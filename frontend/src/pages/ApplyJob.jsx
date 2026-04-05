import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  ChevronLeft, 
  Send, 
  User, 
  Mail, 
  Link as LinkIcon, 
  FileText,
  Zap,
  CheckCircle
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import FormInput from '../components/FormInput';
import jobService from '../services/jobService';

const ApplyJob = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    resume: '',
    cover_letter: ''
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data = await jobService.getJobById(id);
        setJob(data);
      } catch (err) {
        setJob({ id: id, title: "Senior Full Stack Engineer", company: "Google" });
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  if (loading) return null;

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col">
          <Navbar />
          <main className="max-w-7xl mx-auto px-6 lg:px-10 pt-48 pb-20 flex flex-col items-center text-center">
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-20 h-20 rounded-3xl bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center mb-8 shadow-2xl shadow-emerald-500/20"
            >
              <CheckCircle className="text-emerald-400 w-10 h-10" />
            </motion.div>
            <h1 className="text-4xl font-black tracking-tighter text-white mb-2 uppercase italic">Mission Transmitted</h1>
            <p className="text-slate-400 font-medium text-lg max-w-md italic mb-10">"Your career application has been successfully buffered into the system. Good luck, Node."</p>
            <Link to="/jobs" className="btn-lavish !bg-blue-600 !text-white px-10 py-4 font-black uppercase text-xs tracking-widest">
              Return to Catalog
            </Link>
          </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
        <Navbar />
        
        <main className="max-w-3xl mx-auto px-6 lg:px-10 pt-32 pb-20">
          
          <Link to={`/jobs/details/${id}`} className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-all font-black text-xs mb-10 group uppercase tracking-widest outline-none">
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Cancel Operation
          </Link>

          <header className="mb-12 border-b border-slate-800/60 pb-10">
             <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                   <Zap className="text-blue-400 w-5 h-5" />
                </div>
                <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic leading-none">Job Application</h1>
             </div>
             <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Applying for <span className="text-blue-400 font-black">{job.title}</span> @ <span className="text-white font-black">{job.company}</span></p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-8">
            <Card className="!p-10 !bg-slate-900/60 border-slate-800/40 relative overflow-hidden group shadow-2xl">
              <div className="space-y-8">
                <FormInput
                  label="Full Identity"
                  icon={User}
                  placeholder="e.g. John Doe"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
                
                <FormInput
                  label="Communication Node"
                  type="email"
                  icon={Mail}
                  placeholder="e.g. node@alumni.net"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />

                <FormInput
                  label="Resume / Portfolio Link"
                  icon={LinkIcon}
                  placeholder="https://drive.google.com/..."
                  required
                  value={formData.resume}
                  onChange={(e) => setFormData({...formData, resume: e.target.value})}
                />

                <div className="flex flex-col gap-3">
                   <label className="text-xs font-black text-slate-500 uppercase tracking-widest leading-none ml-1">
                      Professional Statement
                   </label>
                   <textarea 
                     rows="6"
                     placeholder="Why should this node join the collective?"
                     className="w-full bg-slate-950/60 border-2 border-slate-800 rounded-[1.5rem] p-6 text-slate-100 font-medium placeholder:text-slate-700 focus:outline-none focus:border-blue-500/50 transition-all italic leading-relaxed"
                     value={formData.cover_letter}
                     onChange={(e) => setFormData({...formData, cover_letter: e.target.value})}
                   />
                </div>
              </div>
            </Card>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={submitting}
              className="btn-lavish w-full !bg-white !text-slate-950 flex items-center justify-center gap-3 py-5 text-sm font-black uppercase tracking-tight shadow-xl shadow-white/5 hover:shadow-blue-500/30 transition-all disabled:opacity-50"
            >
              {submitting ? 'Transmitting Data...' : 'Submit Operation'}
              {!submitting && <Send size={18} className="fill-current" />}
            </motion.button>
          </form>
        </main>
    </div>
  );
};

export default ApplyJob;
