import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Shield, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { authApi } from '../../lib/api';
import { useAuthStore } from '../../store/auth.store';

export default function Login() {
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const setAuth = useAuthStore(s => s.setAuth);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    setLoading(true); setError('');
    try {
      const res = await authApi.login(data);
      setAuth(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (e: any) {
      setError(e.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-300 relative overflow-hidden">
      <div className="hero-glow w-96 h-96 bg-primary-500/20 top-0 left-1/4 -translate-x-1/2" style={{position:'absolute'}} />
      <div className="hero-glow w-80 h-80 bg-purple-600/15 bottom-0 right-1/4" style={{position:'absolute'}} />
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="glass-card p-8 w-full max-w-md mx-4 z-10">
        <Link to="/" className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
            <Shield size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">WatchTower</span>
        </Link>
        <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
        <p className="text-white/50 mb-6 text-sm">Sign in to your monitoring dashboard</p>
        {error && <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm mb-4">{error}</div>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm text-white/60 mb-1 block">Email</label>
            <input {...register('email',{required:'Email is required'})} type="email" className="input-field" placeholder="you@example.com" />
            {errors.email && <p className="text-red-400 text-xs mt-1">{String(errors.email.message)}</p>}
          </div>
          <div>
            <label className="text-sm text-white/60 mb-1 block">Password</label>
            <div className="relative">
              <input {...register('password',{required:'Password is required'})} type={showPw?'text':'password'} className="input-field pr-10" placeholder="••••••••" />
              <button type="button" onClick={()=>setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70">
                {showPw?<EyeOff size={16}/>:<Eye size={16}/>}
              </button>
            </div>
            {errors.password && <p className="text-red-400 text-xs mt-1">{String(errors.password.message)}</p>}
          </div>
          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm text-primary-400 hover:text-primary-300">Forgot password?</Link>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 relative z-10">
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <><span>Sign In</span><ArrowRight size={16}/></>}
          </button>
        </form>
        <p className="text-center text-white/40 text-sm mt-6">
          Don't have an account? <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium">Sign up free</Link>
        </p>
      </motion.div>
    </div>
  );
}
