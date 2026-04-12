import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Zap, ArrowRight, Home as HomeIcon, Globe, UserPlus, Briefcase, Calendar, Users, GraduationCap } from 'lucide-react';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/welcome';
import StatCard from './components/StatCard';
import authService from './services/authService';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Signup from './pages/Signup';
import AlumniDirectory from './pages/AlumniDirectory';
import Mentorship from './pages/Mentorship';
import MentorshipRequest from './pages/MentorshipRequest';
import Landing from './pages/Landing';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import ApplyJob from './pages/ApplyJob';
import Events from './pages/Events';
import Profile from './pages/Profile';
import Requests from './pages/Requests';
import Conversations from './pages/Conversations';
import Messages from './pages/Messages';
import PostJob from './pages/PostJob';
import ManageJobs from './pages/ManageJobs';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import dashboardService from './services/dashboardService';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminProtectedRoute from './components/AdminProtectedRoute';


function Home() {
  const [stats, setStats] = React.useState([]);
  const [activities, setActivities] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [loadingActivities, setLoadingActivities] = React.useState(true);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const realStats = await dashboardService.getStats();
        const mappedStats = realStats.map(stat => {
            let localIcon = "Users";
            if (stat.label.includes("Mentor")) localIcon = "Mentors";
            if (stat.label.includes("Job")) localIcon = "Jobs";
            if (stat.label.includes("Event")) localIcon = "Events";
            return { ...stat, icon: localIcon };
        });
        setStats(mappedStats);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchActivities = async () => {
      try {
        const data = await dashboardService.getActivities();
        setActivities(data);
      } catch (error) {
        console.error("Failed to fetch activities", error);
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
    <div className="app-container">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        <Hero />
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-8"
        >
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
                /* Loading skeletons matching StatCard shape roughly */
                [1,2,3,4].map(i => (
                    <div key={i} className="h-32 bg-slate-900 animate-pulse rounded-[2rem] border border-slate-800" />
                ))
            ) : (
                stats.map((item, index) => <StatCard key={index} {...item} />)
            )}
          </div>
 
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div 
              variants={itemVariants}
              className="lg:col-span-2 p-8 bg-slate-900 border border-slate-800 rounded-[2rem] shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute -top-10 -right-10 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none">
                 <Activity className="w-64 h-64 text-amber-500" />
              </div>
              <h4 className="flex items-center gap-3 text-2xl font-black uppercase text-white mb-8 border-b border-white/5 pb-6">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                  <Globe className="w-5 h-5 text-amber-500 animate-pulse" />
                </div>
                Recent Activity
              </h4>
              
              <div className="flex flex-col gap-4 relative z-10">
                {loadingActivities ? (
                  [1, 2, 3].map(i => (
                    <div key={i} className="flex items-center gap-5 p-5 bg-slate-950/40 rounded-2xl border border-white/5 animate-pulse">
                      <div className="w-12 h-12 bg-slate-800 rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <div className="w-24 h-4 bg-slate-800 rounded" />
                        <div className="w-full h-3 bg-slate-800 rounded" />
                      </div>
                    </div>
                  ))
                ) : activities.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 px-4">
                    <div className="w-20 h-20 bg-slate-950 rounded-full flex items-center justify-center border border-slate-800 mb-6 shadow-inner">
                      <Activity className="w-8 h-8 text-slate-700" />
                    </div>
                    <p className="text-lg text-slate-400 font-medium">Your network timeline is quiet.</p>
                    <p className="text-sm text-slate-500 mt-2">Connect with members to supercharge your feed.</p>
                  </div>
                ) : (
                  activities.map((activity, index) => {
                    const getIcon = () => {
                      if (activity.type === 'job') return <Briefcase className="w-5 h-5 text-emerald-400" />;
                      if (activity.type === 'user') return <UserPlus className="w-5 h-5 text-blue-400" />;
                      if (activity.type === 'event') return <Calendar className="w-5 h-5 text-purple-400" />;
                      return <Activity className="w-5 h-5 text-amber-500" />;
                    };

                    return (
                      <motion.div 
                        key={activity.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-5 p-5 hover:bg-white/5 rounded-2xl border border-transparent hover:border-white/10 transition-all group/item cursor-pointer"
                        onClick={() => window.location.href = activity.link}
                      >
                         <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shadow-inner group-hover/item:border-white/20 transition-colors">
                           {getIcon()}
                         </div>
                         <div className="flex-1 min-w-0">
                           <div className="flex items-center justify-between mb-0.5">
                             <h5 className="text-[11px] font-black text-white uppercase tracking-wider truncate">{activity.title}</h5>
                             <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-none">{formatTime(activity.created_at)}</span>
                           </div>
                           <p className="text-[13px] font-bold text-slate-400 truncate tracking-tight">{activity.message}</p>
                         </div>
                         <ArrowRight className="w-4 h-4 text-slate-700 group-hover/item:text-white transition-colors group-hover/item:translate-x-0.5" />
                      </motion.div>
                    );
                  })
                )}
              </div>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="p-8 bg-slate-900 border border-slate-800 rounded-[2rem] shadow-2xl relative overflow-hidden group"
            >
               <div className="absolute -top-10 -right-10 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none">
                 <Zap className="w-64 h-64 text-blue-500" />
              </div>
              <h4 className="flex items-center gap-3 text-2xl font-bold tracking-tight text-white mb-8 border-b border-slate-800/60 pb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  <Zap className="w-5 h-5 text-blue-400" />
                </div>
                Quick Actions
              </h4>
              <div className="flex flex-col gap-4 relative z-10">
                <Link to="/mentorship">
                  <motion.div whileHover={{ scale: 1.02 }} className="flex justify-between items-center p-5 rounded-2xl bg-slate-950 border border-slate-800 cursor-pointer group/action hover:border-amber-500/40 hover:bg-slate-900 transition-all shadow-lg">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-200 group-hover/action:text-white transition-colors">Find a Mentor</span>
                      <span className="text-xs text-slate-500 mt-1">Get expert guidance</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center group-hover/action:bg-amber-500/10 group-hover/action:border-amber-500/30 transition-colors">
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover/action:text-amber-500 group-hover/action:translate-x-0.5 transition-all" />
                    </div>
                  </motion.div>
                </Link>
                
                <Link to="/jobs">
                  <motion.div whileHover={{ scale: 1.02 }} className="flex justify-between items-center p-5 rounded-2xl bg-slate-950 border border-slate-800 cursor-pointer group/action hover:border-blue-500/40 hover:bg-slate-900 transition-all shadow-lg">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-200 group-hover/action:text-white transition-colors">Explore Jobs</span>
                      <span className="text-xs text-slate-500 mt-1">Discover new careers</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center group-hover/action:bg-blue-500/10 group-hover/action:border-blue-500/30 transition-colors">
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover/action:text-blue-400 group-hover/action:translate-x-0.5 transition-all" />
                    </div>
                  </motion.div>
                </Link>

                {authService.getCurrentUser()?.role?.toLowerCase() === 'recruiter' && (
                  <Link to="/manage-jobs">
                    <motion.div whileHover={{ scale: 1.02 }} className="flex justify-between items-center p-5 rounded-2xl bg-slate-900 border border-blue-500/30 cursor-pointer group/action hover:border-blue-500/60 hover:bg-slate-900 transition-all shadow-xl">
                      <div className="flex flex-col">
                        <span className="font-bold text-blue-400 group-hover/action:text-blue-300 transition-colors">Manage Postings</span>
                        <span className="text-xs text-slate-500 mt-1">Control your active jobs</span>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover/action:bg-blue-500/20 transition-colors">
                        <Zap className="w-4 h-4 text-blue-400 animate-pulse" />
                      </div>
                    </motion.div>
                  </Link>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/alumni" element={<AlumniDirectory />} />
        
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/details/:id" element={<JobDetails />} />
        <Route path="/jobs/apply/:id" element={<ProtectedRoute><ApplyJob /></ProtectedRoute>} />
        <Route path="/post-job" element={<ProtectedRoute><PostJob /></ProtectedRoute>} />
        <Route path="/manage-jobs" element={<ProtectedRoute><ManageJobs /></ProtectedRoute>} />
        
        <Route path="/mentorship" element={<Mentorship />} />
        <Route path="/mentorship/request/:id" element={<ProtectedRoute><MentorshipRequest /></ProtectedRoute>} />
        
        <Route path="/requests" element={<ProtectedRoute><Requests /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
        <Route path="/messages/:id" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
        <Route path="/events" element={<Events />} />
        
        {/* Admin System */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
