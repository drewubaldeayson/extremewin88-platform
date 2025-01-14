import React, { useState, useEffect, useRef } from "react";
import { fetchProviders, fetchGamesByProviderByGameType } from "../services/firebase";
import "./ScrollableMenuMobile.css";

const ScrollableMenuMobile = ({ onGamesFetched, providerType }) => {
  const [providers, setProviders] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const menuRef = useRef(null);

  // Fetch providers on component mount
  useEffect(() => {
    const loadProviders = async () => {
      try {
        const fetchedProviders = await fetchProviders();
        const providersWithGames = [];

        for (const provider of fetchedProviders) {
          const games = await fetchGamesByProviderByGameType(provider.provider_uid, providerType);
          if (games.length > 0) {
            providersWithGames.push(provider);
          }
        }

        setProviders(providersWithGames);
        if (providersWithGames.length > 0) {
          fetchGames(providersWithGames[0].provider_uid);
        }
      } catch (error) {
        console.error("Error fetching providers:", error);
      }
    };

    loadProviders();
  }, [providerType]);

  const handleLeftClick = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    menuRef.current.scrollBy({ left: -200, behavior: "smooth" });
  };

  const handleRightClick = () => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, Math.max(providers.length - 5, 0)));
    menuRef.current.scrollBy({ left: 200, behavior: "smooth" });
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
    <div className="scrollable-menu">
      <button className="mobile-arrow mobile-left-arrow" onClick={handleLeftClick}>
        <img
          src="https://rollem88.com/assets/images/icon/left-arrow3.png"
          alt="Left Arrow"
          className="mobile-arrow-icon"
        />
      </button>
      <div className="scrollable-menu-container" ref={menuRef}>
        <ul className="scrollable-menu-provider-list">
          {providers.slice(currentIndex, currentIndex + 5).map((provider) => (
            <li
              key={provider.provider_uid}
              className="mobile-provider-item"
              onClick={() => fetchGames(provider.provider_uid)}
            >
              <img
                src={provider.carousel_icon}
                alt={provider.provider_name}
                className="mobile-provider-logo"
              />
            </li>
          ))}
        </ul>
      </div>
      <button className="mobile-arrow mobile-right-arrow" onClick={handleRightClick}>
        <img
          src="https://rollem88.com/assets/images/icon/right-arrow3.png"
          alt="Right Arrow"
          className="mobile-arrow-icon"
        />
      </button>
    </div>
  );
};

export default ScrollableMenuMobile;
