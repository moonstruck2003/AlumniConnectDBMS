import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, Briefcase, MapPin, DollarSign, Clock, Filter, ChevronRight, Building2, Zap } from 'lucide-react';
import Navbar from '../components/Navbar';
import './Jobs.css';

const MOCK_JOBS = [
  {
    id: 1,
    title: "Senior Full Stack Engineer",
    company: "Google",
    location: "Mountain View, CA",
    salary: "$180k - $240k",
    type: "Full-time",
    category: "Engineering",
    posted: "2 days ago",
    logo: "G",
    color: "blue"
  },
  {
    id: 2,
    title: "Product Designer",
    company: "Airbnb",
    location: "Remote",
    salary: "$140k - $190k",
    type: "Full-time",
    category: "Design",
    posted: "5 hours ago",
    logo: "A",
    color: "rose"
  },
  {
    id: 3,
    title: "Software Engineer Intern",
    company: "Meta",
    location: "Menlo Park, CA",
    salary: "$8k - $12k / mo",
    type: "Internship",
    category: "Engineering",
    posted: "1 week ago",
    logo: "M",
    color: "blue"
  },
  {
    id: 4,
    title: "Marketing Manager",
    company: "Slack",
    location: "San Francisco, CA",
    salary: "$120k - $160k",
    type: "Full-time",
    category: "Marketing",
    posted: "3 days ago",
    logo: "S",
    color: "purple"
  },
  {
    id: 5,
    title: "Backend Developer",
    company: "Stripe",
    location: "Remote / Dublin",
    salary: "$160k - $210k",
    type: "Permanent",
    category: "Engineering",
    posted: "1 day ago",
    logo: "S",
    color: "indigo"
  },
  {
    id: 6,
    title: "UX Researcher",
    company: "Microsoft",
    location: "Redmond, WA",
    salary: "$130k - $175k",
    type: "Full-time",
    category: "Design",
    posted: "4 days ago",
    logo: "M",
    color: "blue"
  }
];

export default function Jobs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Engineering', 'Design', 'Marketing', 'Product', 'Data Science'];

  const filteredJobs = MOCK_JOBS.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1 } 
    }
  };

  const itemVariants = {
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 260, damping: 20 } 
    }
  };

  return (
    <div className="jobs-page bg-slate-950 min-h-screen text-slate-100 pb-20 selection:bg-blue-500/30">
      <Navbar />
      
      {/* Compact Hero Section */}
      <section className="relative pt-24 pb-12 overflow-hidden border-b border-slate-800/50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-blue-600/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center space-y-4"
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

          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="max-w-2xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2 p-2 rounded-[2rem] bg-slate-900/40 backdrop-blur-3xl border border-white/10 shadow-2xl group/search focus-within:border-blue-500/50 transition-all"
          >
            <div className="flex items-center gap-3 px-5 py-3">
              <Search className="w-5 h-5 text-slate-500 group-focus-within/search:text-blue-400 transition-colors" />
              <input 
                type="text" 
                placeholder="Search legacy-defining roles..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-lg placeholder-slate-700 font-semibold"
              />
            </div>
            <button className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-[1.5rem] font-black transition-all shadow-lg flex items-center gap-2 uppercase tracking-wider text-[10px]">
              <Zap className="w-4 h-4 fill-current" />
              Discover
            </button>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-16">
        {/* Filters Sidebar */}
        <aside className="hidden lg:block">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="sticky top-32 space-y-12 p-8 rounded-[2.5rem] bg-slate-900/30 border border-white/5 backdrop-blur-xl"
          >
            <div className="space-y-8">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
                <Filter className="w-4 h-4" />
                Specializations
              </h4>
              <div className="flex flex-col gap-3">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-6 py-4 rounded-2xl text-left font-black text-xs uppercase tracking-widest transition-all relative overflow-hidden group/cat ${
                      selectedCategory === cat 
                      ? 'text-blue-400' 
                      : 'text-slate-500 hover:text-slate-100'
                    }`}
                  >
                    {selectedCategory === cat && (
                      <motion.div 
                        layoutId="cat-bg"
                        className="absolute inset-0 bg-blue-500/10 border border-blue-500/20"
                        style={{ borderRadius: '1rem' }}
                      />
                    )}
                    <span className="relative z-10">{cat}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-8 rounded-[2rem] bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/20 space-y-6 relative overflow-hidden group/cta">
              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover/cta:scale-110 transition-transform">
                <Briefcase className="w-32 h-32" />
              </div>
              <h5 className="font-black text-white text-lg tracking-tight relative z-10">Expand the legacy?</h5>
              <p className="text-sm text-blue-200/60 leading-relaxed font-semibold relative z-10">Recruit top-tier talent from our elite alumni network.</p>
              <button className="w-full py-4 bg-white/10 hover:bg-white text-slate-400 hover:text-slate-950 rounded-2xl font-black transition-all border border-white/10 text-[10px] uppercase tracking-widest relative z-10">
                Launch Posting
              </button>
            </div>
          </motion.div>
        </aside>

        {/* Job Listings Grid */}
        <div className="space-y-10">
          <div className="flex items-center justify-between">
            <p className="text-slate-500 text-sm font-black uppercase tracking-[0.2em]">
              Curated List / <span className="text-slate-100">{filteredJobs.length}</span> Opportunities
            </p>
            <div className="flex items-center gap-4 bg-slate-900/50 px-6 py-3 rounded-2xl border border-white/5">
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Chronology:</span>
              <select className="bg-transparent border-none text-blue-400 text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer">
                <option>Newest Premier</option>
                <option>Compensation</option>
              </select>
            </div>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="visible"
            animate="visible"
            className="grid gap-8"
          >
            <AnimatePresence mode='popLayout'>
              {filteredJobs.map((job) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 1, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  layout
                  whileHover={{ 
                    y: -10, 
                    borderColor: 'rgba(59, 130, 246, 0.4)',
                    boxShadow: '0 25px 50px rgba(0,0,0,0.5), 0 0 30px rgba(59, 130, 246, 0.1)' 
                  }}
                  className="p-10 rounded-[3rem] bg-slate-900 border border-slate-800 shadow-2xl flex flex-col md:flex-row items-center gap-10 transition-all relative overflow-hidden group/card"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-100 translate-y-0">
                     <div className="px-4 py-1.5 bg-blue-500/20 rounded-full text-[9px] font-black text-blue-400 uppercase tracking-[0.2em] border border-blue-500/30">
                       Premier Active
                     </div>
                  </div>

                  {/* Company Logo with Pulse */}
                  <div className="relative shrink-0">
                    <div className={`absolute inset-0 bg-${job.color}-500/10 rounded-[2rem] blur-2xl opacity-100 shadow-lg shadow-${job.color}-500/5`} />
                    <div className={`w-24 h-24 rounded-[2rem] bg-slate-950 border border-slate-800 flex items-center justify-center text-4xl font-black text-${job.color}-500 shadow-2xl relative z-10 transition-all duration-500 group-hover/card:rotate-[10deg] group-hover/card:scale-110`}>
                      {job.logo}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 space-y-6 text-center md:text-left">
                    <div className="space-y-2">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <h3 className="text-3xl font-black text-white group-hover/card:text-blue-400 transition-colors tracking-tight">{job.title}</h3>
                        <div className="flex justify-center md:justify-start">
                          <span className="px-3 py-1 bg-slate-800/50 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-widest border border-slate-700/50 group-hover/card:border-blue-500/30 transition-colors">
                            {job.type}
                          </span>
                        </div>
                      </div>
                      <p className="text-blue-400/80 font-black text-sm uppercase tracking-widest flex items-center justify-center md:justify-start gap-3">
                        <Building2 className="w-4 h-4 text-blue-500/50" />
                        {job.company}
                      </p>
                    </div>

                    <div className="flex flex-wrap justify-center md:justify-start gap-8">
                      <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest">
                        <MapPin className="w-4 h-4 text-slate-700" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest">
                        <DollarSign className="w-4 h-4 text-slate-700" />
                        {job.salary}
                      </div>
                      <div className="flex items-center gap-2 text-teal-400/60 text-xs font-black uppercase tracking-widest">
                        <Clock className="w-4 h-4 text-teal-500/30" />
                        {job.posted}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-4 w-full md:w-auto pt-8 md:pt-0 border-t md:border-t-0 border-slate-800/50 md:pl-10">
                     <Link to={`/jobs/details/${job.id}`} className="flex-1 md:flex-none">
                        <button className="w-full px-12 py-5 bg-white text-slate-950 hover:bg-blue-600 hover:text-white rounded-[1.8rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl hover:shadow-blue-500/30 flex items-center justify-center gap-3">
                           Initialize
                           <ChevronRight className="w-4 h-4" />
                        </button>
                     </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
