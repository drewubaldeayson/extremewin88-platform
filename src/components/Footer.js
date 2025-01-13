import React from "react";
import "./Footer.css";
import companyLogo from "../assets/icons/extremewin88logo.png";
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  const handleRedirectToAbout = () => {
    navigate('/about-us'); 
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRedirectToPrivacyPolicy = () => {
    navigate('/privacy-policy'); 
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRedirectToTerms = () => {
    navigate('/terms-and-conditions'); 
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRedirectToSlots = () => {
    navigate('/slots'); 
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRedirectToCasino = () => {
    navigate('/casino'); 
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRedirectToTableCards = () => {
    navigate('/tablecards'); 
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRedirectToFishing = () => {
    navigate('/fishing'); 
    window.scrollTo({ top: 0, behavior: "smooth" });
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
            <i className="bi bi-envelope-at-fill email-icon"></i>
            <a href="mailto:extremewin88co@gmail.com">extremewin88co@gmail.com</a>
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
            <li onClick={handleRedirectToCasino}>Casino</li>
            <li onClick={handleRedirectToSlots}>Slots</li>
            <li onClick={handleRedirectToTableCards}>Table & Cards</li>
            <li onClick={handleRedirectToFishing}>Fishing</li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Reach Us</h3>
          <a href="https://www.facebook.com/profile.php?id=61559585600764" target="_blank" rel="noopener noreferrer" className="facebook-icon">
            <i className="bi bi-facebook"></i>
          </a>
        </div>
      </div>
      <div class="new-footer-container3"> 
        <div class="footer-swiper-wrapper">
                        <a class="footer-swiper-slide" >
                            <img src="https://bigwin69.site/assets/images/provider/footer/ybt.png" alt=""/>
                        </a>
                                            <a class="footer-swiper-slide" >
                            <img src="https://bigwin69.site/assets/images/provider/footer/pplay.png" alt=""/>
                        </a>
                                            <a class="footer-swiper-slide" >
                            <img src="https://bigwin69.site/assets/images/provider/footer/awc.png" alt=""/>
                        </a>
                                            <a class="footer-swiper-slide" >
                            <img src="https://bigwin69.site/assets/images/provider/footer/evo.png" alt=""/>
                        </a>
                                            <a class="footer-swiper-slide" >
                            <img src="https://bigwin69.site/assets/images/provider/footer/sa.png" alt=""/>
                        </a>
                                            <a class="footer-swiper-slide" >
                            <img src="https://bigwin69.site/assets/images/provider/footer/dg.png" alt=""/>
                        </a>
                                                                <a class="footer-swiper-slide" >
                            <img src="https://bigwin69.site/assets/images/provider/footer/pplay.png" alt=""/>
                        </a>
                                            <a class="footer-swiper-slide" >
                            <img src="https://bigwin69.site/assets/images/provider/footer/fc.png" alt=""/>
                        </a>
                                            <a class="footer-swiper-slide" >
                            <img src="https://bigwin69.site/assets/images/provider/footer/bpg.png" alt=""/>
                        </a>
                                            <a class="footer-swiper-slide" >
                            <img src="https://bigwin69.site/assets/images/provider/footer/op.png" alt=""/>
                        </a>
                                            <a class="footer-swiper-slide" >
                            <img src="https://bigwin69.site/assets/images/provider/footer/hs.png" alt=""/>
                        </a>
                                            <a class="footer-swiper-slide" >
                            <img src="https://bigwin69.site/assets/images/provider/footer/pgs.png" alt=""/>
                        </a>
                                            <a class="footer-swiper-slide" >
                            <img src="https://bigwin69.site/assets/images/provider/footer/bng.png" alt=""/>
                        </a>
                                            <a class="footer-swiper-slide" >
                            <img src="https://bigwin69.site/assets/images/provider/footer/cq9.png" alt=""/>
                        </a>
                                            <a class="footer-swiper-slide" >
                            <img src="https://bigwin69.site/assets/images/provider/footer/jili.png" alt=""/>
                        </a>
                                            <a class="footer-swiper-slide" >
                            <img src="https://bigwin69.site/assets/images/provider/footer/nt.png" alt=""/>
                        </a>
                                            <a class="footer-swiper-slide" >
                            <img src="https://bigwin69.site/assets/images/provider/footer/ns.png" alt=""/>
                        </a>
                                            <a class="footer-swiper-slide" >
                            <img src="https://bigwin69.site/assets/images/provider/footer/nlc.png" alt=""/>
                        </a>
                                            <a class="footer-swiper-slide" >
                            <img src="https://bigwin69.site/assets/images/provider/footer/relax.png" alt=""/>
                        </a>
                                            <a class="footer-swiper-slide" >
                            <img src="https://bigwin69.site/assets/images/provider/footer/v5g.png" alt=""/>
                        </a>
                                    
                  </div>
              </div>
      
    </footer>
  );
};

export default Footer;
