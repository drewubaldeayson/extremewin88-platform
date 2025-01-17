import React from "react";
import "./PromotionalHighlights.css";
import promotionalImage1 from "../assets/images/2025-promotional-gif.gif";
import { useNavigate } from 'react-router-dom';
import TabMenu from "./TabMenu";
import CarouselMobile from "./CarouselMobile";

const PromotionalHighlights = () => {
  const navigate = useNavigate();

  const handleRedirectToSlots = () => {
    navigate('/slots'); 
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRedirectToFishing = () => {
    navigate('/fishing'); 
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRedirectToTableCards = () => {
    navigate('/tablecards'); 
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRedirectToCasino = () => {
    navigate('/casino');
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="dashboard">
      {/* HERO SECTION FOR DESKTOP ONLY */}
      {/* <div className="hero-section">
        <div className="hero-card" onClick={handleRedirectToSlots}>
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
            src={promotionalImage1}
            alt="Casino"
            className="hero-image"
          />
          <div className="hero-content" onClick={handleRedirectToCasino}>
            <h2>Casino</h2>
            <p>Your Game, Your Luck, Your Jackpot Awaits!</p>
            <button className="play-now-button">Play Now</button>
          </div>
        </div>
      </div> */}
 
      {/* HERO SECTION FOR MOBILE VIEW MENU ONLY */}
      <CarouselMobile/>

      {/* PROVIDERS LIST FOR DESKTOP ONLY*/}
      <div className="cards-section">
        <div className="info-card" onClick={handleRedirectToCasino}>
          <div className="card-content">
            <div className="text-content">
              <h3>Casino</h3>
              <p>More than 180 Games!</p>
            </div>
            <div className="image-content">
              <img src="https://lvsgaming.com/assets/C-C2T1ZCGE.png" alt="Casino" />
            </div>
          </div>
        </div>
        <div className="info-card" onClick={handleRedirectToSlots}>
          <div className="card-content">
            <div className="text-content">
              <h3>Slots</h3>
              <p>Fly High, Win Big!</p>
            </div>
            <div className="image-content">
              <img src="https://lvsgaming.com/assets/slotnew-BluT622Z.png" alt="Slots" />
            </div>
          </div>
        </div>
        <div className="info-card"  onClick={handleRedirectToTableCards}>
          <div className="card-content">
            <div className="text-content">
              <h3>Table & Cards</h3>
              <p>Master Your Precision!</p>
            </div>
            <div className="image-content">
              <img src="https://lvsgaming.com/assets/cardnew-iM0idOYX.png" alt="Table & Cards" />
            </div>
          </div>
        </div>
        <div className="info-card"  onClick={handleRedirectToFishing}>
          <div className="card-content">
            <div className="text-content">
              <h3>Fishing</h3>
              <p>Showcase Your Fishing Skills!</p>
            </div>
            <div className="image-content">
              <img src="https://lvsgaming.com/assets/fishingnew-CV0N4uG_.png" alt="Fishing" />
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default PromotionalHighlights;
