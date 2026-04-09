import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AlumniCard from './AlumniCard';
import SearchFilter from './SearchFilter';
import FilterModal from '../components/FilterModal';
import AlumniProfileModal from '../components/AlumniProfileModal';
import alumniService from '../services/alumniService';
import './AlumniDirectory.css';

const AlumniDirectory = () => {
    const [alumni, setAlumni] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAlumni, setSelectedAlumni] = useState(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAlumni = async () => {
            try {
                const response = await alumniService.getAllAlumni();
                // Map DB structure to frontend props
                const mappedAlumni = response.alumni.map(item => ({
                    id: item.user_id,
                    initials: `${item.profile?.first_name?.[0] || 'A'}${item.profile?.last_name?.[0] || 'M'}`,
                    name: `${item.profile?.first_name || 'Alumni'} ${item.profile?.last_name || 'Member'}`,
                    title: item.alumni?.job_title || 'Professional',
                    company: item.alumni?.company || 'N/A',
                    location: 'Network Node',
                    year: '2020+', 
                    isMentor: !!item.alumni?.is_accepting_mentee,
                    industry: 'Technology',
                    profile: item.profile,
                    alumni: item.alumni,
                    email: item.email
                }));

                const defaultAlumni = [
                    { id: 'd1', initials: 'SJ', name: 'Sarah Johnson', title: 'Senior Software Engineer', company: 'Google', location: 'Mountain View, CA', year: 2018, isMentor: true, industry: 'Technology', profile: { first_name: 'Sarah', last_name: 'Johnson', bio: 'Senior Engineer at Google.' }, alumni: { job_title: 'Senior Software Engineer', company: 'Google' }, email: 'sarah@google.com' },
                    { id: 'd2', initials: 'MC', name: 'Michael Chen', title: 'Product Manager', company: 'Microsoft', location: 'Seattle, WA', year: 2015, isMentor: true, industry: 'Technology', profile: { first_name: 'Michael', last_name: 'Chen', bio: 'PM at Microsoft.' }, alumni: { job_title: 'Product Manager', company: 'Microsoft' }, email: 'michael@microsoft.com' },
                ];

                const finalAlumni = mappedAlumni.length > 0 ? mappedAlumni : defaultAlumni;

                setAlumni(finalAlumni);
            } catch (err) {
                console.error("Failed to fetch alumni", err);
                // Fallback on error
                const defaultAlumni = [
                    { id: 'd1', initials: 'SJ', name: 'Sarah Johnson', title: 'Senior Software Engineer', company: 'Google', location: 'Mountain View, CA', year: 2018, isMentor: true, industry: 'Technology', profile: { first_name: 'Sarah', last_name: 'Johnson', bio: 'Senior Engineer at Google.' }, alumni: { job_title: 'Senior Software Engineer', company: 'Google' }, email: 'sarah@google.com' },
                    { id: 'd2', initials: 'MC', name: 'Michael Chen', title: 'Product Manager', company: 'Microsoft', location: 'Seattle, WA', year: 2015, isMentor: true, industry: 'Technology', profile: { first_name: 'Michael', last_name: 'Chen', bio: 'PM at Microsoft.' }, alumni: { job_title: 'Product Manager', company: 'Microsoft' }, email: 'michael@microsoft.com' },
                ];
                setAlumni(defaultAlumni);
            } finally {
                setLoading(false);
            }
        };

        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        fetchAlumni();
    }, [navigate]);

    const filteredAlumni = React.useMemo(() => {
        return alumni.filter(alumnus => {
            const matchesSearch = alumnus.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                alumnus.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                alumnus.title.toLowerCase().includes(searchTerm.toLowerCase());

            return matchesSearch;
        });
    }, [alumni, searchTerm]);

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const handleViewProfile = (id) => {
        const selected = alumni.find(a => a.id === id);
        if (selected) {
            setSelectedAlumni(selected);
            setIsProfileOpen(true);
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

    return (
        <div className="min-h-screen bg-slate-950 font-sans text-slate-200 selection:bg-blue-500/30">
            <Navbar />
            
            {/* Standardized Hero & Search Section */}
            <section className="relative pt-24 pb-12 overflow-hidden border-b border-slate-800/50">
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-blue-600/5 via-transparent to-transparent pointer-events-none" />
                
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-4 mb-12"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] font-black tracking-[0.3em] uppercase">
                            <Users className="w-3.5 h-3.5" />
                            Alumni Network
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white uppercase italic">
                            The Alumni <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-teal-400">Directory</span>
                        </h1>
                        <p className="text-base text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
                            Connect with {alumni.length} elite graduates from our university network.
                        </p>
                    </motion.div>

                    {/* Unified Search Bar */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="flex flex-col md:flex-row items-center gap-4 p-2 rounded-[2.5rem] bg-slate-900/30 backdrop-blur-3xl border border-white/5 shadow-2xl max-w-2xl mx-auto group/search focus-within:border-blue-500/50 transition-all"
                    >
                        <div className="flex-1 flex items-center gap-3 px-6 py-3">
                            <Search className="w-5 h-5 text-slate-500 group-focus-within/search:text-blue-500 transition-colors" />
                            <input 
                                type="text" 
                                placeholder="Search by name, company, or role..." 
                                className="w-full bg-transparent border-none outline-none text-lg placeholder-slate-700 font-semibold"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-7xl mx-auto px-6 lg:px-8 py-10"
            >
                <div className="flex items-center justify-between mb-10 px-1">
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                        Showing <span className="text-blue-400">{filteredAlumni.length}</span> Members
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-40">
                        <div className="w-12 h-12 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin" />
                    </div>
                ) : (
                    <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredAlumni.map(alumnus => (
                            <AlumniCard 
                                key={alumnus.id} 
                                {...alumnus} 
                                onViewProfile={handleViewProfile}
                            />
                        ))}
                    </motion.div>
                )}
            </motion.div>

            <AlumniProfileModal 
                alumni={selectedAlumni}
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
            />
        </div>
    );
};

export default AlumniDirectory;
