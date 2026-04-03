import { motion } from 'framer-motion';
import { TrendingUp, Users, GraduationCap, Briefcase, Calendar } from 'lucide-react';

export default function StatCard({ label, value, growth, icon }) {
  // Auto map icons if string identifier passed, or default to Users
  let Icon = Users;
  if (icon === 'Mentors') Icon = GraduationCap;
  if (icon === 'Jobs') Icon = Briefcase;
  if (icon === 'Events') Icon = Calendar;

  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, scale: 0.95, y: 20 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
      }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="group relative p-6 rounded-[2rem] bg-slate-900 border border-slate-800 hover:border-slate-700 hover:shadow-[0_0_40px_rgba(245,158,11,0.08)] transition-all overflow-hidden cursor-pointer"
    >
      {/* Background glow trail on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10 flex flex-col gap-5">
        <div className="flex justify-between items-start">
          <div className="w-14 h-14 rounded-2xl bg-slate-950 flex items-center justify-center border border-slate-800/60 shadow-inner group-hover:border-amber-500/30 transition-colors duration-300">
            <Icon className="w-6 h-6 text-slate-300 group-hover:text-amber-400 transition-colors" />
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
            <TrendingUp className="w-3.5 h-3.5" />
            {growth}
          </div>
        </div>
        
        <div>
          <h3 className="text-4xl font-bold text-slate-50 tracking-tight mb-1 group-hover:text-white transition-colors">{value}</h3>
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest">{label}</p>
        </div>
      </div>
    </motion.div>
  );
}
