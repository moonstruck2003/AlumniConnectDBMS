import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
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

    useEffect(() => {
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

    return (
        <>
            <Navbar />
            <div className="alumni-directory-container">
                <div className="alumni-directory-header">
                    <h1>Alumni Directory</h1>
                    <p>Connect with {alumni.length} alumni from our university</p>
                </div>

                <div className="alumni-directory-filters">
                    <SearchFilter onSearch={handleSearch} onFilterClick={() => setShowFilterModal(true)} />
                </div>

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

                <div className="alumni-count">
                    Showing {filteredAlumni.length} of {alumni.length} alumni
                </div>

                <div className="alumni-grid">
                    {filteredAlumni.map(alumnus => (
                        <AlumniCard key={alumnus.id} {...alumnus} />
                    ))}
                </div>
            </div>
        </>
    );
};

export default AlumniDirectory;