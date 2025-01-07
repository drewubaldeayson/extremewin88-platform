import React, { useState, useEffect} from "react";
import "./WithdrawMoneyModal.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebase";
import Swal from "sweetalert2";
import { sendWithdrawalTransaction } from "../services/firebase"; // Import the function
import gcashTransferImage from "../assets/images/gcash.png";

const WithdrawMoneyModal = ({ onClose }) => {
  const [walletAmount, setWalletAmount] = useState(0.0);
  const [selectedTab, setSelectedTab] = useState("GCash");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("GCash");
  const [showDepositMethodInstructions, setShowWithdrawalMethodInstructions] = useState(false);
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [username, setUserName] = useState("");
  const auth = getAuth();
  
  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  const handleAmountClick = (value) => {
    setAmount(value);
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
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
          const playerData = JSON.parse(localStorage.getItem("playerData"));
          const unsubscribeWallet = listenToWalletAmount(playerData.username);
          setUserName(playerData.username)
          console.log("USER NAME ", playerData.username)
  
          // Cleanup wallet listener on component unmount or logout
          return () => unsubscribeWallet();
        }
      });
  
      return () => unsubscribeAuth(); // Cleanup auth listener on component unmount
    }, [auth]);

  const handleWithdrawal = () => {
    if (!amount || isNaN(amount) || amount <= 0) {
        Swal.fire("Error", "Please enter a valid withdrawal amount.", "error");
        return;
    }

    if(amount > walletAmount){
        Swal.fire("Error", "You don't have enough wallet balance to withdraw.", "error");
        return;
    }

    
    setShowWithdrawalMethodInstructions(true);
  };

  const handleSendTransaction = async () => {

    if (!accountName) {
        Swal.fire("Error", "Please enter your account name.", "error");
        return;
    }

    if (!accountNumber) {
      Swal.fire("Error", "Please enter your account number.", "error");
      return;
    }

    try {
      await sendWithdrawalTransaction({method, amount, accountNumber, accountName, username });

      Swal.fire("Success", "Your withdrawal request has been submitted!", "success").then(() => {
        onClose(); // Close the modal after success
      });
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleBack = () => {
    setShowWithdrawalMethodInstructions(false);
  };

  return (
    <div className="withdraw-modal-overlay">
      <div className="withdraw-modal-container">
        <button className="withdraw-money-close-button" onClick={onClose}>
          &times;
        </button>

        <div className="withdraw-modal-header">
          {showDepositMethodInstructions && (
            <button className="back-button" onClick={handleBack}>
              &larr;
            </button>
          )}
          <h2 className="withdraw-modal-title">
            Withdraw thru {selectedTab}
          </h2>
        </div>

        {!showDepositMethodInstructions ? (
          <>
            
            <div className="tabs">
              <button
                className={`tab-button ${selectedTab === "GCash" ? "active" : ""}`}
                onClick={() => handleTabChange("GCash")}
              >
                GCash
              </button>
            </div>
            <p className="withdraw-modal-subtitle">Enjoy withdrawing your wins everyday!</p>
            <input
              type="text"
              placeholder="Enter Amount"
              value={amount}
              onChange={handleAmountChange}
              className="amount-input"
            />
            <div className="amount-buttons">
              {[50, 100, 500, 1000, 1500, 2000, 5000, 10000].map((value) => (
                <button
                  key={value}
                  className="amount-button"
                  onClick={() => handleAmountClick(value)}
                >
                  ₱ {value}
                </button>
              ))}
            </div>
            <button className="withdraw-button" onClick={handleWithdrawal}>
              Withdraw
            </button>
          </>
        ) : (
          <>
            <br/>
            <p className="important-instructions">
                ⚠️ <strong>Important Withdrawal Instructions</strong>
                <br/>
                <br />
                Please carefully enter your account number for us to process your withdrawal correctly.
                <br />
                <br/>
                Thank you for choosing a seamless payment experience with us!
            </p>

            <br/>
            <input
              type="text"
              placeholder="Enter Account Name"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              className="amount-input"
            />
            <br/>
            <input
              type="text"
              placeholder="Enter Account Number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="amount-input"
            />
            <button className="withdraw-button" onClick={handleSendTransaction}>
              Send
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default WithdrawMoneyModal;
