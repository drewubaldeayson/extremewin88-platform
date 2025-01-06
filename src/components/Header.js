import React, { useState, useEffect  } from "react";
import LoginModal from "./LoginModal";
import { auth } from "../services/firebase";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebase";
import "./Header.css";
import { useNavigate } from 'react-router-dom';
import RegistrationModal from "./RegistrationModal";
import DepositMoneyModal from "./DepositMoneyModal";

const Header = () => {

  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [isRegistrationModalVisible, setIsRegistrationModalVisible] = useState(false);
  const [isDepositMoneyModalVisible, setIsDepositMoneyModalVisible] = useState(false);
  const [playerData, setPlayerData] = useState(null);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [walletAmount, setWalletAmount] = useState(0.0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const auth = getAuth();
  const navigate = useNavigate();

  const toggleLoginModal = () => {
    setIsLoginModalVisible(!isLoginModalVisible);
  };

  const toggleRegistrationModal = () => {
    setIsRegistrationModalVisible(!isRegistrationModalVisible);
  };

  const toggleDepositMoneyModal = () => {
    setIsDepositMoneyModalVisible(!isDepositMoneyModalVisible);
  }

  const toggleDepositMoneyHistoryModal = () => {
    navigate("/deposit-history");
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        localStorage.removeItem("playerData"); // Clear cached player data
        setIsUserAuthenticated(false); // Reset authentication state
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
  };
  
  const listenToWalletAmount = (username) => {
    const playersCollection = collection(db, "players");
    const q = query(playersCollection, where("username", "==", username));
  
    return onSnapshot(q, (querySnapshot) => {
      if (!querySnapshot.empty) {
        querySnapshot.forEach((docSnapshot) => {
          const data = docSnapshot.data();
          setWalletAmount(data.wallet_amount || 0.0);
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
        // User is logged in
        setIsUserAuthenticated(true);
        const playerData = JSON.parse(localStorage.getItem("playerData"));
        const unsubscribeWallet = listenToWalletAmount(playerData.username);

        // Cleanup wallet listener on component unmount or logout
        return () => unsubscribeWallet();
      } else {
        setIsUserAuthenticated(false);
      }
    });

    return () => unsubscribeAuth(); // Cleanup auth listener on component unmount
  }, [auth]);

  useEffect(() => {
    // Retrieve player data from localStorage
    const cachedPlayerData = localStorage.getItem("playerData");
    if (cachedPlayerData) {
      setPlayerData(JSON.parse(cachedPlayerData));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown")) {
        closeDropdown();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);


  const handleRedirectToHome = () => {
    navigate('/'); 
  };

  return (
    <>
      <header className="header">
        <div className="left-section" onClick={handleRedirectToHome}>
          <div className="logo">
            <span className="logo-lvs">Extreme</span>
            <span className="logo-gaming">Win88</span>
          </div>
          <nav className="nav">
            <a onClick={handleRedirectToHome} className="nav-link">
              Home
            </a>
            <a onClick={handleRedirectToHome} className="nav-link">
              Slots
            </a>
            <a onClick={handleRedirectToHome} className="nav-link">
              Promotions
            </a>
          </nav>
        </div>
        <div className="auth-buttons">
          {!isUserAuthenticated ? (
            <>
              <button className="login-button" onClick={toggleLoginModal}>
                Login
              </button>
              <button className="registration-button"  onClick={toggleRegistrationModal}>Registration</button>
            </>
          ) : (
            <div className="nav-after-login">
              <div className="deposit-btn-wrapper">
                <div className="wallet-dropdown-container">
                  <select className="wallet-dropdown" disabled>
                    <option value="EW">Wallet ₱: {walletAmount.toLocaleString()}</option>
                  </select>
                </div>
              </div>
              <div className="dropdown">
                <button
                  type="button"
                  className="user-icon-nav custom-dropdown-toggle"
                  onClick={toggleDropdown}
                >
                  <span className="user-icon">
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 24 24"
                      fontSize="1rem"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M20 22H4V20C4 17.2386 6.23858 15 9 15H15C17.7614 15 20 17.2386 20 20V22ZM12 13C8.68629 13 6 10.3137 6 7C6 3.68629 8.68629 1 12 1C15.3137 1 18 3.68629 18 7C18 10.3137 15.3137 13 12 13Z"></path>
                    </svg>
                  </span>
                  <span className="three-dots">
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 16 16"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"></path>
                    </svg>
                  </span>
                </button>
                {isDropdownOpen && ( 
                  <div className="dropdown-menu">
                    <a onClick={toggleDepositMoneyModal} className="dropdown-item">
                      Deposit
                    </a>
                    <a href="#withdraw" className="dropdown-item">
                      Withdraw
                    </a>
                    <a onClick={toggleDepositMoneyHistoryModal} className="dropdown-item">
                      Deposit History
                    </a>
                    <a href="#withdraw-history" className="dropdown-item">
                      Withdraw History
                    </a>
                    <a href="#betting-history" className="dropdown-item">
                      Betting History
                    </a>
                    <a href="#promotion" className="dropdown-item">
                      Promotion
                    </a>
                    <a href="#profile" className="dropdown-item">
                      Profile
                    </a>
                    <button
                      className="logout-button dropdown-item"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                 </div> )}
              </div>
            </div>
          )}
        </div>
      </header>
      {/* Render Login Modal */}
      {isLoginModalVisible && (
        <LoginModal onClose={toggleLoginModal} />
      )}

      {isRegistrationModalVisible && (
        <RegistrationModal onClose={toggleRegistrationModal} />
      )}

      {isDepositMoneyModalVisible && (
        <DepositMoneyModal onClose={toggleDepositMoneyModal} />
      )}

    </>
  );
};

export default Header;
