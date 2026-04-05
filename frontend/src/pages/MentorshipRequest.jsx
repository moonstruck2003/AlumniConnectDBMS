import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  ChevronLeft, 
  Send, 
  Coins, 
  CheckCircle,
  MessageSquare,
  Zap,
  ArrowRight
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import FormInput from '../components/FormInput';
import mentorshipService from '../services/mentorshipService';

const MentorshipRequest = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [bid, setBid] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const listings = await mentorshipService.getMentorships();
        const found = listings.find(l => l.listing_id === parseInt(id));
        setListing(found);
        setBid(found?.min_coin_bid || 500);
      } catch (err) {
        setListing({ id: id, alumni_name: "Sarah Jenkins", min_coin_bid: 500 });
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
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
              className="w-20 h-20 rounded-3xl bg-amber-500/20 border-2 border-amber-500/40 flex items-center justify-center mb-8 shadow-2xl shadow-amber-500/20"
            >
              <Zap className="text-amber-400 w-10 h-10" />
            </motion.div>
            <h1 className="text-4xl font-black tracking-tighter text-white mb-2 uppercase italic">Proposal Transmitted</h1>
            <p className="text-slate-400 font-medium text-lg max-w-md italic mb-10">"Your mentorship request has been broadcasted to the mentor's domain. Signal incoming."</p>
            <Link to="/mentorship" className="btn-lavish !bg-amber-600 !text-white px-10 py-4 font-black uppercase text-xs tracking-widest">
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
          
          <Link to="/mentorship" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-all font-black text-xs mb-10 group uppercase tracking-widest outline-none">
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Cancel Operation
          </Link>

          <header className="mb-12 border-b border-slate-800/60 pb-10">
             <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                   <Zap className="text-amber-400 w-5 h-5" />
                </div>
                <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic leading-none">Mentorship Proposal</h1>
             </div>
             <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Establishing node connection with <span className="text-amber-500 font-black">{listing.alumni_name}</span></p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-8">
            <Card className="!p-10 !bg-slate-900/60 border-slate-800/40 relative overflow-hidden group shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                 <div className="flex flex-col gap-3">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest leading-none ml-1">
                       Coin Bid Amount
                    </label>
                    <div className="relative flex items-center group/bid">
                       <div className="absolute left-5 text-amber-500">
                          <Coins size={20} />
                       </div>
                       <input 
                         type="number"
                         min={listing.min_coin_bid || 500}
                         value={bid}
                         onChange={(e) => setBid(e.target.value)}
                         className="w-full bg-slate-950/60 border-2 border-slate-800 rounded-[1.5rem] py-4 pl-14 pr-6 text-slate-100 font-black text-xl focus:outline-none focus:border-amber-500/50 transition-all"
                       />
                    </div>
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Minimum: {listing.min_coin_bid || 500} coins</span>
                 </div>
              </div>

              <div className="flex flex-col gap-3">
                 <label className="text-xs font-black text-slate-500 uppercase tracking-widest leading-none ml-1">
                    Proposed Agenda
                 </label>
                 <textarea 
                   rows="6"
                   placeholder="Define your research goals: 'System Design', 'ML Architecture'..."
                   className="w-full bg-slate-950/60 border-2 border-slate-800 rounded-[1.5rem] p-6 text-slate-100 font-medium placeholder:text-slate-700 focus:outline-none focus:border-amber-500/50 transition-all italic leading-relaxed"
                   value={message}
                   onChange={(e) => setMessage(e.target.value)}
                 />
              </div>
            </Card>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={submitting}
              className="btn-lavish w-full !bg-white !text-slate-950 flex items-center justify-center gap-3 py-5 text-sm font-black uppercase tracking-tight shadow-xl shadow-white/5 hover:shadow-amber-500/30 transition-all disabled:opacity-50"
            >
              {submitting ? 'Transmitting Data...' : 'Submit Operation'}
              {!submitting && <Send size={18} className="fill-current" />}
            </motion.button>
          </form>
        </main>
    </div>
  );
};

export default MentorshipRequest;
