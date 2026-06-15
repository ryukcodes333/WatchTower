import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { authApi } from '../../lib/api';

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    setLoading(true);
    await authApi.forgotPassword(data.email).catch(()=>{});
    setSent(true); setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-300 relative overflow-hidden">
      <div className="hero-glow w-96 h-96 bg-primary-500/20 top-0 left-1/4" style={{position:'absolute'}}/>
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="glass-card p-8 w-full max-w-md mx-4 z-10">
        <Link to="/" className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center"><Shield size={18} className="text-white"/></div>
          <span className="text-xl font-bold gradient-text">WatchTower</span>
        </Link>
        {sent ? (
          <div className="text-center">
            <Mail size={48} className="text-primary-400 mx-auto mb-4"/>
            <h2 className="text-2xl font-bold mb-2">Check your inbox</h2>
            <p className="text-white/50 mb-6">If that email exists in our system, we've sent a reset link.</p>
            <Link to="/login" className="btn-outline inline-flex items-center gap-2"><ArrowLeft size={16}/> Back to Login</Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-1">Reset password</h1>
            <p className="text-white/50 mb-6 text-sm">Enter your email and we'll send you a reset link.</p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-sm text-white/60 mb-1 block">Email</label>
                <input {...register('email',{required:true})} type="email" className="input-field" placeholder="you@example.com"/>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full relative z-10">
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"/> : 'Send Reset Link'}
              </button>
            </form>
            <Link to="/login" className="flex items-center gap-1 text-white/40 text-sm mt-6 hover:text-white/70"><ArrowLeft size={14}/> Back to login</Link>
          </>
        )}
      </motion.div>
    </div>
  );
}
