import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EtymologyCard.css';

const EtymologyCard = ({ title, data, baseData, language, currentDisplay, onDisplayChange, labels }) => {
  const [translations, setTranslations] = useState({});
  const [isTranslating, setIsTranslating] = useState(false);
  // Use the base English data as source for translation
  const sourceData = baseData || data;

  useEffect(() => {
    // Only translate if we don't have it and it's not English
    if (currentDisplay !== 'english' && !translations[currentDisplay]) {
      handleTranslate();
    }
  }, [currentDisplay]);

  const handleTranslate = async () => {
    setIsTranslating(true);
    try {
      const fieldsToTranslate = [];
      if (sourceData?.etymology) fieldsToTranslate.push({ key: 'etymology', text: sourceData.etymology });
      if (sourceData?.root?.meaning) fieldsToTranslate.push({ key: 'rootMeaning', text: sourceData.root.meaning });

      if (fieldsToTranslate.length === 0) { setIsTranslating(false); return; }

      // Translate each field
      const results = await Promise.all(
        fieldsToTranslate.map(f => 
          axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/translate`, { 
            text: f.text, 
            targetLang: currentDisplay 
          })
        )
      );

      const newTranslations = {};
      results.forEach((res, index) => {
        newTranslations[fieldsToTranslate[index].key] = res.data.translatedText;
      });

      setTranslations(prev => ({
        ...prev,
        [currentDisplay]: {
          ...prev[currentDisplay],
          ...newTranslations
        }
      }));
    } catch (error) {
      console.error('Translation failed', error);
    } finally {
      setIsTranslating(false);
    }
  };

  if (!data || !labels) return <div className="glass-panel">Loading details...</div>;

  // Safe access with fallbacks
  const currentEtymology = translations[currentDisplay]?.etymology || data.etymology || "";
  const currentRoot = data.root || { text: "N/A", meaning: "N/A" };
  const currentRootMeaning = translations[currentDisplay]?.rootMeaning || currentRoot.meaning || "";

  return (
    <div className="glass-panel animate-fade-in etymology-card">
      <div className="card-header">
        <div className="header-left">
          <h3 className="card-title">{title}</h3>
          <span className="language-badge">{language}</span>
        </div>
        <div className="language-toggle-group">
          {['english', 'kannada', 'sanskrit'].map((lang) => (
            <button
              key={lang}
              className={`toggle-btn ${currentDisplay === lang ? 'active' : ''}`}
              onClick={() => onDisplayChange(lang)}
            >
              {lang === 'english' ? 'EN' : lang === 'kannada' ? 'KN' : 'SA'}
            </button>
          ))}
        </div>
      </div>
      
      <div className="card-words">
        {data.native && (
          <div className="word-section native-script">
            <span className="word-label">{labels.native}</span>
            <span className="word-value">{data.native}</span>
          </div>
        )}
        
        <div className="word-section transliteration">
          <span className="word-label">{labels.transliteration}</span>
          <span className="word-value">{data.word}</span>
        </div>
      </div>

      <div className="divider"></div>

      <div className="etymology-content">
        {data.root && (
          <div className="dhatu-section glass-panel">
            <h4 className="dhatu-label">{labels.root}</h4>
            <div className="dhatu-display">
              <span className="dhatu-text">{data.root.text}</span>
              <span className="dhatu-meaning">({currentRootMeaning})</span>
            </div>
          </div>
        )}

        <div className="history-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4>{labels.history}</h4>
            {isTranslating && <span className="translating-indicator">Translating...</span>}
          </div>
          <p className={`description ${isTranslating ? 'blur' : ''}`}>{currentEtymology}</p>
        </div>

        {data.derivatives && data.derivatives.length > 0 && (
          <div className="derivatives-section">
            <h4>{labels.derivatives}</h4>
            <div className="derivatives-grid">
              {data.derivatives.map((word, i) => (
                <span key={i} className="derivative-tag">{word}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EtymologyCard;
