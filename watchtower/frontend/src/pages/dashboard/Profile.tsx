import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { profileApi } from '../../lib/api';
import { useAuthStore } from '../../store/auth.store';

export default function Profile() {
  const { user, setUser } = useAuthStore();
  const [pwSuccess, setPwSuccess] = useState('');
  const [pwError, setPwError] = useState('');
  const [nameSuccess, setNameSuccess] = useState('');
  const { register: regName, handleSubmit: hName } = useForm({ defaultValues: { name: user?.name || '' } });
  const { register: regPw, handleSubmit: hPw, reset: resetPw } = useForm();

  const onName = async (d: any) => {
    try { const res = await profileApi.update(d); setUser(res.data.user); setNameSuccess('Name updated!'); setTimeout(()=>setNameSuccess(''),3000); } catch {}
  };
  const onPw = async (d: any) => {
    setPwError(''); setPwSuccess('');
    try { await profileApi.changePassword(d); setPwSuccess('Password changed!'); resetPw(); setTimeout(()=>setPwSuccess(''),3000); }
    catch (e: any) { setPwError(e.response?.data?.message || 'Failed'); }
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Profile</h1><p className="text-white/40 text-sm mt-1">Manage your account details</p></div>
      <div className="flex items-center gap-4 glass-card p-5">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-2xl font-bold">{user?.name?.[0]?.toUpperCase()}</div>
        <div><div className="font-bold text-lg">{user?.name}</div><div className="text-white/40 text-sm">{user?.email}</div>
          <div className="mt-1"><span className="text-xs px-2 py-0.5 rounded-full bg-primary-500/20 text-primary-300 border border-primary-500/30">{user?.subscription?.plan || 'FREE'}</span></div>
        </div>
      </div>

      <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="glass-card p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2"><User size={18} className="text-primary-400"/>Personal Info</h3>
        {nameSuccess && <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-green-400 text-sm mb-4">{nameSuccess}</div>}
        <form onSubmit={hName(onName)} className="space-y-4">
          <div><label className="text-sm text-white/60 mb-1 block">Full Name</label><input {...regName('name',{required:true})} className="input-field max-w-sm"/></div>
          <div><label className="text-sm text-white/60 mb-1 block">Email</label><input value={user?.email} disabled className="input-field max-w-sm opacity-50 cursor-not-allowed"/></div>
          <button type="submit" className="btn-primary flex items-center gap-2 relative z-10"><Save size={15}/>Save Changes</button>
        </form>
      </motion.div>

      <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.1}} className="glass-card p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2"><Lock size={18} className="text-primary-400"/>Change Password</h3>
        {pwSuccess && <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-green-400 text-sm mb-4">{pwSuccess}</div>}
        {pwError && <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm mb-4">{pwError}</div>}
        <form onSubmit={hPw(onPw)} className="space-y-4">
          <div><label className="text-sm text-white/60 mb-1 block">Current Password</label><input {...regPw('currentPassword',{required:true})} type="password" className="input-field max-w-sm"/></div>
          <div><label className="text-sm text-white/60 mb-1 block">New Password</label><input {...regPw('newPassword',{required:true,minLength:{value:8,message:'Min 8 chars'}})} type="password" className="input-field max-w-sm"/></div>
          <button type="submit" className="btn-primary flex items-center gap-2 relative z-10"><Lock size={15}/>Update Password</button>
        </form>
      </motion.div>
    </div>
  );
}
