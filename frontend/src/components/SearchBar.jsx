import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2 } from 'lucide-react';
import axios from 'axios';

const SearchBar = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('english');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isTransliterating, setIsTransliterating] = useState(false);
  const suggestionRef = useRef(null);
  const debounceTimer = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchTransliteration = async (text) => {
    if (!text || language === 'english') {
      setSuggestions([]);
      return;
    }

    setIsTransliterating(true);
    try {
      const target = language === 'kannada' ? 'Kannada' : 'Devanagari';
      const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/transliterate?text=${encodeURIComponent(text)}&target=${target}`);
      if (response.data.result) {
        // We'll show the transliterated result as a suggestion
        setSuggestions([response.data.result]);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Transliteration error:', error);
    } finally {
      setIsTransliterating(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    
    if (value.trim() && language !== 'english') {
      debounceTimer.current = setTimeout(() => {
        fetchTransliteration(value);
      }, 500);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (suggestion) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    onSearch(suggestion, language);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim(), language);
      setShowSuggestions(false);
    }
  };

  return (
    <div className="search-bar-container" ref={suggestionRef}>
      <form onSubmit={handleSubmit} className="search-bar">
        <div className="search-input-group glass-panel">
          <div className="select-wrapper">
            <select 
              value={language} 
              onChange={(e) => {
                setLanguage(e.target.value);
                setSuggestions([]);
                setShowSuggestions(false);
              }}
              className="language-select"
              disabled={isLoading}
            >
              <option value="english">English</option>
              <option value="kannada">Kannada</option>
              <option value="sanskrit">Sanskrit</option>
            </select>
          </div>
          <div className="input-wrapper">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              placeholder={`Enter a word in ${language}...`}
              disabled={isLoading}
            />
            {isTransliterating && <Loader2 className="spinner animate-spin" size={16} />}
          </div>
          <button type="submit" className={`search-button ${isLoading ? 'loading' : ''}`} disabled={isLoading || !query.trim()}>
            {isLoading ? <div className="loader" /> : 'Explore'}
          </button>
        </div>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="suggestions-dropdown glass-panel animate-fade-in">
          {suggestions.map((suggestion, index) => (
            <div 
              key={index} 
              className="suggestion-item"
              onClick={() => selectSuggestion(suggestion)}
            >
              <span className="suggestion-text">{suggestion}</span>
              <span className="suggestion-label">Transliteration</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
