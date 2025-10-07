import { Router } from 'express';
import { runScoring, getResults, exportResultsCSV } from '../controllers/scoringController.js';

const router = Router();

router.post('/score', runScoring);
router.get('/results', getResults);
router.get("/results/csv", exportResultsCSV);

export default router;