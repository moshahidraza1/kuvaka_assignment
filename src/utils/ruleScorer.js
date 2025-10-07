export const ruleScore = (lead, offer)=>{
    let score = 0;
// role - decision maker or influencer
   const role = lead.role?.toLowerCase() || '';
  if (role.includes('ceo') || role.includes('chief') || role.includes('head') || role.includes('vp')) {
    score += 20;
  } else if (role.includes('manager') || role.includes('director') || role.includes('lead')) {
    score += 10;
  }
// industry matching
  const leadIndustry = (lead.industry || '').toLowerCase();
  const exact = offer.ideal_use_cases.map(i => i.toLowerCase());

  const adjacentMap = {
    'b2b saas mid-market':    ['cloud services', 'enterprise software'],
    'healthcare':             ['healthtech'],
    'fintech':                ['banking', 'payments'],
    'analytics':              ['business intelligence', 'data science'],
    'ai/ml':                  ['machine learning']
  };

  const adjacent = offer.ideal_use_cases
    .map(u => adjacentMap[u.toLowerCase()] || [])
    .flat();

  if (exact.includes(leadIndustry)) {
    score += 20;
  } else if (adjacent.includes(leadIndustry)) {
    score += 10;
  }
// data completeness
  const required = ['name','role','company','industry','location','linkedin_bio'];
  const hasAll = required.every(k => Boolean(lead[k]));
  if (hasAll) score += 10;

  return score;

}