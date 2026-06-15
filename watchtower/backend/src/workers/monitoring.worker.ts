import { prisma } from '../lib/prisma';
import { logger } from '../utils/logger';
import { sendAlertEmail } from '../utils/mailer';
import fetch from 'node-fetch';

const BATCH_SIZE = 50;
const CHECK_INTERVAL_MS = 30000; // check every 30s which monitors are due

interface CheckResult {
  status: 'UP' | 'DOWN';
  statusCode?: number;
  responseTime?: number;
  error?: string;
}

async function checkHttp(url: string, timeout: number): Promise<CheckResult> {
  const start = Date.now();
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout * 1000);
    const res = await fetch(url, { signal: controller.signal as any, redirect: 'follow' });
    clearTimeout(timer);
    const responseTime = Date.now() - start;
    const status = res.ok ? 'UP' : 'DOWN';
    return { status, statusCode: res.status, responseTime };
  } catch (err: any) {
    return { status: 'DOWN', responseTime: Date.now() - start, error: err.message };
  }
}

async function processMonitor(monitor: any): Promise<void> {
  try {
    const result = await checkHttp(monitor.url, monitor.timeout);

    await prisma.check.create({
      data: {
        monitorId: monitor.id,
        status: result.status,
        statusCode: result.statusCode,
        responseTime: result.responseTime,
        error: result.error,
      },
    });

    const recentChecks = await prisma.check.findMany({
      where: { monitorId: monitor.id },
      orderBy: { checkedAt: 'desc' },
      take: 100,
    });
    const upCount = recentChecks.filter(c => c.status === 'UP').length;
    const uptime = recentChecks.length > 0 ? (upCount / recentChecks.length) * 100 : 100;

    const wasDown = monitor.status === 'DOWN';
    const isNowDown = result.status === 'DOWN';

    await prisma.monitor.update({
      where: { id: monitor.id },
      data: {
        status: result.status,
        lastCheckedAt: new Date(),
        lastStatusCode: result.statusCode,
        lastResponseTime: result.responseTime,
        uptime: parseFloat(uptime.toFixed(2)),
      },
    });

    // Handle incidents
    if (!wasDown && isNowDown) {
      await prisma.incident.create({
        data: { userId: monitor.userId, monitorId: monitor.id, status: 'OPEN', cause: result.error || `HTTP ${result.statusCode}` },
      });
      await triggerAlerts(monitor, 'SITE_DOWN', result.error);
    } else if (wasDown && !isNowDown) {
      const incident = await prisma.incident.findFirst({ where: { monitorId: monitor.id, status: 'OPEN' }, orderBy: { startedAt: 'desc' } });
      if (incident) {
        const duration = Math.floor((Date.now() - incident.startedAt.getTime()) / 1000);
        await prisma.incident.update({ where: { id: incident.id }, data: { status: 'RESOLVED', resolvedAt: new Date(), duration } });
      }
      await triggerAlerts(monitor, 'SITE_RECOVERED');
    }
  } catch (err) {
    logger.error(`Error processing monitor ${monitor.id}`, { err });
  }
}

async function triggerAlerts(monitor: any, type: string, detail?: string): Promise<void> {
  try {
    const alerts = await prisma.alertConfig.findMany({
      where: { userId: monitor.userId, enabled: true, types: { has: type as any } },
    });
    for (const alert of alerts) {
      if (alert.channel === 'EMAIL') {
        await sendAlertEmail(alert.target, type, monitor.name, monitor.url, detail).catch(e => logger.error('Alert email failed', { e }));
      }
      // Future: WhatsApp, Telegram, Discord, Slack
    }
  } catch (err) {
    logger.error('Trigger alerts error', { err });
  }
}

async function runChecks(): Promise<void> {
  try {
    const now = new Date();
    const monitors = await prisma.monitor.findMany({
      where: {
        paused: false,
        OR: [
          { lastCheckedAt: null },
          { lastCheckedAt: { lt: new Date(now.getTime() - 30000) } },
        ],
      },
      take: BATCH_SIZE,
    });

    if (monitors.length === 0) return;
    logger.debug(`Processing ${monitors.length} monitors`);

    await Promise.allSettled(monitors.map(processMonitor));
  } catch (err) {
    logger.error('Run checks error', { err });
  }
}

export function startMonitoringWorker(): void {
  logger.info('Starting monitoring worker...');
  runChecks();
  setInterval(runChecks, CHECK_INTERVAL_MS);
}
