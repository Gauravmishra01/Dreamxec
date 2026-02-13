const naughtyWords = require("naughty-words");

// Merge all languages
const allWords = Object.values(naughtyWords).flat();

// Normalize to lowercase set
const badWordsSet = new Set(
  allWords.map(word => word.toLowerCase())
);

// Tokenizer: split on whitespace + punctuation
function tokenize(text) {
  return text
    .toLowerCase()
    .split(/[\s.,!?;:()"'\[\]{}<>\\/]+/)
    .filter(Boolean);
}

function containsProfanity(text) {
  const tokens = tokenize(text);

  for (const token of tokens) {
    if (badWordsSet.has(token)) {
      return true;
    }
  }

  return false;
}

function censorProfanity(text) {
  const tokens = tokenize(text);

  let censoredText = text;

  for (const token of tokens) {
    if (badWordsSet.has(token)) {
      const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`\\b${escaped}\\b`, "gi");
      censoredText = censoredText.replace(regex, "*".repeat(token.length));
    }
  }

  return censoredText;
}

module.exports = {
  containsProfanity,
  censorProfanity,
};
