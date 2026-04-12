import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Briefcase, 
  GraduationCap, 
  Calendar, 
  Activity, 
  ArrowUpRight, 
  Zap, 
  CheckCircle,
  TrendingUp,
  Layout
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import dashboardService from '../services/dashboardService';

const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const realStats = await dashboardService.getStats();
        
        const iconMap = {
          'Users': Users,
          'GraduationCap': GraduationCap,
          'Briefcase': Briefcase,
          'Calendar': Calendar
        };

        const mappedStats = realStats.map(stat => ({
          ...stat,
          icon: iconMap[stat.icon] || Users
        }));

        setStats(mappedStats);
      } catch (error) {
        console.error("Failed to fetch real dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchActivities = async () => {
      try {
        const data = await dashboardService.getActivities();
        setActivities(data);
      } catch (error) {
        console.error("Failed to fetch dashboard activities", error);
      } finally {
        setLoadingActivities(false);
      }
    };

    fetchStats();
    fetchActivities();
  }, []);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 lg:px-10 pt-32 pb-20">
          
          <motion.div 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             className="mb-12 border-b border-white/5 pb-10"
          >
            <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic">Command Center</h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-4 flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Real-time Global Network Synchronization
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-10"
          >
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="!p-8 !bg-slate-900/60 animate-pulse h-40">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 bg-slate-800 rounded-2xl" />
                      <div className="w-16 h-6 bg-slate-800 rounded-lg" />
                    </div>
                    <div className="w-24 h-4 bg-slate-800 rounded mb-2" />
                    <div className="w-32 h-8 bg-slate-800 rounded" />
                  </Card>
                ))}
              </div>
            ) : (
              /* Stats Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <Card key={index} className="!p-8 !bg-slate-900/60 transition-all hover:border-white/10 group cursor-pointer shadow-2xl relative overflow-hidden">
                      <div className="flex justify-between items-start mb-6">
                        <div className={`p-4 rounded-2xl bg-slate-950 border border-slate-800 transition-colors group-hover:border-white/20 ${item.color}`}>
                          <Icon size={24} className="group-hover:rotate-12 transition-transform duration-500" />
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                          <TrendingUp size={12} className="text-emerald-400" />
                          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest leading-none">{item.growth}</span>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1.5">{item.label}</span>
                        <span className="text-4xl font-black text-white tracking-widest transition-all group-hover:scale-105 group-hover:translate-x-1 origin-left">{item.value}</span>
                      </div>
                      <div className="absolute -right-6 -bottom-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700 pointer-events-none">
                         <Icon size={120} />
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Middle Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
              
              {/* Activity Timeline */}
              <Card className="xl:col-span-2 !p-10 !bg-slate-900/60 relative overflow-hidden group">
                 <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/5">
                   <h4 className="flex items-center gap-3 text-xl font-black uppercase text-white tracking-tighter leading-none">
                     <Activity size={24} className="text-amber-500 animate-pulse" />
                     Recent Activity
                   </h4>
                   <button className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">Clear All</button>
                 </div>
                 
                 <div className="flex flex-col gap-4">
                   {loadingActivities ? (
                     [1, 2, 3].map(i => (
                       <div key={i} className="flex items-center gap-6 p-6 bg-slate-950/40 rounded-3xl border border-white/5 animate-pulse">
                         <div className="w-12 h-12 bg-slate-800 rounded-2xl" />
                         <div className="flex-1 space-y-3">
                           <div className="w-32 h-4 bg-slate-800 rounded" />
                           <div className="w-full h-3 bg-slate-800 rounded" />
                         </div>
                       </div>
                     ))
                   ) : activities.length === 0 ? (
                     <div className="flex flex-col items-center justify-center py-20 grayscale opacity-40">
                       <div className="w-24 h-24 bg-slate-950 rounded-full flex items-center justify-center border border-slate-800 mb-8 shadow-inner shadow-black group-hover:scale-110 transition-transform duration-700">
                         <Activity className="w-10 h-10 text-slate-700" />
                       </div>
                       <h3 className="text-lg font-black text-slate-400 uppercase tracking-widest mb-2 leading-none">The domain is silent.</h3>
                       <p className="text-xs font-bold text-slate-600 uppercase tracking-tight">Expand your node to receive signal updates.</p>
                     </div>
                   ) : (
                     activities.map((activity, index) => (
                       <motion.div 
                         key={activity.id}
                         initial={{ opacity: 0, x: -10 }}
                         animate={{ opacity: 1, x: 0 }}
                         transition={{ delay: index * 0.1 }}
                         className="flex items-center gap-6 p-6 hover:bg-white/5 rounded-3xl border border-transparent hover:border-white/5 transition-all group/item"
                       >
                         <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-amber-500 shadow-inner group-hover/item:border-amber-500/30 transition-colors">
                           <Zap size={20} className={activity.is_read ? 'opacity-30' : 'animate-pulse'} />
                         </div>
                         <div className="flex-1 min-w-0">
                           <div className="flex items-center justify-between mb-1">
                             <h5 className="text-sm font-black text-white uppercase tracking-tight truncate leading-none">{activity.title}</h5>
                             <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{formatTime(activity.created_at)}</span>
                           </div>
                           <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight leading-relaxed truncate">{activity.message}</p>
                         </div>
                         <ArrowUpRight size={18} className="text-slate-700 group-hover/item:text-amber-500 transition-colors shrink-0" />
                       </motion.div>
                     ))
                   )}
                 </div>
                 
                 <div className="absolute -top-10 -right-10 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none">
                    <Layout className="w-80 h-80 text-amber-500" />
                 </div>
              </Card>

              {/* Action Column */}
              <div className="flex flex-col gap-8">
                 <Card className="!p-8 !bg-slate-900/60 border-t-4 border-t-amber-500 group">
                    <div className="flex items-center gap-3 mb-6">
                      <Zap size={18} className="text-amber-500" />
                      <span className="text-xs font-black text-slate-300 uppercase tracking-widest leading-none">Priority Task</span>
                    </div>
                    <h5 className="text-lg font-black text-white uppercase tracking-tighter mb-4 leading-none">Complete Alumni Verification</h5>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed mb-8 italic">Enhance your security rating by completing social validation.</p>
                    <button className="btn-lavish w-full flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest py-4 transition-all">
                       Initialize Sync
                       <ArrowUpRight size={16} />
                    </button>
                 </Card>

                 <Card className="!p-8 !bg-slate-900/60 relative overflow-hidden group border-slate-800/40 hover:border-blue-500/30 transition-all">
                    <h5 className="flex items-center gap-3 text-sm font-black text-slate-300 uppercase tracking-widest mb-8 leading-none">
                      <CheckCircle size={16} className="text-blue-500" />
                      Network Trust Center
                    </h5>
                    <div className="flex flex-col gap-6">
                       <div className="flex justify-between items-center">
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Identity Score</span>
                         <span className="text-xs font-black text-emerald-400 leading-none">840 / 1000</span>
                       </div>
                       <div className="w-full h-2 bg-slate-950 rounded-full border border-slate-800 overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: '84%' }}
                            transition={{ duration: 1.5, ease: 'easeOut' }}
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                          />
                       </div>
                    </div>
                 </Card>
              </div>

            </div>
          </motion.div>
        </main>
    </div>
  );
};

export default Dashboard;
