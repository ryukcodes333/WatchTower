import { Router } from 'express';
import authRoutes from './auth.routes';
import monitorRoutes from './monitor.routes';
import incidentRoutes from './incident.routes';
import alertRoutes from './alert.routes';
import profileRoutes from './profile.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/monitors', monitorRoutes);
router.use('/incidents', incidentRoutes);
router.use('/alerts', alertRoutes);
router.use('/profile', profileRoutes);
router.get('/health', (_, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

export default router;
