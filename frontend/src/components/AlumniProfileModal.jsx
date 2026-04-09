import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Briefcase, MapPin, GraduationCap, Link as LinkIcon, Mail, User, Info } from 'lucide-react';

const AlumniProfileModal = ({ alumni, isOpen, onClose }) => {
    if (!alumni) return null;

    const { first_name, last_name, bio, linkedin_url } = alumni.profile || {};
    const { company, job_title } = alumni.alumni || {};
    const name = `${first_name || 'Alumni'} ${last_name || 'Member'}`;
    const initials = `${first_name?.[0] || 'A'}${last_name?.[0] || 'M'}`;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden"
                    >
                        {/* Header/Close */}
                        <div className="absolute top-6 right-6 z-20">
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Top Visual Section */}
                        <div className="h-32 bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-teal-600/20 border-b border-slate-800" />

                        <div className="px-8 pb-10">
                            <div className="relative flex items-end gap-6 -mt-12 mb-8">
                                <div className="w-24 h-24 rounded-3xl bg-slate-900 border-4 border-slate-950 shadow-2xl flex items-center justify-center overflow-hidden">
                                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center text-3xl font-bold text-white uppercase">
                                        {initials}
                                    </div>
                                </div>
                                <div className="pb-2">
                                    <h2 className="text-3xl font-black text-white">{name}</h2>
                                    <p className="text-blue-400 font-bold tracking-wide uppercase text-xs">{job_title || 'Professional'}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Left Column: Info Cards */}
                                <div className="space-y-4">
                                    <div className="p-5 rounded-2xl bg-slate-800/30 border border-slate-700/50">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4 flex items-center gap-2">
                                            <Info className="w-3 h-3 text-blue-400" /> Professional Details
                                        </h4>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4 text-slate-300">
                                                <Briefcase className="w-4 h-4 text-slate-500" />
                                                <span className="text-sm font-medium">{company || 'Self-Employed'}</span>
                                            </div>
                                            <div className="flex items-center gap-4 text-slate-300">
                                                <MapPin className="w-4 h-4 text-slate-500" />
                                                <span className="text-sm font-medium">Remote / Flexible</span>
                                            </div>
                                            <div className="flex items-center gap-4 text-slate-300">
                                                <Mail className="w-4 h-4 text-slate-500" />
                                                <span className="text-sm font-medium">{alumni.email}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {linkedin_url && (
                                        <a 
                                            href={linkedin_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block p-5 rounded-2xl bg-blue-600/10 border border-blue-500/20 hover:bg-blue-600/20 transition-all group"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <LinkIcon className="w-4 h-4 text-blue-400" />
                                                    <span className="text-sm font-bold text-blue-300">LinkedIn Profile</span>
                                                </div>
                                                <div className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                                                    <LinkIcon className="w-3 h-3 text-blue-200" />
                                                </div>
                                            </div>
                                        </a>
                                    )}
                                </div>

                                {/* Right Column: Bio/Extra */}
                                <div className="flex flex-col">
                                    <div className="flex-1 p-6 rounded-3xl bg-slate-800/30 border border-slate-700/50">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4 flex items-center gap-2">
                                            <User className="w-3 h-3 text-amber-500" /> About
                                        </h4>
                                        <p className="text-slate-300 text-sm leading-relaxed font-medium">
                                            {bio || "This alumnus hasn't provided a bio yet. They are part of our growing network of professionals willing to connect and share experiences."}
                                        </p>
                                    </div>
                                    
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="mt-6 w-full py-4 bg-white text-slate-950 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-white/5 hover:bg-slate-100 transition-all"
                                    >
                                        Connect via Chat
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AlumniProfileModal;
