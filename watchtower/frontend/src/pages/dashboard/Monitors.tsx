import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pause, Play, Trash2, ExternalLink, RefreshCw, Globe, Shield, Link as LinkIcon, Search } from 'lucide-react';
import { monitorsApi } from '../../lib/api';
import { useForm } from 'react-hook-form';

const TYPES = ['HTTP','API','SSL','DOMAIN'];

const statusBadge = (s: string) => {
  const map: Record<string,string> = { UP:'badge-up', DOWN:'badge-down', PAUSED:'badge-paused', PENDING:'badge-pending' };
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${map[s]||'badge-pending'}`}>{s}</span>;
};

const TypeIcon = ({ type }: { type: string }) => {
  if(type==='SSL') return <Shield size={16} className="text-amber-400"/>;
  if(type==='DOMAIN') return <LinkIcon size={16} className="text-purple-400"/>;
  return <Globe size={16} className="text-blue-400"/>;
};

export default function Monitors() {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const qc = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const { data, isLoading } = useQuery({ queryKey: ['monitors'], queryFn: () => monitorsApi.getAll().then(r => r.data.monitors), refetchInterval: 30000 });
  const monitors = (data || []).filter((m: any) => m.name.toLowerCase().includes(search.toLowerCase()) || m.url.toLowerCase().includes(search.toLowerCase()));

  const createMut = useMutation({ mutationFn: monitorsApi.create, onSuccess: () => { qc.invalidateQueries({queryKey:['monitors']}); setShowModal(false); reset(); } });
  const deleteMut = useMutation({ mutationFn: monitorsApi.delete, onSuccess: () => qc.invalidateQueries({queryKey:['monitors']}) });
  const pauseMut = useMutation({ mutationFn: monitorsApi.pause, onSuccess: () => qc.invalidateQueries({queryKey:['monitors']}) });

  const onSubmit = (d: any) => createMut.mutate(d);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Monitors</h1><p className="text-white/40 text-sm mt-1">Manage all your monitored endpoints</p></div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2 relative z-10"><Plus size={16}/> Add Monitor</button>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"/>
        <input value={search} onChange={e=>setSearch(e.target.value)} className="input-field pl-10" placeholder="Search monitors..."/>
      </div>

      {isLoading ? (
        <div className="grid gap-4">{[1,2,3].map(i => <div key={i} className="glass-card p-5 h-20 animate-pulse"/>)}</div>
      ) : monitors.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Globe size={48} className="text-white/20 mx-auto mb-4"/>
          <h3 className="text-lg font-semibold mb-2">No monitors yet</h3>
          <p className="text-white/40 mb-6">Add your first monitor to start tracking uptime.</p>
          <button onClick={() => setShowModal(true)} className="btn-primary relative z-10"><Plus size={16} className="inline mr-2"/>Add Monitor</button>
        </div>
      ) : (
        <div className="grid gap-3">
          <AnimatePresence>
            {monitors.map((m: any) => (
              <motion.div key={m.id} layout initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,scale:0.95}} className="glass-card p-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <TypeIcon type={m.type}/>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm flex items-center gap-2">
                        {m.name}
                        {statusBadge(m.status)}
                      </div>
                      <div className="text-xs text-white/40 truncate mt-0.5">{m.url}</div>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-6 text-sm">
                    <div className="text-center"><div className="text-green-400 font-semibold">{m.uptime?.toFixed(1)}%</div><div className="text-white/30 text-xs">Uptime</div></div>
                    <div className="text-center"><div className="font-semibold">{m.lastResponseTime ? `${m.lastResponseTime}ms` : '—'}</div><div className="text-white/30 text-xs">Response</div></div>
                    <div className="text-center"><div className="font-semibold">{m.interval}s</div><div className="text-white/30 text-xs">Interval</div></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a href={m.url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white"><ExternalLink size={15}/></a>
                    <button onClick={() => pauseMut.mutate(m.id)} className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-amber-400">{m.paused?<Play size={15}/>:<Pause size={15}/>}</button>
                    <button onClick={() => { if(confirm(`Delete "${m.name}"?`)) deleteMut.mutate(m.id); }} className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-red-400"><Trash2 size={15}/></button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setShowModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm"/>
            <motion.div initial={{opacity:0,scale:0.95,y:20}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.95}} className="glass-card p-6 w-full max-w-md relative z-10">
              <h3 className="text-lg font-bold mb-5">Add New Monitor</h3>
              {createMut.isError && <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm mb-4">{(createMut.error as any)?.response?.data?.message}</div>}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div><label className="text-sm text-white/60 mb-1 block">Monitor Name</label><input {...register('name',{required:true})} className="input-field" placeholder="My Website"/>{errors.name && <p className="text-red-400 text-xs mt-1">Required</p>}</div>
                <div><label className="text-sm text-white/60 mb-1 block">URL</label><input {...register('url',{required:true,pattern:{value:/^https?:\/\/.+/,message:'Must start with http(s)://'}})} className="input-field" placeholder="https://example.com"/>{errors.url && <p className="text-red-400 text-xs mt-1">{String(errors.url.message||'Required')}</p>}</div>
                <div><label className="text-sm text-white/60 mb-1 block">Type</label><select {...register('type')} className="input-field">{TYPES.map(t=><option key={t} value={t}>{t}</option>)}</select></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-sm text-white/60 mb-1 block">Interval (sec)</label><input {...register('interval')} type="number" min="30" defaultValue="60" className="input-field"/></div>
                  <div><label className="text-sm text-white/60 mb-1 block">Timeout (sec)</label><input {...register('timeout')} type="number" min="5" defaultValue="30" className="input-field"/></div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={()=>setShowModal(false)} className="btn-outline flex-1">Cancel</button>
                  <button type="submit" disabled={createMut.isPending} className="btn-primary flex-1 relative z-10">
                    {createMut.isPending ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"/> : 'Create Monitor'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
