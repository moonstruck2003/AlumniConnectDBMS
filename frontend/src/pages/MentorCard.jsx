import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, Users, CheckCircle2, XCircle, MessageSquare, Send } from 'lucide-react';
import api from '../services/api';

const MentorCard = ({ 
    id, 
    initials, 
    name, 
    title, 
    company, 
    rating = 5.0, 
    mentees = 0, 
    slotsAvailable = 3, 
    expertise = [], 
    description,
    isStudent,
    onRequested,
    isConnected,
    userId
}) => {
    const [isRequesting, setIsRequesting] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRequest = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        
        setLoading(true);
        try {
            await api.post(`/mentorships/${id}/request`, { message });
            alert("Request sent successfully!");
            setIsRequesting(false);
            if (onRequested) onRequested();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to send request.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div 
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="group relative flex flex-col p-6 rounded-[2rem] bg-slate-900 border border-slate-800 hover:border-slate-700 hover:shadow-[0_0_40px_rgba(245,158,11,0.08)] transition-all overflow-hidden"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10 flex gap-4 items-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center border border-slate-700/50 shadow-inner group-hover:border-amber-500/30 transition-colors shrink-0">
                    <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-200 to-white">{initials || name?.charAt(0)}</span>
                </div>
                <div>
                    <h3 className="text-lg font-black text-slate-100 mb-0.5 group-hover:text-white transition-colors">{name}</h3>
                    <p className="text-xs font-bold text-amber-500 uppercase tracking-tight">{title} <span className="text-slate-500">@</span> {company}</p>
                </div>
            </div>

            <div className="relative z-10 flex flex-wrap items-center gap-2 mb-6">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-[10px] font-black uppercase tracking-tighter text-slate-400">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    {rating}
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-[10px] font-black uppercase tracking-tighter text-slate-400">
                    <Users className="w-3 h-3 text-blue-400" />
                    {mentees} Mentees
                </div>
            </div>

            <div className="relative z-10 flex-1 mb-6">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3">Expertise & Focus</p>
                <p className="text-sm text-slate-400 mb-4 line-clamp-3 leading-relaxed">
                    {description || "Experienced professional offering guidance in career growth and technical skills."}
                </p>
                <div className="flex flex-wrap gap-2">
                    {expertise.length > 0 ? expertise.map((skill, index) => (
                        <span key={index} className="px-3 py-1 rounded-lg bg-slate-800/50 border border-slate-700/50 text-[10px] font-bold text-slate-300">
                            {skill}
                        </span>
                    )) : (
                        ['Career Dev', 'Technical Guidance', 'Networking'].map((skill, index) => (
                             <span key={index} className="px-3 py-1 rounded-lg bg-slate-800/50 border border-slate-700/50 text-[10px] font-bold text-slate-300 uppercase tracking-tighter">
                                {skill}
                            </span>
                        ))
                    )}
                </div>
            </div>
            
            <div className="relative z-10 w-full pt-4 border-t border-slate-800/50 mt-auto">
                <AnimatePresence mode="wait">
                    {isConnected ? (
                        <Link 
                            to={`/messages/${userId}`}
                            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
                        >
                            <MessageSquare size={14} /> 
                            Chat Now
                        </Link>
                    ) : !isRequesting ? (
                        <motion.button 
                            key="request-btn"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            disabled={!isStudent}
                            onClick={() => setIsRequesting(true)}
                            className={`w-full py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all ${
                                isStudent 
                                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20' 
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                            }`}
                        >
                            {isStudent ? 'Apply for Mentorship' : 'Students Only'}
                        </motion.button>
                    ) : (
                        <motion.form 
                            key="request-form"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            onSubmit={handleRequest}
                            className="space-y-3"
                        >
                            <textarea 
                                autoFocus
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Why do you want this mentor?"
                                className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500/50 transition-all font-bold resize-none"
                                rows={3}
                            />
                            <div className="flex gap-2">
                                <button 
                                    type="button"
                                    onClick={() => setIsRequesting(false)}
                                    className="flex-1 py-2.5 rounded-lg border border-white/5 bg-slate-800 text-slate-400 font-bold text-[9px] uppercase tracking-widest hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={loading || !message.trim()}
                                    className="flex-1 py-2.5 rounded-lg bg-amber-500 text-slate-950 font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-amber-400 transition-colors"
                                >
                                    {loading ? 'Sending...' : <><Send size={10} /> Send</>}
                                </button>
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default MentorCard;
