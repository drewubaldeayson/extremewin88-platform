import React from 'react';
import "./SearchButton.css";

const SearchButton = ({ searchQuery, setSearchQuery }) => {
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="search-container">
      <input
        type="text"
        className="search-input"
        placeholder="Search your favorite game"
        value={searchQuery}
        onChange={handleSearchChange}
      />
    </div>
  );
};

export default SearchButton;
