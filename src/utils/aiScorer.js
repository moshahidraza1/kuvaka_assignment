import { GoogleGenerativeAI } from '@google/generative-ai';
import { ruleScore } from './ruleScorer.js';

// Initialize with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Calls the Gemini Pro model using a simple API key.
 * If it fails for any reason (like rate limits), it will fall back
 * to a rule-based score without crashing the app.
 */
export async function callAIModel(lead, offer) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
Product: "${offer.name}"
Value props: [${offer.value_props.join(', ')}]
Use cases: [${offer.ideal_use_cases.join(', ')}]

Prospect:
- role: ${lead.role}
- industry: ${lead.industry}
- bio: "${lead.linkedin_bio}"

Classify buying intent as High, Medium, or Low and explain in one sentence.
Respond in this exact format:
intent: <High|Medium|Low>
reasoning: <Your one sentence explanation>
    `.trim();

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const intent = (text.match(/intent:\s*(High|Medium|Low)/i) || [])[1] || 'Low';
    const reasoning = (text.match(/reasoning:\s*(.*)/i) || [])[1] || 'AI response parsing failed.';

    return { intent, reasoning };

  } catch (error) {
    console.error('Gemini API call failed. Falling back to rule-based scoring.', error);
    
    // Fallback logic
    const rScore = ruleScore(lead, offer);
    let intent = 'Low';
    if (rScore >= 40) {
      intent = 'High';
    } else if (rScore >= 25) {
      intent = 'Medium';
    }
    
    return {
      intent: intent,
      reasoning: `AI model failed. Fallback classification based on rule score of ${rScore}.`
    };
  }
}