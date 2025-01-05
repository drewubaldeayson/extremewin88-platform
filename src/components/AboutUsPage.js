import React from "react";
import "./AboutUsPage.css"; // Optional: Include CSS for styling

const AboutUsPage = () => {
  return (
    <div className="about-us-container">
      <h1>About Us</h1>
      <div className="about-us-sections">
        <div className="about-us-mission">
          <h2>Our Mission</h2>
          <p>
            At ExtremeWin88, our mission is to create a dynamic gaming environment
            that is accessible, enjoyable, and rewarding for players of all
            levels. We are passionate about innovation and continuously strive
            to enhance our platform to provide the best possible gaming
            experience.
          </p>
        </div>
        <div className="about-us-offer">
          <h2>What We Offer</h2>
          <p>
            Our platform features a diverse range of games, from classic
            favorites to new and innovative titles. Whether you're into
            strategy, action, adventure, or casino games, ExtremeWin88 has
            something for everyone. Our games are designed to be user-friendly,
            with seamless graphics and gameplay that will immerse you in a world
            of fun and excitement.
          </p>
        </div>
      </div>
      <div className="about-us-why-choose">
        <h2>Why Choose ExtremeWin88?</h2>
        <ul>
          <li>Wide variety of games to suit every taste</li>
          <li>Regularly updated with new and exciting content</li>
          <li>User-friendly interface and seamless gameplay</li>
          <li>Safe and secure gaming environment</li>
          <li>Win 24/7</li>
          <li>24/7 customer support to assist you with any queries</li>
        </ul>
      </div>
      <div className="about-us-contact">
        <h2>Contact Us</h2>
        <p>
          We value our players and are always here to help. If you have any
          questions, suggestions, or feedback, please feel free to reach out to
          us via our live chat button at the bottom right corner of the page.
        </p>
      
      </div>
    </div>
  );
};

export default AboutUsPage;
