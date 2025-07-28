// src/pages/BookingPage.jsx
// This component will handle the booking process for a parking spot.

import React, { useState, useEffect } from 'react';
import '../App.css'; // Assuming shared styles
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// THIS LINE IS CRITICAL: Ensure faSpinner is explicitly imported here
import { faParking, faClock, faCalendarAlt, faCreditCard, faCheckCircle, faTimesCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';

const BookingPage = ({ navigateTo, location }) => {
    // In a real application, you would pass spot details via state or URL params
    // For now, we'll use placeholder data.
    const [spotDetails, setSpotDetails] = useState(() => {
        // Use location.state for initial data, fallback to dummy data
        const initialState = location?.state || {};
        return {
            id: initialState.spotId || 'SPOT123',
            name: initialState.spotName || 'Downtown Parking Spot A',
            pricePerHour: initialState.pricePerHour || 2.50,
            currency: initialState.currency || '$',
            address: initialState.address || '123 Main St, City, Country',
        };
    });

    const [bookingDuration, setBookingDuration] = useState(1); // Duration in hours
    const [totalCost, setTotalCost] = useState(0);
    const [bookingMessage, setBookingMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [isBooking, setIsBooking] = useState(false);

    // Update total cost whenever duration or price changes
    useEffect(() => {
        setTotalCost(spotDetails.pricePerHour * bookingDuration);
    }, [bookingDuration, spotDetails.pricePerHour]);

    const handleDurationChange = (e) => {
        const duration = parseInt(e.target.value);
        if (!isNaN(duration) && duration > 0) {
            setBookingDuration(duration);
        } else {
            setBookingDuration(1); // Default to 1 hour if invalid input
        }
    };

    const handleConfirmBooking = async () => {
        setIsBooking(true);
        setBookingMessage('');
        setMessageType('');

        // Simulate API call for booking
        try {
            console.log(`Attempting to book spot ${spotDetails.id} for ${bookingDuration} hours. Total: ${spotDetails.currency}${totalCost.toFixed(2)}`);
            // In a real app: call Firebase/backend to update spot status, record booking
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay

            setBookingMessage('Booking successful! Enjoy your parking.', 'success');
            setMessageType('success');
            console.log("Booking confirmed!");

            // Optional: Navigate to a confirmation page or back to map after successful booking
            setTimeout(() => {
                navigateTo('/map');
            }, 2000);

        } catch (error) {
            console.error("Booking error:", error);
            setBookingMessage(`Booking failed: ${error.message || 'Please try again.'}`, 'error');
            setMessageType('error');
        } finally {
            setIsBooking(false);
        }
    };

    return (
        <section className="booking-page-section settings-page-section"> {/* Reusing settings-page-section for consistent layout */}
            <div className="booking-page-container settings-container"> {/* Reusing settings-container */}
                <h2>Confirm Your Booking</h2>
                <p className="settings-description">Review details and confirm your parking spot reservation.</p>

                {bookingMessage && (
                    <div className={`message-box ${messageType}`}>
                        <FontAwesomeIcon icon={messageType === 'success' ? faCheckCircle : faTimesCircle} />
                        <span>{bookingMessage}</span>
                    </div>
                )}

                <div className="booking-details-card">
                    <h3><FontAwesomeIcon icon={faParking} /> Spot Details</h3>
                    <p><strong>Spot ID:</strong> {spotDetails.id}</p>
                    <p><strong>Location:</strong> {spotDetails.name} ({spotDetails.address})</p>
                    <p><strong>Price per hour:</strong> {spotDetails.currency}{spotDetails.pricePerHour.toFixed(2)}</p>
                </div>

                <div className="booking-form-group">
                    <label htmlFor="bookingDuration"><FontAwesomeIcon icon={faClock} /> Booking Duration (hours):</label>
                    <input
                        type="number"
                        id="bookingDuration"
                        value={bookingDuration}
                        onChange={handleDurationChange}
                        min="1"
                        max="24"
                        step="1"
                        disabled={isBooking}
                    />
                </div>

                <div className="booking-summary-card">
                    <h3><FontAwesomeIcon icon={faCreditCard} /> Total Cost</h3>
                    <p className="total-cost">{spotDetails.currency}{totalCost.toFixed(2)}</p>
                </div>

                <div className="booking-actions">
                    <button
                        className="btn btn-primary ripple-effect"
                        onClick={handleConfirmBooking}
                        disabled={isBooking || bookingDuration < 1}
                    >
                        {isBooking ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Confirm Booking'}
                    </button>
                    <button
                        className="btn btn-secondary ripple-effect"
                        onClick={() => navigateTo('/map')}
                        disabled={isBooking}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </section>
    );
};

export default BookingPage;