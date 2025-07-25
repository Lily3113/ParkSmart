// src/components/HowItWorks.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// Import icons for each step
import { faMapMarkerAlt, faCreditCard, faCar } from '@fortawesome/free-solid-svg-icons';
import '../App.css'; // Link to its specific CSS

const HowItWorks = () => {
    return (
        <section className="how-it-works-section">
            <div className="how-it-works-header">
                <h2 className="how-it-works-title">How ParkSmart Works</h2>
                <p className="how-it-works-subtitle">Your seamless parking experience in 3 simple steps.</p>
            </div>
            <div className="steps-container">
                <div className="step-card">
                    <div className="step-icon-wrapper">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="step-icon" />
                    </div>
                    <h3 className="step-title">1. Find Your Spot</h3>
                    <p className="step-description">Easily search for available parking near your destination, filter by price, distance, and amenities.</p>
                </div>

                <div className="step-card">
                    <div className="step-icon-wrapper">
                        <FontAwesomeIcon icon={faCreditCard} className="step-icon" />
                    </div>
                    <h3 className="step-title">2. Book & Pay Securely</h3>
                    <p className="step-description">Reserve your desired spot and complete payment securely through the app in just a few taps.</p>
                </div>

                <div className="step-card">
                    <div className="step-icon-wrapper">
                        <FontAwesomeIcon icon={faCar} className="step-icon" />
                    </div>
                    <h3 className="step-title">3. Park Smart</h3>
                    <p className="step-description">Navigate directly to your reserved spot and enjoy hassle-free parking with real-time assistance.</p>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;