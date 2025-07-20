import spacy
import re
from datetime import datetime

try:
    nlp = spacy.load("en_core_sci_sm")
except:
    nlp = spacy.load("en_core_web_sm")

protocol_doses = {
    "FEC": {"5-FU": 500, "Epirubicin": 100, "Cyclophosphamide": 500},
    "AC": {"Doxorubicin": 60, "Cyclophosphamide": 600},
    "PE": {"Cisplatin": 75, "Etoposide": 100},
    "TP": {"Paclitaxel": 175, "Carboplatin": 300}
}

def calculate_bsa(weight, height):
    return round(0.007184 * (weight ** 0.425) * (height ** 0.725), 2)

def extract_info(note):
    doc = nlp(note)

    weight = re.search(r'(\d{2,3})\s?kg', note)
    height = re.search(r'(\d{3})\s?cm', note)
    protocol = re.search(r'\b(FEC|AC|PE|TP)\b', note.upper())
    stade_match = re.search(r'\b(stade\s*[IVX]+)', note, re.IGNORECASE)

    name_match = re.search(r'\b(?:madame|monsieur)\s+([A-Z][a-z]+)\s+([A-Z][a-z]+)', note, re.IGNORECASE)
    age_match = re.search(r'(\d{1,2})\s?(ans|ans?)', note)
    sex_match = re.search(r'\b(monsieur|madame)\b', note, re.IGNORECASE)

    previous_treatments = re.findall(r'(?:ancien traitement|traitement précédent)[:\-]?\s*(.+)', note, re.IGNORECASE)
    previous_treatments = [t.strip().replace("•", "").strip(":-• ").strip() for t in previous_treatments if t.strip()]
    previous_treatments = [t for t in previous_treatments if not re.search(r'\b(docteur|dr)\b', t, re.IGNORECASE)]

    diagnosis = None
    for ent in doc.ents:
        if any(x in ent.text.lower() for x in ['cancer', 'lymphome', 'leucémie']):
            diagnosis = ent.text
            break
    if not diagnosis:
        dx_match = re.search(r'(cancer|lymphome|leucémie)[^\n.,;]*', note, re.IGNORECASE)
        if dx_match:
            diagnosis = dx_match.group(0).strip()

    doctor_match = re.search(r'\b(?:docteur|dr)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)', note, re.IGNORECASE)

    # Fréquences des cycles par protocole
    cycle_frequency_by_protocol = {
        "FEC": "Tous les 21 jours",
        "AC": "Tous les 14 à 21 jours",
        "PE": "Tous les 21 jours",
        "TP": "Tous les 21 jours"
    }

    result = {
        "patient": f"{name_match.group(1)} {name_match.group(2)}" if name_match else "-",
        "diagnosis": diagnosis or "-",
        "weight_kg": int(weight.group(1)) if weight else None,
        "height_cm": int(height.group(1)) if height else None,
        "protocol": protocol.group(1).upper() if protocol else None,
        "intent": "start_chemotherapy",
        "stade": stade_match.group(1).upper() if stade_match else "-",
        "age": int(age_match.group(1)) if age_match else None,
        "sex": "Homme" if sex_match and sex_match.group(1).lower() == "monsieur" else (
            "Femme" if sex_match else "-"
        ),
        "previous_treatments": previous_treatments or [],
        "doctor": doctor_match.group(1).strip() if doctor_match else "-",
        "status": "en_attente",
        "cycle_frequency": cycle_frequency_by_protocol.get(protocol.group(1).upper(), "-") if protocol else "-",
        "logs": [{
            "actor": "médecin",
            "action": "prescription créée",
            "timestamp": datetime.now().isoformat()
        }]
    }

    if result["weight_kg"] and result["height_cm"] and result["protocol"] in protocol_doses:
        bsa = calculate_bsa(result["weight_kg"], result["height_cm"])
        result["bsa"] = bsa
        result["dosage"] = {
            drug: round(dose * bsa, 1)
            for drug, dose in protocol_doses[result["protocol"]].items()
        }
    else:
        result["error"] = "Données insuffisantes pour calculer la posologie."

    return result
