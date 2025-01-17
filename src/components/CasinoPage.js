import React, { useState, useEffect, useRef } from "react";
import PromotionalHighlights from "./PromotionalHighlights";
import GameProviderCarousel from "./GameProviderCarousel";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db, fetchCasinoGames, fetchPendingWithdrawals } from "../services/firebase"
import SearchButton from './SearchButton';
import LoginModal from "./LoginModal.js";
import './SlotsPage.css';
import TabMenu from "./TabMenu.js";
import BottomNavBar from "./BottomNavBar.js";

const CasinoPage = () => {
    const [allGames, setAllGames] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [onlineUsers, setOnlineUsers] = useState({});
    const [gameLaunchUrl, setGameLaunchUrl] = useState("");
    const [isMaximized, setIsMaximized] = useState(false);
    const iframeRef = useRef(null);
    const [isGameLoading, setIsGameLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
    const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
    const [walletAmount, setWalletAmount] = useState({ current: 0.0, pending: 0.0 });
    const [userId, setUserId] = useState("");
    const auth = getAuth();
    const [progressBarKey, setProgressBarKey] = useState(0);

    const fetchGames = async () => {
        try {
          const fetchedGames = await fetchCasinoGames();
          setAllGames(fetchedGames);
        } catch (error) {
          console.error("Error fetching games:", error);
        }
    };

    useEffect(() => {
       fetchGames();
    }, []);
    

    const filteredGames = allGames.filter((game) =>
        game.game_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Initialize the online user counts randomly between 20 and 100 for each game
    const initializeOnlineUsers = () => {
        const newOnlineUsers = {};
        allGames.forEach((game) => {
        newOnlineUsers[game.game_uid] = 20 + Math.floor(Math.random() * 81); // Random between 20 and 100
        });
        setOnlineUsers(newOnlineUsers);
    };

    const toggleLoginModal = () => {
        setIsLoginModalVisible(!isLoginModalVisible);
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

    useEffect(() => {
        if (isGameLoading) {
            const timer = setTimeout(() => {
                setProgressBarKey(prevKey => prevKey + 1);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [isGameLoading]);

    useEffect(() => {
        // Listen for changes in Firebase authentication state
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
          if (user) {
            setIsUserAuthenticated(true);
            const playerData = JSON.parse(localStorage.getItem("playerData"));
            setUserId(playerData.userId)
            const unsubscribeWallet = listenToWalletAmount(playerData.username);
    
            return () => unsubscribeWallet();
          } else {
            setIsUserAuthenticated(false);
          }
        });
        return () => unsubscribeAuth();
    }, [auth]);

    useEffect(() => {
        // Initialize online users on first load
        initializeOnlineUsers();
    
        const interval = setInterval(() => {
          setOnlineUsers((prevOnlineUsers) => {
            const updatedUsers = { ...prevOnlineUsers };
    
            allGames.forEach((game) => {
              // If the game's online count exists, randomly fluctuate it between 20 and 100
              const randomChange = Math.floor(Math.random() * 11) - 5; // Range between -5 and +5
              let newOnlineCount = updatedUsers[game.game_uid] + randomChange;
    
              // Ensure the new online count is always between 20 and 100
              newOnlineCount = Math.min(Math.max(newOnlineCount, 20), 100);
    
              updatedUsers[game.game_uid] = newOnlineCount;
            });
    
            return updatedUsers;
          });
        }, Math.floor(Math.random() * (900000 - 600000)) + 600000); // Random interval between 10-15 minutes
    
        return () => clearInterval(interval); // Clean up the interval on component unmount
    }, [allGames]);


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

    return (
        <div className="slots-page">
             {/* PROVIDERS LIST FOR MOBILE VIEW MENU */}
            <TabMenu />
            {/* CATEGORIES LIST FOR DESKTOP VIEW MENU */}
            <PromotionalHighlights/>
            <ul className="casino-games-wrapper">
                {filteredGames.map((game) => (
                <li key={game.game_uid} data-id={game.game_uid} data-provider={game.game_provider} data-name={game.game_name}  onClick={() => handleGameClick(game.game_uid)}>
                    <img src={game.game_launcher_icon} alt={game.game_name} />
                    <img className="favorite-btn" data-id={game.game_uid} src="https://rollem88.com/assets/images/icon/favorite.svg?v=0.0.99" alt="favorite" />
                    <div className="game">
                        <span>{game.game_name}</span>
                        <span>{game.provider_uid.replace(/_/g, " ")}</span>
                    </div>
                    <div className="online">
                        <div></div>
                        <span>{onlineUsers[game.game_uid] || 20} Online</span>
                    </div>
                </li>
                ))}
            </ul>
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
            <BottomNavBar/>
        </div>
    );
};

export default CasinoPage;
