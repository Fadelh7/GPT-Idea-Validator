import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post('/evaluate', async (req, res) => {
  const { idea } = req.body;
  if (!idea) {
    return res.status(400).json({ error: 'Missing idea' });
  }

  const prompt = `
You are a startup mentor. Evaluate the following idea based on problem-solving, scalability, clarity. Respond with:
Verdict: ✅ Promising or ❌ Needs Work
Explanation: • bullet point 1 • bullet point 2
Suggestion: one concrete improvement.

Startup Idea:
${idea}
`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
      temperature: 0.7
    });

    const text = completion.choices[0].message.content;

    // Parse the LLM response
    const verdictMatch = text.match(/Verdict:\s*(.*)/i);
    const explanationMatch = text.match(/Explanation:\s*([\s\S]*?)Suggestion:/i);
    const suggestionMatch = text.match(/Suggestion:\s*(.*)/i);

    const verdict = verdictMatch ? verdictMatch[1].trim() : '';
    const explanationRaw = explanationMatch ? explanationMatch[1].trim() : '';
    const explanation = explanationRaw
      .split('•')
      .map(s => s.trim())
      .filter(Boolean);
    const suggestion = suggestionMatch ? suggestionMatch[1].trim() : '';

    res.json({ verdict, explanation, suggestion });
  } catch (err) {
    res.status(500).json({ error: 'LLM error', details: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`AI Startup Mentor server running on port ${PORT}`);
});
