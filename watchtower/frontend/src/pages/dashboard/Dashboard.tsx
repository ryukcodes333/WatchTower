import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Monitor, CheckCircle, XCircle, TrendingUp, Zap, AlertTriangle, BarChart2 } from 'lucide-react';
import { monitorsApi } from '../../lib/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const StatCard = ({ icon: Icon, label, value, color, sub }: any) => (
  <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="glass-card p-5">
    <div className="flex items-start justify-between mb-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={20} className="text-white"/>
      </div>
    </div>
    <div className="text-3xl font-bold mb-1">{value ?? '—'}</div>
    <div className="text-sm text-white/50">{label}</div>
    {sub && <div className="text-xs text-white/30 mt-1">{sub}</div>}
  </motion.div>
);

const mockUptimeData = Array.from({length:14}, (_,i) => ({
  day: `Day ${i+1}`,
  uptime: 95 + Math.random() * 5,
  response: 120 + Math.random() * 200,
}));

export default function Dashboard() {
  const { data: statsData } = useQuery({ queryKey: ['dashboard-stats'], queryFn: () => monitorsApi.stats().then(r => r.data.stats), refetchInterval: 30000 });
  const { data: monitorsData } = useQuery({ queryKey: ['monitors'], queryFn: () => monitorsApi.getAll().then(r => r.data.monitors), refetchInterval: 30000 });

  const stats = statsData || {};
  const monitors = monitorsData || [];
  const recentMonitors = monitors.slice(0, 5);

  const cards = [
    { icon: Monitor, label: 'Total Monitors', value: stats.total ?? 0, color: 'bg-primary-500/20', sub: `${stats.paused ?? 0} paused` },
    { icon: CheckCircle, label: 'Active & Up', value: stats.active ?? 0, color: 'bg-green-500/20', sub: `${stats.avgUptime ?? 100}% avg uptime` },
    { icon: XCircle, label: 'Down Now', value: stats.failed ?? 0, color: 'bg-red-500/20', sub: stats.failed ? 'Needs attention!' : 'All clear' },
    { icon: Zap, label: 'Avg Response', value: stats.avgResponse ? `${stats.avgResponse}ms` : '—', color: 'bg-blue-500/20', sub: 'Last check' },
    { icon: AlertTriangle, label: 'Open Incidents', value: stats.incidents ?? 0, color: 'bg-amber-500/20', sub: 'Active right now' },
    { icon: TrendingUp, label: 'Avg Uptime', value: stats.avgUptime ? `${stats.avgUptime}%` : '—', color: 'bg-purple-500/20', sub: 'Last 100 checks' },
  ];

  const statusBadge = (status: string) => {
    const cls: Record<string,string> = { UP:'badge-up', DOWN:'badge-down', PAUSED:'badge-paused', PENDING:'badge-pending' };
    return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cls[status] || 'badge-pending'}`}>{status}</span>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-white/40 text-sm mt-1">Real-time overview of your monitoring infrastructure</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c,i) => <StatCard key={i} {...c}/>)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-5">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><BarChart2 size={18} className="text-primary-400"/> Uptime (14 days)</h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={mockUptimeData}>
              <defs>
                <linearGradient id="uptimeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10"/>
              <XAxis dataKey="day" stroke="#ffffff30" tick={{fontSize:10}}/>
              <YAxis domain={[90,100]} stroke="#ffffff30" tick={{fontSize:10}} unit="%"/>
              <Tooltip contentStyle={{background:'#1a1a3e',border:'1px solid #6366f140',borderRadius:'8px',color:'#fff'}}/>
              <Area type="monotone" dataKey="uptime" stroke="#6366f1" fill="url(#uptimeGrad)" strokeWidth={2}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="glass-card p-5">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Zap size={18} className="text-blue-400"/> Response Time (ms)</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={mockUptimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10"/>
              <XAxis dataKey="day" stroke="#ffffff30" tick={{fontSize:10}}/>
              <YAxis stroke="#ffffff30" tick={{fontSize:10}}/>
              <Tooltip contentStyle={{background:'#1a1a3e',border:'1px solid #3b82f640',borderRadius:'8px',color:'#fff'}}/>
              <Line type="monotone" dataKey="response" stroke="#3b82f6" strokeWidth={2} dot={false}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {recentMonitors.length > 0 && (
        <div className="glass-card p-5">
          <h3 className="font-semibold mb-4">Recent Monitors</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-white/30 text-left border-b border-white/5">
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">URL</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Uptime</th>
                <th className="pb-3 font-medium">Response</th>
              </tr></thead>
              <tbody>
                {recentMonitors.map((m: any) => (
                  <tr key={m.id} className="border-b border-white/5 hover:bg-white/2">
                    <td className="py-3 font-medium">{m.name}</td>
                    <td className="py-3 text-white/40 truncate max-w-xs">{m.url}</td>
                    <td className="py-3">{statusBadge(m.status)}</td>
                    <td className="py-3 text-green-400">{m.uptime?.toFixed(1)}%</td>
                    <td className="py-3 text-white/60">{m.lastResponseTime ? `${m.lastResponseTime}ms` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
