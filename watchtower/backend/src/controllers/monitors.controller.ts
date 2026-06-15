import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';
import { logger } from '../utils/logger';

export const getMonitors = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const monitors = await prisma.monitor.findMany({
      where: { userId: req.user!.id },
      include: { _count: { select: { checks: true, incidents: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, monitors });
  } catch (err) {
    logger.error('Get monitors error', { err });
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createMonitor = async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, url, type, interval, timeout, retries } = req.body;
  try {
    const sub = await prisma.subscription.findUnique({ where: { userId: req.user!.id } });
    const count = await prisma.monitor.count({ where: { userId: req.user!.id } });
    if (count >= (sub?.maxMonitors ?? 5)) {
      res.status(403).json({ success: false, message: `Monitor limit reached (${sub?.maxMonitors ?? 5}). Upgrade your plan.` });
      return;
    }
    const monitor = await prisma.monitor.create({
      data: { userId: req.user!.id, name, url, type: type || 'HTTP', interval: interval || 60, timeout: timeout || 30, retries: retries || 3 },
    });
    res.status(201).json({ success: true, monitor });
  } catch (err) {
    logger.error('Create monitor error', { err });
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateMonitor = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const monitor = await prisma.monitor.findFirst({ where: { id, userId: req.user!.id } });
    if (!monitor) { res.status(404).json({ success: false, message: 'Monitor not found' }); return; }
    const updated = await prisma.monitor.update({ where: { id }, data: req.body });
    res.json({ success: true, monitor: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteMonitor = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const monitor = await prisma.monitor.findFirst({ where: { id, userId: req.user!.id } });
    if (!monitor) { res.status(404).json({ success: false, message: 'Monitor not found' }); return; }
    await prisma.monitor.delete({ where: { id } });
    res.json({ success: true, message: 'Monitor deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getMonitor = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const monitor = await prisma.monitor.findFirst({
      where: { id, userId: req.user!.id },
      include: { checks: { orderBy: { checkedAt: 'desc' }, take: 100 }, incidents: { orderBy: { startedAt: 'desc' }, take: 20 } },
    });
    if (!monitor) { res.status(404).json({ success: false, message: 'Monitor not found' }); return; }
    res.json({ success: true, monitor });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const pauseMonitor = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const monitor = await prisma.monitor.findFirst({ where: { id, userId: req.user!.id } });
    if (!monitor) { res.status(404).json({ success: false, message: 'Monitor not found' }); return; }
    const updated = await prisma.monitor.update({ where: { id }, data: { paused: !monitor.paused, status: monitor.paused ? 'PENDING' : 'PAUSED' } });
    res.json({ success: true, monitor: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const [total, active, failed, paused, incidents] = await Promise.all([
      prisma.monitor.count({ where: { userId } }),
      prisma.monitor.count({ where: { userId, status: 'UP' } }),
      prisma.monitor.count({ where: { userId, status: 'DOWN' } }),
      prisma.monitor.count({ where: { userId, status: 'PAUSED' } }),
      prisma.incident.count({ where: { userId, status: 'OPEN' } }),
    ]);
    const monitors = await prisma.monitor.findMany({ where: { userId }, select: { uptime: true, lastResponseTime: true } });
    const avgUptime = monitors.length > 0 ? monitors.reduce((s, m) => s + m.uptime, 0) / monitors.length : 100;
    const avgResponse = monitors.filter(m => m.lastResponseTime).length > 0
      ? monitors.reduce((s, m) => s + (m.lastResponseTime || 0), 0) / monitors.filter(m => m.lastResponseTime).length : 0;
    res.json({ success: true, stats: { total, active, failed, paused, incidents, avgUptime: parseFloat(avgUptime.toFixed(2)), avgResponse: Math.round(avgResponse) } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
