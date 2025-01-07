import React, { useState, useEffect, useRef } from "react";
import "./DepositMoneyHistoryPage.css";
import { fetchDepositRequests, fetchFilteredDepositRequests  } from "../services/firebase"; 
import { DateRangePicker } from "react-date-range";
import { enUS } from "date-fns/locale"; // or any other locale you need

import "react-date-range/dist/styles.css"; 
import "react-date-range/dist/theme/default.css";

const DepositHistory = () => {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
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

  useEffect(() => {
    const loadDeposits = async () => {
      try {
        const data = await fetchFilteredDepositRequests(statusFilter, dateRange.startDate,
            dateRange.endDate);
        setDeposits(data);
        setLoading(false);
      } catch (error) {
        console.error("Error loading deposits:", error);
        setLoading(false);
      }
    };

    loadDeposits();
  }, [statusFilter, dateRange]);

  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
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
    <div className="deposit-history-container">
      <h1 className="title">Deposit History</h1>
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
        <select className="status-filter" value={statusFilter} onChange={handleFilterChange}>
          <option value="All">All</option>
          <option value="processing">Processing</option>
          <option value="successful">Successful</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      <div className="history-table">
        <div className="row header">
          <div className="cell">Status</div>
          <div className="cell">Amount</div>
          <div className="cell">Deposit Method</div>
          <div className="cell">Reference Number</div>
          <div className="cell">Time</div>
        </div>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : deposits.length === 0 ? (
            <div className="no-data">No data records found</div>
          ): (
          deposits.map((deposit) => (
            <div className="row" key={deposit.id}>
              <div className="cell">{deposit.status[0].toUpperCase()+deposit.status.substring(1)}</div>
              <div className="cell">₱{deposit.deposit_amount}</div>
              <div className="cell">{deposit.deposit_method}</div>
              <div className="cell">{deposit.deposit_transaction_number}</div>
              <div className="cell">
                {new Date(deposit.created_at.seconds * 1000).toLocaleString()}
              </div>
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

export default DepositHistory;
