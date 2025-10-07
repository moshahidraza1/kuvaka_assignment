import {
  setOffer,
  getOffer,
  setLeads,
  getLeads,
  setScoredLeads,
  getScoredLeads,
} from "../utils/storage.js"

import csv from "csv-parser"
import stream from "stream"

// store data from POST/offers
const setOfferDetails = (req, res)=>{
    const {name, value_props, ideal_use_cases} = req.body;

    if(!name || !value_props || !ideal_use_cases ){
        return res.status(400).json({
            message: "Required fields are missing"
        })
    }

    setOffer(req.body);
    res.status(200).json({
        message: "Offer details saved successfully",
        offer: req.body
    })
};
