// src/components/FeaturesSection.jsx

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// Icons for How It Works
import { faMapMarkerAlt, faCreditCard, faCar } from '@fortawesome/free-solid-svg-icons';
// Icons for Why Choose Us
import { faShieldAlt, faMobileAlt, faDollarSign, faClock, faHeadset, faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons';
import '../App.css'; // Link to its specific CSS

const FeaturesSection = () => {
    const howItWorksSteps = [
        {
            icon: faMapMarkerAlt,
            title: "1. Find Your Spot",
            description: "Easily search for available parking near your destination, filter by price, distance, and amenities."
        },
        {
            icon: faCreditCard,
            title: "2. Book & Pay Securely",
            description: "Reserve your desired spot and complete payment securely through the app in just a few taps."
        },
        {
            icon: faCar,
            title: "3. Park Smart",
            description: "Navigate directly to your reserved spot and enjoy hassle-free parking with real-time assistance."
        }
    ];

    const whyChooseUsBenefits = [
        {
            icon: faShieldAlt,
            title: "Secure & Reliable",
            description: "Your parking is safe with us. We partner with trusted facilities to ensure peace of mind."
        },
        {
            icon: faMobileAlt,
            title: "Effortless Booking",
            description: "Book your spot in seconds through our intuitive app or website, anytime, anywhere."
        },
        {
            icon: faDollarSign,
            title: "Transparent Pricing",
            description: "No hidden fees. See clear, upfront pricing before you book, always."
        },
        {
            icon: faClock,
            title: "Real-time Availability",
            description: "Access live updates on available parking spots, saving you time and fuel."
        },
        {
            icon: faHeadset,
            title: "24/7 Support",
            description: "Our dedicated support team is always ready to assist you, day or night."
        },
        {
            icon: faMapMarkedAlt,
            title: "Easy Navigation",
            description: "Get precise directions directly to your reserved spot, minimizing stress."
        }
    ];

    return (
        <section className="features-section">
            <div className="features-header">
                <h2 className="features-main-title">Why ParkSmart is Your Best Choice</h2>
                <p className="features-main-subtitle">Discover how we simplify parking and why we're the preferred solution.</p>
            </div>

            {/* How It Works Sub-section */}
            <div className="how-it-works-subsection">
                {/* REMOVED: <h3 className="subsection-title">How It Works</h3> */}
                <p className="subsection-intro-text">Your seamless parking experience in 3 simple steps:</p> {/* Changed to intro text */}
                <div className="steps-container">
                    {howItWorksSteps.map((step, index) => (
                        <div className="step-card card-hover-scale" key={index}>
                            <div className="step-icon-wrapper">
                                <FontAwesomeIcon icon={step.icon} className="step-icon" />
                            </div>
                            <h4 className="step-title">{step.title}</h4>
                            <p className="step-description">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Why Choose Us Sub-section */}
            <div className="why-choose-us-subsection">
                {/* REMOVED: <h3 className="subsection-title">Why Choose Us</h3> */}
                <p className="subsection-intro-text">Experience the difference with our unparalleled features and commitment to your convenience:</p> {/* Changed to intro text */}
                <div className="benefits-grid">
                    {whyChooseUsBenefits.map((benefit, index) => (
                        <div className="benefit-card card-hover-scale" key={index}>
                            <div className="benefit-icon-wrapper">
                                <FontAwesomeIcon icon={benefit.icon} className="benefit-icon" />
                            </div>
                            <h4 className="benefit-title">{benefit.title}</h4>
                            <p className="benefit-description">{benefit.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;