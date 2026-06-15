import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

const router = Router();
router.use(authenticate);

router.put('/update', async (req: any, res) => {
  const { name } = req.body;
  try {
    const user = await prisma.user.update({ where: { id: req.user.id }, data: { name }, select: { id: true, name: true, email: true } });
    res.json({ success: true, user });
  } catch { res.status(500).json({ success: false, message: 'Server error' }); }
});

router.put('/change-password', async (req: any, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) { res.status(404).json({ success: false, message: 'User not found' }); return; }
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) { res.status(400).json({ success: false, message: 'Current password is incorrect' }); return; }
    await prisma.user.update({ where: { id: req.user.id }, data: { password: await bcrypt.hash(newPassword, 12) } });
    res.json({ success: true, message: 'Password changed successfully' });
  } catch { res.status(500).json({ success: false, message: 'Server error' }); }
});

export default router;
