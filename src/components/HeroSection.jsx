// src/components/HeroSection.jsx
import React from 'react';
import '../App.css'; // Link to its specific CSS

const HeroSection = () => {
    return (
        <section className="hero-section">
            <div className="hero-overlay"></div> {/* Optional overlay for text readability */}
            <div className="hero-content">
                <h1 className="hero-title">Find Your Perfect Parking Spot. Instantly.</h1>
                <p className="hero-subtitle">Discover, reserve, and manage parking with ParkSmart – your ultimate smart parking solution.</p>
                
                {/* Search Bar / Call to Action */}
                <div className="hero-search-bar">
                    <input type="text" placeholder="Enter location or address..." className="search-input" />
                    <button className="search-button">Find Parking</button>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;