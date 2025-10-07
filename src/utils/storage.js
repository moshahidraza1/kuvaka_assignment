let offer = null;
let leads = [];
let scoredLeads = [];

// TODO: add input validation
// TODO: switch to a real DB

const setOffer = (newOffer) => {
  offer = newOffer;
};
const getOffer = () => offer;
const setLeads = (newLeads) => {
  leads = newLeads;
  scoredLeads = []; // Reset for new leads 
};
const getLeads = () => leads;

const setScoredLeads = (newScoredLeads) => {
    scoredLeads = newScoredLeads;
};

const getScoredLeads = () => scoredLeads;

export{
  setOffer,
  getOffer,
  setLeads,
  getLeads,
  setScoredLeads,
  getScoredLeads,
};