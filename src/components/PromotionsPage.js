import React from "react";
import "./PromotionsPage.css"; // Optional: Include CSS for styling

const PromotionsPage = () => {
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
        <button className="promotions-play-now-btn">PLAY NOW</button>
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
    </div>
  );
};

export default PromotionsPage;
