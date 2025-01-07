import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
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

function App() {
  return (
    <Router> 
      <div className="App">
        <Header/>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditionsPage />} />
          <Route path="/deposit-history" element={<DepositMoneyHistoryPage />} />
          <Route path="/withdraw-history" element={<WithdrawMoneyHistoryPage />} />
          <Route path="/betting-history" element={<BettingHistoryPage />} />
          <Route path="/promotions" element={<PromotionsPage />} />
        </Routes>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;
