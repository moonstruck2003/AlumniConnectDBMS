import React from 'react';
import './AlumniCard.css';

const AlumniCard = ({ initials, name, title, company, location, year, isMentor }) => {
    return (
        <div className="alumni-card">
            <div className="card-header">
                <div className="alumni-avatar">{initials}</div>
                {isMentor && <span className="mentor-badge">Mentor</span>}
            </div>
            <h3 className="alumni-name">{name}</h3>
            <p className="alumni-title">{title}</p>
            <div className="alumni-info">
                <div className="info-item">
                    <span className="icon">💼</span>
                    <span>{company}</span>
                </div>
                <div className="info-item">
                    <span className="icon">📍</span>
                    <span>{location}</span>
                </div>
                <div className="info-item">
                    <span className="icon">🎓</span>
                    <span>Class of {year}</span>
                </div>
            </div>
            <button className="view-profile-btn">View Profile</button>
        </div>
    );
};

export default AlumniCard;