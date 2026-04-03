import React from 'react';
import './FilterModal.css';

const FilterModal = ({ industry, mentorsOnly, onIndustryChange, onMentorChange, onApply, onClose }) => {
    return (
        <div className="filter-modal-overlay" onClick={onClose}>
            <div className="filter-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Filters</h2>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                <div className="modal-content">
                    <div className="filter-group">
                        <label className="filter-label">Industry</label>
                        <select 
                            value={industry} 
                            onChange={(e) => onIndustryChange(e.target.value)}
                            className="filter-select"
                        >
                            <option>All Industries</option>
                            <option>Technology</option>
                            <option>Finance</option>
                            <option>Marketing</option>
                            <option>Healthcare</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label className="filter-checkbox">
                            <input 
                                type="checkbox" 
                                checked={mentorsOnly}
                                onChange={(e) => onMentorChange(e.target.checked)}
                            />
                            <span>Mentors Only</span>
                        </label>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn-cancel" onClick={onClose}>Cancel</button>
                    <button className="btn-apply" onClick={onApply}>Apply Filters</button>
                </div>
            </div>
        </div>
    );
};

export default FilterModal;
