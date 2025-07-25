// src/components/AboutUs.jsx
import React from 'react';
import '../App.css'; // Link to its specific CSS

const AboutUs = () => {
    return (
        <section className="about-us-section">
            {/* Main title for the section, centered above both columns */}
            <h2 className="about-us-main-title">About ParkSmart</h2>

            <div className="about-us-columns-container">
                {/* Image on the left */}
                <div className="about-us-image-wrapper">
                    <img 
                        src="/images/park.jpeg" 
                        alt="About ParkSmart" 
                        className="about-us-image" 
                        onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x400/CCCCCC/333333?text=Image+Not+Found'; }}
                    />
                    {/* IMPORTANT: Replace the placeholder URL above with your actual image path.
                        For example, if your image is in public/images/about-us.jpg, use src="/images/about-us.jpg" */}
                </div>
                
                {/* Text content on the right */}
                <div className="about-us-content">
                    <p className="about-us-description">
                        ParkSmart is your innovative solution designed to simplify the parking experience in urban areas. We understand the daily frustrations of finding a parking spot, and our mission is to make that a thing of the past.
                    </p>
                    <p className="about-us-description">
                        Our platform provides real-time information on available parking lots, pricing, and amenities, enabling you to find and reserve the perfect spot with ease. Whether you're looking for covered, open, or secure parking, ParkSmart connects you to a vast network of options.
                    </p>
                    <p className="about-us-description">
                        We are committed to providing a hassle-free, efficient, and reliable service that enhances your urban mobility. Join the ParkSmart community and experience the future of parking.
                    </p>
                    <a href="#about-more" className="btn btn-primary ripple-effect">Read More</a>
                </div>
            </div>
        </section>
    );
};

export default AboutUs;