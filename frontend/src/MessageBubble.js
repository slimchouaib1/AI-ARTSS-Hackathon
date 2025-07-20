import React from 'react';
import PrescriptionPDF from './PrescriptionPDF';

function MessageBubble({ type, text, parsed }) {
  let content = null;

  if (type === 'user') {
    content = <p style={{ color: '#2563eb', fontWeight: '500' }}>{text}</p>;
  } else if (type === 'bot' && parsed) {
    content = (
      <div className="output-text" style={{ textAlign: 'left' }}>
        <p><strong>🧍‍♀️ Patient :</strong> {parsed.patient || '-'}</p>
        <p><strong>📊 Stade :</strong> {parsed.stade || '-'}</p>
        <p><strong>🎂 Âge :</strong> {parsed.age || '-'}</p>
        <p><strong>🚻 Sexe :</strong> {parsed.sex || '-'}</p>
        <p><strong>🧠 Diagnostic :</strong> {parsed.diagnosis || '-'}</p>
        <p><strong>⏱️ Fréquence du cycle :</strong> {parsed.cycle_frequency || '-'}</p>
        <p><strong>⚖️ Poids :</strong> {parsed.weight_kg || '-'} kg</p>
        <p><strong>📏 Taille :</strong> {parsed.height_cm || '-'} cm</p>
        <p><strong>📐 BSA :</strong> {parsed.bsa || '-'} m²</p>
        <p><strong>💉 Protocole :</strong> {parsed.protocol || '-'}</p>
        <p><strong>🧑‍⚕️ Médecin :</strong> {parsed.doctor || '-'}</p>

        {parsed.previous_treatments?.length > 0 && (
          <>
            <p><strong>📜 Traitements antérieurs :</strong></p>
            <ul>
              {parsed.previous_treatments
                .filter(t => t.trim().length > 2)
                .map((t, i) => (
                  <li key={i}>• {t.trim().replace(/^[:\-•\s]+/, '')}</li>
                ))}
            </ul>
          </>
        )}

        {parsed.dosage && (
          <>
            <p><strong>💊 Posologie calculée :</strong></p>
            <ul style={{ marginTop: '-5px' }}>
              {Object.entries(parsed.dosage).map(([drug, dose]) => (
                <li key={drug}>• <strong>{drug}</strong> : {dose} mg</li>
              ))}
            </ul>
            <div style={{
              backgroundColor: '#d1fae5',
              color: '#065f46',
              borderRadius: '6px',
              padding: '8px 12px',
              marginTop: '10px'
            }}>
              🧾 Ordonnance envoyée à la pharmacie ✅
            </div>
            <PrescriptionPDF data={parsed} />
            <button
  className="send-btn"
  style={{ marginTop: '10px', marginLeft: '5px' }}
  onClick={() => {
    const email = prompt("📧 Entrer l'adresse email du destinataire :");
    if (!email) return;
    fetch('http://localhost:5000/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, data: parsed })
    })
    .then(res => res.json())
    .then(res => {
      if (res.status === 'ok') alert("📨 Email envoyé avec succès !");
      else alert("❌ Échec de l'envoi de l'email.");
    })
    .catch(() => alert("❌ Erreur réseau lors de l'envoi."));
  }}
>
  ✉️ Envoyer par Email
</button>

          </>
        )}

        {parsed.error && (
          <div className="error" style={{
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            padding: '10px',
            marginTop: '12px',
            borderRadius: '6px'
          }}>
            ❗ {parsed.error}
          </div>
        )}
      </div>
    );
  } else {
    content = <pre>{text}</pre>;
  }

  return (
    <div
      className={`bubble ${type}`}
      style={{
        background: type === 'user' ? '#dbeafe' : '#f9fafb',
        borderLeft: type === 'bot' ? '4px solid #6366f1' : 'none',
        padding: '12px 16px',
        borderRadius: '10px',
        marginBottom: '10px',
        maxWidth: '100%'
      }}
    >
      {content}
    </div>
  );
}

export default MessageBubble;
