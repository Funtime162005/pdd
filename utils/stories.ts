import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

export type CultureStory = {
  title: string;
  titleNative: string;
  emoji: string;
  paragraphs: { native: string; english: string }[];
};

export const STORY_THEMES: Record<string, { theme: string; emoji: string; label: string }[]> = {
  tamil: [
    { theme: 'a clever crow and a farmer in Tamil Nadu', emoji: '🐦', label: 'The Clever Crow' },
    { theme: 'Pongal harvest festival celebration and a magical pot', emoji: '🌾', label: 'Pongal Magic' },
    { theme: 'a brave girl who saves her village near a river', emoji: '🌊', label: 'The River Guardian' },
  ],
  hindi: [
    { theme: 'a wise elephant helps villagers in Rajasthan', emoji: '🐘', label: 'The Wise Elephant' },
    { theme: 'Diwali festival and a child who finds light in darkness', emoji: '🪔', label: "Diwali's Light" },
    { theme: 'a shepherd boy and a magical flute in the Himalayas', emoji: '🎶', label: 'The Magic Flute' },
  ],
  telugu: [
    { theme: 'a dancing peacock that saves a village from drought', emoji: '🦚', label: 'The Dancing Peacock' },
    { theme: 'a kind potter and the river goddess of Godavari', emoji: '🏺', label: "The Potter's Gift" },
    { theme: 'Ugadi festival and the spirit of new beginnings', emoji: '🌸', label: "Ugadi's Promise" },
  ],
  malayalam: [
    { theme: 'an Onam boat race and a sea spirit in Kerala backwaters', emoji: '🚣', label: 'The Onam Race' },
    { theme: 'a girl who befriends a tiger in the Western Ghats', emoji: '🐯', label: 'Forest Friends' },
    { theme: 'a fisherman who finds a magical conch shell by the sea', emoji: '🐚', label: "The Conch's Song" },
  ],
  kannada: [
    { theme: 'a brave warrior who protects Mysore palace', emoji: '🏰', label: 'The Palace Guard' },
    { theme: 'Dasara festival and a magical golden chariot', emoji: '✨', label: 'The Golden Chariot' },
    { theme: 'a young weaver who creates a magical silk saree in Mysore', emoji: '🧵', label: 'The Silk Weaver' },
  ],
};

export async function generateCultureStory(language: string, theme: string): Promise<CultureStory> {
  const model = genAI.getGenerativeModel({ model: 'gemini-flash-lite-latest' });

  const prompt = `Write a traditional folk tale from ${language}-speaking India about: "${theme}".

Write exactly 8 paragraphs, each 2-4 sentences. Total ~250 words.
Each paragraph: first in ${language} script, then English translation.

Return ONLY valid JSON in this exact format:
{"title":"<English title>","titleNative":"<${language} script title>","emoji":"<one emoji>","paragraphs":[{"native":"<${language} text>","english":"<English>"},{"native":"<${language} text>","english":"<English>"},{"native":"<${language} text>","english":"<English>"},{"native":"<${language} text>","english":"<English>"},{"native":"<${language} text>","english":"<English>"},{"native":"<${language} text>","english":"<English>"},{"native":"<${language} text>","english":"<English>"},{"native":"<${language} text>","english":"<English>"}]}

Make it culturally rich with a moral lesson at the end.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(text) as CultureStory;
}
