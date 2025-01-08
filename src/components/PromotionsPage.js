import React, { useState } from "react";
import "./PromotionsPage.css";
import "./FullScreenModal.css";
import { useNavigate } from 'react-router-dom';

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
      title: "Slots",
      description: "Exciting action-packed game with multiple levels and challenges.",
      imageUrl: "https://lvsgaming.com/assets/game-BlsTTUJh.jpeg"
    },
    {
      title: "Fishing",
      description: "Strategize your way to victory in this thought-provoking game.",
      imageUrl: "https://lvsgaming.com/assets/Slideimg3-DPc02D8J.avif"
    },
    {
      title: "Table & Cards",
      description: "Relax and unwind with this fun and casual gaming experience.",
      imageUrl: "https://lvsgaming.com/assets/casino-V4Lcpdc-.jpg"
    },
    {
      title: "Casino",
      description: "Engage in a thrilling adventure with dynamic gameplay.",
      imageUrl: "https://lvsgaming.com/assets/casino2-CFRrWeE9.jpg"
    }
  ];

  const handleRedirectToHome = () => {
    navigate('/'); 
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="promotions-container">
      <header className="promotions-header">
        <h1>EXTREMEWIN88 CREATE YOUR DYNASTY</h1>
        <h2>Outstanding Games</h2>
        <p>
          ExtremeWin88 offers an unparalleled gaming experience with the latest games, secure
          transactions, and top-notch customer support. Whether you’re a casual player or a
          seasoned pro, ExtremeWin88 has something for everyone.
        </p>
        <button className="promotions-play-now-btn" onClick={handleRedirectToHome}>PLAY NOW</button>
      </header>

      <section className="promotions-games">
        <p>
          ExtremeWin88 offers a vast library of games across all genres. Whether you’re into action,
          strategy, or casual gaming, we have something for everyone.
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

      <section className="opportunity-section">
        <h2>Seize the Opportunity<br />to Make Your Dreams Come True</h2>
        <p>
          Experience the joy of winning big and living your dream life.<br />
          Your dreams are within reach—unleash the power of possibility and take the first step towards achieving your goals.
        </p>
      </section>

      <section className="bonus-images-section">
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
      </section>
    </div>
  );
};

export default PromotionsPage;
