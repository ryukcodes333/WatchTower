import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';

export const getIncidents = async (req: AuthRequest, res: Response): Promise<void> => {
  const { monitorId, status, page = '1', limit = '20' } = req.query;
  try {
    const where: any = { userId: req.user!.id };
    if (monitorId) where.monitorId = String(monitorId);
    if (status) where.status = String(status);
    const skip = (parseInt(String(page)) - 1) * parseInt(String(limit));
    const [incidents, total] = await Promise.all([
      prisma.incident.findMany({ where, include: { monitor: { select: { name: true, url: true } } }, orderBy: { startedAt: 'desc' }, skip, take: parseInt(String(limit)) }),
      prisma.incident.count({ where }),
    ]);
    res.json({ success: true, incidents, total, page: parseInt(String(page)), pages: Math.ceil(total / parseInt(String(limit))) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getChecks = async (req: AuthRequest, res: Response): Promise<void> => {
  const { monitorId } = req.params;
  const { page = '1', limit = '50' } = req.query;
  try {
    const monitor = await prisma.monitor.findFirst({ where: { id: monitorId, userId: req.user!.id } });
    if (!monitor) { res.status(404).json({ success: false, message: 'Monitor not found' }); return; }
    const skip = (parseInt(String(page)) - 1) * parseInt(String(limit));
    const checks = await prisma.check.findMany({ where: { monitorId }, orderBy: { checkedAt: 'desc' }, skip, take: parseInt(String(limit)) });
    res.json({ success: true, checks });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
