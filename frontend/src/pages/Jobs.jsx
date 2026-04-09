import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Clock, 
  Filter, 
  ChevronRight, 
  Building2, 
  Zap,
  Plus,
  Mail,
  CheckCircle2,
  XCircle,
  Tag
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import jobService from '../services/jobService';
import authService from '../services/authService';
import './Jobs.css';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const user = authService.getCurrentUser();
  const isRecruiter = user?.role === 'recruiter';

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const jobsData = await jobService.getJobs();
        setJobs(jobsData);
      } catch (err) {
        console.error('Failed to fetch data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleToggle = async (e, jobId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const response = await jobService.toggleJob(jobId);
      setJobs(jobs.map(j => j.job_id === jobId ? { ...j, is_active: response.is_active } : j));
    } catch (err) {
      console.error('Failed to toggle job', err);
    }
  };

  const filteredJobs = React.useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch = job.job_title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            (job.company_name && job.company_name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = selectedType === 'All' || job.job_type === selectedType;
      
      return matchesSearch && matchesType;
    });
  }, [jobs, searchTerm, selectedType]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1 } 
    }
  };

  return (
    <div className="jobs-page bg-slate-950 min-h-screen text-slate-100 pb-20 selection:bg-blue-500/30">
      <Navbar />
      
      {/* Standardized Hero & Search Section */}
      <section className="relative pt-24 pb-12 overflow-hidden border-b border-slate-800/50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-blue-600/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center space-y-4 mb-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] font-black tracking-[0.2em] uppercase">
              <Briefcase className="w-3.5 h-3.5" />
              Career Network
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white uppercase italic">
              Elevate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-teal-400">Future</span>
            </h1>
            <p className="max-w-xl mx-auto text-base text-slate-400 leading-relaxed font-medium">
              Join the elite circle of alumni and access exclusive opportunities.
            </p>
          </motion.div>

          {/* Unified Search and Filtering Bar */}
          <div className="max-w-4xl mx-auto">
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2, duration: 0.8 }}
               className="flex flex-col md:flex-row items-center gap-4 p-2 rounded-[2.5rem] bg-slate-900/40 backdrop-blur-3xl border border-white/10 shadow-2xl w-full group/search focus-within:border-blue-500/50 transition-all"
            >
              <div className="flex-1 flex items-center gap-3 px-6 py-3">
                <Search className="w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search legacy-defining roles..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-lg placeholder-slate-700 font-semibold"
                />
              </div>
              
              {isRecruiter ? (
                <Link to="/post-job" className="shrink-0">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[1.8rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Post Opportunity
                    </motion.button>
                </Link>
              ) : (
                <button className="px-10 py-4 bg-blue-600 hover:bg-blue-500 rounded-[1.8rem] font-black transition-all shadow-lg flex items-center gap-2 uppercase tracking-wider text-[10px]">
                  <Zap className="w-4 h-4 fill-current" />
                  Discover
                </button>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 mt-16 pb-20">
          <div className="flex items-center justify-between">
            <p className="text-slate-500 text-sm font-black uppercase tracking-[0.2em]">
              Curated List / <span className="text-slate-100">{filteredJobs.length}</span> Opportunities
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-40">
               <div className="w-12 h-12 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin" />
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="visible"
              animate="visible"
              className="grid gap-10"
            >
              <AnimatePresence mode='popLayout'>
                {filteredJobs.map((job) => (
                  <motion.div
                    key={job.job_id}
                    layout
                    whileHover={{ 
                      y: -10, 
                      borderColor: 'rgba(59, 130, 246, 0.4)',
                      boxShadow: '0 25px 50px rgba(0,0,0,0.5), 0 0 30px rgba(59, 130, 246, 0.1)' 
                    }}
                    className={`p-10 rounded-[3rem] bg-slate-900 border border-slate-800 shadow-2xl flex flex-col md:flex-row items-center gap-10 transition-all relative overflow-hidden group/card ${!job.is_active ? 'opacity-60 grayscale' : ''}`}
                  >
                    <div className="absolute top-0 right-0 p-8">
                       <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border ${job.is_active ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-slate-800/20 text-slate-500 border-slate-800'}`}>
                         {job.is_active ? 'Status: Active' : 'Status: Closed'}
                       </div>
                    </div>

                    {/* Company Logo */}
                    <div className="relative shrink-0">
                      <div className="w-24 h-24 rounded-[2rem] bg-slate-950 border border-slate-800 flex items-center justify-center text-4xl font-black text-blue-500 shadow-2xl relative z-10 transition-all duration-500 group-hover/card:rotate-[10deg] group-hover/card:scale-110">
                        {job.company_name?.[0] || job.job_title[0]}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 space-y-6 text-center md:text-left">
                      <div className="space-y-2">
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                          <h3 className="text-3xl font-black text-white group-hover/card:text-blue-400 transition-colors tracking-tight uppercase leading-none">{job.job_title}</h3>
                          <div className="flex justify-center md:justify-start">
                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${job.job_type === 'Internship' ? 'bg-amber-500/5 text-amber-500 border-amber-500/20' : 'bg-blue-500/5 text-blue-400 border-blue-500/20'}`}>
                              {job.job_type}
                            </span>
                          </div>
                        </div>
                        <p className="text-blue-400/80 font-black text-sm uppercase tracking-widest flex items-center justify-center md:justify-start gap-3">
                          <Building2 className="w-4 h-4 text-blue-500/50" />
                          {job.company_name || "Enterprise"}
                        </p>
                      </div>

                      <div className="flex flex-wrap justify-center md:justify-start gap-8">
                        <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest">
                          <MapPin className="w-4 h-4 text-slate-700" />
                          {job.location || 'Remote'}
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest">
                          <DollarSign className="w-4 h-4 text-slate-700" />
                          {job.salary || 'Competitive'}
                        </div>
                        <div className="flex items-center gap-2 text-teal-400/60 text-xs font-black uppercase tracking-widest">
                          <Clock className="w-4 h-4 text-teal-500/30" />
                          {new Date(job.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-center gap-4 w-full md:w-auto pt-8 md:pt-0 border-t md:border-t-0 border-slate-800/50 md:pl-10">
                       <button 
                         onClick={() => {
                           setSelectedJob(job);
                           setIsModalOpen(true);
                         }}
                         className="w-full md:w-48 px-12 py-5 bg-white text-slate-950 hover:bg-blue-600 hover:text-white rounded-[1.8rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl hover:shadow-blue-500/30 flex items-center justify-center gap-3"
                       >
                          Apply
                          <ChevronRight className="w-4 h-4" />
                       </button>

                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Application Modal */}
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Transmission Protocol"
            type="info"
          >
            {selectedJob && (
              <div className="space-y-8">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center">
                    <Mail className="text-blue-400 w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-white uppercase italic tracking-tighter">Direct Contact Node</h4>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Established secure connection</p>
                  </div>
                </div>

                <div className="bg-slate-950/50 border border-slate-800 p-8 rounded-3xl relative overflow-hidden group/modal-card">
                  <div className="relative z-10 text-center">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Target Endpoint</p>
                    <a 
                      href={`mailto:${selectedJob.contact_email}`}
                      className="text-2xl font-black text-white hover:text-blue-400 transition-colors tracking-tighter block break-all"
                    >
                      {selectedJob.contact_email}
                    </a>
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl -mr-16 -mt-16" />
                </div>

                <p className="text-slate-400 font-medium text-center text-sm leading-relaxed italic px-4">
                  "Please initiate contact via the provided email. Your professional record will be buffered and stored upon transmission."
                </p>

                <div className="pt-4">
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border border-white/5"
                  >
                    Close Protocol
                  </button>
                </div>
              </div>
            )}
          </Modal>

          {!loading && filteredJobs.length === 0 && (
             <div className="py-40 text-center grayscale opacity-30">
                <div className="inline-flex w-32 h-32 bg-slate-900 rounded-[2.5rem] items-center justify-center border-2 border-slate-800 mb-8 shadow-inner">
                  <Search className="text-slate-700" size={56} strokeWidth={1} />
                </div>
                <h3 className="text-3xl font-black text-white mb-2 tracking-tighter uppercase italic">No Signals Found</h3>
                <p className="text-slate-600 font-bold uppercase tracking-widest text-xs">Adjust your frequency to discover new opportunities.</p>
             </div>
          )}
        </main>
      </div>
    );
}

