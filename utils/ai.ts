import { GoogleGenerativeAI } from '@google/generative-ai';
import { PRONOUNCE_INTERMEDIATE_POOLS, PRONOUNCE_PRO_POOLS, SENTENCE_GAME_POOLS } from '../constants/translations';

// Initialize the API with the key from env, or a fallback if not set.
// We check if it exists so we can gracefully fallback in the UI if the user hasn't set it yet.
const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

export const hasApiKey = () => API_KEY.length > 0;

// Picks the longest (most complex) word out of a native phrase — used to turn an
// already-authored sentence pool into a standalone "tough word" writing target
// without inventing new vocabulary in scripts we can't fully verify.
function longestWord(phrase: string): string {
  const words = phrase.split(/\s+/).filter(Boolean);
  if (words.length === 0) return phrase;
  return words.reduce((a, b) => (b.length > a.length ? b : a), words[0]);
}

// Generates level content for ALL 1000 levels deterministically across all supported languages
export function getWritingLevelItems(levelNum: number, language: string = 'tamil', tier: string = 'Beginner') {
  const isIntermediate = tier.includes('Intermediate');
  const isPro = tier.includes('Pro') || tier.includes('Advanced');
  const langKey = (language || 'tamil').toLowerCase();

  // Intermediate & Pro never show alphabets/consonants — only sentences and tough
  // words, drawn from the same per-language pools used elsewhere in the app so
  // every supported language (not just Tamil) gets correct, varied content.
  if (isPro) {
    const pool = PRONOUNCE_PRO_POOLS[langKey] || PRONOUNCE_PRO_POOLS.tamil;
    const entry = pool[(levelNum - 1) % pool.length];
    if (levelNum % 2 === 1) {
      const word = longestWord(entry.phrase);
      return { target: word, english: `${entry.english} (Advanced word, Level ${levelNum})`, prompt: `Write the word: ${word}` };
    }
    return { target: entry.phrase, english: `${entry.english} (Advanced Level ${levelNum})`, prompt: `Write: ${entry.phrase}` };
  }

  if (isIntermediate) {
    const pool = PRONOUNCE_INTERMEDIATE_POOLS[langKey] || PRONOUNCE_INTERMEDIATE_POOLS.tamil;
    const entry = pool[(levelNum - 1) % pool.length];
    if (levelNum % 2 === 1) {
      const word = longestWord(entry.phrase);
      return { target: word, english: `${entry.english} (Intermediate word, Level ${levelNum})`, prompt: `Write the word: ${word}` };
    }
    return { target: entry.phrase, english: `${entry.english} (Intermediate Level ${levelNum})`, prompt: `Write: ${entry.phrase}` };
  }

  const langMap: Record<string, { vowels: string[]; special: string[]; consonants: string[]; vocab: { target: string; english: string }[] }> = {
    tamil: {
      vowels: ['அ', 'ஆ', 'இ', 'ஈ', 'உ', 'ஊ', 'எ', 'ஏ', 'ஐ', 'ஒ', 'ஓ', 'ஔ'],
      special: ['ஃ'],
      consonants: ['க்', 'ங்', 'ச்', 'ஞ்', 'ட்', 'ண்', 'த்', 'ந்', 'ப்', 'ம்', 'ய்', 'ர்', 'ல்', 'வ்', 'ழ்', 'ள்', 'ற்', 'ன்'],
      vocab: [
        { target: 'அம்மா', english: 'Mother' },
        { target: 'அப்பா', english: 'Father' },
        { target: 'அனில்', english: 'Squirrel' },
        { target: 'ஆடு', english: 'Goat' },
        { target: 'இலை', english: 'Leaf' },
        { target: 'ஈசல்', english: 'Winged Termite' },
        { target: 'உரல்', english: 'Mortar' },
        { target: 'ஊஞ்சல்', english: 'Swing' },
        { target: 'எலி', english: 'Rat' },
        { target: 'ஏணி', english: 'Ladder' },
        { target: 'ஐவர்', english: 'Five people' },
        { target: 'ஒட்டகம்', english: 'Camel' },
        { target: 'ஓடம்', english: 'Boat' },
        { target: 'ஔடதம்', english: 'Medicine' },
        { target: 'சூரியன்', english: 'Sun' },
        { target: 'நிலவு', english: 'Moon' },
        { target: 'மரம்', english: 'Tree' },
        { target: 'மலர்', english: 'Flower' },
        { target: 'பறவை', english: 'Bird' },
        { target: 'மீன்', english: 'Fish' },
        { target: 'புலி', english: 'Tiger' },
        { target: 'சிங்கம்', english: 'Lion' },
        { target: 'யானை', english: 'Elephant' },
        { target: 'வீடு', english: 'House' },
        { target: 'பள்ளி', english: 'School' },
        { target: 'புத்தகம்', english: 'Book' }
      ]
    },
    hindi: {
      vowels: ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ऋ', 'ए', 'ऐ', 'ओ', 'औ', 'अं'],
      special: ['अः'],
      consonants: ['क', 'ख', 'ग', 'घ', 'ङ', 'च', 'छ', 'ज', 'झ', 'ञ', 'ट', 'ठ', 'ड', 'ढ', 'ण', 'त', 'थ', 'द', 'ध', 'न', 'प', 'फ', 'ब', 'भ', 'म', 'य', 'र', 'ल', 'व', 'श', 'ष', 'स', 'ह'],
      vocab: [
        { target: 'माता', english: 'Mother' },
        { target: 'पिता', english: 'Father' },
        { target: 'पेड़', english: 'Tree' },
        { target: 'जल', english: 'Water' },
        { target: 'सूर्य', english: 'Sun' },
        { target: 'चंद्रमा', english: 'Moon' },
        { target: 'पुस्तकालय', english: 'Library' },
        { target: 'विद्यालय', english: 'School' },
        { target: 'गृह', english: 'Home' },
        { target: 'मित्र', english: 'Friend' },
        { target: 'शेर', english: 'Lion' },
        { target: 'हाथी', english: 'Elephant' }
      ]
    },
    telugu: {
      vowels: ['అ', 'ఆ', 'ఇ', 'ఈ', 'ఉ', 'ఊ', 'ఋ', 'ఎ', 'ఏ', 'ఐ', 'ఒ', 'ఓ'],
      special: ['ఔ'],
      consonants: ['క', 'ఖ', 'గ', 'ఘ', 'ఙ', 'చ', 'ఛ', 'జ', 'ఝ', 'ఞ', 'ట', 'ఠ', 'డ', 'ఢ', 'ణ', 'త', 'థ', 'ద', 'ధ', 'న', 'ప', 'ఫ', 'బ', 'భ', 'మ', 'య', 'ర', 'ల', 'వ', 'శ', 'ష', 'స', 'హ'],
      vocab: [
        { target: 'అమ్మ', english: 'Mother' },
        { target: 'నాన్న', english: 'Father' },
        { target: 'చెట్టు', english: 'Tree' },
        { target: 'నీళ్ళు', english: 'Water' },
        { target: 'సూర్యుడు', english: 'Sun' },
        { target: 'చంద్రుడు', english: 'Moon' },
        { target: 'ఇల్లు', english: 'House' },
        { target: 'బడి', english: 'School' },
        { target: 'పుస్తకం', english: 'Book' },
        { target: 'సింహం', english: 'Lion' }
      ]
    },
    malayalam: {
      vowels: ['അ', 'ആ', 'ഇ', 'ഈ', 'ഉ', 'ഊ', 'ഋ', 'എ', 'ഏ', 'ഐ', 'ഒ', 'ഓ'],
      special: ['ഔ'],
      consonants: ['ക', 'ഖ', 'ഗ', 'ഘ', 'ങ', 'ച', 'ഛ', 'ജ', 'ഝ', 'ഞ', 'ട', 'ഠ', 'ഡ', 'ഢ', 'ണ', 'ത', 'ഥ', 'ദ', 'ധ', 'ന', 'പ', 'ഫ', 'ബ', 'ഭ', 'മ', 'യ', 'ര', 'ല', 'വ', 'ശ', 'ഷ', 'സ', 'ഹ'],
      vocab: [
        { target: 'അമ്മ', english: 'Mother' },
        { target: 'അച്ഛൻ', english: 'Father' },
        { target: 'മരം', english: 'Tree' },
        { target: 'വെള്ളം', english: 'Water' },
        { target: 'സൂര്യൻ', english: 'Sun' },
        { target: 'ചന്ദ്രൻ', english: 'Moon' },
        { target: 'വീട്', english: 'House' },
        { target: 'വിദ്യാലയം', english: 'School' },
        { target: 'പുസ്തകം', english: 'Book' },
        { target: 'സിംഹം', english: 'Lion' }
      ]
    },
    kannada: {
      vowels: ['ಅ', 'ಆ', 'ಇ', 'ಈ', 'ಉ', 'ಊ', 'ಋ', 'ಎ', 'ಏ', 'ಐ', 'ಒ', 'ಓ'],
      special: ['ಔ'],
      consonants: ['ಕ', 'ಖ', 'ಗ', 'ಘ', 'ಙ', 'ಚ', 'ಛ', 'ಜ', 'ಝ', 'ಞ', 'ಟ', 'ಠ', 'ಡ', 'ಢ', 'ಣ', 'ತ', 'ಥ', 'ದ', 'ಧ', 'ನ', 'ಪ', 'ಫ', 'ಬ', 'ಭ', 'ಮ', 'ಯ', 'ರ', 'ಲ', 'ವ', 'ಶ', 'ಷ', 'ಸ', 'ಹ'],
      vocab: [
        { target: 'ಅಮ್ಮ', english: 'Mother' },
        { target: 'ಅಪ್ಪ', english: 'Father' },
        { target: 'ಮರ', english: 'Tree' },
        { target: 'ನೀರು', english: 'Water' },
        { target: 'ಸೂರ್ಯ', english: 'Sun' },
        { target: 'ಚಂದ್ರ', english: 'Moon' },
        { target: 'ಮನೆ', english: 'House' },
        { target: 'ಶಾಲೆ', english: 'School' },
        { target: 'ಪುಸ್ತಕ', english: 'Book' },
        { target: 'ಸಿಂಹ', english: 'Lion' }
      ]
    }
  };

  const currentLang = langMap[language] || langMap['tamil'];
  const { vowels, special, consonants, vocab } = currentLang;

  // Level 1 - 12: Vowels
  if (levelNum >= 1 && levelNum <= 12) {
    const v = vowels[(levelNum - 1) % vowels.length];
    return { target: v, english: `Vowel ${v}`, prompt: `Trace the vowel '${v}'` };
  }
  // Level 13: Special Letter
  if (levelNum === 13) {
    const s = special[0] || vowels[0];
    return { target: s, english: 'Special Letter', prompt: `Trace the special letter '${s}'` };
  }
  // Level 14 - 45: Consonants
  const totalConsonants = consonants.length;
  if (levelNum >= 14 && levelNum <= (13 + totalConsonants)) {
    const c = consonants[levelNum - 14];
    return { target: c, english: `Consonant ${c}`, prompt: `Trace the consonant '${c}'` };
  }

  // Level 46 - 1000: Words & Simple Sentences for this Language.
  // Beginner still needs some sentence practice, not words forever — every 4th
  // level swaps in a short simple sentence from the same pool used elsewhere.
  const postAlphabetIdx = levelNum - 14 - totalConsonants;
  if (postAlphabetIdx % 4 === 0) {
    const sentencePool = SENTENCE_GAME_POOLS[langKey] || SENTENCE_GAME_POOLS.tamil;
    const sentence = sentencePool[(postAlphabetIdx / 4) % sentencePool.length];
    return {
      target: sentence.original,
      english: `${sentence.english} (Level ${levelNum})`,
      prompt: `Level ${levelNum}: Trace '${sentence.original}' (${sentence.english})`
    };
  }

  const wordIdx = postAlphabetIdx % vocab.length;
  const wordObj = vocab[wordIdx];

  return {
    target: wordObj.target,
    english: `${wordObj.english} (Level ${levelNum})`,
    prompt: `Level ${levelNum}: Trace '${wordObj.target}' (${wordObj.english})`
  };
}

export type AssessmentQuestion = {
  id: number;
  question: string;
  options: string[];
  correctOption: number;
  type: 'text';
};

export async function generateAssessmentQuestions(language: string): Promise<AssessmentQuestion[]> {
  if (!hasApiKey()) {
    throw new Error('API Key is missing');
  }

  const model = genAI.getGenerativeModel({ 
    model: 'gemini-flash-lite-latest',
    generationConfig: {
      responseMimeType: "application/json",
    }
  });
  const prompt = `Generate exactly 10 multiple-choice questions for learning ${language}. 
  The difficulty MUST be distributed as follows:
  - Questions 1 to 3 (id 0-2): Easy level (basic vocabulary, simple greetings)
  - Questions 4 to 7 (id 3-6): Intermediate level (sentence structure, common phrases)
  - Questions 8 to 10 (id 7-9): Hard level (complex grammar, idioms, advanced vocabulary)
  
  CRITICAL INSTRUCTION: Generate completely random and varied questions. Do not repeat the same concepts every time. (Random seed: ${Math.random()})
  
  The 'question' text MUST be in English.
  The 4 'options' MUST be written in the native ${language} script.
  Output JSON array. Keys: id (0-9), question (string), options (4 strings), correctOption (0-3), type ("text").`;

  try {
    if (!hasApiKey()) {
      return getFallbackAssessmentQuestions(language);
    }
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText) as AssessmentQuestion[];
  } catch (error) {
    console.warn("Error generating assessment, using fallback:", error);
    return getFallbackAssessmentQuestions(language);
  }
}

function getFallbackAssessmentQuestions(language: string): AssessmentQuestion[] {
  return [
    { id: 0, question: "What is the word for 'Vanakkam' / Hello?", options: ["வணக்கம்", "நன்றி", "காலை", "இரவு"], correctOption: 0, type: 'text' },
    { id: 1, question: "What is the word for 'Thank you'?", options: ["வணக்கம்", "நன்றி", "அன்பு", "மகிழ்ச்சி"], correctOption: 1, type: 'text' },
    { id: 2, question: "What is the word for 'Water'?", options: ["பால்", "தண்ணீர்", "சோறு", "பழம்"], correctOption: 1, type: 'text' },
    { id: 3, question: "How do you say 'My name is...'?", options: ["என் பெயர்...", "நான் செல்கிறேன்", "எனக்கு வேண்டும்", "அங்கே பார்"], correctOption: 0, type: 'text' },
    { id: 4, question: "What is the word for 'Mother'?", options: ["அப்பா", "அம்மா", "அண்ணன்", "தங்கை"], correctOption: 1, type: 'text' },
    { id: 5, question: "What is the word for 'Sun'?", options: ["நிலவு", "சூரியன்", "மழை", "காற்று"], correctOption: 1, type: 'text' },
    { id: 6, question: "What does 'நல்வரவு' (Nalvaravu) mean?", options: ["Goodbye", "Welcome", "Goodnight", "Thank you"], correctOption: 1, type: 'text' },
    { id: 7, question: "Choose the correct phrase: 'Good morning'", options: ["காலை வணக்கம்", "மாலை வணக்கம்", "இரவு வணக்கம்", "நன்றி"], correctOption: 0, type: 'text' },
    { id: 8, question: "What is the word for 'Book'?", options: ["புத்தகம்", "பேனா", "பள்ளி", "வீடு"], correctOption: 0, type: 'text' },
    { id: 9, question: "How do you say 'Where are you going?'", options: ["நீ எங்கே போகிறாய்?", "நீ யார்?", "சாப்பிட்டாயா?", "என்ன செய்கிறாய்?"], correctOption: 0, type: 'text' },
  ];
}

export async function generateTutorResponse(chatHistory: string, userMessage: string, userLevel: string = "Beginner - Level 1", userLanguage: string = "Tamil"): Promise<string> {
  if (!hasApiKey()) {
    return "Please set your Gemini API key in the .env file to chat with me!";
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
  const prompt = `You are a hilarious, witty, and slightly sarcastic comedy AI language tutor! 
  You respond to the user like a fun stand-up comedian or a quirky movie character.
  The user is practicing a new language: ${userLanguage}. 
  CRITICAL: The user is currently at proficiency level: ${userLevel}. 
  If they are a Beginner, use simple words but keep the jokes punchy. 
  If they are Intermediate, add some clever wordplay. 
  If they are Pro, use witty cultural idioms and advanced sarcasm!
  
  Here is the recent chat history:
  ${chatHistory}
  
  User just said: "${userMessage}"
  
  REQUIREMENTS: 
  - Be extremely funny, witty, and engaging.
  - Make it feel like a snappy comedy dialogue.
  - EXTREME LENGTH LIMIT: Maximum 10-15 words total per response. It must be ONE very short punchy sentence. NO EXCEPTIONS.
  - Ask them to translate or say a word in ${userLevel.includes("Beginner") ? "simple" : "advanced"} terms, but keep the instruction very brief.
  - ALWAYS include the native script for ${userLanguage} (e.g. தமிழ் if Tamil, हिन्दी if Hindi) next to the transliterated word. Example: "Nandri (நன்றி)".
  - Use 1-2 emojis!`;

  // Smart fallbacks per language so the tutor never goes silent
  const fallbacks: Record<string, string[]> = {
    Tamil:     ["Vanakkam (வணக்கம்) means hello — can you say it? 🙏", "Try saying Nandri (நன்றி) — that's thank you! 😄", "Quick! What is 'water' in Tamil? (Hint: Tanni — தண்ணீர்) 💧"],
    Hindi:     ["Namaste (नमस्ते)! Can you say that back? 🙏", "What's 'thank you' in Hindi? Hint: Dhanyavaad (धन्यवाद) 😄", "Try this: Paani (पानी) means water — say it! 💧"],
    Telugu:    ["Namaskaram (నమస్కారం)! Repeat after me! 🙏", "How do you say thanks? Dhanyavaadalu (ధన్యవాదాలు) 😄", "Water = Neellu (నీళ్ళు) — can you say it? 💧"],
    Malayalam: ["Namaskaram (നമസ്കാരം)! Give it a go! 🙏", "Thank you = Nanni (നന്ദി) — try it! 😄", "Water in Malayalam? Vellam (വെള്ളം)! 💧"],
    Kannada:   ["Namaskara (ನಮಸ್ಕಾರ)! Can you say it? 🙏", "Thank you = Dhanyavadagalu (ಧನ್ಯವಾದಗಳು) 😄", "Water = Neeru (ನೀರು) — say it! 💧"],
  };

  const langFallbacks = fallbacks[userLanguage] || fallbacks['Tamil'];

  try {
    // Race the API call against a 12s timeout
    const result = await Promise.race([
      model.generateContent(prompt),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), 12000)),
    ]);
    const text = (result as any).response.text().trim();
    if (!text) throw new Error('empty response');
    return text;
  } catch (error) {
    console.warn("Tutor API failed, using fallback:", error);
    // Return a random helpful language tip instead of an error
    return langFallbacks[Math.floor(Math.random() * langFallbacks.length)];
  }
}


export async function generatePracticeLesson(skill: string, level: string, language: string): Promise<AssessmentQuestion[]> {
  if (!hasApiKey()) {
    throw new Error('API Key is missing');
  }

  const model = genAI.getGenerativeModel({ 
    model: 'gemini-flash-lite-latest',
    generationConfig: {
      responseMimeType: "application/json",
    }
  });

  const prompt = `You are an expert language tutor teaching ${language}. 
  The user is currently at the proficiency level: ${level}.
  Create exactly 50 multiple-choice practice questions focused specifically on the topic of [${skill}].
  
  CRITICAL INSTRUCTION: Select a COMPLETELY RANDOM, highly varied set of 50 words, phrases, or grammar rules from a massive pool. Do not repeat the same exercises every time. Shuffle your selection. (Random seed: ${Math.random()})
  
  CRITICAL DIFFICULTY INSTRUCTIONS:
  - If ${level} includes "Beginner", focus on alphabets, consonants, vowels, and simple 1-2 word basic words.
  - If ${level} includes "Intermediate", focus on tough words and short 3-5 word sentences.
  - If ${level} includes "Pro" or "Advanced", focus on typical sentences, complex grammar, and long 5-10+ word sentences.
  
  The 'question' text MUST be in English.
  The 4 'options' MUST be written in the native ${language} script.
  Output JSON array. Keys: id (0-49), question (string), options (4 strings), correctOption (0-3), type ("text").`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText) as AssessmentQuestion[];
  } catch (error) {
    console.warn("Error generating practice lesson:", error);
    throw error;
  }
}

export type SentenceQuestion = {
  id: number;
  english: string;
  correctOrder: string[];
  scrambledWords: string[];
};

export async function generateSentenceLesson(level: string, language: string): Promise<SentenceQuestion[]> {
  if (!hasApiKey()) throw new Error('API Key is missing');

  const model = genAI.getGenerativeModel({ 
    model: 'gemini-flash-lite-latest',
    generationConfig: { responseMimeType: "application/json" }
  });

  const prompt = `You are a language tutor teaching ${language}. The user is at level: ${level}.
  Create EXACTLY 10 short sentence-building exercises.
  
  CRITICAL INSTRUCTION: Create completely random and varied sentences. Do not use the same sentences every time. Choose unexpected topics. Scale the difficulty based on the specific Level number from 1 to 1000. (Random seed: ${Math.random()})
  
  CRITICAL DIFFICULTY INSTRUCTIONS:
  - If ${level} includes "Beginner", use very short 3-4 word sentences with simple foundational words.
  - If ${level} includes "Intermediate", use 5-7 word sentences with moderate grammar.
  - If ${level} includes "Pro" or "Advanced", use extremely tough, long, and complex sentences. Include difficult idioms, obscure vocabulary, and advanced grammatical clauses. All words must be highly advanced.

  For each exercise:
  1. Provide a sentence in English ('english').
  2. Provide the translation in ${language} as an array of words in the exact correct order ('correctOrder').
  3. Provide the same words, plus 2-3 extra distractor words in ${language}, completely scrambled/randomized ('scrambledWords').

  Output JSON array of objects with keys: id (0-4), english (string), correctOrder (string array), scrambledWords (string array).`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(text) as SentenceQuestion[];
  } catch (error) {
    console.warn("Error generating sentence lesson:", error);
    throw error;
  }
}

export type Flashcard = {
  id: number;
  term: string;
  translation: string;
  emoji: string;
};

export function getOfflineFlashcards(levelNum: number, language: string): Flashcard[] {
  const langKey = language.toLowerCase();

  const vocabPool: Record<string, Array<{ term: string; translation: string; emoji: string }>> = {
    tamil: [
      { term: 'பூனை', translation: 'Cat', emoji: '🐱' },
      { term: 'நாய்', translation: 'Dog', emoji: '🐶' },
      { term: 'ஆப்பிள்', translation: 'Apple', emoji: '🍎' },
      { term: 'வாழைப்பழம்', translation: 'Banana', emoji: '🍌' },
      { term: 'சூரியன்', translation: 'Sun', emoji: '☀️' },
      { term: 'நிலவு', translation: 'Moon', emoji: '🌙' },
      { term: 'மழை', translation: 'Rain', emoji: '🌧️' },
      { term: 'மரம்', translation: 'Tree', emoji: '🌳' },
      { term: 'பூ', translation: 'Flower', emoji: '🌸' },
      { term: 'நீர்', translation: 'Water', emoji: '💧' },
      { term: 'வீடு', translation: 'House', emoji: '🏠' },
      { term: 'புத்தகம்', translation: 'Book', emoji: '📚' },
      { term: 'பள்ளி', translation: 'School', emoji: '🏫' },
      { term: 'கார்', translation: 'Car', emoji: '🚗' },
      { term: 'விமானம்', translation: 'Airplane', emoji: '✈️' },
      { term: 'பறவை', translation: 'Bird', emoji: '🐦' },
      { term: 'மீன்', translation: 'Fish', emoji: '🐟' },
      { term: 'சிங்கம்', translation: 'Lion', emoji: '🦁' },
      { term: 'யானை', translation: 'Elephant', emoji: '🐘' },
      { term: 'அம்மா', translation: 'Mother', emoji: '👩' },
      { term: 'அப்பா', translation: 'Father', emoji: '👨' },
    ],
    hindi: [
      { term: 'बिल्ली', translation: 'Cat', emoji: '🐱' },
      { term: 'कुत्ता', translation: 'Dog', emoji: '🐶' },
      { term: 'सेब', translation: 'Apple', emoji: '🍎' },
      { term: 'केला', translation: 'Banana', emoji: '🍌' },
      { term: 'सूरज', translation: 'Sun', emoji: '☀️' },
      { term: 'चांद', translation: 'Moon', emoji: '🌙' },
      { term: 'बारिश', translation: 'Rain', emoji: '🌧️' },
      { term: 'पेड़', translation: 'Tree', emoji: '🌳' },
      { term: 'फूल', translation: 'Flower', emoji: '🌸' },
      { term: 'पानी', translation: 'Water', emoji: '💧' },
    ],
    telugu: [
      { term: 'పిల్లి', translation: 'Cat', emoji: '🐱' },
      { term: 'కుక్క', translation: 'Dog', emoji: '🐶' },
      { term: 'యాపిల్', translation: 'Apple', emoji: '🍎' },
      { term: 'అరటిపండు', translation: 'Banana', emoji: '🍌' },
      { term: 'సూర్యుడు', translation: 'Sun', emoji: '☀️' },
      { term: 'చంద్రుడు', translation: 'Moon', emoji: '🌙' },
      { term: 'వర్షం', translation: 'Rain', emoji: '🌧️' },
      { term: 'చెట్టు', translation: 'Tree', emoji: '🌳' },
      { term: 'పువ్వు', translation: 'Flower', emoji: '🌸' },
      { term: 'నీరు', translation: 'Water', emoji: '💧' },
    ],
    malayalam: [
      { term: 'പൂച്ച', translation: 'Cat', emoji: '🐱' },
      { term: 'പട്ടി', translation: 'Dog', emoji: '🐶' },
      { term: 'ആപ്പിൾ', translation: 'Apple', emoji: '🍎' },
      { term: 'വാഴപ്പഴം', translation: 'Banana', emoji: '🍌' },
      { term: 'സൂര്യൻ', translation: 'Sun', emoji: '☀️' },
      { term: 'ചന്ദ്രൻ', translation: 'Moon', emoji: '🌙' },
      { term: 'മഴ', translation: 'Rain', emoji: '🌧️' },
      { term: 'മരം', translation: 'Tree', emoji: '🌳' },
      { term: 'പൂവ്', translation: 'Flower', emoji: '🌸' },
      { term: 'വെള്ളം', translation: 'Water', emoji: '💧' },
    ],
    kannada: [
      { term: 'ಬೆಕ್ಕು', translation: 'Cat', emoji: '🐱' },
      { term: 'ನಾಯಿ', translation: 'Dog', emoji: '🐶' },
      { term: 'ಸೇಬು', translation: 'Apple', emoji: '🍎' },
      { term: 'ಬಾಳೆಹಣ್ಣು', translation: 'Banana', emoji: '🍌' },
      { term: 'ಸೂರ್ಯ', translation: 'Sun', emoji: '☀️' },
      { term: 'ಚಂದ್ರ', translation: 'Moon', emoji: '🌙' },
      { term: 'ಮಳೆ', translation: 'Rain', emoji: '🌧️' },
      { term: 'ಮರ', translation: 'Tree', emoji: '🌳' },
      { term: 'ಹೂವು', translation: 'Flower', emoji: '🌸' },
      { term: 'ನೀರು', translation: 'Water', emoji: '💧' },
    ]
  };

  const pool = vocabPool[langKey] || vocabPool.tamil;
  const startIdx = ((levelNum - 1) * 3) % pool.length;

  const result: Flashcard[] = [];
  for (let i = 0; i < 10; i++) {
    const item = pool[(startIdx + i) % pool.length];
    result.push({
      id: i,
      term: item.term,
      translation: item.translation,
      emoji: item.emoji
    });
  }
  return result;
}

export async function generateFlashcardLesson(skill: string, level: string, language: string): Promise<Flashcard[]> {
  const levelMatch = level.match(/(\d+)/);
  const levelNum = levelMatch ? parseInt(levelMatch[1], 10) : 1;

  if (!hasApiKey()) {
    return getOfflineFlashcards(levelNum, language);
  }

  const model = genAI.getGenerativeModel({ 
    model: 'gemini-flash-lite-latest',
    generationConfig: { responseMimeType: "application/json" }
  });

  const prompt = `You are an expert language teacher teaching ${language}. The user is at level: ${level}.
  Create 10 flashcards for the topic [${skill}].
  
  CRITICAL INSTRUCTION: Select a COMPLETELY RANDOM, highly varied set of 10 words from a massive pool of ${language} vocabulary suitable for this level. DO NOT output the same common words every time. Shuffle your selection. (Random seed: ${Math.random()})
  
  DIFFICULTY:
  - "Beginner": alphabets, consonants, vowels, and simple 1-2 word basic words.
  - "Intermediate": tough words and short 3-5 word sentences.
  - "Pro" or "Advanced": typical sentences, complex grammar, and long 5-10+ word sentences.

  'term' MUST be the native ${language} word/phrase.
  'translation' MUST be the English translation.
  'emoji' MUST be a single, colorful Unicode emoji (e.g. 🐶, 🍎, 🏃) that visually represents the term perfectly.
  
  Output a JSON array of EXACTLY 10 objects with keys: id (0-9), term (string), translation (string), emoji (string).`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(text) as Flashcard[];
  } catch (error) {
    console.warn("Error generating flashcards:", error);
    return getOfflineFlashcards(levelNum, language);
  }
}

export type ReadingStory = {
  title: string;
  titleEnglish: string;
  paragraphs: Array<{ native: string; english: string; }>;
  questions: Array<{ question: string; options: string[]; correctOption: number; }>;
};

export function getOfflineReadingLesson(levelNum: number, language: string): ReadingStory {
  const langKey = language.toLowerCase();

  const stories: Record<string, ReadingStory> = {
    tamil: {
      title: "சின்னப் பூனை மாலா",
      titleEnglish: "Mala the Little Cat",
      paragraphs: [
        { native: "மாலா ஒரு அழகான சின்னப் பூனை.", english: "Mala is a beautiful little cat." },
        { native: "அது தினமும் பாலும் மீனும் சாப்பிடும்.", english: "It eats milk and fish every day." },
        { native: "அது தோட்டத்தில் மகிழ்ச்சியாக விளையாடும்.", english: "It plays happily in the garden." }
      ],
      questions: [
        { question: "மாலா என்ன விலங்கு?", options: ["பூனை", "நாய்", "யானை", "பறவை"], correctOption: 0 },
        { question: "மாலா தினமும் என்ன சாப்பிடும்?", options: ["பாலும் மீனும்", "பழங்கள்", "இலைகள்", "கேக்"], correctOption: 0 },
        { question: "மாலா எங்கே விளையாடும்?", options: ["தோட்டத்தில்", "வீட்டில்", "பள்ளியில்", "காட்டில்"], correctOption: 0 }
      ]
    },
    hindi: {
      title: "छोटी बिल्ली माला",
      titleEnglish: "Mala the Little Cat",
      paragraphs: [
        { native: "माला एक सुंदर छोटी बिल्ली है।", english: "Mala is a beautiful little cat." },
        { native: "वह हर दिन दूध और मछली खाती है।", english: "She eats milk and fish every day." },
        { native: "वह बगीचे में खुशी से खेलती है।", english: "She plays happily in the garden." }
      ],
      questions: [
        { question: "माला कौन सा जानवर है?", options: ["बिल्ली", "कुत्ता", "हाथी", "पक्षियों"], correctOption: 0 },
        { question: "माला हर दिन क्या खाती है?", options: ["दूध और मछली", "फल", "पत्ते", "केक"], correctOption: 0 },
        { question: "माला कहाँ खेलती है?", options: ["बगीचे में", "घर में", "स्कूल में", "जंगल में"], correctOption: 0 }
      ]
    },
    telugu: {
      title: "చిన్న పిల్లి మాలా",
      titleEnglish: "Mala the Little Cat",
      paragraphs: [
        { native: "మాలా ఒక అందమైన చిన్న పిల్లి.", english: "Mala is a beautiful little cat." },
        { native: "అది రోజూ పాలు, చేపలు తింటుంది.", english: "It eats milk and fish every day." },
        { native: "అది తోటలో సంతోషంగా ఆడుకుంటుంది.", english: "It plays happily in the garden." }
      ],
      questions: [
        { question: "మాలా ఏ జంతువు?", options: ["పిల్లి", "కుక్క", "ఏనుగు", "పక్షి"], correctOption: 0 },
        { question: "మాలా రోజూ ఏమి తింటుంది?", options: ["పాలు మరియు చేపలు", "పండ్లు", "ఆకులు", "కేక్"], correctOption: 0 },
        { question: "మాలా ఎక్కడ ఆడుకుంటుంది?", options: ["తోటలో", "ఇంట్లో", "బడిలో", "అడవిలో"], correctOption: 0 }
      ]
    },
    malayalam: {
      title: "ചെറിയ പൂച്ച മാലാ",
      titleEnglish: "Mala the Little Cat",
      paragraphs: [
        { native: "മാലാ ഒരു മനോഹരമായ ചെറിയ പൂച്ചയാണ്.", english: "Mala is a beautiful little cat." },
        { native: "അത് ദിവസവും പാലും മീനും കഴിക്കും.", english: "It eats milk and fish every day." },
        { native: "അത് തോട്ടത്തിൽ സന്തോഷത്തോടെ കളിക്കും.", english: "It plays happily in the garden." }
      ],
      questions: [
        { question: "മാലാ ഏത് മൃഗമാണ്?", options: ["പൂച്ച", "പട്ടി", "ആന", "പക്ഷി"], correctOption: 0 },
        { question: "മാലാ ദിവസവും എന്ത് കഴിക്കും?", options: ["പാലും മീനും", "പഴങ്ങൾ", "ഇലകൾ", "കേക്ക്"], correctOption: 0 },
        { question: "മാലാ എവിടെ കളിക്കും?", options: ["തോട്ടത്തിൽ", "വീട്ടിൽ", "സ്കൂളിൽ", "കാട്ടിൽ"], correctOption: 0 }
      ]
    },
    kannada: {
      title: "ಚಿಕ್ಕ ಬೆಕ್ಕು ಮಾಲಾ",
      titleEnglish: "Mala the Little Cat",
      paragraphs: [
        { native: "ಮಾಲಾ ಒಂದು ಸುಂದರವಾದ ಚಿಕ್ಕ ಬೆಕ್ಕು.", english: "Mala is a beautiful little cat." },
        { native: "ಅದು ಪ್ರತಿದಿನ ಹಾಲು ಮತ್ತು ಮೀನು ತಿನ್ನುತ್ತದೆ.", english: "It eats milk and fish every day." },
        { native: "ಅದು ತೋಟದಲ್ಲಿ ಸಂತೋಷದಿಂದ ಆಟವಾಡುತ್ತದೆ.", english: "It plays happily in the garden." }
      ],
      questions: [
        { question: "ಮಾಲಾ ಯಾವ ಪ್ರಾಣಿ?", options: ["ಬೆಕ್ಕು", "ನಾಯಿ", "ಆನೆ", "ಪಕ್ಷಿ"], correctOption: 0 },
        { question: "ಮಾಲಾ ಪ್ರತಿದಿನ ಏನು ತಿನ್ನುತ್ತದೆ?", options: ["ಹಾಲು ಮತ್ತು ಮೀನು", "ಹಣ್ಣುಗಳು", "ಎಲೆಗಳು", "ಕೇಕ್"], correctOption: 0 },
        { question: "ಮಾಲಾ ಎಲ್ಲಿ ಆಟವಾಡುತ್ತದೆ?", options: ["ತೋಟದಲ್ಲಿ", "ಮನೆಯಲ್ಲಿ", "ಶಾಲೆಯಲ್ಲಿ", "ಕಾಡಿನಲ್ಲಿ"], correctOption: 0 }
      ]
    }
  };

  return stories[langKey] || stories.tamil;
}

export async function generateReadingLesson(level: string, language: string): Promise<ReadingStory> {
  const levelMatch = level.match(/(\d+)/);
  const levelNum = levelMatch ? parseInt(levelMatch[1], 10) : 1;

  if (!hasApiKey()) {
    return getOfflineReadingLesson(levelNum, language);
  }

  const model = genAI.getGenerativeModel({ 
    model: 'gemini-flash-lite-latest',
    generationConfig: { responseMimeType: "application/json" }
  });

  const prompt = `You are a language teacher teaching ${language}. The user is at level: ${level}.
  Create a short reading comprehension story in ${language}.
  
  CRITICAL INSTRUCTION: Write a COMPLETELY RANDOM, highly varied story. Choose a unique topic, characters, or situation every single time. DO NOT write the same common topics over and over again. Be creative. (Random seed: ${Math.random()})
  
  CRITICAL DIFFICULTY INSTRUCTIONS: 
  - If ${level} includes "Beginner", focus on alphabets, consonants, vowels, and simple 1-2 word basic words in 2-3 short sentences.
  - If ${level} includes "Intermediate", write short stories with tough words and 3-5 word sentences.
  - If ${level} includes "Pro" or "Advanced", write longer stories with typical complex sentences, advanced grammar, and literary phrases.
  
  Provide the following in your JSON response:
  1. 'title': Story title in ${language}.
  2. 'titleEnglish': English translation of the title.
  3. 'paragraphs': An array of objects representing the sentences or paragraphs of the story. Each object must have a 'native' string (${language}) and an 'english' string.
  4. 'questions': An array of exactly 3 multiple-choice comprehension questions entirely in ${language} about the story to verify understanding. Each question must have 'question' (string in ${language}), 'options' (array of 4 strings in ${language}), and 'correctOption' (number 0-3).
  
  Output a single JSON object.`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(text) as ReadingStory;
  } catch (error) {
    console.warn("Error generating reading lesson:", error);
    return getOfflineReadingLesson(levelNum, language);
  }
}

export type WritingChallenge = {
  englishWord: string;
  expectedTranslation: string;
};

export async function generateWritingChallenge(level: string, language: string): Promise<WritingChallenge[]> {
  if (!hasApiKey()) throw new Error('API Key is missing');

  const model = genAI.getGenerativeModel({ 
    model: 'gemini-flash-lite-latest',
    generationConfig: { responseMimeType: "application/json" }
  });

  const prompt = `You are a language teacher for ${language}. The user is at level: ${level}.
  Generate 5 simple words for a handwriting practice exercise.
  
  CRITICAL INSTRUCTION: Select 5 completely random, highly varied words. (Random seed: ${Math.random()})
  If ${level} includes "Beginner" or "Intermediate", use simple 3-5 letter words (e.g. apple, cat, sun).
  If ${level} includes "Pro", use slightly longer words.
  
  Provide a JSON array of exactly 5 objects. Keys: englishWord (string), expectedTranslation (string in ${language} script).`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(text) as WritingChallenge[];
  } catch (error) {
    console.warn("Error generating writing challenge:", error);
    throw error;
  }
}

export type HandwritingEvaluation = {
  score: number;
  feedback: string;
  breakdown?: { label: string; score: number; note: string }[];
};

// Timeout wrapper — rejects after ms milliseconds
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)
    ),
  ]);
}

// Fast local geometric scorer — runs instantly, no API
function localGeometricScore(
  paths: { x: number; y: number }[][],
  expectedTranslation: string
): HandwritingEvaluation {
  const all = paths.flat();
  if (all.length === 0) return { score: 0, feedback: 'Nothing drawn!', breakdown: [] };

  const totalPoints = all.length;
  const strokeCount = paths.length;

  // Bounding box
  const xs = all.map(p => p.x);
  const ys = all.map(p => p.y);
  const w = Math.max(...xs) - Math.min(...xs);
  const h = Math.max(...ys) - Math.min(...ys);

  // Direction changes = complexity
  let dirChanges = 0;
  for (const path of paths) {
    for (let i = 2; i < path.length; i++) {
      const dot =
        (path[i-1].x - path[i-2].x) * (path[i].x - path[i-1].x) +
        (path[i-1].y - path[i-2].y) * (path[i].y - path[i-1].y);
      if (dot < 0) dirChanges++;
    }
  }

  // Expected complexity for the character (more characters = more strokes/points expected)
  const charLen = expectedTranslation.length;
  const expectedPoints = 80 + charLen * 40;
  const expectedDir    = 15 + charLen * 8;

  // Score each component
  const detailScore   = Math.min(100, Math.round((totalPoints / expectedPoints) * 100));
  const complexScore  = Math.min(100, Math.round((dirChanges / expectedDir) * 100));
  const coverageScore = Math.min(100, Math.round(((w * h) / 15000) * 100));
  const strokeScore   = strokeCount >= 2 ? 90 : totalPoints > 80 ? 78 : 50;

  const overall = Math.round(detailScore * 0.3 + complexScore * 0.3 + coverageScore * 0.2 + strokeScore * 0.2);
  const score   = Math.max(35, Math.min(88, overall));

  return {
    score,
    feedback: score >= 75
      ? '✨ Great effort! Keep refining your strokes.'
      : score >= 55
      ? '👍 Good try! Focus on matching the character shape.'
      : '💪 Keep practicing! Try to trace the guide character.',
    breakdown: [
      { label: 'Stroke detail',  score: detailScore,   note: `${totalPoints} pts drawn` },
      { label: 'Complexity',     score: complexScore,  note: `${dirChanges} curves detected` },
      { label: 'Coverage',       score: coverageScore, note: `${Math.round(w)}×${Math.round(h)} area` },
      { label: 'Stroke count',   score: strokeScore,   note: strokeCount === 1 && totalPoints > 80 ? 'Fluid single stroke' : `${strokeCount} stroke(s)` },
    ],
  };
}

// Normalize paths to compact coordinate string for AI prompt
function normalizePaths(paths: { x: number; y: number }[][]): string {
  const all = paths.flat();
  if (all.length === 0) return '';
  const minX = Math.min(...all.map(p => p.x)), maxX = Math.max(...all.map(p => p.x));
  const minY = Math.min(...all.map(p => p.y)), maxY = Math.max(...all.map(p => p.y));
  const rX = maxX - minX || 1, rY = maxY - minY || 1;

  return paths.map((path, i) => {
    const sampled = path.filter((_, idx) => idx % 8 === 0); // sample every 8th to keep prompt short
    const pts = sampled.map(p =>
      `(${Math.round(((p.x - minX) / rX) * 100)},${Math.round(((p.y - minY) / rY) * 100)})`
    ).join(' ');
    return `S${i + 1}: ${pts}`;
  }).join(' | ');
}

export async function evaluateHandwriting(
  imageBase64: string,
  expectedTranslation: string,
  language: string,
  paths?: { x: number; y: number }[][]
): Promise<HandwritingEvaluation> {
  if (!hasApiKey() || !paths || paths.length === 0) {
    return { score: 0, feedback: 'Nothing drawn yet!', breakdown: [] };
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-lite-latest' });

    const totalPoints = paths.flat().length;

    const prompt = `You are a strict and expert ${language} script handwriting evaluator.
The student was asked to write: "${expectedTranslation}" in ${language}.
Analyze the provided image of their handwriting.

Does this match "${expectedTranslation}"? Score strictly out of 100 based on legibility and correct stroke shapes:
- Clearly correct and perfectly legible: 75-98
- Partially correct but messy/sloppy: 45-74
- Wrong character, illegible, or completely off: 10-44

Reply in this exact format (no markdown, just plain text):
SCORE: <number>
FEEDBACK: <one short sentence>
STROKE_ACCURACY: <number>
CHARACTER_SHAPE: <number>
PROPORTIONS: <number>
OVERALL_FORM: <number>`;

    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType: "image/png"
      }
    };

    const result = await withTimeout(model.generateContent([prompt, imagePart]), 15000);
    const text = result.response.text().trim();

    const getNum = (label: string) => {
      const m = text.match(new RegExp(`${label}:\\s*(\\d+)`));
      return m ? Math.min(100, parseInt(m[1])) : 50;
    };
    const getStr = (label: string) => {
      const m = text.match(new RegExp(`${label}:\\s*(.+)`));
      return m ? m[1].trim() : '';
    };

    const score = getNum('SCORE');
    const feedback = getStr('FEEDBACK') || (score >= 70 ? 'Great effort!' : 'Keep practicing!');
    console.log('✅ Vision AI scored:', score, 'for', expectedTranslation);

    return {
      score,
      feedback,
      breakdown: [
        { label: 'Stroke accuracy', score: getNum('STROKE_ACCURACY'), note: `${paths.length} stroke(s)` },
        { label: 'Character shape', score: getNum('CHARACTER_SHAPE'), note: score >= 70 ? 'Matches well' : 'Needs work' },
        { label: 'Proportions',     score: getNum('PROPORTIONS'),     note: score >= 70 ? 'Well spaced' : 'A bit squished' },
        { label: 'Overall form',    score: getNum('OVERALL_FORM'),    note: score >= 70 ? 'Good form' : 'Keep tracing' },
      ],
    };
  } catch (e) {
    console.warn('AI evaluation timed out or failed, using local scorer:', e);
    return localGeometricScore(paths, expectedTranslation);
  }
}

export function isSingleLetterOrAlphabet(phrase: string, english?: string): boolean {
  if (!phrase) return true;
  const cleanPhrase = phrase.trim();
  
  // Rule 1: Length 1 is always a single letter
  if (cleanPhrase.length <= 1) return true;

  // Rule 2: Single consonant with diacritic/virama (e.g. க், ங், ச், பூ, பா)
  const baseChars = cleanPhrase.replace(/[\u0B80-\u0B83\u0BBE-\u0BCD\u0900-\u0903\u093E-\u094D\u0C01-\u0C03\u0C3E-\u0C4D\u0D01-\u0D03\u0D3E-\u0D4D]/g, '');
  if (baseChars.length <= 1) return true;

  // Rule 3: Check English translation label
  if (english) {
    const cleanEng = english.toLowerCase().trim();
    if (
      cleanEng.includes('vowel') || 
      cleanEng.includes('consonant') || 
      cleanEng.includes('alphabet') ||
      cleanEng.includes('letter') ||
      cleanEng.length <= 1 ||
      /^[a-z]\s*\(.*\)$/i.test(cleanEng)
    ) {
      return true;
    }
  }

  return false;
}

export async function generatePronunciationPhrases(level: string, language: string): Promise<PronunciationPhrase[]> {
  if (!hasApiKey()) throw new Error('API Key is missing');

  const model = genAI.getGenerativeModel({ 
    model: 'gemini-flash-lite-latest',
    generationConfig: { responseMimeType: "application/json" }
  });

  const prompt = `You are a language teacher for ${language}. The user is at level: ${level}.
  Generate exactly 10 multi-word phrases or multi-character vocabulary words for a pronunciation practice exercise.
  
  CRITICAL STRICT RULES:
  1. DO NOT output single letters, alphabets, isolated vowels, or isolated consonants (e.g. NEVER output 'அ', 'ஆ', 'க்', 'A (Vowel)', 'K (Consonant)').
  2. ALWAYS use full, multi-letter words or complete real-world sentences (e.g. 'அம்மா' / 'Mother', 'தண்ணீர்' / 'Water', 'வணக்கம்' / 'Hello', 'குடும்பம்' / 'Family').
  3. Every phrase MUST be a real multi-letter word or sentence.
  
  Provide a JSON array of exactly 10 objects. Keys: phrase (string in ${language} script), english (string translation).`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(text) as PronunciationPhrase[];
    return parsed.filter(p => !isSingleLetterOrAlphabet(p.phrase, p.english));
  } catch (error) {
    console.warn("Error generating pronunciation phrases:", error);
    throw error;
  }
}

export type FoundationItem = {
  id: number;
  text: string;
  sound: string;
  translation: string;
  category: string;
};

export async function generateFoundationsLesson(language: string, level: string): Promise<FoundationItem[]> {
  const match = level.match(/Level (\d+)/);
  const lvlNum = match ? parseInt(match[1], 10) : 1;
  const langLower = language.toLowerCase();

  // Deterministic complete Tamil curriculum for Level 1 (Uyir Ezhuthu) & Level 2 (Mei Ezhuthu)
  if (langLower === 'tamil') {
    if (lvlNum === 1) {
      return [
        { id: 1, text: 'அ', sound: 'a', translation: 'A as in Amma (Mother)', category: 'Uyir Ezhuthu' },
        { id: 2, text: 'ஆ', sound: 'aa', translation: 'Aa as in Aadu (Goat)', category: 'Uyir Ezhuthu' },
        { id: 3, text: 'இ', sound: 'i', translation: 'I as in Ilai (Leaf)', category: 'Uyir Ezhuthu' },
        { id: 4, text: 'ஈ', sound: 'ii', translation: 'Ii as in Eeti (Spear)', category: 'Uyir Ezhuthu' },
        { id: 5, text: 'உ', sound: 'u', translation: 'U as in Ulagam (World)', category: 'Uyir Ezhuthu' },
        { id: 6, text: 'ஊ', sound: 'uu', translation: 'Uu as in Oonjal (Swing)', category: 'Uyir Ezhuthu' },
        { id: 7, text: 'எ', sound: 'e', translation: 'E as in Eli (Rat)', category: 'Uyir Ezhuthu' },
        { id: 8, text: 'ஏ', sound: 'ee', translation: 'Ee as in Eani (Ladder)', category: 'Uyir Ezhuthu' },
        { id: 9, text: 'ஐ', sound: 'ai', translation: 'Ai as in Ainthu (Five)', category: 'Uyir Ezhuthu' },
        { id: 10, text: 'ஒ', sound: 'o', translation: 'O as in Ondru (One)', category: 'Uyir Ezhuthu' },
        { id: 11, text: 'ஓ', sound: 'oo', translation: 'Oo as in Odam (Boat)', category: 'Uyir Ezhuthu' },
        { id: 12, text: 'ஔ', sound: 'au', translation: 'Au as in Avvaiyar (Poet)', category: 'Uyir Ezhuthu' },
        { id: 13, text: 'ஃ', sound: 'aakh', translation: 'Aakh (Ayutha Ezhuthu)', category: 'Uyir Ezhuthu' },
        
        { id: 14, text: 'அம்மா', sound: 'Amma', translation: 'Mother', category: 'Basic Words' },
        { id: 15, text: 'அப்பா', sound: 'Appa', translation: 'Father', category: 'Basic Words' },
        { id: 16, text: 'அண்ணன்', sound: 'Annan', translation: 'Elder Brother', category: 'Basic Words' },
        { id: 17, text: 'அக்கா', sound: 'Akka', translation: 'Elder Sister', category: 'Basic Words' },
        { id: 18, text: 'தம்பி', sound: 'Thambi', translation: 'Younger Brother', category: 'Basic Words' },
        { id: 19, text: 'தங்கை', sound: 'Thangai', translation: 'Younger Sister', category: 'Basic Words' },
        { id: 20, text: 'வீடு', sound: 'Veedu', translation: 'House / Home', category: 'Basic Words' },
        { id: 21, text: 'மரம்', sound: 'Maram', translation: 'Tree', category: 'Basic Words' },
        { id: 22, text: 'பழம்', sound: 'Pazham', translation: 'Fruit', category: 'Basic Words' },
        { id: 23, text: 'நீர்', sound: 'Neer', translation: 'Water', category: 'Basic Words' },
      ];
    }
    if (lvlNum === 2) {
      return [
        { id: 1, text: 'க்', sound: 'ik', translation: 'Ik as in Thakkali (Tomato)', category: 'Mei Ezhuthu' },
        { id: 2, text: 'ங்', sound: 'ing', translation: 'Ing as in Sangu (Conch)', category: 'Mei Ezhuthu' },
        { id: 3, text: 'ச்', sound: 'ich', translation: 'Ich as in Thachchan (Carpenter)', category: 'Mei Ezhuthu' },
        { id: 4, text: 'ஞ்', sound: 'inj', translation: 'Inj as in Oonjal (Swing)', category: 'Mei Ezhuthu' },
        { id: 5, text: 'ட்', sound: 'it', translation: 'It as in Pattu (Silk)', category: 'Mei Ezhuthu' },
        { id: 6, text: 'ண்', sound: 'in', translation: 'In as in Kan (Eye)', category: 'Mei Ezhuthu' },
        { id: 7, text: 'த்', sound: 'ith', translation: 'Ith as in Puthagam (Book)', category: 'Mei Ezhuthu' },
        { id: 8, text: 'ந்', sound: 'inth', translation: 'Inth as in Panthu (Ball)', category: 'Mei Ezhuthu' },
        { id: 9, text: 'ப்', sound: 'ip', translation: 'Ip as in Kappal (Ship)', category: 'Mei Ezhuthu' },
        { id: 10, text: 'ம்', sound: 'im', translation: 'Im as in Maram (Tree)', category: 'Mei Ezhuthu' },
        { id: 11, text: 'ய்', sound: 'iy', translation: 'Iy as in Naai (Dog)', category: 'Mei Ezhuthu' },
        { id: 12, text: 'ர்', sound: 'ir', translation: 'Ir as in Ther (Chariot)', category: 'Mei Ezhuthu' },
        { id: 13, text: 'ல்', sound: 'il', translation: 'Il as in Pal (Tooth)', category: 'Mei Ezhuthu' },
        { id: 14, text: 'வ்', sound: 'iv', translation: 'Iv as in Sevvai (Tuesday)', category: 'Mei Ezhuthu' },
        { id: 15, text: 'ழ்', sound: 'zha', translation: 'Zha as in Tamil (Language)', category: 'Mei Ezhuthu' },
        { id: 16, text: 'ள்', sound: 'il', translation: 'Il (Hard L) as in Vaal (Sword)', category: 'Mei Ezhuthu' },
        { id: 17, text: 'ற்', sound: 'tr', translation: 'Tr as in Kaatru (Wind)', category: 'Mei Ezhuthu' },
        { id: 18, text: 'ன்', sound: 'in', translation: 'In as in Meen (Fish)', category: 'Mei Ezhuthu' },
        
        { id: 19, text: 'கண்', sound: 'Kan', translation: 'Eye', category: 'Basic Words' },
        { id: 20, text: 'பந்து', sound: 'Panthu', translation: 'Ball', category: 'Basic Words' },
        { id: 21, text: 'கப்பல்', sound: 'Kappal', translation: 'Ship', category: 'Basic Words' },
        { id: 22, text: 'நாய்', sound: 'Naai', translation: 'Dog', category: 'Basic Words' },
        { id: 23, text: 'மீன்', sound: 'Meen', translation: 'Fish', category: 'Basic Words' },
        { id: 24, text: 'புத்தகம்', sound: 'Puthagam', translation: 'Book', category: 'Basic Words' },
        { id: 25, text: 'பல்', sound: 'Pal', translation: 'Tooth', category: 'Basic Words' },
        { id: 26, text: 'தமிழ்', sound: 'Tamil', translation: 'Tamil Language', category: 'Basic Words' },
      ];
    }

    if (lvlNum >= 3 && lvlNum <= 14) {
      const TAMIL_UYIRMEI_SERIES = [
        {
          category: 'Uyirmei - அ',
          letters: [
            { text: 'க', sound: 'ka', translation: 'Ka as in Kan (Eye)' },
            { text: 'ங', sound: 'nga', translation: 'Nga as in Ing-ga (Here)' },
            { text: 'ச', sound: 'cha', translation: 'Cha as in Sattam (Law)' },
            { text: 'ஞ', sound: 'nja', translation: 'Nja as in Nyaayiru (Sunday)' },
            { text: 'ட', sound: 'ta', translation: 'Ta as in Pattam (Kite)' },
            { text: 'ண', sound: 'na', translation: 'Na as in Kanam (Weight)' },
            { text: 'த', sound: 'tha', translation: 'Tha as in Thambi (Brother)' },
            { text: 'ந', sound: 'ntha', translation: 'Ntha as in Nandu (Crab)' },
            { text: 'ப', sound: 'pa', translation: 'Pa as in Pattam (Kite)' },
            { text: 'ம', sound: 'ma', translation: 'Ma as in Maram (Tree)' },
            { text: 'ய', sound: 'ya', translation: 'Ya as in Yaanai (Elephant)' },
            { text: 'ர', sound: 'ra', translation: 'Ra as in Ratham (Chariot)' },
            { text: 'ல', sound: 'la', translation: 'La as in Lattu (Top)' },
            { text: 'வ', sound: 'va', translation: 'Va as in Vaanam (Sky)' },
            { text: 'ழ', sound: 'zha', translation: 'Zha as in Tamil (Language)' },
            { text: 'ள', sound: 'la', translation: 'La (Hard) as in Vaal (Tail)' },
            { text: 'ற', sound: 'tra', translation: 'Tra as in Paravai (Bird)' },
            { text: 'ன', sound: 'na', translation: 'Na as in Annan (Brother)' },
          ],
          words: [
            { text: 'கண்', sound: 'Kan', translation: 'Eye' },
            { text: 'மரம்', sound: 'Maram', translation: 'Tree' },
            { text: 'பறவை', sound: 'Paravai', translation: 'Bird' },
            { text: 'யானை', sound: 'Yaanai', translation: 'Elephant' },
            { text: 'வானம்', sound: 'Vaanam', translation: 'Sky' },
          ]
        },
        {
          category: 'Uyirmei - ஆ',
          letters: [
            { text: 'கா', sound: 'kaa', translation: 'Kaa as in Kaatru (Wind)' },
            { text: 'ஙா', sound: 'ngaa', translation: 'Ngaa sound' },
            { text: 'சா', sound: 'chaa', translation: 'Chaa as in Saappadu (Food)' },
            { text: 'ஞா', sound: 'njaa', translation: 'Njaa as in Gnaayiru (Sun)' },
            { text: 'டா', sound: 'taa', translation: 'Taa sound' },
            { text: 'ணா', sound: 'naa', translation: 'Naa sound' },
            { text: 'தா', sound: 'thaa', translation: 'Thaa as in Thaatha (Grandfather)' },
            { text: 'நா', sound: 'nthaa', translation: 'Nthaa as in Naai (Dog)' },
            { text: 'பா', sound: 'paa', translation: 'Paa as in Paal (Milk)' },
            { text: 'மா', sound: 'maa', translation: 'Maa as in Maangai (Mango)' },
            { text: 'யா', sound: 'yaa', translation: 'Yaa as in Yaar (Who)' },
            { text: 'ரா', sound: 'raa', translation: 'Raa as in Raaja (King)' },
            { text: 'லா', sound: 'laa', translation: 'Laa as in Laabam (Profit)' },
            { text: 'வா', sound: 'vaa', translation: 'Vaa as in Vaazhai (Banana)' },
            { text: 'ழா', sound: 'zhaa', translation: 'Zhaa as in Vaazhga (Long live)' },
            { text: 'ளா', sound: 'laa', translation: 'Laa (Hard) sound' },
            { text: 'றா', sound: 'traa', translation: 'Traa as in Kaatru (Wind)' },
            { text: 'னா', sound: 'naa', translation: 'Naa sound' },
          ],
          words: [
            { text: 'பால்', sound: 'Paal', translation: 'Milk' },
            { text: 'நாய்', sound: 'Naai', translation: 'Dog' },
            { text: 'மாங்காய்', sound: 'Maangai', translation: 'Mango' },
            { text: 'தாத்தா', sound: 'Thaatha', translation: 'Grandfather' },
            { text: 'காடை', sound: 'Kaadai', translation: 'Quail' },
          ]
        },
        {
          category: 'Uyirmei - இ',
          letters: [
            { text: 'கி', sound: 'ki', translation: 'Ki as in Kili (Parrot)' },
            { text: 'ஙி', sound: 'ngi', translation: 'Ngi sound' },
            { text: 'சி', sound: 'chi', translation: 'Chi as in Singam (Lion)' },
            { text: 'ஞி', sound: 'nji', translation: 'Nji sound' },
            { text: 'டி', sound: 'ti', translation: 'Ti as in Vandi (Vehicle)' },
            { text: 'ணி', sound: 'ni', translation: 'Ni as in Mani (Bell)' },
            { text: 'தி', sound: 'thi', translation: 'Thi as in Thinam (Day)' },
            { text: 'நி', sound: 'nthi', translation: 'Nthi as in Nilavu (Moon)' },
            { text: 'பி', sound: 'pi', translation: 'Pi as in Pillai (Child)' },
            { text: 'மி', sound: 'mi', translation: 'Mi as in Minnal (Lightning)' },
            { text: 'யி', sound: 'yi', translation: 'Yi sound' },
            { text: 'ரி', sound: 'ri', translation: 'Ri as in Nari (Fox)' },
            { text: 'லி', sound: 'li', translation: 'Li as in Puli (Tiger)' },
            { text: 'வி', sound: 'vi', translation: 'Vi as in Viral (Finger)' },
            { text: 'ழி', sound: 'zhi', translation: 'Zhi as in Vazhi (Path)' },
            { text: 'ளி', sound: 'li', translation: 'Li (Hard) as in KiLi (Parrot)' },
            { text: 'றி', sound: 'tri', translation: 'Tri sound' },
            { text: 'னி', sound: 'ni', translation: 'Ni as in Kani (Fruit)' },
          ],
          words: [
            { text: 'கிளி', sound: 'Kili', translation: 'Parrot' },
            { text: 'புலி', sound: 'Puli', translation: 'Tiger' },
            { text: 'நிலவு', sound: 'Nilavu', translation: 'Moon' },
            { text: 'விரல்', sound: 'Viral', translation: 'Finger' },
            { text: 'சிங்கம்', sound: 'Singam', translation: 'Lion' },
          ]
        },
        {
          category: 'Uyirmei - ஈ',
          letters: [
            { text: 'கீ', sound: 'kee', translation: 'Kee as in Keerai (Spinach)' },
            { text: 'ஙீ', sound: 'ngee', translation: 'Ngee sound' },
            { text: 'சீ', sound: 'chee', translation: 'Chee as in Seepu (Comb)' },
            { text: 'ஞீ', sound: 'njee', translation: 'Njee sound' },
            { text: 'டீ', sound: 'tee', translation: 'Tee sound' },
            { text: 'ணீ', sound: 'nee', translation: 'Nee as in Thanneer (Water)' },
            { text: 'தீ', sound: 'thee', translation: 'Thee as in Thee (Fire)' },
            { text: 'நீ', sound: 'nthee', translation: 'Nthee as in Nee (You)' },
            { text: 'பீ', sound: 'pee', translation: 'Pee sound' },
            { text: 'மீ', sound: 'mee', translation: 'Mee as in Meen (Fish)' },
            { text: 'யீ', sound: 'yee', translation: 'Yee sound' },
            { text: 'ரீ', sound: 'ree', translation: 'Ree sound' },
            { text: 'லீ', sound: 'lee', translation: 'Lee sound' },
            { text: 'வீ', sound: 'vee', translation: 'Vee as in Veedu (House)' },
            { text: 'ழீ', sound: 'zhee', translation: 'Zhee sound' },
            { text: 'ளீ', sound: 'lee', translation: 'Lee (Hard) sound' },
            { text: 'றீ', sound: 'tree', translation: 'Tree sound' },
            { text: 'னீ', sound: 'nee', translation: 'Nee sound' },
          ],
          words: [
            { text: 'மீன்', sound: 'Meen', translation: 'Fish' },
            { text: 'வீடு', sound: 'Veedu', translation: 'House' },
            { text: 'தீ', sound: 'Thee', translation: 'Fire' },
            { text: 'கீரை', sound: 'Keerai', translation: 'Spinach' },
            { text: 'சீப்பு', sound: 'Seepu', translation: 'Comb' },
          ]
        },
        {
          category: 'Uyirmei - உ',
          letters: [
            { text: 'கு', sound: 'ku', translation: 'Ku as in Kudai (Umbrella)' },
            { text: 'ஙு', sound: 'ngu', translation: 'Ngu sound' },
            { text: 'சு', sound: 'chu', translation: 'Chu as in Suriyan (Sun)' },
            { text: 'ஞு', sound: 'nju', translation: 'Nju sound' },
            { text: 'டு', sound: 'tu', translation: 'Tu as in Vandu (Beetle)' },
            { text: 'ணு', sound: 'nu', translation: 'Nu sound' },
            { text: 'து', sound: 'thu', translation: 'Thu as in Thuni (Cloth)' },
            { text: 'நு', sound: 'nthu', translation: 'Nthu as in Nungu (Ice apple)' },
            { text: 'பு', sound: 'pu', translation: 'Pu as in Puthagam (Book)' },
            { text: 'மு', sound: 'mu', translation: 'Mu as in Muyal (Rabbit)' },
            { text: 'யு', sound: 'yu', translation: 'Yu sound' },
            { text: 'ரு', sound: 'ru', translation: 'Ru as in Rusi (Taste)' },
            { text: 'லு', sound: 'lu', translation: 'Lu sound' },
            { text: 'வு', sound: 'vu', translation: 'Vu sound' },
            { text: 'ழு', sound: 'zhu', translation: 'Zhu as in Ezhuthu (Letter)' },
            { text: 'ளு', sound: 'lu', translation: 'Lu (Hard) sound' },
            { text: 'று', sound: 'tru', translation: 'Tru as in Aaru (River)' },
            { text: 'னு', sound: 'nu', translation: 'Nu sound' },
          ],
          words: [
            { text: 'குடை', sound: 'Kudai', translation: 'Umbrella' },
            { text: 'முயல்', sound: 'Muyal', translation: 'Rabbit' },
            { text: 'சூரியன்', sound: 'Suriyan', translation: 'Sun' },
            { text: 'புத்தகம்', sound: 'Puthagam', translation: 'Book' },
            { text: 'ஆறு', sound: 'Aaru', translation: 'River' },
          ]
        },
        {
          category: 'Uyirmei - ஊ',
          letters: [
            { text: 'கூ', sound: 'koo', translation: 'Koo as in Koottam (Crowd)' },
            { text: 'ஙூ', sound: 'ngoo', translation: 'Ngoo sound' },
            { text: 'சூ', sound: 'choo', translation: 'Choo sound' },
            { text: 'ஞூ', sound: 'njoo', translation: 'Njoo sound' },
            { text: 'டூ', sound: 'too', translation: 'Too sound' },
            { text: 'ணூ', sound: 'noo', translation: 'Noo sound' },
            { text: 'தூ', sound: 'thoo', translation: 'Thoo as in Thoon (Pillar)' },
            { text: 'நூ', sound: 'nthoo', translation: 'Nthoo as in Nool (Thread)' },
            { text: 'பூ', sound: 'poo', translation: 'Poo as in Poo (Flower)' },
            { text: 'மூ', sound: 'moo', translation: 'Moo as in Mooku (Nose)' },
            { text: 'யூ', sound: 'yoo', translation: 'Yoo sound' },
            { text: 'ரூ', sound: 'roo', translation: 'Roo as in Roobai (Rupee)' },
            { text: 'லூ', sound: 'loo', translation: 'Loo sound' },
            { text: 'வூ', sound: 'voo', translation: 'Voo sound' },
            { text: 'ழூ', sound: 'zhoo', translation: 'Zhoo sound' },
            { text: 'ளூ', sound: 'loo', translation: 'Loo (Hard) sound' },
            { text: 'றூ', sound: 'troo', translation: 'Troo sound' },
            { text: 'னூ', sound: 'noo', translation: 'Noo sound' },
          ],
          words: [
            { text: 'பூ', sound: 'Poo', translation: 'Flower' },
            { text: 'மூக்கு', sound: 'Mooku', translation: 'Nose' },
            { text: 'நூல்', sound: 'Nool', translation: 'Thread' },
            { text: 'தூண்', sound: 'Thoon', translation: 'Pillar' },
            { text: 'ரூபாய்', sound: 'Roobai', translation: 'Rupee' },
          ]
        },
        {
          category: 'Uyirmei - எ',
          letters: [
            { text: 'கெ', sound: 'ke', translation: 'Ke sound' },
            { text: 'ஙெ', sound: 'nge', translation: 'Nge sound' },
            { text: 'செ', sound: 'che', translation: 'Che as in Cheppal' },
            { text: 'ஞெ', sound: 'nje', translation: 'Nje sound' },
            { text: 'டெ', sound: 'te', translation: 'Te sound' },
            { text: 'ணெ', sound: 'ne', translation: 'Ne as in Ennei (Oil)' },
            { text: 'தெ', sound: 'the', translation: 'The as in Theru (Street)' },
            { text: 'நெ', sound: 'nthe', translation: 'Nthe as in Nellu (Paddy)' },
            { text: 'பெ', sound: 'pe', translation: 'Pe as in Petti (Box)' },
            { text: 'மெ', sound: 'me', translation: 'Me sound' },
            { text: 'யெ', sound: 'ye', translation: 'Ye sound' },
            { text: 'ரெ', sound: 're', translation: 'Re sound' },
            { text: 'லெ', sound: 'le', translation: 'Le sound' },
            { text: 'வெ', sound: 've', translation: 'Ve as in Velli (Silver)' },
            { text: 'ழெ', sound: 'zhe', translation: 'Zhe sound' },
            { text: 'ளெ', sound: 'le', translation: 'Le (Hard) sound' },
            { text: 'றெ', sound: 'tre', translation: 'Tre sound' },
            { text: 'னெ', sound: 'ne', translation: 'Ne sound' },
          ],
          words: [
            { text: 'பெட்டி', sound: 'Petti', translation: 'Box' },
            { text: 'வெள்ளி', sound: 'Velli', translation: 'Silver / Friday' },
            { text: 'தெரு', sound: 'Theru', translation: 'Street' },
            { text: 'நெல்', sound: 'Nellu', translation: 'Paddy' },
          ]
        },
        {
          category: 'Uyirmei - ஏ',
          letters: [
            { text: 'கே', sound: 'kay', translation: 'Kay as in Kelvi (Question)' },
            { text: 'ஙே', sound: 'ngay', translation: 'Ngay sound' },
            { text: 'சே', sound: 'chay', translation: 'Chay as in Seval (Rooster)' },
            { text: 'ஞே', sound: 'njay', translation: 'Njay sound' },
            { text: 'டே', sound: 'tay', translation: 'Tay sound' },
            { text: 'ணே', sound: 'nay', translation: 'Nay sound' },
            { text: 'தே', sound: 'thay', translation: 'Thay as in Thengai (Coconut)' },
            { text: 'நே', sound: 'nthay', translation: 'Nthay as in Neram (Time)' },
            { text: 'பே', sound: 'pay', translation: 'Pay as in Paesu (Talk)' },
            { text: 'மே', sound: 'may', translation: 'May as in Megam (Cloud)' },
            { text: 'யே', sound: 'yay', translation: 'Yay sound' },
            { text: 'ரே', sound: 'ray', translation: 'Ray sound' },
            { text: 'லே', sound: 'lay', translation: 'Lay sound' },
            { text: 'வே', sound: 'vay', translation: 'Vay as in Velan (Farmer)' },
            { text: 'ழே', sound: 'zhay', translation: 'Zhay sound' },
            { text: 'ளே', sound: 'lay', translation: 'Lay (Hard) sound' },
            { text: 'றே', sound: 'tray', translation: 'Tray sound' },
            { text: 'னே', sound: 'nay', translation: 'Nay sound' },
          ],
          words: [
            { text: 'மேகம்', sound: 'Megam', translation: 'Cloud' },
            { text: 'தேங்காய்', sound: 'Thengai', translation: 'Coconut' },
            { text: 'நேரம்', sound: 'Neram', translation: 'Time' },
            { text: 'சேவல்', sound: 'Seval', translation: 'Rooster' },
          ]
        },
        {
          category: 'Uyirmei - ஐ',
          letters: [
            { text: 'கை', sound: 'kai', translation: 'Kai as in Kai (Hand)' },
            { text: 'ஙை', sound: 'ngai', translation: 'Ngai sound' },
            { text: 'சை', sound: 'chai', translation: 'Chai sound' },
            { text: 'ஞை', sound: 'njai', translation: 'Njai sound' },
            { text: 'டை', sound: 'tai', translation: 'Tai as in Kudai (Umbrella)' },
            { text: 'ணை', sound: 'nai', translation: 'Nai as in Yanai (Elephant)' },
            { text: 'தை', sound: 'thai', translation: 'Thai as in Thai (January)' },
            { text: 'நை', sound: 'nthai', translation: 'Nthai sound' },
            { text: 'பை', sound: 'pai', translation: 'Pai as in Pai (Bag)' },
            { text: 'மை', sound: 'mai', translation: 'Mai as in Mai (Ink)' },
            { text: 'யை', sound: 'yai', translation: 'Yai sound' },
            { text: 'ரை', sound: 'rai', translation: 'Rai as in Keerai (Spinach)' },
            { text: 'லை', sound: 'lai', translation: 'Lai as in Ilai (Leaf)' },
            { text: 'வை', sound: 'vai', translation: 'Vai as in Vai (Mouth)' },
            { text: 'ழை', sound: 'zhai', translation: 'Zhai as in Mazhai (Rain)' },
            { text: 'ளை', sound: 'lai', translation: 'Lai (Hard) sound' },
            { text: 'றை', sound: 'trai', translation: 'Trai as in Paravai (Bird)' },
            { text: 'னை', sound: 'nai', translation: 'Nai sound' },
          ],
          words: [
            { text: 'கை', sound: 'Kai', translation: 'Hand' },
            { text: 'பை', sound: 'Pai', translation: 'Bag' },
            { text: 'மழை', sound: 'Mazhai', translation: 'Rain' },
            { text: 'இலை', sound: 'Ilai', translation: 'Leaf' },
            { text: 'யானை', sound: 'Yaanai', translation: 'Elephant' },
          ]
        },
        {
          category: 'Uyirmei - ஒ',
          letters: [
            { text: 'கொ', sound: 'ko', translation: 'Ko as in Kodi (Flag)' },
            { text: 'ஙொ', sound: 'ngo', translation: 'Ngo sound' },
            { text: 'சொ', sound: 'cho', translation: 'Cho as in Sol (Word)' },
            { text: 'ஞொ', sound: 'njo', translation: 'Njo sound' },
            { text: 'டொ', sound: 'to', translation: 'To sound' },
            { text: 'ணொ', sound: 'no', translation: 'No sound' },
            { text: 'தொ', sound: 'tho', translation: 'Tho sound' },
            { text: 'நொ', sound: 'ntho', translation: 'Ntho as in Nodi (Second)' },
            { text: 'பொ', sound: 'po', translation: 'Po sound' },
            { text: 'மொ', sound: 'mo', translation: 'Mo as in Mozhi (Language)' },
            { text: 'யொ', sound: 'yo', translation: 'Yo sound' },
            { text: 'ரொ', sound: 'ro', translation: 'Ro as in Rotti (Bread)' },
            { text: 'லொ', sound: 'lo', translation: 'Lo sound' },
            { text: 'வொ', sound: 'vo', translation: 'Vo sound' },
            { text: 'ழொ', sound: 'zho', translation: 'Zho sound' },
            { text: 'ளொ', sound: 'lo', translation: 'Lo (Hard) sound' },
            { text: 'றொ', sound: 'tro', translation: 'Tro sound' },
            { text: 'னொ', sound: 'no', translation: 'No sound' },
          ],
          words: [
            { text: 'கொடி', sound: 'Kodi', translation: 'Flag' },
            { text: 'மொழி', sound: 'Mozhi', translation: 'Language' },
            { text: 'சொல்', sound: 'Sol', translation: 'Word' },
            { text: 'நொடி', sound: 'Nodi', translation: 'Second' },
          ]
        },
        {
          category: 'Uyirmei - ஓ',
          letters: [
            { text: 'கோ', sound: 'koh', translation: 'Koh as in Koil (Temple)' },
            { text: 'ஙோ', sound: 'ngoh', translation: 'Ngoh sound' },
            { text: 'சோ', sound: 'choh', translation: 'Choh as in Soru (Rice)' },
            { text: 'ஞோ', sound: 'njoh', translation: 'Njoh sound' },
            { text: 'டோ', sound: 'toh', translation: 'Toh sound' },
            { text: 'ணோ', sound: 'noh', translation: 'Noh sound' },
            { text: 'தோ', sound: 'thoh', translation: 'Thoh as in Thozhan (Friend)' },
            { text: 'நோ', sound: 'nthoh', translation: 'Nthoh as in Noi (Illness)' },
            { text: 'போ', sound: 'poh', translation: 'Poh as in Poh (Go)' },
            { text: 'மோ', sound: 'moh', translation: 'Moh as in Mor (Buttermilk)' },
            { text: 'யோ', sound: 'yoh', translation: 'Yoh sound' },
            { text: 'ரோ', sound: 'roh', translation: 'Roh as in Roja (Rose)' },
            { text: 'லோ', sound: 'loh', translation: 'Loh sound' },
            { text: 'வோ', sound: 'voh', translation: 'Voh sound' },
            { text: 'ழோ', sound: 'zhoh', translation: 'Zhoh sound' },
            { text: 'ளோ', sound: 'loh', translation: 'Loh (Hard) sound' },
            { text: 'றோ', sound: 'troh', translation: 'Troh sound' },
            { text: 'னோ', sound: 'noh', translation: 'Noh sound' },
          ],
          words: [
            { text: 'கோயில்', sound: 'Koil', translation: 'Temple' },
            { text: 'சோறு', sound: 'Soru', translation: 'Rice' },
            { text: 'ரோஜா', sound: 'Roja', translation: 'Rose' },
            { text: 'மோர்', sound: 'Mor', translation: 'Buttermilk' },
          ]
        },
        {
          category: 'Uyirmei - ஔ',
          letters: [
            { text: 'கௌ', sound: 'kau', translation: 'Kau as in Kauravar' },
            { text: 'ஙௌ', sound: 'ngau', translation: 'Ngau sound' },
            { text: 'சௌ', sound: 'chau', translation: 'Chau as in Saukyam (Wellbeing)' },
            { text: 'ஞௌ', sound: 'njau', translation: 'Njau sound' },
            { text: 'டௌ', sound: 'tau', translation: 'Tau sound' },
            { text: 'ணௌ', sound: 'nau', translation: 'Nau sound' },
            { text: 'தௌ', sound: 'thau', translation: 'Thau sound' },
            { text: 'நௌ', sound: 'nthau', translation: 'Nthau sound' },
            { text: 'பௌ', sound: 'pau', translation: 'Pau as in Pournami (Full Moon)' },
            { text: 'மௌ', sound: 'mau', translation: 'Mau as in Maunam (Silence)' },
            { text: 'யௌ', sound: 'yau', translation: 'Yau sound' },
            { text: 'ரௌ', sound: 'rau', translation: 'Rau sound' },
            { text: 'லௌ', sound: 'lau', translation: 'Lau sound' },
            { text: 'வௌ', sound: 'vau', translation: 'Vau as in Vowval (Bat)' },
            { text: 'ழௌ', sound: 'zhau', translation: 'Zhau sound' },
            { text: 'ளௌ', sound: 'lau', translation: 'Lau (Hard) sound' },
            { text: 'றௌ', sound: 'trau', translation: 'Trau sound' },
            { text: 'னௌ', sound: 'nau', translation: 'Nau sound' },
          ],
          words: [
            { text: 'பௌர்ணமி', sound: 'Pournami', translation: 'Full Moon' },
            { text: 'மௌனம்', sound: 'Maunam', translation: 'Silence' },
            { text: 'வௌவால்', sound: 'Vowval', translation: 'Bat' },
          ]
        }
      ];

      const seriesIndex = lvlNum - 3;
      const series = TAMIL_UYIRMEI_SERIES[seriesIndex];
      if (series) {
        let idCounter = 1;
        const letterItems: FoundationItem[] = series.letters.map(l => ({
          id: idCounter++,
          text: l.text,
          sound: l.sound,
          translation: l.translation,
          category: series.category
        }));
        const wordItems: FoundationItem[] = series.words.map(w => ({
          id: idCounter++,
          text: w.text,
          sound: w.sound,
          translation: w.translation,
          category: 'Basic Words'
        }));
        return [...letterItems, ...wordItems];
      }
    }


  }

  if (!hasApiKey()) throw new Error('API Key is missing');

  const model = genAI.getGenerativeModel({ 
    model: 'gemini-flash-lite-latest',
    generationConfig: { responseMimeType: "application/json" }
  });

  let curriculumInstruction = "";

  if (langLower === 'tamil') {
    if (lvlNum >= 3 && lvlNum <= 14) {
      curriculumInstruction = `You MUST generate a subset of exactly 18 'Uyirmei Ezhuthu' (Compound letters) sharing the SAME VOWEL SOUND. Specifically, generate combination sequence #${lvlNum - 2} out of 12 (for example, if sequence 1, generate all 18 consonants with the 'a' sound -> க, ங, ச, ஞ... If sequence 2, generate all 18 with the 'aa' sound -> கா, ஙா, சா, ஞா...). Put them in a category named 'Uyirmei Ezhuthu'. Also generate exactly 10 'Basic Words'.`;
    } else {
      curriculumInstruction = `The user has mastered the alphabet. Generate exactly 20 advanced vocabulary words categorised under 'Advanced Words'.`;
    }
  } else if (langLower === 'hindi') {
    if (lvlNum === 1) {
      curriculumInstruction = `You MUST generate all 13 'Swar' (Vowels) in one category named 'Swar', and exactly 10 'Basic Words' in another category.`;
    } else if (lvlNum === 2) {
      curriculumInstruction = `You MUST generate all 33 'Vyanjan' (Consonants) in one category named 'Vyanjan', and exactly 10 'Basic Words'.`;
    } else if (lvlNum >= 3 && lvlNum <= 14) {
      curriculumInstruction = `You MUST generate exactly 33 'Matras' sharing the SAME VOWEL SOUND. Specifically, generate the full sequence for vowel/matra #${lvlNum - 2} out of 12 across all consonants (e.g. ka, kha, ga... then kaa, khaa, gaa...). Put them in a category named 'Barakhadi'. Also generate exactly 10 'Basic Words'.`;
    } else {
      curriculumInstruction = `Generate exactly 20 advanced vocabulary words categorised under 'Advanced Words'.`;
    }
  } else if (langLower === 'telugu' || langLower === 'kannada' || langLower === 'malayalam') {
    if (lvlNum === 1) {
      curriculumInstruction = `You MUST generate all Vowels (e.g. Achulu or Swarangal) in one category named accordingly in native grammatical terms, and exactly 10 'Basic Words'.`;
    } else if (lvlNum === 2) {
      curriculumInstruction = `You MUST generate all Consonants (e.g. Hallulu or Vyanjanangal) in one category, and exactly 10 'Basic Words'.`;
    } else if (lvlNum >= 3 && lvlNum <= 14) {
      curriculumInstruction = `You MUST generate all Compound Letters (e.g. Guninthalu) sharing the SAME VOWEL SOUND across all consonants in one category, and exactly 10 'Basic Words'.`;
    } else {
      curriculumInstruction = `Generate exactly 20 advanced vocabulary words categorised under 'Advanced Words'.`;
    }
  } else {
    curriculumInstruction = `If lvlNum is 1, teach all Vowels + 10 words. If 2, teach all Consonants + 10 words. If 3+, teach all advanced alphabet combinations grouped by vowel sound + 10 words. Use native grammatical terms.`;
  }

  const prompt = `You are an expert language teacher teaching ${language}. 
  
  CURRICULUM REQUIREMENT (CRITICAL): 
  ${curriculumInstruction}
  
  IMPORTANT INSTRUCTION: You MUST generate the letters STRICTLY in their traditional chronological alphabetical order as taught in schools (e.g., standard sequential dictionary order). Do NOT shuffle or randomise the letters. Keep them perfectly sequential.
  
  Output a JSON array of objects with keys: 
  - id (number)
  - text (the native ${language} letter/word)
  - sound (English transliteration/pronunciation)
  - translation (English meaning. If it's just a letter, provide a word that starts with it, e.g., "A as in Apple")
  - category (The native grammatical category name, e.g., "Uyir Ezhuthu", "Swar", "Basic Words").`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(text) as FoundationItem[];
  } catch (error) {
    console.warn("Error generating foundations:", error);
    throw error;
  }
}



// ===== STORIES =====
export type CultureStory = {
  title: string;
  titleNative: string;
  emoji: string;
  paragraphs: { native: string; english: string }[];
};

