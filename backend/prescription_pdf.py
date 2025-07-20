from fpdf import FPDF

def generate_pdf(data, output_stream):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.cell(200, 10, txt="Ordonnance Chimiothérapie", ln=1)

    def safe(val): return str(val) if val else '-'

    pdf.cell(200, 10, txt=f"Patient : {safe(data.get('patient'))}", ln=1)
    pdf.cell(200, 10, txt=f"Cycle : {safe(data.get('cycle'))}", ln=1)
    pdf.cell(200, 10, txt=f"Diagnostic : {safe(data.get('diagnosis'))}", ln=1)
    pdf.cell(200, 10, txt=f"Protocole : {safe(data.get('protocol'))}", ln=1)
    pdf.cell(200, 10, txt=f"Poids : {safe(data.get('weight_kg'))} kg", ln=1)
    pdf.cell(200, 10, txt=f"Taille : {safe(data.get('height_cm'))} cm", ln=1)
    pdf.cell(200, 10, txt=f"BSA : {safe(data.get('bsa'))} m²", ln=1)

    pdf.cell(200, 10, txt="Posologie :", ln=1)
    dosage = data.get('dosage', {})
    for drug, dose in dosage.items():
        pdf.cell(200, 10, txt=f"• {drug} : {dose} mg", ln=1)

    pdf.cell(200, 10, txt=f"Médecin : {safe(data.get('doctor'))}", ln=1)

    pdf.output(output_stream)
