import React from 'react';
import { motion } from 'framer-motion';
import { Star, Users, CheckCircle2, XCircle } from 'lucide-react';

const MentorCard = ({ initials, name, title, company, rating, mentees, slotsAvailable, expertise }) => {
    return (
        <motion.div 
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="group relative flex flex-col p-6 rounded-[2rem] bg-slate-900 border border-slate-800 hover:border-slate-700 hover:shadow-[0_0_40px_rgba(245,158,11,0.08)] transition-all cursor-pointer overflow-hidden"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10 flex gap-4 items-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center border border-slate-700/50 shadow-inner group-hover:border-amber-500/30 transition-colors shrink-0">
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-200 to-white">{initials}</span>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-100 mb-0.5 group-hover:text-white transition-colors">{name}</h3>
                    <p className="text-xs font-semibold text-amber-500">{title} <span className="text-slate-500">@</span> {company}</p>
                </div>
            </div>

            <div className="relative z-10 flex flex-wrap items-center gap-2 mb-6">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-xs font-medium text-slate-300">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    {rating}
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-xs font-medium text-slate-300">
                    <Users className="w-3.5 h-3.5 text-blue-400" />
                    {mentees} mentees
                </div>
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${slotsAvailable > 0 ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"}`}>
                    {slotsAvailable > 0 ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    {slotsAvailable > 0 ? `${slotsAvailable} slots` : 'Full'}
                </div>
            </div>

            <div className="relative z-10 flex-1 mb-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Expertise</p>
                <div className="flex flex-wrap gap-2">
                    {expertise.map((skill, index) => (
                        <span key={index} className="px-3 py-1 rounded-lg bg-slate-800/50 border border-slate-700/50 text-xs font-medium text-slate-300">
                            {skill}
                        </span>
                    ))}
                </div>
            </div>
            
            <div className="relative z-10 w-full pt-4 border-t border-slate-800 mt-auto">
                <button 
                    disabled={slotsAvailable === 0}
                    className={`w-full py-3 rounded-xl font-semibold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 ${
                        slotsAvailable > 0 
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]' 
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                    }`}
                >
                    {slotsAvailable > 0 ? 'Request Mentorship' : 'Currently Unavailable'}
                </button>
            </div>
        </motion.div>
    );
};

export default MentorCard;