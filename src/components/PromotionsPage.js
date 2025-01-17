import React, { useState } from "react";
import "./PromotionsPage.css";
import "./FullScreenModal.css";
import { useNavigate } from 'react-router-dom';
import BottomNavBar from "./BottomNavBar";
import promotion20Image from "../assets/images/promotion_20.png";
import promotion10Image from "../assets/images/promotion_10.png";
import promotion5Image from "../assets/images/promotion_5.png";

const FullScreenModal = ({ imageSrc, onClose }) => {
  return (
    <div className="fullscreen-container" onClick={onClose}>
      <img src={imageSrc} alt="Full Screen" className="fullscreen-image" />
    </div>
  );
};

const PromotionsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState("");
  const navigate = useNavigate();

  const openFullScreen = (imageSrc) => {
    setCurrentImage(imageSrc);
    setIsModalOpen(true);
  };

  const closeFullScreen = () => {
    setIsModalOpen(false);
  };

  const promotions = [
    {
      title: "PALDO! 20% (DAILY RELOAD)",
      description: "20% Daily Reload Bonus: Claim this bonus during deposit. A turnover requirement applies, calculated as (Deposit x 1) + (Bonus x 12). This must be met before withdrawals are allowed.",
      imageUrl: promotion20Image
    },
    {
      title: "PALDO! 10% (DAILY RELOAD)",
      description: "10% Daily Reload Bonus: Claim this bonus during deposit. A turnover requirement applies, calculated as (Deposit x 1) + (Bonus x 8). This must be met before withdrawals are allowed.",
      imageUrl: promotion10Image
    },
    {
      title: "PALDO! 5% (DAILY RELOAD)",
      description: "5% Daily Reload Bonus: Claim this bonus during deposit. A turnover requirement applies, calculated as (Deposit x 1) + (Bonus x 5). This must be met before withdrawals are allowed.",
      imageUrl: promotion5Image
    }
  ];

  const handleRedirectToHome = () => {
    navigate('/'); 
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="promotions-container">
      <div className="p-20">
        <header className="promotions-header">
          <h1>Promotions</h1>
        </header>

        <section className="promotions-games">
          <p>
          Discover a wide range of promotions tailored to enhance your gaming experience. From daily reload bonuses to exclusive rewards, there's something for every player. Don't miss out—boost your gameplay today!
          </p>

          <div className="promotion-containers">
            {promotions.map((promo, index) => (
              <div key={index} className="promotion-box">
                <div className="promotion-data">
                  <img src={promo.imageUrl} alt={promo.title} className="promotion-image" />
                  <h3>{promo.title}</h3>
                  <p>{promo.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* <section className="opportunity-section">
          <h2>Seize the Opportunity<br />to Make Your Dreams Come True</h2>
          <p>
            Experience the joy of winning big and living your dream life.<br />
            Your dreams are within reach—unleash the power of possibility and take the first step towards achieving your goals.
          </p>
        </section> */}

        {/* <section className="bonus-images-section">
          <div className="bonus-image">
            <img src="https://lvsgaming.com/assets/promo1-DTmoQwsC.png" alt="Welcome Bonus" onClick={() => openFullScreen("https://lvsgaming.com/assets/promo1-DTmoQwsC.png")}/>
          </div>
          <div className="bonus-image">
            <img src="https://lvsgaming.com/assets/promo2-BsA_eced.png" alt="General Rules" onClick={() => openFullScreen("https://lvsgaming.com/assets/promo2-BsA_eced.png")}/>
          </div>
          <div className="bonus-image">
            <img src="https://lvsgaming.com/assets/promo3-D405XuwJ.png" alt="Refer & Earn" onClick={() => openFullScreen("https://lvsgaming.com/assets/promo3-D405XuwJ.png")}/>
          </div>
          {isModalOpen && (
            <FullScreenModal imageSrc={currentImage} onClose={closeFullScreen} />
          )}
        </section> */}
      </div>
      <BottomNavBar/>
    </div>
  );
};

export default PromotionsPage;
