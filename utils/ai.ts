import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the API with the key from env, or a fallback if not set.
// We check if it exists so we can gracefully fallback in the UI if the user hasn't set it yet.
const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

export const hasApiKey = () => API_KEY.length > 0;

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
    const result = await model.generateContent(prompt);
    
    const text = result.response.text();
    // Clean up potential markdown formatting if the model still includes it
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText) as AssessmentQuestion[];
  } catch (error) {
    console.warn("Error generating assessment:", error);
    throw error;
  }
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

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.warn("Error generating tutor response:", error);
    return "I'm having trouble thinking right now. Please try again later.";
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
  - If ${level} includes "Beginner", make the exercises very simple, using basic, common words and short sentences.
  - If ${level} includes "Intermediate", use conversational grammar and moderate vocabulary.
  - If ${level} includes "Pro" or "Advanced", use extremely tough and highly advanced vocabulary. Every single word and scenario must be very challenging, including rare words, complex grammar, and difficult literary terms.
  
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

export async function generateFlashcardLesson(skill: string, level: string, language: string): Promise<Flashcard[]> {
  if (!hasApiKey()) throw new Error('API Key is missing');

  const model = genAI.getGenerativeModel({ 
    model: 'gemini-flash-lite-latest',
    generationConfig: { responseMimeType: "application/json" }
  });

  const prompt = `You are an expert language teacher teaching ${language}. The user is at level: ${level}.
  Create 10 flashcards for the topic [${skill}].
  
  CRITICAL INSTRUCTION: Select a COMPLETELY RANDOM, highly varied set of 10 words from a massive pool of ${language} vocabulary suitable for this level. DO NOT output the same common words every time. Shuffle your selection. (Random seed: ${Math.random()})
  
  DIFFICULTY:
  - "Beginner": simple nouns (animals, food, colors, family) or basic verbs.
  - "Intermediate": intermediate phrases, emotions, weather, or conversational terms.
  - "Pro" or "Advanced": EXTREMELY TOUGH vocabulary. Every single word must be highly advanced, rare, difficult professional terms, obscure idioms, or complex abstract concepts. No simple words allowed!

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
    throw error;
  }
}

export type ReadingStory = {
  title: string;
  titleEnglish: string;
  paragraphs: Array<{ native: string; english: string; }>;
  questions: Array<{ question: string; options: string[]; correctOption: number; }>;
};

export async function generateReadingLesson(level: string, language: string): Promise<ReadingStory> {
  if (!hasApiKey()) throw new Error('API Key is missing');

  const model = genAI.getGenerativeModel({ 
    model: 'gemini-flash-lite-latest',
    generationConfig: { responseMimeType: "application/json" }
  });

  const prompt = `You are a language teacher teaching ${language}. The user is at level: ${level}.
  Create a short reading comprehension story in ${language}.
  
  CRITICAL INSTRUCTION: Write a COMPLETELY RANDOM, highly varied story. Choose a unique topic, characters, or situation every single time. DO NOT write the same common topics over and over again. Be creative. (Random seed: ${Math.random()})
  
  CRITICAL DIFFICULTY INSTRUCTIONS: 
  - If ${level} includes "Beginner", write 3-4 very simple sentences about daily life, animals, or food.
  - If ${level} includes "Intermediate", write a short paragraph about a cultural event or a trip with moderate vocabulary.
  - If ${level} includes "Pro", write a complex story, folk tale, or article with advanced grammar and idioms.
  
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
    throw error;
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

  // Plain text mode — much faster than JSON mode
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-lite-latest' });

    const totalPoints = paths.flat().length;
    const strokeSummary = normalizePaths(paths);

    const prompt = `You are a ${language} script handwriting evaluator.
The student was asked to write: "${expectedTranslation}" in ${language}.
Strokes: ${paths.length}, Points: ${totalPoints}
Normalized coordinates: ${strokeSummary}

Does this match "${expectedTranslation}"? Score strictly:
- Clearly correct: 72-90
- Partially correct: 45-68
- Wrong character: 15-40

Reply in this exact format:
SCORE: <number>
FEEDBACK: <one short sentence>
STROKE_ACCURACY: <number>
CHARACTER_SHAPE: <number>
PROPORTIONS: <number>
OVERALL_FORM: <number>`;

    const result = await withTimeout(model.generateContent(prompt), 15000);
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
    console.log('✅ AI scored:', score, 'for', expectedTranslation);

    return {
      score,
      feedback,
      breakdown: [
        { label: 'Stroke accuracy', score: getNum('STROKE_ACCURACY'), note: `${paths.length} stroke(s)` },
        { label: 'Character shape', score: getNum('CHARACTER_SHAPE'), note: score >= 70 ? 'Matches well' : 'Needs work' },
        { label: 'Proportions',     score: getNum('PROPORTIONS'),     note: `${totalPoints} pts` },
        { label: 'Overall form',    score: getNum('OVERALL_FORM'),    note: score >= 70 ? 'Good form' : 'Keep tracing' },
      ],
    };
  } catch (e) {
    console.warn('AI evaluation timed out or failed, using local scorer:', e);
    return localGeometricScore(paths, expectedTranslation);
  }
}

export type PronunciationPhrase = {
  phrase: string;
  english: string;
};

export async function generatePronunciationPhrases(level: string, language: string): Promise<PronunciationPhrase[]> {
  if (!hasApiKey()) throw new Error('API Key is missing');

  const model = genAI.getGenerativeModel({ 
    model: 'gemini-flash-lite-latest',
    generationConfig: { responseMimeType: "application/json" }
  });

  const prompt = `You are a language teacher for ${language}. The user is at level: ${level}.
  Generate exactly 10 phrases for a pronunciation practice exercise.
  
  CRITICAL INSTRUCTION: Select 10 completely random, highly varied phrases. (Random seed: ${Math.random()})
  If ${level} includes "Beginner", use simple 1-2 word common phrases (e.g. Hello, Thank you, Water).
  If ${level} includes "Intermediate", use conversational sentences with 3-5 words (e.g. I am going to the store).
  If ${level} includes "Pro" or "Advanced", use tough tongue-twisters, complex grammatical sentences, or advanced cultural idioms with 5-10 words.
  
  Provide a JSON array of exactly 10 objects. Keys: phrase (string in ${language} script), english (string translation).`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(text) as PronunciationPhrase[];
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
  if (!hasApiKey()) throw new Error('API Key is missing');

  const model = genAI.getGenerativeModel({ 
    model: 'gemini-flash-lite-latest',
    generationConfig: { responseMimeType: "application/json" }
  });

  const match = level.match(/Level (\d+)/);
  const lvlNum = match ? parseInt(match[1], 10) : 1;
  const langLower = language.toLowerCase();

  let curriculumInstruction = "";

  if (langLower === 'tamil') {
    if (lvlNum === 1) {
      curriculumInstruction = `You MUST generate EXACTLY all 12 'Uyir Ezhuthu' (Vowels) (அ to ஔ) in one category named 'Uyir Ezhuthu', and exactly 10 'Basic Words' in another category.`;
    } else if (lvlNum === 2) {
      curriculumInstruction = `You MUST generate EXACTLY all 18 'Mei Ezhuthu' (Consonants) (க் to ன்) in one category named 'Mei Ezhuthu', and exactly 10 'Basic Words' in another category.`;
    } else if (lvlNum >= 3 && lvlNum <= 14) {
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

