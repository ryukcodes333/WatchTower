import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../lib/prisma';
import { signToken } from '../utils/jwt';
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/mailer';
import { logger } from '../utils/logger';

export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) { res.status(409).json({ success: false, message: 'Email already in use' }); return; }
    const hashed = await bcrypt.hash(password, 12);
    const verificationToken = uuidv4();
    const user = await prisma.user.create({
      data: { name, email, password: hashed, verificationToken },
    });
    await prisma.subscription.create({ data: { userId: user.id } });
    await sendVerificationEmail(email, verificationToken).catch(() => {});
    res.status(201).json({ success: true, message: 'Registration successful. Please verify your email.' });
  } catch (err) {
    logger.error('Register error', { err });
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) { res.status(401).json({ success: false, message: 'Invalid credentials' }); return; }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) { res.status(401).json({ success: false, message: 'Invalid credentials' }); return; }
    const token = signToken({ userId: user.id, email: user.email });
    await prisma.auditLog.create({ data: { userId: user.id, action: 'LOGIN', ip: req.ip } });
    res.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email, emailVerified: user.emailVerified } });
  } catch (err) {
    logger.error('Login error', { err });
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  const { token } = req.query;
  try {
    const user = await prisma.user.findFirst({ where: { verificationToken: String(token) } });
    if (!user) { res.status(400).json({ success: false, message: 'Invalid or expired token' }); return; }
    await prisma.user.update({ where: { id: user.id }, data: { emailVerified: true, verificationToken: null } });
    res.json({ success: true, message: 'Email verified successfully' });
  } catch (err) {
    logger.error('Verify email error', { err });
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) { res.json({ success: true, message: 'If that email exists, a reset link was sent.' }); return; }
    const token = uuidv4();
    await prisma.user.update({ where: { id: user.id }, data: { resetToken: token, resetTokenExpiry: new Date(Date.now() + 3600000) } });
    await sendPasswordResetEmail(email, token).catch(() => {});
    res.json({ success: true, message: 'If that email exists, a reset link was sent.' });
  } catch (err) {
    logger.error('Forgot password error', { err });
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { token, password } = req.body;
  try {
    const user = await prisma.user.findFirst({ where: { resetToken: token, resetTokenExpiry: { gt: new Date() } } });
    if (!user) { res.status(400).json({ success: false, message: 'Invalid or expired reset token' }); return; }
    const hashed = await bcrypt.hash(password, 12);
    await prisma.user.update({ where: { id: user.id }, data: { password: hashed, resetToken: null, resetTokenExpiry: null } });
    res.json({ success: true, message: 'Password reset successfully' });
  } catch (err) {
    logger.error('Reset password error', { err });
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getMe = async (req: any, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, emailVerified: true, createdAt: true, subscription: true },
    });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
