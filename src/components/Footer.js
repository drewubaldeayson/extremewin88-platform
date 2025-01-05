import React from "react";
import "./Footer.css";
import companyLogo from "../assets/icons/extremewin88logo.png";

const Footer = () => {
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
            <li><a href="#about">About</a></li>
            <li><a href="#privacy-policy">Privacy Policy</a></li>
            <li><a href="#terms">Terms & Conditions</a></li>
            <li><a href="#refund-policy">Refund Policy</a></li>
            <li><a href="#data-deletion">Data Deletion</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Categories</h3>
          <ul>
            <li><a href="#popular">Popular</a></li>
            <li><a href="#casino">Casino</a></li>
            <li><a href="#fishing">Fishing</a></li>
            <li><a href="#slot">Slot</a></li>
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
