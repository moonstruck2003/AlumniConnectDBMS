import React, { useState } from 'react';
import './SearchFilter.css';

const SearchFilter = ({ onSearch, onFilterClick }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleInput = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        onSearch(value);
    };

    return (
        <div className="search-filter">
            <input
                type="text"
                placeholder="Search by name, company, or role..."
                value={searchTerm}
                onChange={handleInput}
                className="search-input"
            />
            <button className="filters-btn" onClick={onFilterClick}>⚙️ Filters</button>
        </div>
    );
};

export default SearchFilter;
