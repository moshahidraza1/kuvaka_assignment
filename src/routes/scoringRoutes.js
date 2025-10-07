import { Router } from 'express';
import { runScoring, getResults } from '../controllers/scoringController.js';

const router = Router();

router.post('/score', runScoring);
router.get('/results', getResults);

export default router;