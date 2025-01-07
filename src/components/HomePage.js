import React, { useState, useEffect } from "react";
import { fetchProviders, fetchGamesByProvider, db,fetchPendingWithdrawals } from "../services/firebase"
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import "./GamesList.css";
import "./HomeComponent.css";
import GameSection from "./GameSection.js";
import LoginModal from "./LoginModal.js";

const HomePage = () => {
  const [providers, setProviders] = useState([]);
  const [gamesByProvider, setGamesByProvider] = useState({});
  const [viewAllProvider, setViewAllProvider] = useState(null);
  const [allGames, setAllGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [gameLaunchUrl, setGameLaunchUrl] = useState("");
  const [isMaximized, setIsMaximized] = useState(false);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [walletAmount, setWalletAmount] = useState({ current: 0.0, pending: 0.0 });
  const [userId, setUserId] = useState("");
  const auth = getAuth();

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
    const loadProvidersAndGames = async () => {
      setLoading(true);

      // Fetch all providers
      const providersData = await fetchProviders();
      setProviders(providersData);

      // Fetch games for each provider
      const gamesData = {};
      for (const provider of providersData) {
        const games = await fetchGamesByProvider(provider.provider_uid);
        gamesData[provider.provider_uid] = games || [];
      }

      setGamesByProvider(gamesData);
      setLoading(false);
    };

    loadProvidersAndGames();
  }, []);


  const handleViewAll = async (providerId) => {
    const games = await fetchGamesByProvider(providerId);
    setViewAllProvider(providerId);
    setAllGames(games);
  };

  const handleBackToHome = () => {
    setViewAllProvider(null);
    setAllGames([]);
  };

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
      setModalVisible(true);
    }else{
      setIsLoginModalVisible(true);
    }
  };

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
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
  


  if (viewAllProvider) {
    const provider = providers.find((p) => p.provider_uid === viewAllProvider);

    return (
      <div className="all-games-page">
        <div className="all-games-section">
          <div className="all-games-header">
            <h3>
              {provider.provider_name} <span>({allGames.length})</span>
            </h3>
            <button className="back-btn" onClick={handleBackToHome}>
              Back
            </button>
          </div>
          <div className="all-games-list">
            {allGames.map((game) => (
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
  }


  return (
    <div className="home-page">
      {providers.map((provider, index) => {
        if (index % 2 === 0) {
          const nextProvider = providers[index + 1];

          return (
            <div key={index} className="game-row">
              <GameSection
                title={provider.provider_name}
                games={gamesByProvider[provider.provider_uid] || []}
                providerId={provider.provider_uid}
                onViewAll={handleViewAll}
              />
              {nextProvider && (
                <GameSection
                  title={nextProvider.provider_name}
                  games={gamesByProvider[nextProvider.provider_uid] || []}
                  providerId={nextProvider.provider_uid}
                  onViewAll={handleViewAll}
                />
              )}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

export default HomePage;