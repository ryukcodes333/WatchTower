import { motion } from 'framer-motion';
import { Check, Zap, CreditCard } from 'lucide-react';
import { useAuthStore } from '../../store/auth.store';

const plans = [
  { name:'Free', price:0, monitors:5, interval:5, features:['5 monitors','5-minute checks','Email alerts','7-day history','Basic analytics'], color:'border-white/10', badge:null },
  { name:'Starter', price:9, monitors:20, interval:1, features:['20 monitors','1-minute checks','Email alerts','30-day history','Advanced analytics','API access'], color:'border-primary-500/40', badge:'Popular' },
  { name:'Pro', price:29, monitors:100, interval:0.5, features:['100 monitors','30-second checks','All alert channels','90-day history','Team members (3)','Priority support','SLA guarantee'], color:'border-purple-500/40', badge:'Best Value' },
  { name:'Business', price:99, monitors:500, interval:0.25, features:['500 monitors','15-second checks','All alert channels','365-day history','Unlimited team members','Dedicated support','Custom SLA','Status page','API priority'], color:'border-amber-500/40', badge:'Enterprise' },
];

export default function Billing() {
  const user = useAuthStore(s => s.user);
  const currentPlan = user?.subscription?.plan || 'FREE';

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Billing & Plans</h1><p className="text-white/40 text-sm mt-1">Manage your subscription</p></div>
      <div className="glass-card p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center"><CreditCard size={22} className="text-primary-400"/></div>
        <div>
          <div className="font-semibold">Current Plan: <span className="gradient-text">{currentPlan}</span></div>
          <div className="text-sm text-white/40">Up to {user?.subscription?.maxMonitors || 5} monitors</div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {plans.map((p, i) => {
          const isCurrent = p.name.toUpperCase() === currentPlan;
          return (
            <motion.div key={p.name} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}}
              className={`glass-card p-6 relative border ${p.color} ${isCurrent ? 'ring-2 ring-primary-500/50' : ''}`}>
              {p.badge && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary-500 to-purple-600 text-xs font-bold px-3 py-1 rounded-full">{p.badge}</div>}
              {isCurrent && <div className="absolute -top-3 right-4 bg-green-500 text-xs font-bold px-3 py-1 rounded-full">Current</div>}
              <div className="mb-4">
                <div className="text-lg font-bold mb-1">{p.name}</div>
                <div className="text-3xl font-bold">{p.price === 0 ? 'Free' : `$${p.price}`}<span className="text-sm text-white/40 font-normal">{p.price > 0 ? '/mo' : ''}</span></div>
              </div>
              <ul className="space-y-2 mb-6">
                {p.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check size={14} className="text-green-400 mt-0.5 flex-shrink-0"/>
                    <span className="text-white/70">{f}</span>
                  </li>
                ))}
              </ul>
              <button className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all ${isCurrent ? 'bg-white/5 text-white/40 cursor-default' : 'btn-primary relative z-10'}`} disabled={isCurrent}>
                {isCurrent ? 'Current Plan' : p.price === 0 ? 'Downgrade' : <span className="flex items-center justify-center gap-1.5"><Zap size={14}/> Upgrade</span>}
              </button>
            </motion.div>
          );
        })}
      </div>
      <div className="glass-card p-5 text-center text-white/40 text-sm">
        Payment processing coming soon. <span className="text-primary-400">Contact us</span> for enterprise pricing.
      </div>
    </div>
  );
}
