import React, { useState, useEffect } from "react";
import "./DepositMoneyModal.css";
import Swal from "sweetalert2";
import { sendDepositTransaction } from "../services/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import gcashTransferImage from "../assets/images/gcash.png";

const DepositMoneyModal = ({ onClose }) => {
  const [selectedTab, setSelectedTab] = useState("GCash");
  const [amount, setAmount] = useState("");
  const [showGCashInstructions, setShowGCashInstructions] = useState(false);
  const [transactionNumber, setTransactionNumber] = useState("");
  const [username, setUserName] = useState("");
  const auth = getAuth();

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  const handleAmountClick = (value) => {
    setAmount(value);
  };

  const handleAmountChange = (e) => {
    if(e.target.value > 50000){
      Swal.fire("Error", "Maximum deposit amount is Php 50,000.", "error");
    }else{
      setAmount(e.target.value);
    }
    
  };

  const handleDeposit = () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      Swal.fire("Error", "Please enter a valid deposit amount.", "error");
      return;
    }

    if(amount < 100){
      Swal.fire("Error", "Minimum deposit amount is Php 100.", "error");
      return;
    }

    setShowGCashInstructions(true);
  };

  const handleSendTransaction = async () => {
    if (!transactionNumber) {
      Swal.fire("Error", "Please enter the transaction number.", "error");
      return;
    }

    try {
      await sendDepositTransaction({ amount, transactionNumber, username });

      Swal.fire("Success", "Your deposit request has been submitted!", "success").then(() => {
        onClose(); // Close the modal after success
      });
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleBack = () => {
    setShowGCashInstructions(false);
  };

  useEffect(() => {
        // Listen for changes in Firebase authentication state
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const playerData = JSON.parse(localStorage.getItem("playerData"));
        setUserName(playerData.username)
        return true;
      }
    });

    return () => unsubscribeAuth();
  }, [auth]);

  return (
    <div className="deposit-modal-overlay">
      <div className="deposit-modal-container">
        <button className="deposit-money-close-button" onClick={onClose}>
          &times;
        </button>

        <div className="deposit-modal-header">
          {showGCashInstructions && (
            <button className="back-button" onClick={handleBack}>
              &larr;
            </button>
          )}
          <h2 className="deposit-modal-title">
            Deposit thru {selectedTab}
          </h2>
        </div>

        {!showGCashInstructions ? (
          <>
            
            <div className="tabs">
              <button
                className={`tab-button ${selectedTab === "GCash" ? "active" : ""}`}
                onClick={() => handleTabChange("GCash")}
              >
                GCash
              </button>
            </div>
            <p className="deposit-modal-subtitle">Start Earning and Enjoy the Thrill! Deposit Now and Play!</p>
            <input
              type="number"
              placeholder="Enter Amount"
              value={amount}
              onChange={handleAmountChange}
              className="amount-input"
            />
            <div className="withdraw-modal-note">Note: Minimum of Php 100 and Maximum of Php 50,000 per deposit</div>
            <div className="amount-buttons">
              {[50, 100, 500, 1000, 1500, 2000, 5000, 10000, 50000].map((value) => (
                <button
                  key={value}
                  className="amount-button"
                  onClick={() => handleAmountClick(value)}
                >
                  ₱ {value}
                </button>
              ))}
            </div>
            <button className="deposit-button" onClick={handleDeposit}>
              Deposit
            </button>
          </>
        ) : (
          <>
            <br/>
            <p className="important-instructions">
                ⚠️ <strong>Important Deposit Instructions</strong>
                <br/>
                <br />
                Please proceed with the payment using one of the following methods:
                <br />
                <br/>
                <strong>1. Send Money:</strong> Enter the following GCash number in your GCash app to send the amount <strong>₱{amount}</strong> directly.
                <br />
                <br/>
                <strong>2. Scan QR Code:</strong> Alternatively, you can scan the QR code below to make the payment. Ensure the amount <strong>₱{amount}</strong> is entered correctly.
                <br />
                <br/>
                After successfully completing the payment, kindly note down the reference or transaction number. Once done, submit the transaction details to us to confirm your payment.
                <br />
                <br/>
                <strong className="important-note">Please note! The use of words such as "bet", "ExtremeWin88", or "gambling" in the reference section is strictly prohibited when transferring money.</strong>
                <br/>
                <br/>
                Thank you for choosing a seamless payment experience with us!
            </p>

            <div className="gcash-details">
              <h3>1. GCash Number</h3>
              <br/>
              <table className="gcash-table">
                <tbody>
                <tr>
                    <td className="gcash-label">GCash</td>
                    <td className="gcash-value">
                    <span id="gcash-number">0961 783 7182</span>
                    <button
                        className="copy-button"
                        onClick={() => {
                        const text = document.getElementById("gcash-number").textContent;
                        navigator.clipboard.writeText(text).then(() => {
                            alert("GCash number copied!");
                        });
                        }}
                    >
                        📋
                    </button>
                    </td>
                </tr>
                <tr>
                    <td className="gcash-label">Price Amount</td>
                    <td className="gcash-value">₱{amount}</td>
                </tr>
                </tbody>
            </table>
            </div>
            <br/>
            <div className="gcash-qr">
                <h3>2. GCash QR</h3>
                <br/>
                <div className="qr-container">
                    <img src={gcashTransferImage} alt="GCash QR Code" className="qr-code" />
                </div>
            </div>
            <br/>
            <input
              type="text"
              placeholder="Enter Transaction Number"
              value={transactionNumber}
              onChange={(e) => setTransactionNumber(e.target.value)}
              className="amount-input"
            />
            <button className="deposit-button" onClick={handleSendTransaction}>
              Send
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default DepositMoneyModal;
