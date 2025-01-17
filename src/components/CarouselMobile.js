import React, { useState, useEffect } from "react";
import "./CarouselMobile.css";
import banner1 from "../assets/images/banner1.jpg";
import banner2 from "../assets/images/banner2.jpg";
import banner3 from "../assets/images/banner3.jpg";

const CarouselMobile = () => {
  const images = [
    banner1,
    banner2,
    banner3
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrevIndex(currentIndex); // Set the current index as previous
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length); // Update to the next index
    }, 3000); // Change image every 5 seconds
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div className="carousel-mobile">
      {images.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Slide ${index + 1}`}
          className={`carousel-image-mobile ${
            index === currentIndex
              ? "active"
              : index === prevIndex
              ? "exit"
              : ""
          }`}
        />
      ))}
    </div>
  );
};

export default CarouselMobile;
