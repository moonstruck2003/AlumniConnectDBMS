import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  UserCheck, 
  Clock, 
  BookOpen, 
  User, 
  ClipboardList, 
  MessageSquare,
  TrendingUp,
  Inbox,
  Check,
  X,
  Briefcase
} from 'lucide-react';
import Navbar from '../components/Navbar';
import MentorCard from './MentorCard';
import authService from '../services/authService';
import api from '../services/api';

const Mentorship = () => {
    const [activeTab, setActiveTab] = useState('find');
    const [listings, setListings] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    
    // Auth context
    const user = authService.getCurrentUser();
    const isStudent = user?.role === 'student';
    const isAlumni = user?.role === 'alumni';

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'find') {
                const data = await api.get('/mentorships');
                setListings(data);
            } else if (activeTab === 'sent') {
                const data = await api.get('/mentorships/sent');
                setRequests(data);
            } else if (activeTab === 'incoming') {
                const data = await api.get('/mentorships/incoming');
                setRequests(data);
            }
        } catch (err) {
            console.error("Failed to fetch data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        fetchData();
    }, [navigate, activeTab]);

    const handleStatusUpdate = async (requestId, status) => {
        try {
            await api.post(`/mentorship-requests/${requestId}/status`, { status });
            alert(`Request marked as ${status}`);
            fetchData(); // Refresh list
        } catch (err) {
            alert("Failed to update status.");
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    const tabs = [
        { id: 'find', label: 'Explore Mentors', icon: Search },
        ...(isStudent ? [{ id: 'sent', label: 'My Sent Requests', icon: MessageSquare }] : []),
        ...(isAlumni ? [
            { id: 'incoming', label: 'Incoming Requests', icon: Inbox },
            { id: 'manage', label: 'Active Mentees', icon: UserCheck }
        ] : [])
    ];

    return (
        <div className="min-h-screen bg-[#070b14] font-sans text-slate-200">
            <Navbar user={user} />
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-24"
            >
                <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 border-b border-white/5 pb-12 gap-8">
                    <div>
                        <motion.h1 
                           variants={itemVariants} 
                           className="text-5xl lg:text-7xl font-black tracking-tighter text-white mb-6 uppercase leading-none italic"
                        >
                           Mentorship<br /><span className="text-amber-500 not-italic">Program</span>
                        </motion.h1>
                        <motion.p variants={itemVariants} className="text-xs font-bold text-slate-500 uppercase tracking-[0.4em] max-w-xl">
                           Bridging the gap between academic theory and industry reality through direct alumni connections.
                        </motion.p>
                    </div>

                    <motion.div variants={itemVariants} className="flex bg-slate-900/40 border border-white/5 p-1.5 rounded-[2rem] w-full lg:max-w-md shadow-2xl backdrop-blur-xl">
                        {tabs.map(tab => (
                            <button 
                                key={tab.id}
                                className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all relative z-10 ${activeTab === tab.id ? 'text-slate-950' : 'text-slate-500 hover:text-white'}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                                {activeTab === tab.id && (
                                    <motion.div 
                                        layoutId="mentorship-tab"
                                        className="absolute inset-0 bg-amber-500 rounded-[1.5rem] -z-10"
                                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                    />
                                )}
                            </button>
                        ))}
                    </motion.div>
                </div>

                {/* Content Area */}
                <motion.div variants={itemVariants} className="min-h-[400px]">
                    {loading ? (
                       <div className="flex items-center justify-center h-64">
                         <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
                       </div>
                    ) : (
                      <AnimatePresence mode="wait">
                        {activeTab === 'find' && (
                            <motion.div 
                                key="find"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                            >
                                {listings.map(mentor => (
                                    <MentorCard 
                                      key={mentor.listing_id} 
                                      id={mentor.listing_id}
                                      name={`${mentor.alumni?.user?.profile?.first_name} ${mentor.alumni?.user?.profile?.last_name}`}
                                      initials={`${mentor.alumni?.user?.profile?.first_name?.charAt(0)}${mentor.alumni?.user?.profile?.last_name?.charAt(0)}`}
                                      title={mentor.alumni?.job_title}
                                      company={mentor.alumni?.company}
                                      description={mentor.description}
                                      expertise={['Mentorship', 'Career Growth']}
                                      isStudent={isStudent}
                                    />
                                ))}
                                {listings.length === 0 && (
                                   <div className="col-span-full py-32 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
                                      <TrendingUp className="w-12 h-12 text-slate-800 mx-auto mb-6" />
                                      <p className="text-sm font-bold text-slate-500 uppercase tracking-widest leading-relaxed">No alumni are currently offering mentorship.<br />Check back later!</p>
                                   </div>
                                )}
                            </motion.div>
                        )}
                        
                        {(activeTab === 'sent' || activeTab === 'incoming') && (
                            <motion.div 
                                key="requests-list"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex flex-col gap-6"
                            >
                                {requests.map(req => (
                                    <div key={req.request_id} className="p-8 rounded-[2.5rem] bg-slate-900/40 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-8 hover:bg-slate-900/60 transition-all group">
                                        <div className="flex gap-6 items-center">
                                            <div className="w-16 h-16 rounded-[1.5rem] bg-slate-800 flex items-center justify-center border border-white/5 shrink-0 group-hover:border-amber-500/20 transition-all shadow-inner">
                                                <User className="w-6 h-6 text-slate-600" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                   <h4 className="text-xl font-black text-white italic">
                                                        {activeTab === 'sent' 
                                                         ? `${req.listing?.alumni?.user?.profile?.first_name} ${req.listing?.alumni?.user?.profile?.last_name}`
                                                         : `${req.student?.user?.profile?.first_name} ${req.student?.user?.profile?.last_name}`
                                                        }
                                                   </h4>
                                                   <span className={`px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] border ${
                                                      req.status === 'Pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                                      req.status === 'Accepted' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                      'bg-red-500/10 text-red-500 border-red-500/20'
                                                   }`}>
                                                      {req.status}
                                                   </span>
                                                </div>
                                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                                                   {activeTab === 'sent' ? 'Request to Alumni' : 'Request from Student'} • {new Date(req.created_at).toLocaleDateString()}
                                                </p>
                                                <div className="p-5 rounded-2xl bg-slate-950/50 border border-white/5 max-w-lg">
                                                   <p className="text-xs text-slate-400 leading-relaxed font-medium">"{req.message || 'No message provided.'}"</p>
                                                </div>
                                            </div>
                                        </div>

                                        {activeTab === 'incoming' && req.status === 'Pending' && (
                                           <div className="flex gap-3 shrink-0">
                                              <button 
                                                onClick={() => handleStatusUpdate(req.request_id, 'Rejected')}
                                                className="w-12 h-12 rounded-xl border border-red-500/10 bg-red-500/5 text-red-500 flex items-center justify-center hover:bg-red-500/10 transition-all"
                                              >
                                                 <X size={18} />
                                              </button>
                                              <button 
                                                onClick={() => handleStatusUpdate(req.request_id, 'Accepted')}
                                                className="px-8 h-12 rounded-xl bg-emerald-500 text-slate-950 font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-emerald-400 shadow-xl shadow-emerald-500/20 transition-all"
                                              >
                                                 <Check size={14} /> Accept Request
                                              </button>
                                           </div>
                                        )}
                                        {activeTab === 'incoming' && req.status !== 'Pending' && (
                                           <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest border border-white/5 px-6 py-3 rounded-xl bg-slate-950/20">
                                              Request Actioned
                                           </div>
                                        )}
                                    </div>
                                ))}
                                {requests.length === 0 && (
                                   <div className="py-32 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
                                      <Inbox className="w-12 h-12 text-slate-800 mx-auto mb-6" />
                                      <p className="text-sm font-bold text-slate-500 uppercase tracking-widest leading-relaxed">No {activeTab} mentorship requests found.</p>
                                   </div>
                                )}
                            </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Mentorship;
