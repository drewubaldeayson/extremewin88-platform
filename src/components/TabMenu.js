import React from 'react';
import './TabMenu.css';

const TabMenu = () => {
  return (
    <div className="tab-menu-container">
      <ul className="tab-menu">
        <li><a href="/casino">Casino</a></li>
        <li><a href="/slots">Slots</a></li>
        <li><a href="/tablecards">Table & Cards</a></li>
        <li><a href="/fishing">Fishing</a></li>
        <li><a href="/search">Search</a></li>
      </ul>
    </div>
  );
};

export default TabMenu;