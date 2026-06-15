import app from './app';
import { config } from './config';
import { logger } from './utils/logger';
import { prisma } from './lib/prisma';
import { startMonitoringWorker } from './workers/monitoring.worker';

const start = async () => {
  try {
    await prisma.$connect();
    logger.info('Database connected');

    app.listen(config.port, '0.0.0.0', () => {
      logger.info(`🚀 WatchTower API running on port ${config.port} [${config.nodeEnv}]`);
    });

    if (config.nodeEnv !== 'test') {
      startMonitoringWorker();
      logger.info('Monitoring worker started');
    }
  } catch (err) {
    logger.error('Failed to start server', { err });
    process.exit(1);
  }
};

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled rejection', { reason });
});
process.on('uncaughtException', (err) => {
  logger.error('Uncaught exception', { err });
  process.exit(1);
});

start();
