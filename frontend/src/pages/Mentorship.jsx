import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, UserCheck, Clock, BookOpen, User, ClipboardList, MessageSquare } from 'lucide-react';
import Navbar from '../components/navbar';
import MentorCard from './MentorCard';

const Mentorship = () => {
    const [activeTab, setActiveTab] = useState('find');

    const mentorStats = [
        { label: 'Active Mentors', value: '4', icon: UserCheck, color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20" },
        { label: 'Active Connections', value: '1', icon: Search, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" },
        { label: 'Pending Requests', value: '1', icon: Clock, color: "text-slate-300", bg: "bg-slate-800", border: "border-slate-700" }
    ];

    const mentors = [
        {
            id: 1,
            initials: 'SJ',
            name: 'Sarah Johnson',
            title: 'Senior Software Engineer',
            company: 'Google',
            rating: 4.9,
            mentees: 12,
            slotsAvailable: 2,
            expertise: ['Career Development', 'Technical Skills', 'Interview Prep']
        },
        {
            id: 2,
            initials: 'MC',
            name: 'Michael Chen',
            title: 'Product Manager',
            company: 'Microsoft',
            rating: 4.8,
            mentees: 8,
            slotsAvailable: 1,
            expertise: ['Product Strategy', 'Leadership', 'Entrepreneurship']
        },
        {
            id: 3,
            initials: 'DK',
            name: 'David Kim',
            title: 'Investment Banker',
            company: 'Goldman Sachs',
            rating: 5.0,
            mentees: 5,
            slotsAvailable: 3,
            expertise: ['Finance', 'Investment Banking', 'Career transitions']
        },
        {
            id: 4,
            initials: 'JW',
            name: 'Jessica Wang',
            title: 'ML Engineer',
            company: 'Meta',
            rating: 4.7,
            mentees: 10,
            slotsAvailable: 0,
            expertise: ['Machine Learning', 'Data Science', 'Research']
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    const tabs = [
        { id: 'find', label: 'Find Mentors', icon: Search },
        { id: 'my', label: 'My Mentors', icon: ClipboardList },
        { id: 'requests', label: 'My Requests', icon: MessageSquare }
    ];

    return (
        <div className="min-h-screen bg-slate-950 font-sans text-slate-200">
            <Navbar />
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-7xl mx-auto px-6 lg:px-8 py-10"
            >
                <motion.div variants={itemVariants} className="mb-12 border-b border-slate-800/50 pb-8">
                    <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">Mentorship Program</h1>
                    <p className="text-lg text-slate-400 max-w-2xl font-medium">Connect with experienced alumni who can guide your career journey.</p>
                </motion.div>

                {/* Stats Row */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {mentorStats.map((stat, index) => (
                        <div key={index} className="flex items-center gap-5 p-6 rounded-[2rem] bg-slate-900 border border-slate-800 shadow-xl">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${stat.bg} ${stat.border}`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-white mb-1 tracking-tight">{stat.value}</div>
                                <div className="text-sm font-semibold text-slate-500 tracking-widest uppercase">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Tabs */}
                <motion.div variants={itemVariants} className="flex bg-slate-900 border border-slate-800 p-1.5 rounded-2xl mb-8 w-full max-w-lg">
                    {tabs.map(tab => (
                        <button 
                            key={tab.id}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all relative z-10 ${activeTab === tab.id ? 'text-slate-950' : 'text-slate-400 hover:text-slate-200'}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                            {activeTab === tab.id && (
                                <motion.div 
                                    layoutId="mentorship-tab"
                                    className="absolute inset-0 bg-amber-500 rounded-xl -z-10"
                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                />
                            )}
                        </button>
                    ))}
                </motion.div>

                {/* Content Area */}
                <motion.div variants={itemVariants} className="min-h-[400px]">
                    <AnimatePresence mode="wait">
                        {activeTab === 'find' && (
                            <motion.div 
                                key="find"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {mentors.map(mentor => (
                                    <MentorCard key={mentor.id} {...mentor} />
                                ))}
                            </motion.div>
                        )}
                        
                        {activeTab === 'my' && (
                            <motion.div 
                                key="my"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="flex flex-col items-center justify-center py-20 px-4 text-center bg-slate-900 border border-slate-800 rounded-[2rem]"
                            >
                                <div className="w-20 h-20 bg-slate-950 rounded-full flex items-center justify-center border border-slate-800 mb-6 shadow-inner">
                                  <User className="w-8 h-8 text-slate-700" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">No Mentors Yet</h3>
                                <p className="text-slate-400">You haven't connected with any mentors. Start by finding a mentor in the directory.</p>
                            </motion.div>
                        )}
                        
                        {activeTab === 'requests' && (
                            <motion.div 
                                key="requests"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="flex flex-col items-center justify-center py-20 px-4 text-center bg-slate-900 border border-slate-800 rounded-[2rem]"
                            >
                                <div className="w-20 h-20 bg-slate-950 rounded-full flex items-center justify-center border border-slate-800 mb-6 shadow-inner">
                                  <MessageSquare className="w-8 h-8 text-slate-700" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">No Pending Requests</h3>
                                <p className="text-slate-400">You have no active mentor requests at the moment.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Mentorship;