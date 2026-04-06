import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AlumniCard from './AlumniCard';
import SearchFilter from './SearchFilter';
import FilterModal from '../components/FilterModal';
import './AlumniDirectory.css';

const AlumniDirectory = () => {
    const [alumni, setAlumni] = useState([]);
    const [filteredAlumni, setFilteredAlumni] = useState([]);
    const [mentorsOnly, setMentorsOnly] = useState(false);
    const [industry, setIndustry] = useState('All Industries');
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const mockAlumni = [
            { id: 1, initials: 'SJ', name: 'Sarah Johnson', title: 'Senior Software Engineer', company: 'Google', location: 'Mountain View, CA', year: 2018, isMentor: true, industry: 'Technology' },
            { id: 2, initials: 'MC', name: 'Michael Chen', title: 'Product Manager', company: 'Microsoft', location: 'Seattle, WA', year: 2015, isMentor: true, industry: 'Technology' },
            { id: 3, initials: 'ER', name: 'Emily Rodriguez', title: 'Marketing Director', company: 'Coca-Cola', location: 'Atlanta, GA', year: 2019, isMentor: false, industry: 'Marketing' },
            { id: 4, initials: 'DK', name: 'David Kim', title: 'Investment Banker', company: 'Goldman Sachs', location: 'New York, NY', year: 2017, isMentor: true, industry: 'Finance' },
            { id: 5, initials: 'JW', name: 'Jessica Wang', title: 'ML Engineer', company: 'Google', location: 'Mountain View, CA', year: 2020, isMentor: true, industry: 'Technology' },
            { id: 6, initials: 'RT', name: 'Robert Taylor', title: 'Engineering Manager', company: 'Apple', location: 'Cupertino, CA', year: 2016, isMentor: false, industry: 'Technology' },
        ];
        setAlumni(mockAlumni);
        setFilteredAlumni(mockAlumni);
    }, []);

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
                        onMentorChange={setMentorsOnly}
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
                        <AlumniCard key={alumnus.id} {...alumnus} />
                    ))}
                </motion.div>
            </motion.div>
        </div>
    );
};

export default AlumniDirectory;
