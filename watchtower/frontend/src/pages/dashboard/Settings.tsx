import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Bell, Globe, Shield } from 'lucide-react';

export default function Settings() {
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifBrowser, setNotifBrowser] = useState(false);
  const [timezone, setTimezone] = useState('UTC');

  const Toggle = ({ val, onChange }: any) => (
    <button onClick={() => onChange(!val)} className={`relative w-12 h-6 rounded-full transition-all ${val ? 'bg-primary-500' : 'bg-white/10'}`}>
      <span className={`absolute w-4 h-4 bg-white rounded-full top-1 transition-all ${val ? 'left-7' : 'left-1'}`}/>
    </button>
  );

  const Section = ({ icon: Icon, title, children }: any) => (
    <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="glass-card p-6">
      <h3 className="font-semibold mb-4 flex items-center gap-2"><Icon size={18} className="text-primary-400"/>{title}</h3>
      {children}
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Settings</h1><p className="text-white/40 text-sm mt-1">Configure your WatchTower preferences</p></div>
      <Section icon={Bell} title="Notifications">
        <div className="space-y-4">
          {[{ label:'Email Notifications', sub:'Receive alerts via email', val:notifEmail, set:setNotifEmail },
            { label:'Browser Notifications', sub:'Push alerts in browser', val:notifBrowser, set:setNotifBrowser }].map(item => (
            <div key={item.label} className="flex items-center justify-between">
              <div><div className="font-medium text-sm">{item.label}</div><div className="text-xs text-white/40">{item.sub}</div></div>
              <Toggle val={item.val} onChange={item.set}/>
            </div>
          ))}
        </div>
      </Section>
      <Section icon={Globe} title="Regional">
        <div>
          <label className="text-sm text-white/60 mb-1 block">Timezone</label>
          <select value={timezone} onChange={e=>setTimezone(e.target.value)} className="input-field max-w-xs">
            {['UTC','America/New_York','America/Los_Angeles','Europe/London','Asia/Tokyo','Australia/Sydney'].map(tz => <option key={tz} value={tz}>{tz}</option>)}
          </select>
        </div>
      </Section>
      <Section icon={Shield} title="Security">
        <div className="text-sm text-white/60 space-y-2">
          <p>Your data is encrypted in transit (TLS 1.3) and at rest (AES-256).</p>
          <p className="text-xs text-white/30">Two-factor authentication coming soon.</p>
        </div>
      </Section>
    </div>
  );
}
