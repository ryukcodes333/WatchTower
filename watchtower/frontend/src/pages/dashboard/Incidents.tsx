import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Clock, Filter } from 'lucide-react';
import { incidentsApi } from '../../lib/api';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

export default function Incidents() {
  const [status, setStatus] = useState('');
  const { data, isLoading } = useQuery({
    queryKey: ['incidents', status],
    queryFn: () => incidentsApi.getAll(status ? { status } : {}).then(r => r.data),
  });
  const incidents = data?.incidents || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-2xl font-bold">Incidents</h1><p className="text-white/40 text-sm mt-1">History of downtime and recovery events</p></div>
        <div className="flex gap-2">
          {['', 'OPEN', 'RESOLVED'].map(s => (
            <button key={s} onClick={() => setStatus(s)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${status === s ? 'bg-primary-500/30 text-primary-300 border border-primary-500/40' : 'text-white/50 hover:text-white hover:bg-white/5'}`}>
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="glass-card h-16 animate-pulse"/>)}</div>
      ) : incidents.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <CheckCircle size={48} className="text-green-400 mx-auto mb-4"/>
          <h3 className="text-lg font-semibold mb-2">No incidents found</h3>
          <p className="text-white/40">All your monitors are running smoothly!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {incidents.map((inc: any, i: number) => (
            <motion.div key={inc.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}} className="glass-card p-4">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${inc.status==='OPEN' ? 'bg-red-500/20' : 'bg-green-500/20'}`}>
                  {inc.status==='OPEN' ? <AlertTriangle size={18} className="text-red-400"/> : <CheckCircle size={18} className="text-green-400"/>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{inc.monitor?.name}</div>
                  <div className="text-xs text-white/40 truncate">{inc.monitor?.url}</div>
                  {inc.cause && <div className="text-xs text-red-400/70 mt-0.5">{inc.cause}</div>}
                </div>
                <div className="text-right text-xs text-white/40">
                  <div className="flex items-center gap-1 mb-1">
                    <span className={`px-2 py-0.5 rounded-full font-medium ${inc.status==='OPEN' ? 'badge-down' : 'badge-up'}`}>{inc.status}</span>
                  </div>
                  <div className="flex items-center gap-1"><Clock size={11}/> {formatDistanceToNow(new Date(inc.startedAt))} ago</div>
                  {inc.duration && <div className="mt-0.5">Duration: {Math.floor(inc.duration/60)}m {inc.duration%60}s</div>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
