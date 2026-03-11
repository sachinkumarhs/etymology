const fs = require('fs');
const path = require('path');

// Dictionary file paths
const ENGLISH_PATH = path.join(__dirname, 'english.json');
const KANNADA_PATH = path.join(__dirname, 'kannada.txt');
const SANSKRIT_PATH = path.join(__dirname, 'sanskrit.txt');

// Load dictionaries into memory (or use a more efficient way if they are too large)
// For English, we can just require it as it's JSON
let englishDict = {};
try {
  englishDict = require(ENGLISH_PATH);
} catch (e) {
  console.error("Error loading English dictionary:", e);
}

// For Kannada and Sanskrit, we'll read them and store them in Sets for fast lookup
let kannadaSet = new Set();
let sanskritSet = new Set();

function loadTextDictionary(filePath, separator = '\n') {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const words = data.split(separator).map(w => w.trim()).filter(w => w.length > 0);
    return new Set(words);
  } catch (e) {
    console.error(`Error loading dictionary from ${filePath}:`, e);
    return new Set();
  }
}

// Load Kannada (newline separated)
kannadaSet = loadTextDictionary(KANNADA_PATH, '\n');
// Load Sanskrit (comma separated based on view_file output)
sanskritSet = loadTextDictionary(SANSKRIT_PATH, ',');

/**
 * Validates if a word exists in the specified language dictionary.
 * @param {string} word - The word to check.
 * @param {string} language - 'english', 'kannada', or 'sanskrit'.
 * @returns {boolean}
 */
function isValidWord(word, language) {
  if (!word) return false;
  const cleanWord = word.trim().toLowerCase();

  switch (language.toLowerCase()) {
    case 'english':
      return !!englishDict[cleanWord];
    
    case 'kannada':
      // Check for native script first
      if (kannadaSet.has(word.trim())) return true;
      // If we had a transliteration helper, we'd use it here. 
      // For now, we assume user might enter native script since it's an offline check.
      return false;

    case 'sanskrit':
      // Check for native script first
      if (sanskritSet.has(word.trim())) return true;
      return false;

    default:
      return false;
  }
}

module.exports = { isValidWord };
