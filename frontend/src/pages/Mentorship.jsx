import React, { useState } from 'react';
import Navbar from '../components/navbar';
import MentorCard from './MentorCard';
import './Mentorship.css';

const Mentorship = () => {
    const [activeTab, setActiveTab] = useState('find');

    const mentorStats = [
        { label: 'Active Mentors', value: '4', icon: '👤' },
        { label: 'Active Connections', value: '1', icon: '✓' },
        { label: 'Pending Requests', value: '1', icon: '⏱' }
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

    return (
        <>
            <Navbar />
            <div className="mentorship-container">
                <div className="mentorship-header">
                    <h1>Mentorship Program</h1>
                    <p>Connect with experienced alumni who can guide your career journey</p>
                </div>

                <div className="mentorship-stats">
                    {mentorStats.map((stat, index) => (
                        <div key={index} className="stat-card">
                            <span className="stat-icon">{stat.icon}</span>
                            <div className="stat-content">
                                <div className="stat-value">{stat.value}</div>
                                <div className="stat-label">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mentorship-tabs">
                    <button 
                        className={`tab ${activeTab === 'find' ? 'active' : ''}`}
                        onClick={() => setActiveTab('find')}
                    >
                        👤 Find Mentors
                    </button>
                    <button 
                        className={`tab ${activeTab === 'my' ? 'active' : ''}`}
                        onClick={() => setActiveTab('my')}
                    >
                        📋 My Mentors
                    </button>
                    <button 
                        className={`tab ${activeTab === 'requests' ? 'active' : ''}`}
                        onClick={() => setActiveTab('requests')}
                    >
                        💬 My Requests
                    </button>
                </div>

                {activeTab === 'find' && (
                    <div className="mentors-grid">
                        {mentors.map(mentor => (
                            <MentorCard key={mentor.id} {...mentor} />
                        ))}
                    </div>
                )}

                {activeTab === 'my' && (
                    <div className="empty-state">
                        <p>You haven't connected with any mentors yet. Start by finding a mentor!</p>
                    </div>
                )}

                {activeTab === 'requests' && (
                    <div className="empty-state">
                        <p>No pending mentor requests.</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default Mentorship;