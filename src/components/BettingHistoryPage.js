import React, { useState, useEffect, useRef } from "react";
import "./BettingHistoryPage.css";
import {  fetchFilteredBettingHistoryList  } from "../services/firebase"; 
import { DateRangePicker } from "react-date-range";
import { enUS } from "date-fns/locale"; // or any other locale you need
import { getAuth, onAuthStateChanged } from "firebase/auth";

import "react-date-range/dist/styles.css"; 
import "react-date-range/dist/theme/default.css";

const BettingHistoryPage = () => {
  const [bettingHistoryList, setBettingHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gameProviderFilter, setGameProviderFilter] = useState("All");
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [temporaryDateRange, setTemporaryDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef(null);
  const [username, setUserName] = useState("");
  const auth = getAuth();

  useEffect(() => {
    const loadBettingHistoryList = async () => {
      try {
        const data = await fetchFilteredBettingHistoryList(gameProviderFilter, dateRange.startDate,
            dateRange.endDate, username);
        setBettingHistoryList(data);
        setLoading(false);
      } catch (error) {
        console.error("Error loading betting history:", error);
        setLoading(false);
      }
    };

    loadBettingHistoryList();
  }, [gameProviderFilter, dateRange]);

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
  

  const handleFilterChange = (e) => {
    setGameProviderFilter(e.target.value);
  };

  const applyDateRange = () => {
    setDateRange(temporaryDateRange);
    setShowDatePicker(false);
  };

  const handleDateRangeChange = (ranges) => {
    const { selection } = ranges;
    setTemporaryDateRange({
        startDate: selection.startDate,
        endDate: selection.endDate,
      });
  };

  const handleOutsideClick = (e) => {
    if (datePickerRef.current && !datePickerRef.current.contains(e.target)) {
      setShowDatePicker(false);
    }
  };

  useEffect(() => {
    if (showDatePicker) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showDatePicker]);

  return (
    <div className="betting-history-container">
      <h1 className="title">Betting History</h1>
      <div className="filters">
        <div className="date-range-dropdown">
          <button
            className="date-range-picker-toggle"
            onClick={() => setShowDatePicker(!showDatePicker)}
          >
            Select Date Range
          </button>
          {showDatePicker && (
            <div className="date-range-picker-popup" ref={datePickerRef}>
              <DateRangePicker
                ranges={[
                  {
                    startDate: temporaryDateRange.startDate,
                    endDate: temporaryDateRange.endDate,
                    key: "selection",
                  },
                ]}
                onChange={handleDateRangeChange}
                locale={enUS} 
                
              />
              <div className="date-picker-actions">
                <button className="apply-button" onClick={applyDateRange}>
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
        <select className="status-filter" value={gameProviderFilter} onChange={handleFilterChange}>
          <option value="All">All</option>
          <option value="jili">Jili</option>
          <option value="jdb">JDB</option>
          <option value="fachai">Fachai</option>
          <option value="pgsoft">PGSoft</option>
          <option value="pragmatic_play">Pragmatic Play</option>
          <option value="eazy_gaming">Eazy Gaming</option>
          <option value="game_art">GameArt</option>
          <option value="evolution_live">Evolution Live</option>
          <option value="relax_gaming">RelaxGaming</option>
          <option value="skywind">Skywind</option>
          <option value="playngo">PlayNGo</option>
          <option value="playson">Playson</option>
          <option value="evoplay">Evoplay</option>
          <option value="xgaming">XGaming</option>
          <option value="playtech">Playtech</option>
          <option value="pgsgaming">PGSGaming</option>
          <option value="rich88">Rich88</option>
          <option value="nextspin">NextSpin</option>
          <option value="microgaming">Microgaming</option>
        </select>
      </div>
      <div className="history-table">
        <div className="row header">
          <div className="cell">Date</div>
          <div className="cell">Game Provider</div>
          <div className="cell">Bet Count</div>
          <div className="cell">Valid Amount</div>
          <div className="cell">Win/Lose Amount</div>
        </div>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : bettingHistoryList.length === 0 ? (
            <div className="no-data">No data records found</div>
          ): (
            bettingHistoryList.map((bettingHistory) => (
            <div className="row" key={bettingHistory.id}>
              <div className="cell">{new Date(bettingHistory.created_at.seconds * 1000).toLocaleDateString()}</div>
              <div className="cell">{bettingHistory.game_provider}</div>
              <div className="cell">{bettingHistory.bet_count}</div>
              <div className="cell">₱{bettingHistory.total_bet_amount}</div>
              <div className="cell"> {bettingHistory.total_win_lose_amount < 0
        ? `-₱${Math.abs(bettingHistory.total_win_lose_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
        : `₱${bettingHistory.total_win_lose_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}</div>
            </div>
          ))
        )}
      </div>
      <div className="pagination">
        <button className="prev">{"<"}</button>
        <span className="page-info">Page 1 of 1</span>
        <button className="next">{">"}</button>
      </div>
    </div>
  );
};

export default BettingHistoryPage;
