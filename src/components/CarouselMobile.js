import React, { useState, useEffect } from "react";
import "./CarouselMobile.css";

const CarouselMobile = () => {
  const images = [
    "https://bw69.stobjs.com/banner/17349821271486936806.jpg",
    "https://bw69.stobjs.com/banner/1728552277998169092.jpg",
    "https://bw69.stobjs.com/banner/17277176291891948879.jpg",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="carousel-mobile">
      <img
        src={images[currentIndex]}
        alt={`Slide ${currentIndex + 1}`}
        className="carouse-image-mobile"
      />
    </div>
  );
};

export default CarouselMobile;
