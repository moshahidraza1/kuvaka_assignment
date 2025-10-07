import { Router } from "express";
import multer from "multer";
import { setOfferDetails, uploadLeads } from "../controllers/inputController.js";

const router = Router();

// offer details endpoint
router.post('/offerDetail',setOfferDetails);

// lead uploads
const upload = multer();

router.post('/uploadLeads', upload.single('file'), uploadLeads);

export default router;