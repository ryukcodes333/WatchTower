import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getIncidents, getChecks } from '../controllers/incidents.controller';

const router = Router();
router.use(authenticate);
router.get('/', getIncidents);
router.get('/checks/:monitorId', getChecks);
export default router;
