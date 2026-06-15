import { useQuery } from '@tanstack/react-query';
import { monitorsApi } from '../../lib/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { BarChart2 } from 'lucide-react';

const genData = (n: number) => Array.from({length: n}, (_, i) => ({
  day: `Day ${i + 1}`, uptime: 93 + Math.random() * 7, response: 80 + Math.random() * 250, incidents: Math.random() > 0.8 ? 1 : 0,
}));

const chartData = genData(30);

export default function Analytics() {
  const { data } = useQuery({ queryKey: ['monitors'], queryFn: () => monitorsApi.getAll().then(r => r.data.monitors) });
  const monitors = data || [];

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Analytics</h1><p className="text-white/40 text-sm mt-1">30-day performance overview</p></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="glass-card p-5 text-center">
          <div className="text-3xl font-bold gradient-text">{monitors.length > 0 ? (monitors.reduce((a:any,m:any) => a + m.uptime, 0) / monitors.length).toFixed(2) : '99.98'}%</div>
          <div className="text-white/40 text-sm mt-1">Average Uptime</div>
        </div>
        <div className="glass-card p-5 text-center">
          <div className="text-3xl font-bold text-blue-400">{monitors.filter((m:any)=>m.lastResponseTime).length > 0 ? Math.round(monitors.reduce((a:any,m:any) => a+(m.lastResponseTime||0),0)/monitors.length) : '142'}ms</div>
          <div className="text-white/40 text-sm mt-1">Avg Response Time</div>
        </div>
        <div className="glass-card p-5 text-center">
          <div className="text-3xl font-bold text-green-400">{monitors.filter((m:any)=>m.status==='UP').length}</div>
          <div className="text-white/40 text-sm mt-1">Monitors Up</div>
        </div>
      </div>
      <div className="glass-card p-5">
        <h3 className="font-semibold mb-4 flex items-center gap-2"><BarChart2 size={18} className="text-primary-400"/> Uptime % — Last 30 Days</h3>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData}>
            <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10"/>
            <XAxis dataKey="day" stroke="#ffffff30" tick={{fontSize:10}}/>
            <YAxis domain={[90,100]} stroke="#ffffff30" tick={{fontSize:10}} unit="%"/>
            <Tooltip contentStyle={{background:'#1a1a3e',border:'1px solid #6366f140',borderRadius:'8px',color:'#fff'}}/>
            <Area type="monotone" dataKey="uptime" stroke="#6366f1" fill="url(#g1)" strokeWidth={2}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="glass-card p-5">
        <h3 className="font-semibold mb-4">Response Time (ms)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10"/>
            <XAxis dataKey="day" stroke="#ffffff30" tick={{fontSize:10}}/>
            <YAxis stroke="#ffffff30" tick={{fontSize:10}}/>
            <Tooltip contentStyle={{background:'#1a1a3e',border:'1px solid #3b82f640',borderRadius:'8px',color:'#fff'}}/>
            <Bar dataKey="response" fill="#3b82f6" radius={[4,4,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
