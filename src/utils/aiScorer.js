import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// calls chatGPT for ranking
const callAIModel= async (lead, offer)=> {
  const prompt = `
Product: "${offer.name}"
Value props: [${offer.value_props.join(", ")}]
Use cases: [${offer.ideal_use_cases.join(", ")}]

Prospect:
- name: ${lead.name}
- role: ${lead.role}
- company: ${lead.company}
- industry: ${lead.industry}
- location: ${lead.location}
- bio: "${lead.linkedin_bio}"

Classify intent as High / Medium / Low and explain in 1-2 sentences.

Respond exactly as:
intent: <High|Medium|Low>
reasoning: <your explanation>
  `.trim();

  const res = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are a sales qualification assistant." },
      { role: "user", content: prompt }
    ],
    temperature: 0.2,
  });
  const text = res.choices?.[0]?.message?.content || "";
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
  const intentLine    = lines.find(l => l.toLowerCase().startsWith("intent:")) || "";
  const reasoningLine = lines.find(l => l.toLowerCase().startsWith("reasoning:")) || "";

  const intent    = intentLine.split(":")[1]?.trim() || "Low";
  const reasoning = reasoningLine.split(":")[1]?.trim() || "";
  return { intent, reasoning };
}