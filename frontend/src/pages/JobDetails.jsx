import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Clock, 
  Building2, 
  ChevronLeft, 
  Zap,
  CheckCircle,
  Share2,
  Bookmark
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import jobService from '../services/jobService';

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        // Simulate fetch or use service
        const data = await jobService.getJobById(id);
        setJob(data);
      } catch (err) {
        // Fallback to mock if service fails
        setJob({
          id: id,
          title: "Senior Full Stack Engineer",
          company: "Google",
          location: "Mountain View, CA",
          salary: "$180k - $240k",
          type: "Full-time",
          category: "Engineering",
          posted: "2 days ago",
          description: "We are looking for an exceptional Full Stack Engineer to join our core infrastructure team. You will be responsible for building scalable systems that power millions of users globally.",
          requirements: [
            "8+ years of experience with React and Node.js",
            "Expertise in distributed systems and microservices",
            "Strong understanding of SQL and NoSQL databases",
            "Experience with cloud platforms (GCP/AWS)"
          ],
          benefits: [
            "Competitive equity package",
            "Comprehensive health and wellness coverage",
            "Flexible work arrangements",
            "Learning and development budget"
          ]
        });
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-6 lg:px-10 pt-32 pb-20">
          
          <Link to="/jobs" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-all font-black text-xs mb-10 group uppercase tracking-widest outline-none">
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Catalog
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-10">
              <Card className="!p-10 !bg-slate-900/60 border-slate-800/40 relative overflow-hidden group">
                 <div className="flex items-start justify-between mb-8 transition-all">
                    <div className="flex items-center gap-6">
                       <div className="w-20 h-20 rounded-[1.8rem] bg-slate-950 border border-slate-800 flex items-center justify-center text-3xl font-black text-blue-500 shadow-2xl">
                          {job.logo || 'G'}
                       </div>
                       <div className="flex flex-col">
                          <h1 className="text-3xl font-black text-white tracking-tighter leading-none mb-3">{job.title}</h1>
                          <p className="text-blue-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                             <Building2 size={14} className="opacity-50" />
                             {job.company}
                          </p>
                       </div>
                    </div>
                 </div>

                 <div className="flex flex-wrap gap-6 border-y border-slate-800/40 py-8 mb-10">
                    <div className="flex items-center gap-3 text-slate-400 text-xs font-black uppercase tracking-widest">
                       <MapPin size={16} className="text-slate-600" />
                       {job.location}
                    </div>
                    <div className="flex items-center gap-3 text-slate-400 text-xs font-black uppercase tracking-widest">
                       <DollarSign size={16} className="text-slate-600" />
                       {job.salary}
                    </div>
                    <div className="flex items-center gap-3 text-emerald-400/80 text-xs font-black uppercase tracking-widest">
                       <CheckCircle size={16} className="text-emerald-500/40" />
                       {job.type}
                    </div>
                 </div>

                 <div className="prose prose-invert max-w-none space-y-10">
                    <section>
                       <h4 className="text-lg font-black text-white uppercase tracking-tighter mb-4 italic">The Mission</h4>
                       <p className="text-slate-400 font-medium leading-relaxed tracking-tight">{job.description}</p>
                    </section>

                    <section>
                       <h4 className="text-lg font-black text-white uppercase tracking-tighter mb-4 italic">Core Competencies</h4>
                       <ul className="space-y-4 list-none p-0">
                          {job.requirements.map((req, i) => (
                             <li key={i} className="flex items-start gap-4 text-slate-400 font-medium tracking-tight">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0 shadow-lg shadow-blue-500/40" />
                                {req}
                             </li>
                          ))}
                       </ul>
                    </section>
                 </div>
              </Card>
            </div>

            {/* Sidebar Actions */}
            <div className="space-y-8">
               <Card className="!p-8 !bg-slate-900/60 border-t-4 border-t-blue-600 group">
                   <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-8 leading-none">Transmission Node</h5>
                   <div className="space-y-4 mb-8">
                      <div className="flex flex-col gap-2 bg-slate-950/50 p-6 rounded-2xl border border-slate-800 transition-all group-hover:border-blue-500/20">
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Direct Contact</span>
                         <a 
                           href={`mailto:${job.contact_email}`} 
                           className="text-sm font-black text-white hover:text-blue-400 transition-colors truncate"
                         >
                            {job.contact_email || "recruit@enterprise.io"}
                         </a>
                      </div>
                   </div>
                   <Link to={`/jobs/apply/${job.id}`} className="block w-full">
                      <button className="btn-lavish w-full !bg-blue-600 !text-white flex items-center justify-center gap-3 py-5 text-sm font-black uppercase tracking-tight shadow-xl shadow-blue-600/20 hover:shadow-blue-600/40 transform transition-all group-hover:scale-[1.02]">
                         Initialize Protocol
                         <Zap size={18} className="fill-current" />
                      </button>
                   </Link>
               </Card>

               <div className="grid grid-cols-2 gap-4">
                  <button className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest">
                     <Bookmark size={16} />
                     Save Node
                  </button>
                  <button className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest">
                     <Share2 size={16} />
                     Distribute
                  </button>
               </div>
            </div>

          </div>
        </main>
    </div>
  );
};

export default JobDetails;
