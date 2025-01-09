import React, { useState, useEffect } from "react";
import { fetchProviders, fetchGamesByProviderByGameType } from "../services/firebase";
import "./GameProviderCarousel.css";

const GameProviderCarousel = ({ onGamesFetched, providerType}) => {
  const [providers, setProviders] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch providers on component mount
  useEffect(() => {
    const loadProviders = async () => {
      try {
        const fetchedProviders = await fetchProviders();
        // Fetch and filter providers that have Table Games
        const providersWithTableGames = [];

        for (const provider of fetchedProviders) {
          const games = await fetchGamesByProviderByGameType(provider.provider_uid, providerType);
          if (games.length > 0) {
            providersWithTableGames.push(provider);
          }
        }

        setProviders(providersWithTableGames);
        if (providersWithTableGames.length > 0) {
          fetchGames(providersWithTableGames[0].provider_uid);
        }
      } catch (error) {
        console.error("Error fetching providers:", error);
      }
    };

    loadProviders();
  }, []);

  const handleLeftClick = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleRightClick = () => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, Math.max(providers.length - 5, 0)));
  };

  const fetchGames = async (providerId) => {
    try {
      const games = await fetchGamesByProviderByGameType(providerId, providerType);
      onGamesFetched(games);
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  };

  return (
    <div className="carousel-container">
       
        <div className="carousel">
            <button className="arrow-button left-arrow" onClick={handleLeftClick}>
                <img
                src="https://rollem88.com/assets/images/icon/left-arrow3.png"
                alt="Left Arrow"
                className="arrow-icon"
                />
            </button>
            {providers.slice(currentIndex, currentIndex + 5).map((provider) => (
            <div
                key={provider.provider_uid}
                className="provider-item"
                onClick={() => fetchGames(provider.provider_uid)}
            >
                <img
                src={provider.carousel_icon} // Only one image source required
                alt={provider.provider_name}
                className="provider-logo"
                />
            </div>
            ))}
            <button className="arrow-button right-arrow" onClick={handleRightClick}>
                <img
                src="https://rollem88.com/assets/images/icon/right-arrow3.png"
                alt="Right Arrow"
                className="arrow-icon"
                />
            </button>
        </div>
        
    </div>
  );
};

export default GameProviderCarousel;
