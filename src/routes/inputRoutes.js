import { Router } from "express";
import { setOfferDetails, uploadLeads } from "../controllers/inputController.js";

const router = Router();

// offer details endpoint
router.post('/offerDetail',setOfferDetails);

export default router;