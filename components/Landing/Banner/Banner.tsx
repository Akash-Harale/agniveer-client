'use client';

import { useState, useEffect } from 'react';
import "./Banner.css";

export default function Banner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const images = [
    "https://cbpssubscriber.mygov.in/assets/uploads/juGajmc1gOVBUtt5?67",
    "https://indianpsu.com/wp-content/uploads/2024/06/WhatsAppImage2024-01-25at3.39.42PMXT8M.jpeg",
    "https://www.mha.gov.in/sites/default/files/styles/homepage_top_slider/public/banner1_1_0_0_0.jpg?itok=STbFEEXc",
    "https://www.theweek.in/content/dam/week/magazine/theweek/cover/images/2024/2/8/26-Amit-Shah.jpg",
    "https://static.pib.gov.in/WriteReadData/userfiles/image/SKG_0052OQUV.JPG"
  ];

  // Auto slide every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(interval);
  }, [currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="banner-container">
      {/* Image Slider */}
      <div className="slider-wrapper">
        {images.map((img, index) => (
          <div
            key={index}
            className={`slide ${index === currentSlide ? 'active' : ''}`}
          >
            <img 
              src={img} 
              alt={`Slide ${index + 1}`}
            />
          </div>
        ))}
      </div>

      {/* Previous Button */}
      <button 
        onClick={prevSlide} 
        className="nav-button prev"
        aria-label="Previous slide"
      >
        &#10094;
      </button>

      {/* Next Button */}
      <button 
        onClick={nextSlide} 
        className="nav-button next"
        aria-label="Next slide"
      >
        &#10095;
      </button>

      {/* Dots Navigation */}
      <div className="dots-container">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
