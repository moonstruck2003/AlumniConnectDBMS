import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  GraduationCap, 
  MessageSquare, 
  User, 
  Settings, 
  LogOut, 
  Zap,
  TrendingUp,
  Boxes
} from 'lucide-react';
import authService from '../services/authService';

const Sidebar = () => {
  const menuItems = [
    { name: 'Command Center', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Skill Exchange', icon: GraduationCap, path: '/mentorship' },
    { name: 'Job Portals', icon: Briefcase, path: '/jobs' },
    { name: 'Signal Hub', icon: MessageSquare, path: '/conversations' },
    { name: 'Operational Logs', icon: Boxes, path: '/requests' },
    { name: 'Node Profile', icon: User, path: '/profile' }
  ];

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/login';
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-[280px] bg-slate-950 border-r border-white/5 z-40 hidden lg:flex flex-col p-8 transition-all">
      {/* Brand Header */}
      <div className="flex items-center gap-4 mb-14 px-2">
        <div className="w-10 h-10 rounded-2xl bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)] flex items-center justify-center border border-white/10 group cursor-pointer hover:rotate-12 transition-transform duration-500">
           <Zap className="text-slate-900 w-6 h-6" strokeWidth={3} />
        </div>
        <div className="flex flex-col">
           <span className="text-xl font-black text-white tracking-tighter uppercase italic leading-none">AlumniConnect</span>
           <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] leading-none mt-1">Network OS 1.0</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-2 flex flex-col">
        <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4 px-4 leading-none">Main Operations</span>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-tight transition-all duration-300 group
                ${isActive 
                  ? 'bg-amber-500/10 text-white shadow-xl shadow-amber-500/5' 
                  : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'}`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={20} className={`transition-all duration-300 group-hover:scale-110 ${isActive ? 'text-amber-500' : 'text-slate-500'}`} />
                  <span className="tracking-tighter">{item.name}</span>
                  {isActive && <motion.div layoutId="activeNav" className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-500 shadow-glow" />}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer / Pro Module */}
      <div className="mt-auto pt-10 flex flex-col gap-8 border-t border-white/5">
        <div className="p-6 rounded-[2rem] bg-gradient-to-tr from-slate-900 to-slate-800 border border-white/5 relative overflow-hidden group/pro cursor-pointer">
           <div className="relative z-10 flex flex-col">
             <div className="flex justify-between items-center mb-6">
                <Boxes size={24} className="text-indigo-400" />
                <span className="text-[10px] font-black text-slate-100 bg-indigo-600 px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg shadow-indigo-600/20">Elite Node</span>
             </div>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed mb-6 group-hover/pro:text-slate-200 transition-colors">"Unlock priority mentorship signal & global directory access."</p>
             <button className="flex items-center justify-between text-xs font-black text-white hover:text-indigo-400 transition-colors uppercase tracking-tight group-hover/pro:translate-x-1 duration-300">
                Upgrade Node
                <TrendingUp size={16} />
             </button>
           </div>
           <div className="absolute -top-10 -right-10 opacity-5 group-hover/pro:opacity-10 transition-opacity duration-700 pointer-events-none">
              <Zap size={140} />
           </div>
        </div>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-sm text-red-500 hover:bg-red-500/10 hover:text-red-400 transition-all uppercase tracking-tighter"
        >
          <LogOut size={20} />
          Sign Out Node
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
