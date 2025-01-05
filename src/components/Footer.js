import React from "react";
import "./Footer.css";
import companyLogo from "../assets/icons/extremewin88logo.png";
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  const handleRedirectToAbout = () => {
    navigate('/about-us'); 
  };

  const handleRedirectToPrivacyPolicy = () => {
    navigate('/privacy-policy'); 
  };

  const handleRedirectToTerms = () => {
    navigate('/terms-and-conditions'); 
  };

  return (
    <footer className="footer">
      <div className="footer-top-border">
        <img src={companyLogo} alt="ExtremeWin88" className="footer-logo" />
        <div className="footer-border-line"></div>
      </div>
      <div className="footer-container">
        <div className="footer-section">
          <h3>Contact us if you have any more questions</h3>
          <p>
            <i class="bi bi-envelope-at-fill email-icon"></i>
            <a href="mailto:extremewin88@gmail.com">extremewin88@gmail.com</a>
          </p>
        </div>
        <div className="footer-section">
          <h3>Information</h3>
          <ul>
            <li onClick={handleRedirectToAbout}>About</li>
            <li onClick={handleRedirectToPrivacyPolicy}>Privacy Policy</li>
            <li onClick={handleRedirectToTerms}>Terms & Conditions</li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Categories</h3>
          <ul>
            <li>Popular</li>
            <li>Casino</li>
            <li>Fishing</li>
            <li>Slot</li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Reach Us</h3>
          <a href="https://www.facebook.com/profile.php?id=61568318468259" target="_blank" rel="noopener noreferrer" className="facebook-icon">
            <i class="bi bi-facebook"></i>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
