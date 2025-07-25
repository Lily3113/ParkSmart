// src/pages/AboutUsDetails.jsx

import React from 'react';
import '../App.css'; // Link to its specific CSS

// Receive navigateTo prop to go back to homepage
const AboutUsDetails = ({ navigateTo }) => {
    return (
        <section className="about-us-details-section">
            <div className="about-us-details-content">
                <h1 className="about-us-details-title">Our Full Story & Vision</h1>
                <p className="about-us-details-paragraph">
                    ParkSmart was founded with a singular vision: to eliminate the daily parking headache for urban dwellers. Our journey began with recognizing the immense time, fuel, and frustration wasted in searching for parking spots in bustling city centers. We envisioned a smarter, more connected solution that could transform this experience from a chore into a seamless part of your journey.
                </p>
                <p className="about-us-details-paragraph">
                    Our platform is built on robust real-time data, connecting drivers directly with available parking spaces across a vast network of private and public lots. We've invested heavily in intuitive design and secure payment gateways to ensure that from the moment you search to the moment you park, your experience is effortless and reliable. We believe that urban mobility should be about convenience, not congestion.
                </p>
                <p className="about-us-details-paragraph">
                    Beyond just finding a spot, ParkSmart is committed to contributing to smarter cities. By optimizing parking space utilization, we aim to reduce traffic congestion, lower carbon emissions, and make urban environments more livable. Our technology is continuously evolving, with plans to integrate advanced features like predictive parking, electric vehicle charging spot reservations, and dynamic pricing models.
                </p>
                <p className="about-us-details-paragraph">
                    Join us as we drive towards a future where parking is no longer a problem, but a simple, integrated part of modern life. ParkSmart: Innovating urban mobility, one spot at a time.
                </p>
                <button className="btn btn-primary ripple-effect" onClick={() => navigateTo('home')}>
                    Go Back to Homepage
                </button>
            </div>
        </section>
    );
};

export default AboutUsDetails;