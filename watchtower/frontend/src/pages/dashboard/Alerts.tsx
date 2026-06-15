import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Plus, Trash2, Mail, MessageSquare, Send } from 'lucide-react';
import { alertsApi } from '../../lib/api';
import { useForm } from 'react-hook-form';

const CHANNELS = [
  { value: 'EMAIL', label: 'Email', icon: Mail, available: true },
  { value: 'SLACK', label: 'Slack', icon: MessageSquare, available: false },
  { value: 'DISCORD', label: 'Discord', icon: Send, available: false },
  { value: 'TELEGRAM', label: 'Telegram', icon: Send, available: false },
];

const ALERT_TYPES = ['SITE_DOWN','SITE_RECOVERED','SSL_EXPIRING','DOMAIN_EXPIRING','RESPONSE_TIME_HIGH'];

export default function Alerts() {
  const [showModal, setShowModal] = useState(false);
  const qc = useQueryClient();
  const { register, handleSubmit, reset } = useForm({ defaultValues: { channel:'EMAIL', target:'', types:['SITE_DOWN','SITE_RECOVERED'] } });
  const { data, isLoading } = useQuery({ queryKey: ['alerts'], queryFn: () => alertsApi.getAll().then(r => r.data.alerts) });
  const createMut = useMutation({ mutationFn: alertsApi.create, onSuccess: () => { qc.invalidateQueries({queryKey:['alerts']}); setShowModal(false); reset(); } });
  const deleteMut = useMutation({ mutationFn: alertsApi.delete, onSuccess: () => qc.invalidateQueries({queryKey:['alerts']}) });

  const alerts = data || [];
  const onSubmit = (d: any) => createMut.mutate(d);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Alert Channels</h1><p className="text-white/40 text-sm mt-1">Get notified when something goes wrong</p></div>
        <button onClick={()=>setShowModal(true)} className="btn-primary flex items-center gap-2 relative z-10"><Plus size={16}/> Add Alert</button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {CHANNELS.map(ch => (
          <div key={ch.value} className={`glass-card p-4 text-center ${!ch.available ? 'opacity-40' : ''}`}>
            <ch.icon size={24} className="mx-auto mb-2 text-primary-400"/>
            <div className="text-sm font-medium">{ch.label}</div>
            {!ch.available && <div className="text-xs text-white/30 mt-1">Coming soon</div>}
          </div>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2].map(i=><div key={i} className="glass-card h-16 animate-pulse"/>)}</div>
      ) : alerts.length === 0 ? (
        <div className="glass-card p-10 text-center">
          <Bell size={40} className="text-white/20 mx-auto mb-3"/>
          <h3 className="font-semibold mb-2">No alert channels configured</h3>
          <p className="text-white/40 text-sm mb-5">Add an email alert to be notified when your monitors go down.</p>
          <button onClick={()=>setShowModal(true)} className="btn-primary relative z-10"><Plus size={14} className="inline mr-1"/>Add Alert Channel</button>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((a: any) => (
            <motion.div key={a.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="glass-card p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center"><Mail size={18} className="text-primary-400"/></div>
              <div className="flex-1">
                <div className="font-medium text-sm">{a.target}</div>
                <div className="text-xs text-white/40 mt-0.5">{a.channel} • {a.types?.length} alert types</div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${a.enabled ? 'badge-up' : 'badge-paused'}`}>{a.enabled ? 'Active' : 'Paused'}</span>
                <button onClick={()=>{ if(confirm('Delete this alert?')) deleteMut.mutate(a.id); }} className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-red-400"><Trash2 size={15}/></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setShowModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm"/>
            <motion.div initial={{opacity:0,scale:0.95,y:20}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.95}} className="glass-card p-6 w-full max-w-md relative z-10">
              <h3 className="text-lg font-bold mb-5">Add Alert Channel</h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div><label className="text-sm text-white/60 mb-1 block">Channel</label><select {...register('channel')} className="input-field"><option value="EMAIL">Email</option></select></div>
                <div><label className="text-sm text-white/60 mb-1 block">Email Address</label><input {...register('target',{required:true})} type="email" className="input-field" placeholder="alerts@example.com"/></div>
                <div>
                  <label className="text-sm text-white/60 mb-2 block">Alert Types</label>
                  <div className="space-y-2">
                    {ALERT_TYPES.map(t => (
                      <label key={t} className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" value={t} {...register('types')} defaultChecked={['SITE_DOWN','SITE_RECOVERED'].includes(t)} className="accent-primary-500"/>
                        <span className="text-sm">{t.replace(/_/g,' ')}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={()=>setShowModal(false)} className="btn-outline flex-1">Cancel</button>
                  <button type="submit" disabled={createMut.isPending} className="btn-primary flex-1 relative z-10">
                    {createMut.isPending ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"/> : 'Save Channel'}
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
