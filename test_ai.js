const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || ''; // wait, I don't have the API key in process.env unless I load it from .env
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY);

async function test() {
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-flash-lite-latest',
    generationConfig: { responseMimeType: "application/json" }
  });

  const level = "Pro - Level 1";
  const language = "tamil";
  const prompt = `You are a language teacher for ${language}. The user is at level: ${level}.
  Generate exactly 10 phrases for a pronunciation practice exercise.
  
  CRITICAL INSTRUCTION: Select 10 completely random, highly varied phrases. (Random seed: ${Math.random()})
  If ${level} includes "Beginner", use simple 1-2 word common phrases (e.g. Hello, Thank you, Water).
  If ${level} includes "Intermediate", use conversational sentences with 3-5 words (e.g. I am going to the store).
  If ${level} includes "Pro", use tough tongue-twisters, complex grammatical sentences, or advanced cultural idioms with 5-10 words.
  
  Provide a JSON array of exactly 10 objects. Keys: phrase (string in ${language} script), english (string translation).`;

  try {
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
  } catch (error) {
    console.error(error);
  }
}

test();
