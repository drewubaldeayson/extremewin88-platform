import React, {useState, useEffect} from "react";
import "./BottomNavBar.css"; // Import the CSS file
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { Navigate, useNavigate } from "react-router-dom";
import depositIcon from "../assets/icons/deposit-icon.png";
import withdrawIcon from "../assets/icons/withdraw-icon.png";
import promoIcon from "../assets/icons/promo-icon.png";
import chatIcon from "../assets/icons/chat-icon.png";
import loginIcon from "../assets/icons/login-icon.png";
import registerIcon from "../assets/icons/register-icon.png";
import WithdrawMoneyModal from "./WithdrawMoneyModal";
import DepositMoneyModal from "./DepositMoneyModal";
import LoginModal from "./LoginModal";
import RegistrationModal from "./RegistrationModal";

function BottomNavBar() {
  const navigate = useNavigate();
  const [isDepositMoneyModalVisible, setIsDepositMoneyModalVisible] = useState(false);
  const [isWithdrawMoneyModalVisible, setIsWithdrawMoneyModalVisible] = useState(false);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [isRegistrationModalVisible, setIsRegistrationModalVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inviteCodeFromURL, setInviteCodeFromURL] = useState("");
    const auth = getAuth();

  const toggleDepositMoneyModal = () => {
    setIsDepositMoneyModalVisible(!isDepositMoneyModalVisible);
  }

  const toggleWitdrawMoneyModal = () => {
    setIsWithdrawMoneyModalVisible(!isWithdrawMoneyModalVisible);
  }

  const toggleLoginModal = () => {
    setIsLoginModalVisible(!isLoginModalVisible);
  }

  const toggleRegisterModal = () => {
    setIsRegistrationModalVisible(!isRegistrationModalVisible);
  }
  

  function openLiveChat() {
    // Check if OpenWidget is ready
    if (window.OpenWidget && typeof window.OpenWidget.call === "function") {
      window.OpenWidget.call('open');
    } else {
      console.log("OpenWidget is not loaded yet. Trying again...");
      // Optionally, try again after a delay if it's not loaded
      setTimeout(openLiveChat, 500);
    }
  }

  const handleNavigation = (menu) => {
    if(menu == "Deposit"){  
      toggleDepositMoneyModal();
    }

    else if(menu == "Withdraw"){
      toggleWitdrawMoneyModal();
    }

    else if(menu == "Promo"){
        navigate('/promotions');
    }

    else if(menu == "Chat"){
      openLiveChat();
    }

    else if(menu == "Login"){  
      toggleLoginModal();
    }

    else if(menu == "Register"){
      toggleRegisterModal();
    }
  };

  useEffect(() => {
      // Listen for changes in Firebase authentication state
      const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
        if (user) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
                  
          // Check the URL for 'invite-code' and open registration modal if it exists
          const urlParams = new URLSearchParams(window.location.search);
          const inviteCode = urlParams.get("code");
          if (inviteCode) {
              setInviteCodeFromURL(inviteCode);
              setIsRegistrationModalVisible(true);
          }
        }
      });
  
      return () => unsubscribeAuth(); // Cleanup auth listener on component unmount
  }, [auth]);

  return (
    <div className="bottom-nav">
      {(isAuthenticated && (
      <div
        className="nav-item"
        onClick={() => handleNavigation("Deposit")}
      >
        <span className="nav-icon"><img src={depositIcon}/></span>
        <span className="nav-label">Deposit</span>
      </div>))
      }
      {(!isAuthenticated && (
      <div
        className="nav-item"
        onClick={() => handleNavigation("Login")}
      >
        <span className="nav-icon"><img src={loginIcon}/></span>
        <span className="nav-label">Login</span>
      </div>))
      }

      {(isAuthenticated && (
      <div
        className="nav-item"
        onClick={() => handleNavigation("Withdraw")}
      >
        <span className="nav-icon"><img src={withdrawIcon}/></span>
        <span className="nav-label">Withdraw</span>
      </div>))
      }

      {(!isAuthenticated && (
      <div
        className="nav-item"
        onClick={() => handleNavigation("Register")}
      >
        <span className="nav-icon"><img src={registerIcon}/></span>
        <span className="nav-label">Register</span>
      </div>))
      }


      <div
        className="nav-item"
        onClick={() => handleNavigation("Promo")}
      >
        <span className="nav-icon"><img src={promoIcon}/></span>
        <span className="nav-label">Promo</span>
      </div>
      <div
        className="nav-item"
        onClick={() => handleNavigation("Chat")}
      >
        <span className="nav-icon"><img src={chatIcon}/></span>
        <span className="nav-label">Chat</span>
      </div>

      
      {isDepositMoneyModalVisible && (
        <DepositMoneyModal onClose={toggleDepositMoneyModal} />
      )}

      {isWithdrawMoneyModalVisible && (
        <WithdrawMoneyModal onClose={toggleWitdrawMoneyModal} />
      )}

      {isLoginModalVisible && (
        <LoginModal onClose={toggleLoginModal} onToggleRegistrationModal={toggleRegisterModal} />
      )}

      {isRegistrationModalVisible && (
        <RegistrationModal onClose={toggleRegisterModal} inviteCodeFromURL={inviteCodeFromURL} />
      )}
    </div>
  );
}

export default BottomNavBar;
