const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({});

async function getEtymology(word, language = 'english') {
    const prompt = `Provide the etymology for the word "${word}" as used in ${language.toUpperCase()}.

Return a JSON object with EXACTLY this structure (no markdown, no code blocks):
{
  "english": {
    "word": "the word or its English equivalent",
    "etymology": "Detailed explanation of the word origins in English",
    "root": { "text": "root/dhatu", "meaning": "what the root means" },
    "derivatives": ["word1", "word2", "word3"]
  },
  "kannada": {
    "word": "Kannada transliteration",
    "native": "ಕನ್ನಡ ಲಿಪಿ",
    "etymology": "Etymology relevant to Kannada usage",
    "root": { "text": "root text", "meaning": "root meaning" },
    "derivatives": ["ಪದ1", "ಪದ2", "ಪದ3"]
  },
  "sanskrit": {
    "word": "Sanskrit transliteration",
    "native": "देवनागरी",
    "etymology": "Sanskrit linguistic origin and history",
    "root": { "text": "dhatu", "meaning": "root meaning" },
    "derivatives": ["शब्द1", "शब्द2", "शब्द3"]
  },
  "tree": [
    { "id": "1", "label": "proto-root", "language": "PIE" },
    { "id": "2", "label": "intermediate", "language": "Old Language", "parentId": "1" },
    { "id": "3", "label": "${word}", "language": "${language}", "parentId": "2" }
  ]
}
Return ONLY valid JSON. No markdown.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        
        let text = response.text.trim();
        // Strip markdown code fences if present
        text = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
        console.log('Gemini response preview:', text.substring(0, 200));
        return JSON.parse(text);
    } catch (error) {
        console.error('Gemini API Error:', error.message);
        throw error;
    }
}

module.exports = { getEtymology };
