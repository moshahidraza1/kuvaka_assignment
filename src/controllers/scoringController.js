import {
  getOffer,
  getLeads,
  setScoredLeads,
  getScoredLeads
} from '../utils/storage.js';
import { ruleScore } from '../utils/ruleScorer.js';
import { callAIModel } from '../utils/aiScorer.js';


// calculate and set combined score
export const runScoring = async (req, res) => {
  const offer = getOffer();
  const leads = getLeads();
  if (!offer) {
    return res.status(400).json({ error: 'No offer defined' });
  }
  if (!leads.length) {
    return res.status(400).json({ error: 'No leads to score' });
  }

  const results = [];
  for (const lead of leads) {
    const base = ruleScore(lead, offer);
    const { intent, reasoning } = await callAIModel(lead, offer);
    const aiPoints = { High: 50, Medium: 30, Low: 10 }[intent] || 0;
    results.push({
      ...lead,
      intent,
      score: base + aiPoints,
      reasoning
    });
  }

  setScoredLeads(results);
  return res.status(200).json({ message: 'Scoring complete', results });
};


// retrurn resultant score
export const getResults = (req, res) => {
  const scored = getScoredLeads();
  return res.status(200).json(scored);
};

// export results as csv

export const exportResultsCSV = (req, res) => {
  const results = getScoredLeads();
  if (!results.length) {
    return res.status(404).send("No scoring results to export");
  }

  // build header
  const headers = [
    "name",
    "role",
    "company",
    "industry",
    "location",
    "linkedin_bio",
    "intent",
    "score",
    "reasoning"
  ];
  const rows = results.map(r =>
    headers.map(h => `"${(r[h] || "").toString().replace(/"/g, '""')}"`).join(",")
  );

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename="scored_leads.csv"`);
  res.send([headers.join(","), ...rows].join("\n"));
};