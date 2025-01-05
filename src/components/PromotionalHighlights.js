import React from "react";
import "./PromotionalHighlights.css";

const PromotionalHighlights = () => {
  return (
    <div className="dashboard">
      <div className="hero-section">
        <div className="hero-card">
          <img
            src="https://backend.lvsgaming.com/uploads/1735781780379_313893339.png"
            alt="Table and Card"
            className="hero-image"
          />
          <div className="hero-content">
            <h2>Table and Card</h2>
            <p>Deal the Cards, Play the Table, Claim Your Fortune!</p>
            <button className="play-now-button">Play Now</button>
          </div>
        </div>
        <div className="hero-card">
          <img
            src="https://backend.lvsgaming.com/uploads/1735781780383_813943575.jpg"
            alt="Casino"
            className="hero-image"
          />
          <div className="hero-content">
            <h2>Casino</h2>
            <p>Your Game, Your Luck, Your Jackpot Awaits!</p>
            <button className="play-now-button">Play Now</button>
          </div>
        </div>
      </div>

      {/* Bottom Cards Section */}
      <div className="cards-section">
        <div className="info-card">
          <h3>Casino</h3>
          <p>More than 180 Games!</p>
        </div>
        <div className="info-card">
          <h3>Slots</h3>
          <p>Fly High, Win Big!</p>
        </div>
        <div className="info-card">
          <h3>Table & Cards</h3>
          <p>Master Your Precision!</p>
        </div>
        <div className="info-card">
          <h3>Fishing</h3>
          <p>Master Your Precision!</p>
        </div>
      </div>
    </div>
  );
};

export default PromotionalHighlights;
