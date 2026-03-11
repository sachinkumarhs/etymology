const axios = require('axios');

/**
 * Free translation service using MyMemory API
 * Documentation: https://mymemory.translated.net/doc/spec.php
 * Note: Free tier has limits, but sufficient for low-traffic etymology lookups.
 */
async function translateText(text, targetLang) {
    if (!text || targetLang === 'en') return text;

    // Map internal language codes to MyMemory codes
    const langMap = {
        'kannada': 'kn',
        'sanskrit': 'sa'
    };

    const target = langMap[targetLang] || targetLang;
    
    try {
        const response = await axios.get('https://api.mymemory.translated.net/get', {
            params: {
                q: text,
                langpair: `en|${target}`,
                de: 'etymology.app@example.com' // Valid email improves quota
            }
        });

        if (response.data && response.data.responseData) {
            return response.data.responseData.translatedText;
        }
        return text;
    } catch (error) {
        console.error('Translation error:', error.message);
        return text; // Fallback to original text
    }
}

module.exports = { translateText };
