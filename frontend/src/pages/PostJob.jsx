import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  ChevronLeft, 
  Send, 
  Building2, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Mail, 
  Type,
  Layout,
  Zap,
  CheckCircle,
  ChevronDown
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import FormInput from '../components/FormInput';
import jobService from '../services/jobService';

const PostJob = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    job_title: '',
    company_name: '',
    job_type: 'Job',
    category_id: '',
    location: '',
    salary: '',
    deadline: '',
    contact_email: '',
    job_description: ''
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await jobService.getCategories();
        setCategories(data);
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, category_id: data[0].category_id }));
        }
      } catch (err) {
        console.error('Failed to fetch categories', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await jobService.postJob(formData);
      setSubmitted(true);
    } catch (err) {
      console.error('Failed to post job', err);
      const errorMessage = err.response?.data?.message || 'Failed to post job. Please ensure all fields are correct.';
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <Navbar />
        <main className="max-w-7xl mx-auto px-6 lg:px-10 pt-48 pb-20 flex flex-col items-center text-center">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 rounded-[2.5rem] bg-emerald-500/10 border-2 border-emerald-500/20 flex items-center justify-center mb-8 shadow-2xl shadow-emerald-500/20"
          >
            <CheckCircle className="text-emerald-400 w-12 h-12" />
          </motion.div>
          <h1 className="text-5xl font-black tracking-tighter text-white mb-4 uppercase italic">Opportunity Deployed</h1>
          <p className="text-slate-400 font-medium text-lg max-w-md italic mb-12">"Your listing has been successfully integrated into the career board. Nodes are being notified."</p>
          <Link to="/jobs" className="btn-lavish !bg-blue-600 !text-white px-12 py-5 font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-600/20">
            Return to Board
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col selection:bg-blue-500/30">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-6 lg:px-10 pt-32 pb-20">
        
        <Link to="/jobs" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-all font-black text-xs mb-12 group uppercase tracking-[0.2em] outline-none">
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Abort Operation
        </Link>

        <header className="mb-16 border-b border-slate-800/60 pb-12">
           <div className="flex items-center gap-5 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-blue-600/10 border-2 border-blue-600/20 flex items-center justify-center">
                 <Zap className="text-blue-400 w-7 h-7 fill-current" />
              </div>
              <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">New Deployment</h1>
           </div>
           <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] ml-1">Establish a new professional node in the network</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-10">
          <Card className="!p-12 !bg-slate-900/40 border-slate-800/40 relative overflow-hidden group shadow-2xl backdrop-blur-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-10">
                <FormInput
                  label="Mission Title"
                  icon={Type}
                  placeholder="e.g. Lead Architect"
                  required
                  value={formData.job_title}
                  onChange={(e) => setFormData({...formData, job_title: e.target.value})}
                />

                <FormInput
                  label="Organization Name"
                  icon={Building2}
                  placeholder="e.g. Stellar Systems"
                  value={formData.company_name}
                  onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                />

                <div className="flex flex-col gap-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] leading-none ml-2">
                    Employment Mode
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Job', 'Internship'].map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData({...formData, job_type: type})}
                        className={`py-4 rounded-2xl border-2 font-black text-xs uppercase tracking-widest transition-all ${
                          formData.job_type === type 
                          ? 'bg-blue-600/10 border-blue-600/40 text-blue-400 shadow-lg shadow-blue-600/5' 
                          : 'bg-slate-950/50 border-slate-800 text-slate-600 hover:text-slate-400'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] leading-none ml-2">
                     Specialization Sector
                   </label>
                   <div className="relative group/select">
                      <Layout className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none group-focus-within/select:text-blue-500 transition-colors" size={20} />
                      <select 
                        required
                        className="w-full bg-slate-950/50 border-2 border-slate-800 rounded-[1.5rem] py-4 pl-14 pr-12 text-slate-100 font-bold focus:outline-none focus:border-blue-600/40 transition-all appearance-none cursor-pointer"
                        value={formData.category_id}
                        onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                      >
                        <option value="" disabled>Select Specialization</option>
                        {categories.map(cat => (
                          <option key={cat.category_id} value={cat.category_id}>{cat.category_name}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none group-focus-within/select:text-blue-500 transition-colors" size={18} />
                   </div>
                </div>
              </div>

              <div className="space-y-10">
                <FormInput
                  label="Operational Location"
                  icon={MapPin}
                  placeholder="e.g. Remote / New York"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />

                <FormInput
                  label="Compensation Spectrum"
                  icon={DollarSign}
                  placeholder="e.g. $120k - $160k"
                  value={formData.salary}
                  onChange={(e) => setFormData({...formData, salary: e.target.value})}
                />

                <FormInput
                  label="Deployment Deadline"
                  type="date"
                  icon={Calendar}
                  value={formData.deadline}
                  onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                />

                <FormInput
                  label="Contact Frequency"
                  type="email"
                  icon={Mail}
                  placeholder="recruit@systems.io"
                  required
                  value={formData.contact_email}
                  onChange={(e) => setFormData({...formData, contact_email: e.target.value})}
                />
              </div>
            </div>

            <div className="mt-12 flex flex-col gap-4">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] leading-none ml-2">
                  Mission Parameters (Description)
               </label>
               <textarea 
                 rows="8"
                 placeholder="Define the scope of the role, requirements, and mission values..."
                 className="w-full bg-slate-950/50 border-2 border-slate-800 rounded-[2rem] p-8 text-slate-100 font-medium placeholder:text-slate-700 focus:outline-none focus:border-blue-600/40 transition-all italic leading-relaxed"
                 value={formData.job_description}
                 onChange={(e) => setFormData({...formData, job_description: e.target.value})}
               />
            </div>
            
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] -mr-32 -mt-32 pointer-events-none" />
          </Card>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={submitting}
            className="btn-lavish w-full !bg-white !text-slate-950 flex items-center justify-center gap-4 py-6 text-sm font-black uppercase tracking-[0.2em] shadow-2xl shadow-white/5 hover:shadow-blue-600/30 transition-all disabled:opacity-50"
          >
            {submitting ? 'Transmitting Data...' : 'Deploy Opportunity'}
            {!submitting && <Send size={20} className="fill-current" />}
          </motion.button>
        </form>
      </main>
    </div>
  );
};

export default PostJob;
