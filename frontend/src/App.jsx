import React, { useState } from 'react';
import axios from 'axios';
import SearchBar from './components/SearchBar';
import EtymologyCard from './components/EtymologyCard';
import OriginChart from './components/OriginChart';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [etymologyData, setEtymologyData] = useState(null);

  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [displayLanguage, setDisplayLanguage] = useState('english');

  const handleSearch = async (query, language = 'english') => {
    setLoading(true);
    setError(null);
    setEtymologyData(null);
    setSelectedLanguage(language);
    setDisplayLanguage(language);

    try {
      const response = await axios.get(`${API_BASE_URL}/etymology?word=${encodeURIComponent(query)}&language=${language}`);
      setEtymologyData(response.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error === 'WordNotFound') {
        setError(err.response.data.message);
      } else {
        setError(err.response?.data?.error || 'Failed to fetch etymology. Please try again.');
      }
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getLanguageDetails = (lang) => {
    switch (lang) {
      case 'kannada': return {
        title: 'ಕನ್ನಡ (Kannada)',
        badge: 'KN',
        labels: {
          history: 'ಐತಿಹಾಸಿಕ ಹಿನ್ನೆಲೆ',
          root: 'ಮೂಲ / ಧಾತು',
          derivatives: 'ಸಂಬಂಧಿತ ಪದಗಳು',
          native: 'ಮೂಲ ಲಿಪಿ',
          transliteration: 'ಲಿಪ್ಯಂತರ'
        }
      };
      case 'sanskrit': return {
        title: 'संस्कृतम् (Sanskrit)',
        badge: 'SA',
        labels: {
          history: 'ऐतिहासिक सन्दर्भः',
          root: 'मूलम् / धातुः',
          derivatives: 'व्यುತ್ಪನ್ನ ಶಬ್ದಾಃ', // Using Devanagari below
          native: 'देवनागरी',
          transliteration: 'लिप्यन्तरणम्'
        }
      };
      default: return {
        title: 'English',
        badge: 'EN',
        labels: {
          history: 'Historical Context',
          root: 'Root / Dhatu',
          derivatives: 'Common Derivatives',
          native: 'Native Script',
          transliteration: 'Transliteration'
        }
      };
    }
  };

  return (
    <div className="app-container">
      <header className="header animate-fade-in">
        <h1>Pada Moola</h1>
        <p>Uncover the Linguistic Roots of Words in English, Sanskrit & Kannada</p>
      </header>

      <main>
        <div style={{ marginBottom: '3rem' }}>
          <SearchBar onSearch={handleSearch} isLoading={loading} />
        </div>

        {loading && (
          <div className="loading-overlay animate-fade-in">
            <div className="loader"></div>
            <p>Gathering linguistic roots...</p>
          </div>
        )}

        {error && (
          <div className="error-message animate-fade-in">
            <p>{error}</p>
          </div>
        )}

        {etymologyData && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <div className="single-card-container" style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
              <EtymologyCard
                title={getLanguageDetails(displayLanguage).title}
                language={getLanguageDetails(displayLanguage).badge}
                labels={getLanguageDetails(displayLanguage).labels}
                data={etymologyData[displayLanguage] || etymologyData[selectedLanguage]}
                baseData={etymologyData[selectedLanguage]}
                currentDisplay={displayLanguage}
                onDisplayChange={setDisplayLanguage}
              />
            </div>

            {etymologyData.tree && etymologyData.tree.length > 0 && (
              <OriginChart treeData={etymologyData.tree} />
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
