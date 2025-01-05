import logo from './logo.svg';
import './App.css';
import HomePage from './components/HomePage';
import Header from "./components/Header";
import PromotionalHighlights from './components/PromotionalHighlights';
import GameSection from "./components/GameSection";
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <Header/>
      <PromotionalHighlights/>
      <HomePage />
      <Footer/>
    </div>
  );
}

export default App;
