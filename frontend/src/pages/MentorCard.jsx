import React from 'react';
import './MentorCard.css';

const MentorCard = ({ initials, name, title, company, rating, mentees, slotsAvailable, expertise }) => {
    return (
        <div className="mentor-card">
            <div className="mentor-header">
                <div className="mentor-avatar">{initials}</div>
                <div className="mentor-info">
                    <h3 className="mentor-name">{name}</h3>
                    <p className="mentor-title">{title}</p>
                    <p className="mentor-company">{company}</p>
                </div>
            </div>

            <div className="mentor-stats">
                <div className="stat">
                    <span className="stat-rating">⭐ {rating}</span>
                    <span className="stat-text">({mentees} mentees)</span>
                </div>
                <div className="slots-badge">
                    {slotsAvailable > 0 ? (
                        <span className="available">{slotsAvailable} slots available</span>
                    ) : (
                        <span className="fully-booked">Fully booked</span>
                    )}
                </div>
            </div>

            <div className="expertise-section">
                <p className="expertise-label">Areas of Expertise</p>
                <div className="expertise-tags">
                    {expertise.map((skill, index) => (
                        <span key={index} className="expertise-tag">{skill}</span>
                    ))}
                </div>
            </div>

            <button className="request-btn" disabled={slotsAvailable === 0}>
                Request Mentorship
            </button>
        </div>
    );
};

export default MentorCard;