import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, GraduationCap } from 'lucide-react';

const AlumniCard = ({ initials, name, title, company, location, year, isMentor }) => {
    return (
        <motion.div 
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="group relative flex flex-col p-6 rounded-[2rem] bg-slate-900 border border-slate-800 hover:border-slate-700 hover:shadow-[0_0_40px_rgba(59,130,246,0.08)] transition-all cursor-pointer overflow-hidden"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10 flex justify-between items-start mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center border border-slate-700/50 shadow-inner group-hover:border-blue-500/30 transition-colors">
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-200 to-white">{initials}</span>
                </div>
                {isMentor && (
                    <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full">
                        Mentor
                    </div>
                )}
            </div>
            
            <div className="relative z-10 flex-1">
                <h3 className="text-xl font-bold text-slate-100 mb-1 group-hover:text-white transition-colors">{name}</h3>
                <p className="text-sm font-semibold text-blue-400 mb-6">{title}</p>
                
                <div className="flex flex-col gap-3 text-sm text-slate-400 mb-8 font-medium">
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800/80 text-slate-500 group-hover:text-amber-400 transition-colors">
                            <Briefcase className="w-3.5 h-3.5" />
                        </div>
                        <span>{company}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800/80 text-slate-500 group-hover:text-amber-400 transition-colors">
                            <MapPin className="w-3.5 h-3.5" />
                        </div>
                        <span>{location}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800/80 text-slate-500 group-hover:text-amber-400 transition-colors">
                            <GraduationCap className="w-3.5 h-3.5" />
                        </div>
                        <span>Class of {year}</span>
                    </div>
                </div>
            </div>
            
            <div className="relative z-10 w-full pt-4 border-t border-slate-800 flex justify-end mt-auto">
                <button className="px-5 py-2 rounded-xl font-semibold text-xs uppercase tracking-widest text-slate-300 hover:text-slate-950 hover:bg-white transition-colors border border-slate-700 hover:border-white">
                    View Profile
                </button>
            </div>
        </motion.div>
    );
};

export default AlumniCard;
