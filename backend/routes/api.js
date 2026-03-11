const express = require('express');
const axios = require('axios');
const NodeCache = require('node-cache');
const { getEtymology } = require('../services/gemini');

const { isValidWord } = require('../dictionaries');
const { translateText } = require('../services/translator');

const router = express.Router();
// Cache values for 24 hours to reduce API calls
const cache = new NodeCache({ stdTTL: 86400 });

// Translate endpoint
router.post('/translate', async (req, res) => {
    try {
        const { text, targetLang } = req.body;
        if (!text || !targetLang) {
            return res.status(400).json({ error: 'Text and targetLang are required' });
        }

        const cacheKey = `trans_${Buffer.from(text).toString('base64').substring(0, 32)}_${targetLang}`;
        const cached = cache.get(cacheKey);
        if (cached) return res.json({ translatedText: cached });

        const translatedText = await translateText(text, targetLang);
        cache.set(cacheKey, translatedText);
        res.json({ translatedText });
    } catch (error) {
        res.status(500).json({ error: 'Translation failed' });
    }
});

// Transliterate endpoint using Aksharamukha
router.get('/transliterate', async (req, res) => {
    try {
        const { text, target } = req.query; // target should be 'Devanagari' or 'Kannada'
        if (!text || !target) {
            return res.status(400).json({ error: 'Missing text or target parameter' });
        }
        
        const cacheKey = `trans_${text}_${target}`;
        if (cache.has(cacheKey)) {
            return res.json({ result: cache.get(cacheKey) });
        }

        // Aksharamukha API (Autodetects source, transliterates to target)
        // Note: Aksharamukha returns plain text response
        const response = await axios.get(`https://aksharamukha.appspot.com/api/public?target=${target}&text=${encodeURIComponent(text)}`);
        
        const result = response.data;
        cache.set(cacheKey, result);
        
        res.json({ result });
    } catch (error) {
        console.error('Transliteration error:', error.message);
        res.status(500).json({ error: 'Failed to transliterate' });
    }
});

// Etymology endpoint using Gemini
router.get('/etymology', async (req, res) => {
    try {
        const { word, language = 'english' } = req.query;
        if (!word) {
            return res.status(400).json({ error: 'Missing word parameter' });
        }

        // 1. Offline Dictionary Validation
        if (!isValidWord(word, language)) {
            return res.status(404).json({ 
                error: 'WordNotFound', 
                message: `The word "${word}" was not found in our ${language} dictionary. Please check the spelling or select a different language.` 
            });
        }

        // 2. Cache Check (include language in key)
        const cacheKey = `etymology_v8_${word}_${language}`;
        const cachedData = cache.get(cacheKey);
        if (cachedData) {
            console.log('Serving from cache:', cacheKey);
            return res.json(cachedData);
        }

        // 3. Gemini Call
        const data = await getEtymology(word, language);
        cache.set(cacheKey, data);
        
        res.json(data);
    } catch (error) {
        console.error('Etymology error:', error);
        res.status(500).json({ error: 'Failed to fetch etymology' });
    }
});

module.exports = router;
