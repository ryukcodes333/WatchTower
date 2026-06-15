import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Monitor, AlertTriangle, BarChart2, Bell, CreditCard, Settings, User, Shield, LogOut, Menu, X, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../../store/auth.store';

const nav = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/dashboard/monitors', icon: Monitor, label: 'Monitors' },
  { to: '/dashboard/incidents', icon: AlertTriangle, label: 'Incidents' },
  { to: '/dashboard/analytics', icon: BarChart2, label: 'Analytics' },
  { to: '/dashboard/alerts', icon: Bell, label: 'Alerts' },
  { to: '/dashboard/billing', icon: CreditCard, label: 'Billing' },
  { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
  { to: '/dashboard/profile', icon: User, label: 'Profile' },
];

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
            <Shield size={20} className="text-white"/>
          </div>
          <div>
            <div className="font-bold text-lg gradient-text leading-none">WatchTower</div>
            <div className="text-xs text-white/30 mt-0.5">Monitoring Platform</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {nav.map(({ to, icon: Icon, label, exact }) => (
          <NavLink key={to} to={to} end={exact}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}>
            <Icon size={18}/>
            <span>{label}</span>
            <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100"/>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-white/5">
        <div className="glass rounded-xl p-3 mb-3">
          <div className="text-xs text-white/40 mb-1">Signed in as</div>
          <div className="text-sm font-medium truncate">{user?.name}</div>
          <div className="text-xs text-white/40 truncate">{user?.email}</div>
          <div className="mt-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary-500/20 text-primary-300 border border-primary-500/30 font-medium">
              {user?.subscription?.plan || 'FREE'} plan
            </span>
          </div>
        </div>
        <button onClick={handleLogout} className="sidebar-link w-full text-red-400 hover:bg-red-500/10 hover:text-red-300">
          <LogOut size={18}/><span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-dark-300 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-64 flex-col glass border-r border-white/5 flex-shrink-0">
        <Sidebar/>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setSidebarOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"/>
            <motion.div initial={{x:-280}} animate={{x:0}} exit={{x:-280}} transition={{type:'spring',damping:25}}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-72 z-40 bg-dark-100 border-r border-white/5 flex flex-col">
              <Sidebar/>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <div className="h-16 glass border-b border-white/5 flex items-center px-4 gap-4 flex-shrink-0">
          <button onClick={()=>setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-white/5">
            <Menu size={20}/>
          </button>
          <div className="flex-1"/>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-sm font-semibold">
              {user?.name?.[0]?.toUpperCase()}
            </div>
          </div>
        </div>
        {/* Page content */}
        <div className="flex-1 overflow-y-auto p-6">
          <Outlet/>
        </div>
      </div>
    </div>
  );
}
