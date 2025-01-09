import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import  { useState, useEffect  } from "react";
import Header from "./components/Header";
import Footer from './components/Footer';
import HomeScreen from './components/HomeScreen';
import AboutUsPage from './components/AboutUsPage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import TermsAndConditionsPage from './components/TermsAndConditionsPage';
import DepositMoneyHistoryPage from './components/DepositMoneyHistoryPage';
import WithdrawMoneyHistoryPage from './components/WithdrawMoneyHistoryPage';
import BettingHistoryPage from './components/BettingHistoryPage';
import PromotionsPage from './components/PromotionsPage';
import NewsPage from './components/NewsPage';
import Profile from './components/Profile';
import ProtectedRoute from "./components/ProtectedRoute";

import SlotsPage from './components/SlotsPage';
import CasinoPage from './components/CasinoPage';
import TableCardsPage from './components/TableCardsPage';
import FishingPage from './components/FishingPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Simulate authentication state
    const authStatus = !!localStorage.getItem("playerData");
    setIsAuthenticated(authStatus);
  }, []);

  return (
    <Router> 
      <div className="App">
        <Header/>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditionsPage />} />
          <Route path="/deposit-history" element={<ProtectedRoute isAuthenticated={isAuthenticated}> <DepositMoneyHistoryPage /></ProtectedRoute>} />
          <Route path="/withdraw-history" element={<ProtectedRoute isAuthenticated={isAuthenticated}> <WithdrawMoneyHistoryPage /></ProtectedRoute>} />
          <Route path="/betting-history" element={<ProtectedRoute isAuthenticated={isAuthenticated}><BettingHistoryPage /></ProtectedRoute>} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/promotions" element={<PromotionsPage />} />
          <Route path="/slots" element={<SlotsPage />} />
          <Route path="/casino" element={<CasinoPage />} />
          <Route path="/tablecards" element={<TableCardsPage />} />
          <Route path="/fishing" element={<FishingPage />} />
          <Route path="/news" element={<NewsPage />} />
        </Routes>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;
