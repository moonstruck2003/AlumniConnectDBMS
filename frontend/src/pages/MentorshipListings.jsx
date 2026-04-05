import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Search, 
  Filter, 
  Star, 
  Coins, 
  ArrowRight, 
  MessageCircle, 
  GraduationCap,
  ChevronDown,
  Zap,
  Globe
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import mentorshipService from '../services/mentorshipService';
import { Link } from 'react-router-dom';

const MentorshipListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await mentorshipService.getMentorships();
        setListings(data);
      } catch (err) {
        console.error('Failed to fetch mentorships', err);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  const filteredListings = listings.filter(item => 
    item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.alumni_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 lg:px-10 pt-32 pb-20">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-slate-800/60 pb-10">
            <div>
              <h1 className="text-4xl font-black tracking-tighter text-white mb-2 uppercase leading-none">Expert Mentorship</h1>
              <p className="text-slate-400 font-medium whitespace-nowrap leading-none">Connect with industry elites and accelerate your career path.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative group w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Search by mentor or expertise..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-5 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 transition-all font-bold text-lg italic"
                />
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
                {filteredListings.map((item) => (
                  <Card key={item.listing_id} className="!p-8 !bg-slate-900/40 relative overflow-hidden group">
                    <div className="relative z-10 flex flex-col">
                      <div className="flex justify-between items-start gap-6 mb-8 transition-all">
                        <div className="flex gap-5 group/mentor items-center">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-indigo-700 p-1 group-hover/mentor:scale-105 transition-transform">
                            <div className="w-full h-full rounded-xl bg-slate-950 flex items-center justify-center border border-slate-800 overflow-hidden">
                              <Users className="text-indigo-500" size={32} />
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <h3 className="text-xl font-black text-white tracking-tight uppercase leading-none mb-1.5 transition-all group-hover/mentor:text-indigo-400">Sarah Jenkins</h3>
                            <span className="text-xs font-black text-slate-500 uppercase tracking-widest leading-none">Senior Architect @ Google</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end transition-all border border-amber-500/10 p-2.5 rounded-2xl bg-amber-500/5">
                          <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] leading-none mb-2">Min Bid</span>
                          <div className="flex items-center gap-2">
                            <Coins className="text-amber-500 group-hover:scale-110 transition-transform" size={18} />
                            <span className="text-xl font-black text-white leading-none tracking-tight">{item.min_coin_bid || 500}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-6">
                        <Star className="text-amber-500 fill-amber-500" size={14} />
                        <Star className="text-amber-500 fill-amber-500" size={14} />
                        <Star className="text-amber-500 fill-amber-500" size={14} />
                        <Star className="text-amber-500 fill-amber-500" size={14} />
                        <Star className="text-amber-500 fill-amber-500" size={14} />
                        <span className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest leading-none">4.9 (127 Sessions)</span>
                      </div>
                      
                      <p className="text-slate-400 text-sm font-medium line-clamp-3 mb-8 leading-relaxed max-w-lg italic">
                        "{item.description || 'Passionate about helping students navigate the complex world of software engineering, system design, and career growth at scale.'}"
                      </p>
                      
                      <div className="flex items-center justify-between pt-8 border-t border-slate-800/40">
                        <div className="flex gap-2 transition-all">
                          {['System Design', 'ML Ops', 'Leadership'].map(tag => (
                            <span key={tag} className="px-3 py-1 bg-slate-800/60 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-widest border border-slate-700/40 transition-all hover:text-white hover:border-slate-600 cursor-default">{tag}</span>
                          ))}
                        </div>
                        <Link to={`/mentorship/request/${item.listing_id}`} className="flex items-center gap-2 text-sm font-black text-indigo-500 hover:text-indigo-400 transition-colors uppercase tracking-tighter group/link">
                          Initiate Request
                          <Zap size={18} strokeWidth={3} className="group-hover/link:animate-pulse" />
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </AnimatePresence>
            </div>
          )}
        </main>
    </div>
  );
};

export default MentorshipListings;
