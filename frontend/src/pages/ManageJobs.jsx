import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
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
  Trash2,
  Users,
  Download,
  Award,
  MessageSquare,
  FileText,
  User as UserIcon
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import jobService from '../services/jobService';
import authService from '../services/authService';
import Card from '../components/Card';

export default function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = authService.getCurrentUser();
  const navigate = useNavigate();

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

  const handleViewApplicants = async (job) => {
    setSelectedJob(job);
    setLoadingApplicants(true);
    setIsModalOpen(true);
    try {
      const data = await jobService.getApplicants(job.job_id);
      setApplicants(data);
    } catch (err) {
      console.error('Failed to fetch applicants', err);
      alert('Failed to retrieve applicant dossiers.');
    } finally {
      setLoadingApplicants(false);
    }
  };

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      await jobService.updateApplicationStatus(appId, newStatus);
      setApplicants(prev => prev.map(a => a.application_id === appId ? { ...a, status: newStatus } : a));
    } catch (err) {
      console.error('Failed to update status', err);
      alert('Status transmission failed.');
    }
  };

  const handleMessage = (targetUserId) => {
    if (!targetUserId) {
      alert("Technical constraint: Could not identify target user sequence.");
      return;
    }
    navigate(`/messages/${targetUserId}`);
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

                 <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto md:pl-10">
                   <button 
                     onClick={() => handleViewApplicants(job)}
                     className="w-full md:w-48 px-6 py-4 bg-white text-slate-950 hover:bg-blue-600 hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl"
                   >
                     <Users size={16} />
                     View Applicants
                   </button>
                   <button 
                     onClick={() => handleDelete(job.job_id)}
                     className="w-full md:w-16 h-14 bg-slate-950 hover:bg-rose-600 text-rose-500 hover:text-white border border-slate-800 hover:border-rose-500 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center shadow-xl group/delete"
                     title="Delete Permanently"
                   >
                      <Trash2 size={20} className="group-hover/delete:scale-110 transition-transform" />
                   </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedJob ? `Applicants for: ${selectedJob.job_title}` : "Applicant Dossier"}
        size="xl"
      >
        <div className="min-h-[400px]">
          {loadingApplicants ? (
            <div className="flex justify-center py-20">
               <div className="w-10 h-10 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin" />
            </div>
          ) : applicants.length === 0 ? (
            <div className="py-20 text-center text-slate-500">
               <div className="inline-flex w-16 h-16 bg-slate-900 rounded-2xl items-center justify-center border border-slate-800 mb-4">
                  <Users size={24} className="opacity-20" />
               </div>
               <p className="text-[10px] font-black uppercase tracking-widest">No candidates have applied to this node yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-y-4">
                <thead>
                  <tr className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <th className="px-6 pb-2">Candidate</th>
                    <th className="px-6 pb-2 text-center">Documents</th>
                    <th className="px-6 pb-2 text-center">Applied On</th>
                    <th className="px-6 pb-2 text-center">Status</th>
                    <th className="px-6 pb-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="mt-4">
                  {applicants.map((app, index) => {
                    const profile = app.student?.user?.profile || app.alumni?.user?.profile;
                    const role = app.student ? "Student" : "Alumni";
                    
                    return (
                      <motion.tr 
                        key={app.application_id} 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        className="group/row"
                      >
                        <td className="px-6 py-4 bg-slate-950/50 rounded-l-3xl border-y border-l border-white/5 transition-colors group-hover/row:border-blue-500/30">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-blue-500 border border-slate-800 shadow-inner group-hover/row:border-blue-500/40 transition-colors">
                                <UserIcon size={18} />
                             </div>
                             <div>
                                <p className="text-sm font-black text-white leading-none mb-1 uppercase tracking-tight">{profile?.first_name} {profile?.last_name}</p>
                                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{app.student?.user?.email || app.alumni?.user?.email}</p>
                                <span className="text-[8px] px-1.5 py-0.5 bg-slate-900 rounded-md text-slate-600 font-black uppercase mt-1 inline-block border border-white/5">{role}</span>
                             </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 bg-slate-950/50 border-y border-white/5 transition-colors group-hover/row:border-blue-500/30 text-center">
                           {app.cv_url ? (
                             <a 
                               href={app.cv_url} 
                               target="_blank" 
                               rel="noopener noreferrer"
                               className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors text-[10px] font-black uppercase tracking-widest group/dl px-4 py-2 bg-emerald-500/5 rounded-xl border border-emerald-500/10 hover:border-emerald-500/30"
                             >
                               <Download size={14} className="group-hover/dl:scale-110 transition-transform" />
                               Resume
                             </a>
                           ) : (
                             <span className="text-slate-700 italic text-[9px]">No File</span>
                           )}
                        </td>

                        <td className="px-6 py-4 bg-slate-950/50 border-y border-white/5 transition-colors group-hover/row:border-blue-500/30 text-center">
                           <span className="text-[10px] text-slate-400 font-bold">{new Date(app.applied_at || app.created_at).toLocaleDateString()}</span>
                        </td>

                        <td className="px-6 py-4 bg-slate-950/50 border-y border-white/5 transition-colors group-hover/row:border-blue-500/30 text-center">
                           <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border transition-all duration-500 ${
                             app.status === 'Shortlisted' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]' :
                             app.status === 'Rejected' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.15)]' :
                             'bg-slate-900 text-slate-500 border-slate-800'
                           }`}>
                             {app.status}
                           </span>
                        </td>

                        <td className="px-6 py-4 bg-slate-950/50 rounded-r-3xl border-y border-r border-white/5 transition-colors group-hover/row:border-blue-500/30 text-right">
                           <div className="flex items-center justify-end gap-2 px-2">
                              <button 
                                onClick={() => handleUpdateStatus(app.application_id, 'Shortlisted')}
                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 border shadow-inner ${
                                  app.status === 'Shortlisted' 
                                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)] scale-110' 
                                  : 'bg-slate-900 text-slate-500 border-white/5 hover:border-emerald-500/50 hover:text-emerald-400'
                                }`}
                                title="Shortlist Candidate"
                              >
                                <Award size={18} />
                              </button>
                              <button 
                                onClick={() => handleUpdateStatus(app.application_id, 'Rejected')}
                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 border shadow-inner ${
                                  app.status === 'Rejected' 
                                  ? 'bg-rose-600 text-white border-rose-400 shadow-[0_0_20px_rgba(225,29,72,0.4)] scale-110' 
                                  : 'bg-slate-900 text-slate-500 border-white/5 hover:border-rose-500/50 hover:text-rose-500'
                                }`}
                                title="Reject Candidate"
                              >
                                <XCircle size={18} />
                              </button>
                              <button 
                                onClick={() => handleMessage(app.student?.user?.user_id || app.alumni?.user?.user_id)}
                                className="w-10 h-10 rounded-xl bg-slate-900 text-slate-500 border border-white/5 hover:border-blue-500/50 hover:text-blue-400 hover:bg-blue-500/5 flex items-center justify-center transition-all ml-2 group/msg shadow-inner"
                                title="Initiate Message"
                              >
                                <MessageSquare size={18} className="group-hover/msg:scale-110 transition-transform" />
                              </button>
                           </div>
                        </td>
                      </motion.tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="mt-8 pt-6 border-t border-white/5 flex justify-end">
           <button 
             onClick={() => setIsModalOpen(false)}
             className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
           >
             Close Node
           </button>
        </div>
      </Modal>
    </div>
  );
}
