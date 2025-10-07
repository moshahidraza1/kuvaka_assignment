# Lead Scoring Backend

A small Node.js service that:
- Accepts a product/offer definition  
- Ingests a CSV of leads  
- Applies rule-based + AI scoring  
- Returns intent labels and scores

---

## Prerequisites

• Node.js v19+ & npm  
• An OpenAI API key 

---

## Getting Started

1. Clone this repo  
   ```bash
   git clone https://github.com/moshahidraza1/kuvaka_assignment.git
   cd kuvaka_assignment

2. Install dependencies
```bash
npm install
```

3. add a .env file
```bash
OPENAI_API_KEY=sk-...
```
4. Start the dev server
```bash
npm run dev
```
Server will listen on http://localhost:3000

5. API Endpoints
All routes are under /api/v1

1) POST /offer
Register your product/offer.

Request JSON:
```bash
{
  "name": "AI Outreach Automation",
  "value_props": ["24/7 outreach","6× more meetings"],
  "ideal_use_cases": ["B2B SaaS mid-market"]
}
```
Response:
```bash
{
  "message": "Offer details saved successfully",
  "offer": { /* echo of your payload */ }
}
```

2) POST /leads/upload
Upload a CSV of prospects. Field name must be file.
Sample CSV columns:
name,role,company,industry,location,linkedin_bio
```bash
    curl -X POST http://localhost:3000/api/v1/leads/upload \
    -F "file=@sample_leads.csv"
  ```

Response:
{ "message": "5 leads uploaded successfully" }

3) POST /score
Trigger the scoring pipeline (rule + AI).
```bash
curl -X POST http://localhost:3000/api/v1/score
```
Response example:
{
  "message": "Scoring complete",
  "results": [
    {
      "name":"Alice Smith",
      "role":"Chief Marketing Officer",
      "company":"Acme Corp",
      "industry":"SaaS",
      "location":"New York",
      "linkedin_bio":"…",
      "intent":"High",
      "score":85,
      "reasoning":"Fits ICP SaaS mid-market and role is decision maker."
    },
    …
  ]
}

4) GET /results
Retrieve the last scoring run:
```bash
curl http://localhost:3000/api/v1/results
```
# Rule-Based Logic (0–50 pts)

1. Role relevance
• decision-maker titles (CEO, Chief, Head, VP) → +20
• manager/director/lead → +10

2. Industry match
• exact ICP → +20
• adjacent sectors (e.g. cloud services, enterprise software for “B2B SaaS mid-market”) → +10

3. Data completeness
all six fields present → +10

# AI Layer (0–50 pts)
We ask ChatGPT to classify intent and justify in 1–2 sentences.

Prompt template:
```bash
You are a sales qualification assistant.

Product: "<offer.name>"
Value props: [<offer.value_props>]
Use cases: [<offer.ideal_use_cases>]

Prospect:
- name: <lead.name>
- role: <lead.role>
- company: <lead.company>
- industry: <lead.industry>
- location: <lead.location>
- bio: "<lead.linkedin_bio>"

Classify intent as High / Medium / Low and explain in 1–2 sentences.

Respond exactly as:
intent: <High|Medium|Low>
reasoning: <your explanation>
```
We parse the two prefixed lines and map High → 50, Medium → 30, Low → 10.
