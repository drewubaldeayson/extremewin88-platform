import React from "react";
import { useNavigate } from "react-router-dom";
import "./StickySearchButton.css";

const StickySearchButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/search"); // Redirect to the desired page
  };

  return (
    <div className="sticky-search-button" onClick={handleClick}>
      <span className="search-icon">🔍</span> {/* Replace with an actual icon if needed */}
    </div>
  );
};

export default StickySearchButton;
