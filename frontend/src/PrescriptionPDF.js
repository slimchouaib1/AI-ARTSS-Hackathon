import React from 'react';
import jsPDF from 'jspdf';

function PrescriptionPDF({ data }) {
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text('Ordonnance Chimiothérapie', 20, 20);

    const safe = (val) => (val !== null && val !== undefined && val !== '' ? val : '-');

    doc.text(`Patient : ${safe(data.patient)}`, 20, 30);
    doc.text(`Stade : ${safe(data.stade)}`, 20, 40);
    doc.text(`Diagnostic : ${safe(data.diagnosis)}`, 20, 50);
    doc.text(`Protocole : ${safe(data.protocol)}`, 20, 60);
    doc.text(`Poids : ${safe(data.weight_kg)} kg`, 20, 70);
    doc.text(`Taille : ${safe(data.height_cm)} cm`, 20, 80);
    doc.text(`BSA : ${safe(data.bsa)} m²`, 20, 90);

    let y = 100;
    doc.text('Posologie :', 20, y);
    y += 10;

    if (data.dosage) {
      Object.entries(data.dosage).forEach(([drug, dose]) => {
        doc.text(`• ${drug} : ${dose} mg`, 25, y);
        y += 8;
      });
    } else {
      doc.text('Aucune posologie calculée.', 25, y);
      y += 8;
    }

    y += 10;
    doc.text(`Fait le : ${new Date().toLocaleDateString()}`, 20, y);
    y += 10;
    doc.text(`Médecin : ${safe(data.doctor)}`, 20, y);

    doc.save('ordonnance.pdf');
  };

  return (
    <button onClick={generatePDF} className="send-btn" style={{ marginTop: "10px" }}>
      📄 Télécharger Ordonnance (PDF)
    </button>
  );
}

export default PrescriptionPDF;
