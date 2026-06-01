import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI("AIzaSyDzbVco9GtwURfGKAir8WdYZXmDN--_ISY");

async function run() {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-flash-lite-latest",
      generationConfig: { responseMimeType: "application/json" } 
    });
    const prompt = `Generate 10 beginner multiple-choice questions for learning Tamil. 
  The 'question' text MUST be in English.
  The 4 'options' MUST be written in the native Tamil script.
  Output JSON array. Keys: id (0-9), question (string), options (4 strings), correctOption (0-3), type ("text").`;
  
    const startTime = Date.now();
    const result = await model.generateContent(prompt);
    console.log("Time taken:", (Date.now() - startTime) / 1000, "seconds");
    console.log("Success:", result.response.text());
  } catch (error) {
    console.error("Error generating content:", error);
  }
}
run();
