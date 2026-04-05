import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  MessageSquare,
  Zap,
  Layout,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import jobService from '../services/jobService';
import mentorshipService from '../services/mentorshipService';
import authService from '../services/authService';

const Requests = () => {
  const [activeTab, setActiveTab] = useState('jobs');
  const [jobApps, setJobApps] = useState([]);
  const [mentorReqs, setMentorReqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const user = authService.getCurrentUser();
      if (!user) {
        // Mock data if no user
        setJobApps([{ application_id: 1, job_title: "Senior Full Stack Engineer", company: "Google", status: "Pending" }]);
        setMentorReqs([{ request_id: 1, alumni_name: "Sarah Jenkins", status: "Active", min_coin_bid: 500 }]);
        setLoading(false);
        return;
      }
      try {
        const [jobs, mentors] = await Promise.all([
          jobService.getApplications(user.user_id),
          mentorshipService.getRequests(user.user_id)
        ]);
        setJobApps(jobs);
        setMentorReqs(mentors);
      } catch (err) {
        setJobApps([{ application_id: 1, job_title: "Senior Full Stack Engineer", company: "Google", status: "Pending" }]);
        setMentorReqs([{ request_id: 1, alumni_name: "Sarah Jenkins", status: "Active", min_coin_bid: 500 }]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const tabs = [
    { id: 'jobs', name: 'Opportunities', icon: Briefcase, color: 'text-blue-400' },
    { id: 'mentorship', name: 'Mentorship', icon: Users, color: 'text-amber-500' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 lg:px-10 pt-32 pb-20">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-slate-800/60 pb-10">
            <div>
              <h1 className="text-4xl font-black tracking-tighter text-white mb-2 uppercase italic">Operations Logs</h1>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Monitoring your professional signal history.</p>
            </div>
            
            <div className="flex gap-2 p-2 bg-slate-900 border border-slate-800 rounded-[2rem] shadow-xl">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${isActive ? 'bg-slate-800 text-white shadow-xl border border-slate-700/50' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    <Icon size={16} className={isActive ? tab.color : ''} />
                    {tab.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {activeTab === 'jobs' ? (
                  <motion.div 
                    key="jobs" 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    exit={{ opacity: 0, x: 20 }}
                    className="flex flex-col gap-6"
                  >
                    {jobApps.length > 0 ? jobApps.map((app) => (
                      <Card key={app.application_id} className="!p-8 !bg-slate-900/60 border-slate-800/40 relative overflow-hidden group hover:border-blue-500/30 transition-all">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                          <div className="flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                               <Briefcase size={24} />
                            </div>
                            <div className="flex flex-col">
                              <h3 className="text-xl font-black text-white tracking-tight leading-none mb-2">{app.job_title}</h3>
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">{app.company} • Operation Pending</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-8 border-t md:border-t-0 border-slate-800/60 pt-6 md:pt-0">
                            <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/5 border border-blue-500/10 rounded-xl text-[9px] font-black text-blue-400 uppercase tracking-[0.2em] leading-none">
                               <Clock size={12} />
                               Active Queue
                            </div>
                            <Link to={`/jobs/details/${app.listing_id || 1}`} className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-500 hover:text-white hover:border-blue-500/30 transition-all">
                              <ChevronRight size={20} />
                            </Link>
                          </div>
                        </div>
                      </Card>
                    )) : (
                      <div className="text-center py-20 grayscale opacity-40">
                         <Layout size={48} className="mx-auto mb-6 text-slate-600" />
                         <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Global catalog is empty</p>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div 
                    key="mentorship" 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    exit={{ opacity: 0, x: 20 }}
                    className="flex flex-col gap-6"
                   >
                    {mentorReqs.length > 0 ? mentorReqs.map((req) => (
                      <Card key={req.request_id} className="!p-8 !bg-slate-900/60 border-slate-800/40 relative overflow-hidden group hover:border-amber-500/30 transition-all">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                          <div className="flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-amber-500 group-hover:scale-105 transition-transform">
                               <Users size={24} />
                            </div>
                            <div className="flex flex-col">
                              <h3 className="text-xl font-black text-white tracking-tight leading-none mb-2">Mentorship Node: {req.alumni_name}</h3>
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Bid Amount: {req.min_coin_bid} • Signal Established</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-8 border-t md:border-t-0 border-slate-800/60 pt-6 md:pt-0">
                            <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/5 border border-amber-500/10 rounded-xl text-[9px] font-black text-amber-500 uppercase tracking-[0.2em] leading-none">
                               <Zap size={12} className="animate-pulse" />
                               Priority Signal
                            </div>
                            <Link to="/messages" className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-500 hover:text-white hover:border-amber-500/30 transition-all">
                              <MessageSquare size={20} />
                            </Link>
                          </div>
                        </div>
                      </Card>
                    )) : (
                      <div className="text-center py-20 grayscale opacity-40">
                         <Users size={48} className="mx-auto mb-6 text-slate-600" />
                         <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">No active mentorship nodes found</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </main>
    </div>
  );
};

export default Requests;
