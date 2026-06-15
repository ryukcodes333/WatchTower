import nodemailer from 'nodemailer';
import { config } from '../config';
import { logger } from './logger';

const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: config.smtp.port === 465,
  auth: { user: config.smtp.user, pass: config.smtp.pass },
});

interface MailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendMail = async (options: MailOptions): Promise<void> => {
  try {
    await transporter.sendMail({ from: config.smtp.from, ...options });
    logger.info(`Email sent to ${options.to}`);
  } catch (err) {
    logger.error('Failed to send email', { error: err });
  }
};

export const sendVerificationEmail = async (to: string, token: string): Promise<void> => {
  const url = `${config.frontendUrl}/verify-email?token=${token}`;
  await sendMail({
    to,
    subject: 'Verify your WatchTower email',
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0f0f23;color:#fff;border-radius:12px;padding:40px">
        <h1 style="color:#6366f1;margin-bottom:8px">WatchTower</h1>
        <h2 style="margin-bottom:24px">Verify your email address</h2>
        <p style="color:#a0a0b0;line-height:1.6">Click the button below to verify your email and start monitoring your websites.</p>
        <a href="${url}" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;margin:24px 0">Verify Email</a>
        <p style="color:#666;font-size:14px">Or copy this link: ${url}</p>
      </div>
    `,
  });
};

export const sendPasswordResetEmail = async (to: string, token: string): Promise<void> => {
  const url = `${config.frontendUrl}/reset-password?token=${token}`;
  await sendMail({
    to,
    subject: 'Reset your WatchTower password',
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0f0f23;color:#fff;border-radius:12px;padding:40px">
        <h1 style="color:#6366f1;margin-bottom:8px">WatchTower</h1>
        <h2 style="margin-bottom:24px">Reset your password</h2>
        <p style="color:#a0a0b0;line-height:1.6">Click the button below to reset your password. This link expires in 1 hour.</p>
        <a href="${url}" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;margin:24px 0">Reset Password</a>
        <p style="color:#666;font-size:14px">If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
};

export const sendAlertEmail = async (to: string, type: string, monitorName: string, url: string, detail?: string): Promise<void> => {
  const isDown = type === 'SITE_DOWN';
  const color = isDown ? '#ef4444' : '#22c55e';
  const emoji = isDown ? '🔴' : '🟢';
  await sendMail({
    to,
    subject: `${emoji} ${isDown ? 'ALERT' : 'RECOVERED'}: ${monitorName} is ${isDown ? 'DOWN' : 'back UP'}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0f0f23;color:#fff;border-radius:12px;padding:40px">
        <h1 style="color:#6366f1;margin-bottom:8px">WatchTower</h1>
        <div style="background:${color}22;border:1px solid ${color};border-radius:8px;padding:20px;margin-bottom:24px">
          <h2 style="color:${color};margin:0">${emoji} ${monitorName} is ${isDown ? 'DOWN' : 'RECOVERED'}</h2>
        </div>
        <p><strong>URL:</strong> <a href="${url}" style="color:#6366f1">${url}</a></p>
        ${detail ? `<p><strong>Details:</strong> ${detail}</p>` : ''}
        <p style="color:#a0a0b0">Log in to WatchTower to view full incident details.</p>
        <a href="${config.frontendUrl}/dashboard" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600">View Dashboard</a>
      </div>
    `,
  });
};
