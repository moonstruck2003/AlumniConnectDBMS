import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  ArrowRight, 
  Building2, 
  ChevronDown,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import jobService from '../services/jobService';

const JobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const [jobsData, categoriesData] = await Promise.all([
          jobService.getJobs(),
          jobService.getCategories()
        ]);
        setJobs(jobsData);
        setCategories(categoriesData);
      } catch (err) {
        console.error('Failed to fetch jobs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => 
    (selectedCategory === 'all' || job.category_id === parseInt(selectedCategory)) &&
    (job.job_title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     job.company_name?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-950 flex flex-row">
      <Sidebar />
      <div className="flex-1 lg:ml-[280px]">
        <Navbar />
        
        <main className="max-w-7xl mx-auto px-6 lg:px-10 pt-32 pb-20">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-slate-800/60 pb-10">
            <div>
              <h1 className="text-4xl font-black tracking-tighter text-white mb-2 leading-none">Explore Opportunities</h1>
              <p className="text-slate-400 font-medium whitespace-nowrap leading-none">Find the perfect internship or job in the network.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative group w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Search by title or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-5 text-slate-100 focus:outline-none focus:border-amber-500/50 transition-all font-medium"
                />
              </div>
              
              <div className="relative w-full md:w-48">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <select 
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-10 text-slate-100 focus:outline-none focus:border-amber-500/50 appearance-none font-medium transition-all"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.category_id} value={cat.category_id}>{cat.category_name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredJobs.map((job) => (
                  <Card key={job.job_id} className="!p-8 !bg-slate-900/40 relative overflow-hidden group">
                    <div className="relative z-10">
                      <div className="flex justify-between items-start gap-4 mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-blue-400 group-hover:border-blue-500/50 transition-all">
                          <Building2 size={26} />
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] font-black text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20 uppercase tracking-widest leading-none">
                            Full-time
                          </span>
                          <span className="text-sm font-bold text-slate-500 mt-2 flex items-center gap-1.5 leading-none tracking-tight">
                            <Clock size={12} />
                            2 days ago
                          </span>
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-black text-white tracking-tighter mb-1.5 group-hover:text-blue-400 transition-colors uppercase leading-none">{job.job_title}</h3>
                      <div className="flex items-center gap-4 text-slate-400 text-sm font-bold tracking-tight mb-6 mt-3">
                        <span className="flex items-center gap-1.5 text-slate-300">
                          <Building2 size={14} className="text-blue-400" />
                          {job.company_name || 'TechCorp Solutions'}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin size={14} className="text-amber-500" />
                          Remote
                        </span>
                      </div>
                      
                      <p className="text-slate-500 text-sm font-medium line-clamp-3 mb-8 leading-relaxed italic">
                        "{job.job_description || 'We are looking for a passionate individual to join our world-class engineering team to build the future of network connectivity...'}"
                      </p>
                      
                      <div className="flex items-center justify-between pt-6 border-t border-slate-800/40">
                        <div className="flex gap-2">
                          <span className="px-3 py-1 bg-slate-800 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-700/50">React</span>
                          <span className="px-3 py-1 bg-slate-800 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-700/50">Node.js</span>
                        </div>
                        <motion.button 
                          whileHover={{ x: 5 }}
                          className="flex items-center gap-2 text-sm font-black text-amber-500 hover:text-amber-400 transition-colors group/link uppercase tracking-tighter"
                        >
                          View Details
                          <ArrowRight size={18} strokeWidth={3} className="text-amber-500" />
                        </motion.button>
                      </div>
                    </div>
                  </Card>
                ))}
              </AnimatePresence>
              {filteredJobs.length === 0 && (
                <div className="col-span-full py-20 text-center">
                  <div className="inline-flex w-20 h-20 bg-slate-900 rounded-full items-center justify-center border border-slate-800 mb-6">
                    <Search className="text-slate-600" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 tracking-tight">No opportunities found.</h3>
                  <p className="text-slate-500 font-medium italic">Adjust your search or filters to discover new roles.</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default JobListings;
