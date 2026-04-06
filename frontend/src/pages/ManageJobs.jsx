import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Clock, 
  Building2, 
  Plus,
  CheckCircle2,
  XCircle,
  Zap,
  Layout,
  ExternalLink,
  ChevronRight,
  Trash2
} from 'lucide-react';
import Navbar from '../components/Navbar';
import jobService from '../services/jobService';
import authService from '../services/authService';
import Card from '../components/Card';

export default function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = authService.getCurrentUser();

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        const data = await jobService.getMyJobs();
        setJobs(data);
      } catch (err) {
        console.error('Failed to fetch my jobs', err);
        setError('Connection to node failed. Ensure you are logged in with the correct credentials.');
      } finally {
        setLoading(false);
      }
    };
    fetchMyJobs();
  }, []);

  const handleToggle = async (jobId) => {
    try {
      const response = await jobService.toggleJob(jobId);
      setJobs(prevJobs => prevJobs.map(j => j.job_id === jobId ? { ...j, is_active: response.is_active } : j));
    } catch (err) {
      console.error('Failed to toggle job', err);
      const msg = err.response?.data?.message || 'Operation failed. Please re-sync your account.';
      alert(msg);
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to permanently delete this job listing? This action cannot be undone.')) {
      return;
    }

    try {
      await jobService.deleteJob(jobId);
      setJobs(prevJobs => prevJobs.filter(j => j.job_id !== jobId));
    } catch (err) {
      console.error('Failed to delete job', err);
      alert('Failed to delete job. You may not have permission for this node.');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1 } 
    }
  };

  return (
    <div className="manage-jobs-page bg-slate-950 min-h-screen text-slate-100 pb-20 selection:bg-blue-500/30">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 lg:px-10 pt-32">
        <header className="mb-16 border-b border-white/5 pb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
           <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black tracking-widest uppercase">
                <Layout className="w-3.5 h-3.5" />
                Operational Control
              </div>
              <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">Manage <span className="text-blue-500">Postings</span></h1>
              <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]">Control your active deployment nodes and recruit legacy talent.</p>
           </div>
           
           <Link to="/post-job">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20 uppercase tracking-widest text-xs"
              >
                <Plus className="w-5 h-5" />
                Deploy New Node
              </motion.button>
           </Link>
        </header>

        {loading ? (
          <div className="flex justify-center py-40">
             <div className="w-12 h-12 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : error ? (
           <div className="py-40 text-center">
              <div className="inline-flex w-24 h-24 bg-rose-500/10 rounded-[2rem] items-center justify-center border border-rose-500/20 mb-8 shadow-inner">
                <XCircle className="text-rose-500" size={40} />
              </div>
              <h3 className="text-3xl font-black text-rose-500 mb-2 tracking-tighter uppercase italic">Access Denied</h3>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-8 max-w-sm mx-auto">{error}</p>
              <button 
                onClick={async () => { await authService.logout(); window.location.href='/login'; }}
                className="px-10 py-4 bg-white text-slate-950 font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-xl"
              >
                 System Re-Sync (Logout)
              </button>
           </div>
        ) : jobs.length === 0 ? (
           <div className="py-40 text-center">
              <div className="inline-flex w-32 h-32 bg-slate-900 rounded-[2.5rem] items-center justify-center border-2 border-slate-800 mb-8">
                <Briefcase className="text-slate-700" size={56} />
              </div>
              <h3 className="text-3xl font-black text-white mb-2 tracking-tighter uppercase italic">No Active Deployments</h3>
              <p className="text-slate-600 font-bold uppercase tracking-widest text-xs mb-4">You haven't posted any job opportunities yet.</p>
              <div className="bg-blue-500/5 border border-blue-500/10 p-6 rounded-2xl max-w-md mx-auto mb-10">
                 <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
                    <Zap size={14} className="fill-current animate-pulse" />
                    Technician Note
                 </p>
                 <p className="text-slate-500 text-xs font-medium italic">"If you recently changed your role to recruiter, please log out and sign back in to refresh your system identity."</p>
              </div>
              <div className="flex justify-center gap-4">
                 <Link to="/post-job" className="btn-lavish !bg-white !text-slate-950 px-10 py-4 font-black uppercase text-xs tracking-widest">
                    Create First Node
                 </Link>
                 <button 
                   onClick={async () => { await authService.logout(); window.location.href='/login'; }}
                   className="px-10 py-4 bg-slate-800 text-slate-400 hover:text-white font-black uppercase text-xs tracking-widest rounded-2xl transition-all"
                 >
                    System Re-Sync
                 </button>
              </div>
           </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-8"
          >
            {jobs.map((job) => (
              <motion.div
                key={job.job_id}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className={`p-8 rounded-[2.5rem] bg-slate-900 border border-slate-800 shadow-2xl flex flex-col md:flex-row items-center gap-8 transition-all hover:border-blue-500/30 ${!job.is_active ? 'opacity-60 grayscale' : ''}`}
              >
                <div className="shrink-0">
                  <div className="w-20 h-20 rounded-3xl bg-slate-950 border border-slate-800 flex items-center justify-center text-3xl font-black text-blue-500 shadow-lg capitalize">
                    {job.job_title[0]}
                  </div>
                </div>

                <div className="flex-1 space-y-4 text-center md:text-left">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-white hover:text-blue-400 transition-colors tracking-tight uppercase leading-none italic">{job.job_title}</h3>
                    <div className="flex flex-wrap justify-center md:justify-start gap-6 font-bold text-[10px] text-slate-500 uppercase tracking-widest">
                       <span className="flex items-center gap-2"><MapPin size={12} className="text-slate-700" /> {job.location || 'Remote'}</span>
                       <span className="flex items-center gap-2 text-teal-400/60"><Clock size={12} className="text-teal-500/30" /> {new Date(job.created_at).toLocaleDateString()}</span>
                       <span className="flex items-center gap-2"><Layout size={12} className="text-slate-700" /> {job.category?.category_name}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto md:pl-10">
                   <button 
                     onClick={() => handleDelete(job.job_id)}
                     className="w-full md:w-16 h-16 bg-slate-950 hover:bg-rose-600 text-rose-500 hover:text-white border border-slate-800 hover:border-rose-500 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center shadow-xl group/delete"
                     title="Delete Permanently"
                   >
                      <Trash2 size={24} className="group-hover/delete:scale-110 transition-transform" />
                   </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
}
