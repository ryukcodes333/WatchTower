import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { authApi } from '../../lib/api';

export default function ResetPassword() {
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const token = params.get('token') || '';

  const onSubmit = async (data: any) => {
    setLoading(true); setError('');
    try {
      await authApi.resetPassword({ token, password: data.password });
      navigate('/login?reset=1');
    } catch (e: any) {
      setError(e.response?.data?.message || 'Reset failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-300 relative overflow-hidden">
      <div className="hero-glow w-96 h-96 bg-primary-500/20 top-0 left-1/4" style={{position:'absolute'}}/>
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="glass-card p-8 w-full max-w-md mx-4 z-10">
        <Link to="/" className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center"><Shield size={18} className="text-white"/></div>
          <span className="text-xl font-bold gradient-text">WatchTower</span>
        </Link>
        <h1 className="text-2xl font-bold mb-1">Set new password</h1>
        <p className="text-white/50 mb-6 text-sm">Choose a strong password for your account.</p>
        {error && <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm mb-4">{error}</div>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm text-white/60 mb-1 block">New Password</label>
            <div className="relative">
              <input {...register('password',{required:true,minLength:{value:8,message:'Min 8 chars'}})} type={showPw?'text':'password'} className="input-field pr-10" placeholder="Min 8 characters"/>
              <button type="button" onClick={()=>setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40">{showPw?<EyeOff size={16}/>:<Eye size={16}/>}</button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full relative z-10">
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"/> : 'Reset Password'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
