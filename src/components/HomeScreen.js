import PromotionalHighlights from './PromotionalHighlights';
import HomePage from './HomePage';
import React from "react";
import BottomNavBar from './BottomNavBar';
import TabMenu from './TabMenu';

const HomeScreen =() => {
    return (
        <>{/* PROVIDERS LIST FOR MOBILE VIEW MENU */}
            <TabMenu /><PromotionalHighlights /><HomePage /><BottomNavBar/></>
    );
}

export default HomeScreen;