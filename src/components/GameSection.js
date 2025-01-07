import React, { useState, useEffect, useRef } from "react";
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
  const [displayedGames, setDisplayedGames] = useState(games.slice(0, 10));
  const auth = getAuth();

  const gameSectionWrapperRef = useRef(null);
  useRef(() => {
    const visibleGames = games.slice(startIndex, startIndex + 10);
    setDisplayedGames(visibleGames);
  }, [startIndex, games]);
  
  useEffect(() => {
      // Listen for changes in Firebase authentication state
      const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
        if (user) {
          setIsUserAuthenticated(true);
        } else {
          setIsUserAuthenticated(false);
        }
      });
      return () => unsubscribeAuth();
  }, [auth]);

  // Auto-scroll functionality (horizontally)
  useEffect(() => {
    const scrollInterval = setInterval(() => {
      if (gameSectionWrapperRef.current) {
        const wrapper = gameSectionWrapperRef.current;
        const scrollWidth = wrapper.scrollWidth;
        const clientWidth = wrapper.clientWidth;
        const scrollLeft = wrapper.scrollLeft;

        // Check if we've reached the end of the scroll and reset if needed
        if (scrollLeft + clientWidth >= scrollWidth) {
          setDisplayedGames((prevGames) => [...prevGames, ...games.slice(startIndex, startIndex + 10)]);
        } else {
          
          wrapper.scrollLeft += 1;  // Scroll by 1px (adjust this for speed)
        }
      }
    }, 20);  // Interval time for scrolling speed (lower value = faster scroll)

    return () => clearInterval(scrollInterval);  // Clean up interval on component unmount
  }, [games]);

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
          "x-rapidapi-key": "efd5337684msh1329b1d04eb87f9p13f196jsn51afe35a503a",
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
      <div className="game-section-games-wrapper" ref={gameSectionWrapperRef}>
        <div className="game-section-games">
          {displayedGames.map((game) => (
            <div key={game.game_uid} className="game-card" onClick={() => handleGameClick(game.game_uid)}>
              <img src={game.game_launcher_icon} alt={game.game_name} />
              <p>{game.game_name}</p>
            </div>
          ))}
        </div>
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
