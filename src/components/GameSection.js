import React, { useState, useEffect, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "./GameSection.css";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db,fetchPendingWithdrawals } from "../services/firebase";
import LoginModal from "./LoginModal.js";

const GameSection = ({ title, games, providerId, onViewAll  }) => {
  const [startIndex, setStartIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [gameLaunchUrl, setGameLaunchUrl] = useState("");
  const [isMaximized, setIsMaximized] = useState(false);
  const iframeRef = useRef(null);
  const [isGameLoading, setIsGameLoading] = useState(false);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [displayedGames, setDisplayedGames] = useState(games.slice(0, 10));
  const [walletAmount, setWalletAmount] = useState({ current: 0.0, pending: 0.0 });
  const [userId, setUserId] = useState("");
  const auth = getAuth();
  const [progressBarKey, setProgressBarKey] = useState(0);

  const gameSectionWrapperRef = useRef(null);
  useEffect(() => {
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
          //setDisplayedGames((prevGames) => [...prevGames, ...games.slice(startIndex, startIndex + 10)]);
        } else {
          
          wrapper.scrollLeft += 1;  // Scroll by 1px (adjust this for speed)
        }
      }
    }, 20);  // Interval time for scrolling speed (lower value = faster scroll)

    return () => clearInterval(scrollInterval);  // Clean up interval on component unmount
  }, [games]);

  const listenToWalletAmount = (username) => {
    const playersCollection = collection(db, "players");
    const q = query(playersCollection, where("username", "==", username));
  
    return onSnapshot(q, async (querySnapshot) => {
      if (!querySnapshot.empty) {
        querySnapshot.forEach( async (docSnapshot) => {
          const data = docSnapshot.data();

          const currentWallet = data.wallet_amount || 0.0;

          const pendingAmount = await fetchPendingWithdrawals(username);

          setWalletAmount({
            current: currentWallet,
            pending: pendingAmount,
          });

        });
      } else {
        console.error("No document found for the provided username!");
      }
    });
  };


  useEffect(() => {
        // Listen for changes in Firebase authentication state
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const playerData = JSON.parse(localStorage.getItem("playerData"));
        setUserId(playerData.userId)
        const unsubscribeWallet = listenToWalletAmount(playerData.username);

        return () => unsubscribeWallet();
      }
    });

    return () => unsubscribeAuth();
  }, [auth]);

  const toggleLoginModal = () => {
    setIsLoginModalVisible(!isLoginModalVisible);
  };

  const startLoading = async(gameUid) => {
      setModalVisible(true);
      setIsGameLoading(true);

      setTimeout( async() => {
          
          setIsGameLoading(false);
          
          const response = await fetch("https://live-casino-slots-evolution-jili-and-50-plus-provider.p.rapidapi.com/casino/get-game-url", {
              method: "POST",
              headers: {
              "Content-Type": "application/json",
              "x-igtechcasino-apikey": "677126d265bb35832e54e6d3",
              "x-rapidapi-host": "live-casino-slots-evolution-jili-and-50-plus-provider.p.rapidapi.com",
              "x-rapidapi-key": "8369852d85msh22d517e3367939ap10d24bjsn9a90b0f65d69",
              },
              body: JSON.stringify({
              userId: userId,
              gameId: gameUid,
              lang: "en",
              money: (walletAmount.current - walletAmount.pending),
              home_url: "https://extremewin88.com/",
              platform: 1,
              }),
          });
      
          const data = await response.json();
          setGameLaunchUrl(data.payload.game_launch_url);
          
      }, 3000); // Loader duration (3 seconds)
  };
  
  const handleGameClick = async (gameUid) => {
    if(isUserAuthenticated){
        await startLoading(gameUid);
    
    }else{
      setIsLoginModalVisible(true);
    }
};

  const toggleMaximize = () => {
    const iframe = iframeRef.current;
    if (iframe) {
      if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
        // If the document is in full screen, exit full screen
        document.exitFullscreen?.() ||
        document.webkitExitFullscreen?.() ||
        document.mozCancelFullScreen?.() ||
        document.msExitFullscreen?.();
      } else {
        // Request full screen on the iframe
        iframe.requestFullscreen?.() ||
        iframe.webkitRequestFullscreen?.() ||
        iframe.mozRequestFullScreen?.() ||
        iframe.msRequestFullscreen?.();
      }
    }
  };


  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll(providerId);
    }
  };

  useEffect(() => {
    if (isGameLoading) {
        const timer = setTimeout(() => {
            setProgressBarKey(prevKey => prevKey + 1);
        }, 3000);

        return () => clearTimeout(timer);
    }
}, [isGameLoading]);

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
        <div className={`modal maximized`}>
            <div className="modal-content">
                {isGameLoading ? (
                    <div className="loader-container">
                        <div className="loader">
                            <img src="https://extremewin88.com/static/media/extremewin88logo.b45de00437739a13faff.png" alt="Loader" className="loader-image" />

                            <div className="progress-bar"  key={progressBarKey}></div>
                        </div>
                    </div>
                ) : (

                    <iframe
                        ref={iframeRef}
                        src={gameLaunchUrl}
                        title="Game Launch"
                        className={isMaximized ? "maximized" : ""}
                        frameBorder="0"
                    ></iframe>
                )}

                { !isGameLoading ?  (
                <div className="modal-header">
                    <button className="maximize-btn" onClick={toggleMaximize}>
                    <i className="fas fa-expand"></i>
                    </button>
                    <button className="close-modal" onClick={() => setModalVisible(false)}>
                    <i className="fas fa-times"></i>
                    </button>
                </div>) : <div></div> }

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
