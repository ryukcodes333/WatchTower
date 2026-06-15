import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';

export const getAlerts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const alerts = await prisma.alertConfig.findMany({ where: { userId: req.user!.id }, orderBy: { createdAt: 'desc' } });
    res.json({ success: true, alerts });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createAlert = async (req: AuthRequest, res: Response): Promise<void> => {
  const { channel, target, types, enabled } = req.body;
  try {
    const alert = await prisma.alertConfig.create({ data: { userId: req.user!.id, channel, target, types: types || ['SITE_DOWN', 'SITE_RECOVERED'], enabled: enabled !== false } });
    res.status(201).json({ success: true, alert });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateAlert = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const alert = await prisma.alertConfig.findFirst({ where: { id, userId: req.user!.id } });
    if (!alert) { res.status(404).json({ success: false, message: 'Alert not found' }); return; }
    const updated = await prisma.alertConfig.update({ where: { id }, data: req.body });
    res.json({ success: true, alert: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteAlert = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const alert = await prisma.alertConfig.findFirst({ where: { id, userId: req.user!.id } });
    if (!alert) { res.status(404).json({ success: false, message: 'Alert not found' }); return; }
    await prisma.alertConfig.delete({ where: { id } });
    res.json({ success: true, message: 'Alert deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
