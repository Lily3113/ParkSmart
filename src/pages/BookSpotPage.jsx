// src/pages/BookSpotPage.jsx

import React, { useState } from 'react';
import '../App.css'; // Link to its specific CSS
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faCalendarAlt, faClock, faSearch } from '@fortawesome/free-solid-svg-icons';

const BookSpotPage = ({ navigateTo }) => {
    const [location, setLocation] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        // In a real app, you'd send these values to an API to search for parking spots
        console.log("Searching for parking:", { location, date, time });
        // For now, we'll just log and maybe show a simple message
        alert(`Searching for spots at ${location} on ${date} at ${time}.`);
        // You might navigate to a results page here later
    };

    return (
        <section className="book-spot-page-section">
            <div className="book-spot-header">
                <h1 className="book-spot-title">Find & Book Your Parking Spot</h1>
                <p className="book-spot-subtitle">Enter your details to find available parking near you.</p>
            </div>
            
            <form className="booking-form" onSubmit={handleSearch}>
                <div className="input-group">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="input-icon" />
                    <input
                        type="text"
                        placeholder="Enter location or address"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                        className="form-input"
                    />
                </div>
                <div className="date-time-group">
                    <div className="input-group date-time-field">
                        <FontAwesomeIcon icon={faCalendarAlt} className="input-icon" />
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                            className="form-input"
                        />
                    </div>
                    <div className="input-group date-time-field">
                        <FontAwesomeIcon icon={faClock} className="input-icon" />
                        <input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            required
                            className="form-input"
                        />
                    </div>
                </div>
                <button type="submit" className="btn btn-primary ripple-effect btn-search">
                    <FontAwesomeIcon icon={faSearch} className="btn-icon" /> Search Spots
                </button>
            </form>

            <div className="back-to-home-prompt">
                <p>Looking for general information?</p>
                <button className="btn btn-secondary ripple-effect" onClick={() => navigateTo('home')}>
                    Back to Homepage
                </button>
            </div>
        </section>
    );
};

export default BookSpotPage;