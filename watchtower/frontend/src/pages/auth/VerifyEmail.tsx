import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Shield } from 'lucide-react';
import { authApi } from '../../lib/api';

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const [status, setStatus] = useState<'loading'|'success'|'error'>('loading');
  const token = params.get('token') || '';

  useEffect(() => {
    authApi.verifyEmail(token).then(()=>setStatus('success')).catch(()=>setStatus('error'));
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-300">
      <motion.div initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} className="glass-card p-10 max-w-md mx-4 text-center">
        <div className="flex justify-center mb-4">
          {status==='loading' && <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin"/>}
          {status==='success' && <CheckCircle size={56} className="text-green-400"/>}
          {status==='error' && <XCircle size={56} className="text-red-400"/>}
        </div>
        {status==='loading' && <><h2 className="text-2xl font-bold">Verifying...</h2><p className="text-white/50 mt-2">Please wait.</p></>}
        {status==='success' && <><h2 className="text-2xl font-bold mb-2">Email Verified!</h2><p className="text-white/50 mb-6">Your account is ready. Start monitoring your websites.</p><Link to="/login" className="btn-primary inline-flex relative z-10">Go to Dashboard</Link></>}
        {status==='error' && <><h2 className="text-2xl font-bold mb-2">Verification Failed</h2><p className="text-white/50 mb-6">The link is invalid or has expired.</p><Link to="/register" className="btn-primary inline-flex relative z-10">Back to Register</Link></>}
      </motion.div>
    </div>
  );
}
