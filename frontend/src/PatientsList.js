import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PatientsList.css'; // Ajoute ce fichier pour les styles

function PatientsList() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/patients')
      .then(res => setPatients(res.data))
      .catch(() => alert("❌ Erreur de chargement des patients."));
  }, []);

  return (
    <div className="patients-container">
      <h2 className="patients-title">📋 Liste des Patients</h2>
      {patients.length === 0 ? (
        <p className="empty-text">Aucun patient trouvé.</p>
      ) : (
        <div className="patients-grid">
          {patients.map((p, idx) => (
            <div key={idx} className="patient-card">
              <h3 className="patient-name">👤 {p.patient}</h3>
              <ul className="patient-info">
                <li><strong>🎂 Âge :</strong> {p.age || '-'}</li>
                <li><strong>🚻 Sexe :</strong> {p.sex || '-'}</li>
                <li><strong>🧠 Diagnostic :</strong> {p.diagnosis || '-'}</li>
                <li><strong>💉 Protocole :</strong> {p.protocol || '-'}</li>
                <p><strong>⏱️ Fréquence :</strong> {p.cycle_frequency}</p>
                <li><strong>📊 Stade :</strong> {p.stade || '-'}</li>
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PatientsList;
