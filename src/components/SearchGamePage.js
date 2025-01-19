// SearchGamePage.js
import React, { useState, useEffect, useRef } from 'react';
import { db, fetchGames, fetchPendingWithdrawals } from '../services/firebase';
import './SearchGamePage.css'; // Optional: for styling
import LoginModal from "./LoginModal.js";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import TabMenu from './TabMenu.js';
import { getAuth, onAuthStateChanged } from "firebase/auth";

const SearchGamePage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(false);
    const [providers, setProviders] = useState([]);
      const [gamesByProvider, setGamesByProvider] = useState({});
    const [viewAllProvider, setViewAllProvider] = useState(null);
    const [allGames, setAllGames] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [gameLaunchUrl, setGameLaunchUrl] = useState("");
    const [isMaximized, setIsMaximized] = useState(false);
    const iframeRef = useRef(null);
    const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
    const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
    const [walletAmount, setWalletAmount] = useState({ current: 0.0, pending: 0.0 });
    const [searchQuery, setSearchQuery] = useState('');
    const [userId, setUserId] = useState("");
    const [onlineUsers, setOnlineUsers] = useState({});
    const [isGameLoading, setIsGameLoading] = useState(false);
    const [progressBarKey, setProgressBarKey] = useState(0);
    const auth = getAuth();

    const initializeOnlineUsers = () => {
        const newOnlineUsers = {};
        games.forEach((game) => {
            newOnlineUsers[game.game_uid] = 20 + Math.floor(Math.random() * 81); // Random between 20 and 100
        });
        setOnlineUsers(newOnlineUsers);
    };

    const toggleLoginModal = () => {
        setIsLoginModalVisible(!isLoginModalVisible);
    };

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
    
    const handleGameClick = async (gameUid) => {

        if(isUserAuthenticated){
            await startLoading(gameUid);
        
        }else{
            setIsLoginModalVisible(true);
        }
    };

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


  useEffect(() => {
    const debounceFetch = setTimeout(() => {
      const searchGames = async () => {
        setLoading(true);
        const results = await fetchGames(searchTerm[0].toUpperCase()+searchTerm.substring(1));
        setGames(results);
        console.log(results)
        setLoading(false);
      };

      if (searchTerm.length >= 3) {
        searchGames();
      } else {
        setGames([]);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(debounceFetch);
  }, [searchTerm]);

  return (
    <div className="search-page">
        <TabMenu/>
        <h1>Search a game</h1>
        <input
            type="text"
            placeholder="Type to search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="game-search-input"
        />
        <div className='search-game-section'>
           
            {loading ? (
            <p>Loading...</p>
            ) : games.length > 0 ? (
                <ul className="games-wrapper">
                    {games.map((game) => (
                    <li key={game.game_uid} data-id={game.game_uid} data-provider={game.game_provider} data-name={game.game_name}  onClick={() => handleGameClick(game.game_uid)}>
                        <img src={game.game_launcher_icon} alt={game.game_name} />
                        <img className="favorite-btn" data-id={game.game_uid} src="https://rollem88.com/assets/images/icon/favorite.svg?v=0.0.99" alt="favorite" />
                        <div className="game">
                            <span>{game.game_name}</span>
                            <span>{game.provider_uid}</span>
                        </div>
                        <div className="online">
                            <div></div>
                            <span>{onlineUsers[game.game_uid] || 20} Online</span>
                        </div>
                    </li>
                    ))}
                </ul>
            ) : (
            searchTerm.length >= 3 && <p>No games found.</p>
            )}

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
                </div>
                ) : <div></div> }

            </div>
            
            </div>
        )}

        {isLoginModalVisible && (
            <LoginModal onClose={toggleLoginModal} />
        )}
  </div>
  );
};

export default SearchGamePage;
