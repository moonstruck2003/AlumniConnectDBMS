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
    const [filteredAlumni, setFilteredAlumni] = useState([]);
    const [mentorsOnly, setMentorsOnly] = useState(false);
    const [industry, setIndustry] = useState('All Industries');
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAlumni, setSelectedAlumni] = useState(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
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
                setFilteredAlumni(finalAlumni);
            } catch (err) {
                console.error("Failed to fetch alumni", err);
                // Fallback on error
                const defaultAlumni = [
                    { id: 'd1', initials: 'SJ', name: 'Sarah Johnson', title: 'Senior Software Engineer', company: 'Google', location: 'Mountain View, CA', year: 2018, isMentor: true, industry: 'Technology', profile: { first_name: 'Sarah', last_name: 'Johnson', bio: 'Senior Engineer at Google.' }, alumni: { job_title: 'Senior Software Engineer', company: 'Google' }, email: 'sarah@google.com' },
                    { id: 'd2', initials: 'MC', name: 'Michael Chen', title: 'Product Manager', company: 'Microsoft', location: 'Seattle, WA', year: 2015, isMentor: true, industry: 'Technology', profile: { first_name: 'Michael', last_name: 'Chen', bio: 'PM at Microsoft.' }, alumni: { job_title: 'Product Manager', company: 'Microsoft' }, email: 'michael@microsoft.com' },
                ];
                setAlumni(defaultAlumni);
                setFilteredAlumni(defaultAlumni);
            }
        };

        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        fetchAlumni();
    }, [navigate]);

    const applyFilters = () => {
        let filtered = alumni.filter(alumnus => {
            const matchesSearch = alumnus.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                alumnus.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                alumnus.title.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesIndustry = industry === 'All Industries' || alumnus.industry === industry;
            const matchesMentor = mentorsOnly ? alumnus.isMentor : true;

            return matchesSearch && matchesIndustry && matchesMentor;
        });

        setFilteredAlumni(filtered);
        setShowFilterModal(false);
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
        // Apply filters after search term changes
        setTimeout(() => applyFilters(), 0);
    };

    const handleIndustryChange = (selectedIndustry) => {
        setIndustry(selectedIndustry);
    };

    const handleMentorFilter = (checked) => {
        setMentorsOnly(checked);
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
        <div className="min-h-screen bg-slate-950 font-sans text-slate-200">
            <Navbar />
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-7xl mx-auto px-6 lg:px-8 py-10"
            >
                <motion.div variants={itemVariants} className="mb-12 text-center pb-8 border-b border-slate-800/50">
                    <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">Alumni Directory</h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto font-medium">Connect with {alumni.length} alumni from our university network. Filter by industry, or find a mentor.</p>
                </motion.div>

                <motion.div variants={itemVariants} className="mb-8">
                    <SearchFilter onSearch={handleSearch} onFilterClick={() => setShowFilterModal(true)} />
                </motion.div>

                {showFilterModal && (
                    <FilterModal
                        industry={industry}
                        mentorsOnly={mentorsOnly}
                        onIndustryChange={handleIndustryChange}
                        onMentorChange={handleMentorFilter}
                        onApply={applyFilters}
                        onClose={() => setShowFilterModal(false)}
                    />
                )}

                <motion.div variants={itemVariants} className="flex justify-between items-center mb-6 px-1">
                    <div className="text-sm font-bold text-slate-400 bg-slate-900 border border-slate-800 rounded-full px-5 py-2 shadow-inner">
                        Showing <span className="text-amber-500">{filteredAlumni.length}</span> of {alumni.length} results
                    </div>
                </motion.div>

                <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAlumni.map(alumnus => (
                        <AlumniCard 
                            key={alumnus.id} 
                            {...alumnus} 
                            onViewProfile={handleViewProfile}
                        />
                    ))}
                </motion.div>
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
