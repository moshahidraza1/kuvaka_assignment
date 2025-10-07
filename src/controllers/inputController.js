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

    if(!name || !Array.isArray(value_props) || !Array.isArray(ideal_use_cases) ){
        return res.status(400).json({
            message: "Required fields are missing or Invalid input - value_props and ideal_use_cases should be an array"
        })
    }

    setOffer(req.body);
    res.status(201).json({
        message: "Offer details saved successfully",
        offer: req.body
    })
};

// upload leads
const uploadLeads = (req, res)=>{
    if(!req.file){
        return res.status(400).json({
            message: "No csv file uploaded"
        });
    }
    const leads = [];
    const bufferStream = new stream.PassThrough();
    bufferStream.end(req.file.buffer);
    //TODO: normalize values(lowercase)
    bufferStream.pipe(csv()).on('data', (data)=> leads.push(data)).on('end', ()=>{
        setLeads(leads);
        res.status(200).json({
            message: `${leads.length} leads uploaded successfully`
        }).on('error', (error)=>{
            console.error("CSV parsing error: error");
            res.status(500).json({
                message: "Failed to upload leads"
            })
        })
    })
}

export{setOfferDetails,uploadLeads}
