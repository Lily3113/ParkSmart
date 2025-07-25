// src/pages/HomePage.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for internal navigation

import HeroSection from '../components/HeroSection';
import AboutUs from '../components/AboutUs';
import FeaturesSection from '../components/FeaturesSection';
import PricingSection from '../components/PricingSection';
import TestimonialsSection from '../components/TestimonialsSection';
import FAQSection from './FAQSection';

const HomePage = () => {
    const navigate = useNavigate();

    // The navigateTo function will now use react-router-dom's navigate
    const navigateTo = (path) => {
        navigate(path);
        window.scrollTo(0, 0); // Scroll to top on navigation
    };

    return (
        <>
            <HeroSection />
            <AboutUs navigateTo={navigateTo} />
            <FeaturesSection />
            <PricingSection />
            <TestimonialsSection />
            <FAQSection navigateTo={navigateTo} />
        </>
    );
};

export default HomePage;