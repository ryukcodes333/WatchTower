import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getMonitors, createMonitor, updateMonitor, deleteMonitor, getMonitor, pauseMonitor, getDashboardStats } from '../controllers/monitors.controller';

const router = Router();
router.use(authenticate);
router.get('/stats', getDashboardStats);
router.get('/', getMonitors);
router.post('/', createMonitor);
router.get('/:id', getMonitor);
router.put('/:id', updateMonitor);
router.delete('/:id', deleteMonitor);
router.patch('/:id/pause', pauseMonitor);
export default router;
