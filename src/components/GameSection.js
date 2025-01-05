import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "./GameSection.css";
import LoginModal from "./LoginModal.js";

const GameSection = ({ title, games, providerId, onViewAll  }) => {
  const [startIndex, setStartIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [gameLaunchUrl, setGameLaunchUrl] = useState("");
  const [isMaximized, setIsMaximized] = useState(false);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const auth = getAuth();
  
  useEffect(() => {
      // Listen for changes in Firebase authentication state
      const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
        if (user) {
          setIsUserAuthenticated(true);
        } else {
          setIsUserAuthenticated(false);
        }
        console.log("User is authenticated:", isUserAuthenticated);
      });
      return () => unsubscribeAuth();
  }, [auth]);

  const toggleLoginModal = () => {
    setIsLoginModalVisible(!isLoginModalVisible);
  };
  
  const handleGameClick = async (gameUid) => {
    if(isUserAuthenticated){
      const response = await fetch("https://live-casino-slots-evolution-jili-and-50-plus-provider.p.rapidapi.com/casino/get-game-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-igtechcasino-apikey": "677126d265bb35832e54e6d3",
          "x-rapidapi-host": "live-casino-slots-evolution-jili-and-50-plus-provider.p.rapidapi.com",
          "x-rapidapi-key": "bf58a6fbe1mshe87b23e355bf58ap1ba530jsnd157e37e2a1d",
        },
        body: JSON.stringify({
          userId: "igtechgamingdemo",
          gameId: gameUid,
          lang: "en",
          money: 100000,
          home_url: "https://igtechgaming.com/",
          platform: 1,
        }),
      });

      const data = await response.json();
      setGameLaunchUrl(data.payload.game_launch_url);
      setModalVisible(true);
    }else{
      setIsLoginModalVisible(true);
    }
  };

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const handleNext = () => {
    if (startIndex + 10 < games.length) {
      setStartIndex(startIndex + 10);
    }
  };

  const handlePrev = () => {
    if (startIndex - 10 >= 0) {
      setStartIndex(startIndex - 10);
    }
  };

  const visibleGames = games.slice(startIndex, startIndex + 10);

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll(providerId);
    }
  };

  return (
    <div className="game-section">
      <div className="game-section-header">
        <h3 className="game-section-title">{title}  <span className="game-count">({games.length})</span></h3>
        <button className="view-all-btn" onClick={handleViewAll}>All</button>
      </div>
      <div className="game-section-games-wrapper">
        <button
          className="scroll-btn"
          onClick={handlePrev}
          disabled={startIndex === 0}
        >
          &lt;
        </button>
        <div className="game-section-games">
          {visibleGames.map((game) => (
            <div key={game.game_uid} className="game-card" onClick={() => handleGameClick(game.game_uid)}>
              <img src={game.game_launcher_icon} alt={game.game_name} />
              <p>{game.game_name}</p>
            </div>
          ))}
        </div>
        <button
          className="scroll-btn"
          onClick={handleNext}
          disabled={startIndex + 10 >= games.length}
        >
          &gt;
        </button>
      </div>

      {modalVisible && (
        <div className={`modal ${isMaximized ? "maximized" : ""}`}>
          <div className="modal-content">
            <iframe
              src={gameLaunchUrl}
              title="Game Launch"
              className={isMaximized ? "maximized" : ""}
              frameBorder="0"
            ></iframe>

            <div className="modal-header">
              <button className="maximize-btn" onClick={toggleMaximize}>
                <i className="fas fa-expand"></i>
              </button>
              <button className="close-modal" onClick={() => setModalVisible(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

          </div>
          
        </div>
      )}

      {isLoginModalVisible && (
        <LoginModal onClose={toggleLoginModal} />
      )}
    </div>
  );
};

export default GameSection;
