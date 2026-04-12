import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, 
    ShieldCheck, 
    ShieldAlert, 
    Search, 
    Filter, 
    CheckCircle2, 
    XCircle, 
    LogOut,
    UserCircle,
    GraduationCap,
    Briefcase,
    Activity,
    Lock,
    Trash2,
    Calendar,
    Award
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import adminService from '../services/adminService';

const AdminDashboard = () => {
    const [data, setData] = React.useState({ 
        student: [], alumni: [], recruiter: [],
        job: [], mentorship: [], event: []
    });
    const [activeTab, setActiveTab] = React.useState('student');
    const [loading, setLoading] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState('');
    const navigate = useNavigate();

    const fetchAllData = async () => {
        setLoading(true);
        console.log('Initiating global data sync...');
        try {
            // We use individual await to pinpoint if one hangs, but Promise.all is faster
            // Let's stick with Promise.all but add individual error boundaries
            const results = await Promise.allSettled([
                adminService.getUsers(),
                adminService.getJobs(),
                adminService.getEvents(),
                adminService.getMentorships()
            ]);

            const [usersRes, jobsRes, eventsRes, mentorshipsRes] = results;

            const newData = {
                student: usersRes.status === 'fulfilled' ? (usersRes.value.student || []) : [],
                alumni: usersRes.status === 'fulfilled' ? (usersRes.value.alumni || []) : [],
                recruiter: usersRes.status === 'fulfilled' ? (usersRes.value.recruiter || []) : [],
                job: jobsRes.status === 'fulfilled' ? (jobsRes.value || []) : [],
                event: eventsRes.status === 'fulfilled' ? (eventsRes.value || []) : [],
                mentorship: mentorshipsRes.status === 'fulfilled' ? (mentorshipsRes.value || []) : []
            };

            console.log('Sync complete. Results:', {
                users: usersRes.status,
                jobs: jobsRes.status,
                events: eventsRes.status,
                mentorships: mentorshipsRes.status
            });

            setData(newData);
        } catch (err) {
            console.error('Critical sync failure:', err);
            if (err.response?.status === 403) navigate('/admin');
        } finally {
            setLoading(false);
            console.log('Loader released.');
        }
    };

    React.useEffect(() => {
        fetchAllData();
    }, []);

    const handleVerify = async (userId) => {
        try {
            await adminService.toggleVerification(userId);
            fetchAllData();
        } catch (err) {
            console.log('Verification toggle failed', err);
        }
    };

    const handleDelete = async (id, type) => {
        if (!window.confirm(`Are you sure you want to remove this ${type}?`)) return;
        
        try {
            if (type === 'job') await adminService.deleteJob(id);
            if (type === 'event') await adminService.deleteEvent(id);
            if (type === 'mentorship') await adminService.deleteMentorship(id);
            fetchAllData();
        } catch (err) {
            console.error(`Deletion failed for ${type}`, err);
        }
    };

    const filteredItems = React.useMemo(() => {
        const currentData = data[activeTab] || [];
        if (!searchTerm) return currentData;
        const searchLower = searchTerm.toLowerCase();

        return currentData.filter(item => {
            if (['student', 'alumni', 'recruiter'].includes(activeTab)) {
                return (item.profile?.first_name + ' ' + item.profile?.last_name).toLowerCase().includes(searchLower) ||
                       item.email.toLowerCase().includes(searchLower);
            }
            if (activeTab === 'job') {
                return item.job_title?.toLowerCase().includes(searchLower) || item.company_name?.toLowerCase().includes(searchLower);
            }
            if (activeTab === 'event') {
                return item.title?.toLowerCase().includes(searchLower) || item.location?.toLowerCase().includes(searchLower);
            }
            if (activeTab === 'mentorship') {
                const alumniName = (item.alumni?.user?.profile?.first_name + ' ' + item.alumni?.user?.profile?.last_name).toLowerCase();
                return alumniName.includes(searchLower) || item.description?.toLowerCase().includes(searchLower);
            }
            return false;
        });
    }, [data, activeTab, searchTerm]);

    const tabs = [
        { id: 'student', label: 'Students', icon: GraduationCap, color: 'text-blue-400', bg: 'bg-blue-400/10' },
        { id: 'alumni', label: 'Alumni', icon: CheckCircle2, color: 'text-amber-400', bg: 'bg-amber-400/10' },
        { id: 'recruiter', label: 'Recruiters', icon: Briefcase, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
        { id: 'job', label: 'Jobs', icon: Briefcase, color: 'text-rose-400', bg: 'bg-rose-400/10' },
        { id: 'mentorship', label: 'Mentorships', icon: Award, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
        { id: 'event', label: 'Events', icon: Calendar, color: 'text-orange-400', bg: 'bg-orange-400/10' }
    ];

    return (
        <div className="min-h-screen bg-[#020617] text-slate-300 font-outfit p-6 lg:p-10">
            {/* Header */}
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 bg-slate-900/40 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] shadow-2xl relative">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center">
                        <Lock className="w-8 h-8 text-red-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight">System Admin</h1>
                        <p className="text-slate-500 mt-1 font-medium tracking-wide uppercase text-[10px]">Secure Console v2.1</p>
                    </div>
                </div>

                <div className="flex gap-4">
                     <button onClick={fetchAllData} className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                        <Activity className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
                     </button>
                    <button onClick={() => { adminService.logout(); navigate('/admin'); }} className="px-6 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                        <LogOut className="w-4 h-4" /> Exit
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-xl">
                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-6 px-4">Entity Classes</h3>
                        <div className="space-y-2">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all font-bold ${activeTab === tab.id ? 'bg-white/10 text-white border border-white/10 shadow-lg' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5 border border-transparent'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${tab.bg} border border-white/5`}>
                                            <tab.icon className={`w-4 h-4 ${tab.color}`} />
                                        </div>
                                        {tab.label}
                                    </div>
                                    <span className="text-[10px] bg-slate-950 px-2 py-1 rounded-full border border-white/5 opacity-50">{data[tab.id]?.length || 0}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-3 space-y-8">
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Quantum scan directory..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl py-4 px-12 text-white placeholder:text-slate-600 focus:outline-none focus:border-red-500/50 transition-all shadow-xl"
                        />
                        <Search className="absolute left-4 top-4.5 w-5 h-5 text-slate-600" />
                    </div>

                    <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden min-h-[500px]">
                        <div className="p-8 border-b border-white/5 flex items-center justify-between">
                             <h2 className="text-xl font-black text-white tracking-tight uppercase">{activeTab} Repository</h2>
                             <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${loading ? 'bg-amber-500 animate-bounce' : 'bg-emerald-500'}`} />
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{loading ? 'Syncing...' : 'Connected'}</span>
                             </div>
                        </div>

                        <div className="overflow-x-auto p-4">
                            <table className="w-full border-separate border-spacing-y-4">
                                <thead>
                                    {['student', 'alumni', 'recruiter'].includes(activeTab) && (
                                        <tr className="text-left text-xs font-black text-slate-600 uppercase tracking-[0.2em]">
                                            <th className="px-6 py-4">Identity</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4">Joined</th>
                                            <th className="px-6 py-4 text-right">Verification</th>
                                        </tr>
                                    )}
                                    {activeTab === 'job' && (
                                        <tr className="text-left text-xs font-black text-slate-600 uppercase tracking-[0.2em]">
                                            <th className="px-6 py-4">Position</th>
                                            <th className="px-6 py-4">Corporate</th>
                                            <th className="px-6 py-4">Authority</th>
                                            <th className="px-6 py-4 text-right">Command</th>
                                        </tr>
                                    )}
                                    {activeTab === 'event' && (
                                        <tr className="text-left text-xs font-black text-slate-600 uppercase tracking-[0.2em]">
                                            <th className="px-6 py-4">Event</th>
                                            <th className="px-6 py-4">Space/Time</th>
                                            <th className="px-6 py-4 text-right">Command</th>
                                        </tr>
                                    )}
                                    {activeTab === 'mentorship' && (
                                        <tr className="text-left text-xs font-black text-slate-600 uppercase tracking-[0.2em]">
                                            <th className="px-6 py-4">Mentor</th>
                                            <th className="px-6 py-4">Descriptor</th>
                                            <th className="px-6 py-4 text-right">Command</th>
                                        </tr>
                                    )}
                                </thead>
                                <tbody>
                                    <AnimatePresence mode="wait">
                                        {loading ? (
                                            <motion.tr key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                                <td colSpan="4" className="py-32 text-center text-xs font-black text-indigo-500 tracking-[0.5em] animate-pulse">ESTABLISHING DATA STREAM...</td>
                                            </motion.tr>
                                        ) : filteredItems.map((item, idx) => (
                                            <motion.tr 
                                                key={item.user_id || item.job_id || item.event_id || item.listing_id || idx}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0 }}
                                                className="group hover:bg-white/[0.03] transition-colors"
                                            >
                                                {['student', 'alumni', 'recruiter'].includes(activeTab) && (
                                                    <>
                                                        <td className="px-6 py-4 rounded-l-2xl border-l border-y border-white/5">
                                                            <div className="font-bold text-white">{item.profile?.first_name} {item.profile?.last_name}</div>
                                                            <div className="text-[10px] text-slate-600 font-mono italic">{item.email}</div>
                                                        </td>
                                                        <td className="px-6 py-4 border-y border-white/5">
                                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black border ${item.is_verified ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20 shadow-[0_0_10px_rgba(52,211,153,0.1)]' : 'bg-amber-400/10 text-amber-500 border-amber-400/20'}`}>
                                                                {item.is_verified ? 'STATUS_CORE_VERIFIED' : 'STATUS_PENDING_REVIEW'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 border-y border-white/5 text-[10px] font-mono text-slate-600">{new Date(item.created_at).toLocaleDateString()}</td>
                                                        <td className="px-6 py-4 rounded-r-2xl border-r border-y border-white/5 text-right">
                                                            <button 
                                                                onClick={() => handleVerify(item.user_id)}
                                                                className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${item.is_verified ? 'bg-amber-600/10 text-amber-500 hover:bg-amber-600 hover:text-white border border-amber-600/20' : 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20'}`}
                                                            >
                                                                {item.is_verified ? 'REVOKE' : 'VERIFY'}
                                                            </button>
                                                        </td>
                                                    </>
                                                )}

                                                {activeTab === 'job' && (
                                                    <>
                                                        <td className="px-6 py-4 rounded-l-2xl border-l border-y border-white/5">
                                                            <div className="font-bold text-white uppercase tracking-tighter">{item.job_title}</div>
                                                            <div className="text-[10px] text-slate-600">{item.job_type}</div>
                                                        </td>
                                                        <td className="px-6 py-4 border-y border-white/5 text-slate-400 font-bold">{item.company_name}</td>
                                                        <td className="px-6 py-4 border-y border-white/5 text-[9px] font-black text-slate-500 uppercase tracking-widest">{item.recruiter?.user?.profile?.first_name} {item.recruiter?.user?.profile?.last_name}</td>
                                                        <td className="px-6 py-4 rounded-r-2xl border-r border-y border-white/5 text-right">
                                                            <button onClick={() => handleDelete(item.job_id, 'job')} className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-600 hover:text-white transition-all border border-red-500/20"><Trash2 size={14}/></button>
                                                        </td>
                                                    </>
                                                )}

                                                {activeTab === 'event' && (
                                                    <>
                                                        <td className="px-6 py-4 rounded-l-2xl border-l border-y border-white/5 font-bold text-white uppercase">{item.title}</td>
                                                        <td className="px-6 py-4 border-y border-white/5">
                                                            <div className="text-slate-400 text-xs font-medium">{item.location}</div>
                                                            <div className="text-[9px] font-mono text-slate-600 uppercase">{new Date(item.date).toDateString()}</div>
                                                        </td>
                                                        <td className="px-6 py-4 rounded-r-2xl border-r border-y border-white/5 text-right">
                                                            <button onClick={() => handleDelete(item.event_id, 'event')} className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-600 hover:text-white transition-all border border-red-500/20"><Trash2 size={14}/></button>
                                                        </td>
                                                    </>
                                                )}

                                                {activeTab === 'mentorship' && (
                                                    <>
                                                        <td className="px-6 py-4 rounded-l-2xl border-l border-y border-white/5">
                                                            <div className="font-bold text-white">{item.alumni?.user?.profile?.first_name} {item.alumni?.user?.profile?.last_name}</div>
                                                            <div className="text-[10px] text-slate-600 uppercase tracking-tighter italic">{item.alumni?.job_title} @ {item.alumni?.company}</div>
                                                        </td>
                                                        <td className="px-6 py-4 border-y border-white/5">
                                                            <div className="text-xs text-slate-500 line-clamp-1 italic italic-font">"{item.description}"</div>
                                                        </td>
                                                        <td className="px-6 py-4 rounded-r-2xl border-r border-y border-white/5 text-right">
                                                            <button onClick={() => handleDelete(item.listing_id, 'mentorship')} className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-600 hover:text-white transition-all border border-red-500/20"><Trash2 size={14}/></button>
                                                        </td>
                                                    </>
                                                )}
                                            </motion.tr>
                                        )) }
                                    </AnimatePresence>
                                </tbody>
                            </table>
                            {!loading && filteredItems.length === 0 && (
                                <div className="py-24 text-center">
                                    <div className="text-slate-600 font-black uppercase tracking-[0.5em] opacity-20 text-xs mb-2">VOID_DIRECTORY_EXCEPTION</div>
                                    <div className="text-slate-500 text-[10px] font-medium uppercase tracking-widest">No active records found in this repository class</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
