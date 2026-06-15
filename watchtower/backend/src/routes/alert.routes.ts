import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getAlerts, createAlert, updateAlert, deleteAlert } from '../controllers/alerts.controller';

const router = Router();
router.use(authenticate);
router.get('/', getAlerts);
router.post('/', createAlert);
router.put('/:id', updateAlert);
router.delete('/:id', deleteAlert);
export default router;
