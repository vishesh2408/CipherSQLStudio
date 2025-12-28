const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'mock-key', // Fallback for dev without key
});

exports.generateHint = async (question, sqlQuery, error, schema) => {
  if (!process.env.OPENAI_API_KEY) {
    console.warn("⚠️ No OpenAI API Key found. Returning mock hint.");
    return "This is a mock hint. Please configure OPENAI_API_KEY in .env to get real AI hints. check your WHERE clause.";
  }

  const prompt = `
    You are a SQL Tutor. The student is trying to solve the following question:
    "${question}"

    Database Schema:
    ${JSON.stringify(schema)}

    The student wrote:
    ${sqlQuery}

    The database returned this error (if any):
    ${error || "No syntax error, but result might be incorrect"}

    Provide a helpful hint to guide the student towards the correct solution. 
    DO NOT give the full answer. 
    Keep it brief and encouraging.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 100,
    });
    return response.choices[0].message.content.trim();
  } catch (err) {
    console.error("LLM API Error:", err);
    if (err.status === 429 || err.code === 'insufficient_quota') {
        return "⚠️ AI Tutor Limit Reached. \nTip: Check your WHERE clause logic and ensure you are selecting the correct columns from the table schema.";
    }
    return "I'm having trouble connecting to the AI tutor right now. Please check your syntax manually.";
  }
};
