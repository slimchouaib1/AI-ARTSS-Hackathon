import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import MessageBubble from './MessageBubble';

function ChatBox() {
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('chat-history');
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  useEffect(() => {
    localStorage.setItem('chat-history', JSON.stringify(history));
  }, [history]);

  const sendMessage = async () => {
    if (!message.trim()) return;
    setLoading(true);
    setHistory(prev => [...prev, { type: 'user', text: message }]);

    try {
      const res = await axios.post('http://localhost:5000/api/analyze', {
        note: message,
        patient: '',
      });

      if (res.data.warning) {
        alert(res.data.warning); // 👈 Alerte JS simple ici
        setHistory(prev => [...prev, {
          type: 'bot',
          text: res.data.warning,
          parsed: null
        }]);
      } else {
        setHistory(prev => [...prev, {
          type: 'bot',
          text: JSON.stringify(res.data, null, 2),
          parsed: res.data
        }]);
      }
    } catch (error) {
      alert("❌ Erreur serveur. Vérifie le backend.");
      setHistory(prev => [...prev, {
        type: 'bot',
        text: '❌ Erreur serveur. Vérifie le backend.'
      }]);
    }

    setMessage('');
    setLoading(false);
  };

  const resetChat = () => {
    setHistory([]);
    localStorage.removeItem('chat-history');
  };

  const copyLastResponse = () => {
    const lastBot = [...history].reverse().find(msg => msg.type === 'bot');
    if (lastBot?.parsed) {
      navigator.clipboard.writeText(JSON.stringify(lastBot.parsed, null, 2));
      alert("✅ Résultat copié !");
    }
  };

  const exportLastJSON = () => {
    const lastBot = [...history].reverse().find(msg => msg.type === 'bot');
    if (!lastBot?.parsed) return;
    const blob = new Blob([JSON.stringify(lastBot.parsed, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "analyse_chimiotherapie.json";
    a.click();
  };

  return (
    <div className="chat-container">
      <div className="chat-window">
        {history.map((msg, idx) => (
          <MessageBubble key={idx} type={msg.type} text={msg.text} parsed={msg.parsed} />
        ))}
        {loading && <div className="bubble bot">⏳ Analyse en cours...</div>}
        <div ref={chatEndRef} />
      </div>

      <div className="input-area">
        <textarea
          value={message}
          onChange={(e) => {
            const input = e.target.value
              .replace(/<script.*?>.*?<\/script>/gi, '')
              .replace(/<[^>]*>?/gm, '');
            setMessage(input);
          }}
          placeholder="💬 Tape ta note clinique ici..."
          className="chat-input"
          rows="3"
        />
        <button onClick={sendMessage} className="send-btn">✅ Envoyer</button>
      </div>

      <div className="chat-actions">
        <button onClick={resetChat} className="secondary-btn">🗑️ Réinitialiser</button>
        <button onClick={copyLastResponse} className="secondary-btn">📋 Copier Résultat</button>
        <button onClick={exportLastJSON} className="secondary-btn">⬇️ Exporter JSON</button>
        <a
          href="https://www.cancer.gov/about-cancer/treatment/drugs"
          target="_blank"
          rel="noreferrer"
          className="secondary-btn"
        >
          📚 Protocole cancer
        </a>
      </div>
    </div>
  );
}

export default ChatBox;
