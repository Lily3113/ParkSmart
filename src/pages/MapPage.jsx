// src/pages/MapPage.jsx

import React, { useRef, useEffect, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTimes, faCheckCircle, faParking, faClock, faDollarSign,
    faMobileAlt, faMoneyBillWave, faCreditCard, faSpinner, faEuroSign, faTimesCircle
} from '@fortawesome/free-solid-svg-icons';

import { useFirebase } from '../context/FirebaseContext';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, onSnapshot } from 'firebase/firestore';
import { Link } from 'react-router-dom';

// Fix for default Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icon definitions
const availableIcon = new L.DivIcon({
    className: 'custom-div-icon available-marker',
    html: `<div class="marker-pin available-pin"></div><i class="fa fa-parking marker-icon"></i>`,
    iconSize: [30, 42],
    iconAnchor: [15, 42]
});

const selectedIcon = new L.DivIcon({
    className: 'custom-div-icon selected-marker',
    html: `<div class="marker-pin selected-pin"></div><i class="fa fa-parking marker-icon"></i>`,
    iconSize: [30, 42],
    iconAnchor: [15, 42]
});

const bookedIcon = new L.DivIcon({
    className: 'custom-div-icon booked-marker',
    html: `<div class="marker-pin booked-pin"></div><i class="fa fa-parking marker-icon"></i>`,
    iconSize: [30, 42],
    iconAnchor: [15, 42]
});

const USD_TO_ZWL_RATE = 40;

const MapPage = ({ navigateTo, showModal }) => {
    const { db, user, isAuthReady, appId } = useFirebase();
    const mapRef = useRef(null);
    const leafletMapRef = useRef(null);
    const markerRefs = useRef({});

    const [spots, setSpots] = useState([]);
    const [selectedSpot, setSelectedSpot] = useState(null);
    const [activeBookingTimers, setActiveBookingTimers] = useState({});
    const intervalRefs = useRef({});

    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('ecocash');
    const [selectedCurrency, setSelectedCurrency] = useState('ZWL');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [userEnteredAmount, setUserEnteredAmount] = useState('');
    const [paymentLoading, setPaymentLoading] = useState(false);

    const handleResize = useCallback(() => {
        if (leafletMapRef.current) {
            leafletMapRef.current.invalidateSize();
            console.log("Map invalidateSize called on window resize.");
        }
    }, []);

    const convertAmount = useCallback((amount, fromCurrency, toCurrency) => {
        if (fromCurrency === toCurrency) {
            return amount;
        }
        if (fromCurrency === 'USD' && toCurrency === 'ZWL') {
            return amount * USD_TO_ZWL_RATE;
        }
        if (fromCurrency === 'ZWL' && toCurrency === 'USD') {
            return amount / USD_TO_ZWL_RATE;
        }
        return amount;
    }, []);

    const validatePhoneNumber = useCallback((number, method) => {
        const cleanedNumber = number.replace(/[^0-9]/g, '');

        if (!cleanedNumber.startsWith('07') || cleanedNumber.length !== 10) {
            return "Phone number must be 10 digits and start with '07' (e.g., 0771234567).";
        }

        if (method === 'ecocash') {
            if (!cleanedNumber.startsWith('077') && !cleanedNumber.startsWith('078')) {
                return "EcoCash numbers must start with 077 or 078.";
            }
        } else if (method === 'onemoney') {
            if (!cleanedNumber.startsWith('071')) {
                return "OneMoney numbers must start with 071.";
            }
        }
        return "";
    }, []);

    const handleMarkerClick = useCallback((spotId) => {
        const spot = spots.find(s => s.id === spotId);
        if (spot) {
            setSelectedSpot(spot);
            setShowPaymentModal(false);
            setPhoneNumber('');
            setUserEnteredAmount(convertAmount(spot.priceUSD, 'USD', selectedCurrency).toFixed(2));
            console.log(`Marker clicked: ${spot.id}, Status: ${spot.status}`);
        }
    }, [spots, selectedCurrency, convertAmount]);


    // --- Effect for Map Initialization ---
    useEffect(() => {
        if (mapRef.current && !leafletMapRef.current) {
            leafletMapRef.current = L.map(mapRef.current, {
                center: [-19.0154, 29.1549],
                zoom: 7,
                layers: [
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    })
                ]
            });
            console.log("Leaflet map initialized!");

            window.leafletMapRef = leafletMapRef;
            leafletMapRef.current.invalidateSize();

            window.addEventListener('resize', handleResize);
        }

        return () => {
            if (leafletMapRef.current) {
                leafletMapRef.current.remove();
                leafletMapRef.current = null;
                console.log("Leaflet map cleaned up.");
                delete window.leafletMapRef;
            }
            Object.values(intervalRefs.current).forEach(intervalId => clearInterval(intervalId));
            intervalRefs.current = {};
            window.removeEventListener('resize', handleResize);
        };
    }, [mapRef, handleResize]);

    // --- Effect for Fetching Spots from Firestore ---
    useEffect(() => {
        console.log("Attempting to fetch spots. db:", db, "appId:", appId, "isAuthReady:", isAuthReady); // ADDED LOG
        if (!db || !appId || !isAuthReady) {
            console.log("Firestore or App ID not ready, or Auth not ready. Skipping spot fetch.");
            return;
        }

        const fetchSpots = async () => {
            try {
                const spotsCollectionRef = collection(db, `artifacts/${appId}/public/data/parkingSpots`);
                console.log("Fetching from path:", `artifacts/${appId}/public/data/parkingSpots`); // ADDED LOG
                const q = query(spotsCollectionRef);
                const querySnapshot = await getDocs(q);
                const fetchedSpots = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                if (fetchedSpots.length === 0) {
                    console.warn("No parking spots found in Firestore. Using dummy data.");
                    const dummySpots = [
                        { id: 'H1', lat: -17.8287, lng: 31.0534, status: 'available', priceUSD: 2.50, name: 'Harare CBD Parking' },
                        { id: 'H2', lat: -17.8350, lng: 31.0450, status: 'available', priceUSD: 3.00, name: 'Samora Machel Ave Lot' },
                        { id: 'B1', lat: -20.1543, lng: 28.5775, status: 'available', priceUSD: 2.00, name: 'Bulawayo City Centre' },
                        { id: 'B2', lat: -20.1600, lng: 28.5850, status: 'available', priceUSD: 2.75, name: 'Trade Fair Parking' },
                        { id: 'V1', lat: -17.9243, lng: 25.8567, status: 'available', priceUSD: 3.50, name: 'Vic Falls Main Gate' },
                        { id: 'V2', lat: -17.9300, lng: 25.8650, status: 'available', priceUSD: 3.20, name: 'Vic Falls Airport Parking' },
                        { id: 'M1', lat: -18.9200, lng: 32.6100, status: 'available', priceUSD: 1.80, name: 'Mutare Town Centre' },
                        { id: 'G1', lat: -19.4300, lng: 30.0000, status: 'available', priceUSD: 2.10, name: 'Gweru CBD Parking' },
                    ];
                    setSpots(dummySpots);
                } else {
                    setSpots(fetchedSpots);
                }
                console.log("Successfully fetched parking spots:", fetchedSpots); // ADDED LOG
            } catch (error) {
                console.error("Error fetching parking spots from Firestore:", error); // IMPROVED LOG
                showModal("Failed to load parking spots. Using dummy data as fallback.", "error");
                setSpots([
                    { id: 'H1', lat: -17.8287, lng: 31.0534, status: 'available', priceUSD: 2.50, name: 'Harare CBD Parking' },
                    { id: 'H2', lat: -17.8350, lng: 31.0450, status: 'available', priceUSD: 3.00, name: 'Samora Machel Ave Lot' },
                ]);
            }
        };

        fetchSpots();

    }, [db, appId, isAuthReady, showModal]);

    // --- Effect for Listening to User Bookings (Real-time) and Managing Timers ---
    useEffect(() => {
        if (!db || !user || !appId || !isAuthReady) {
            console.log("Firestore, user, or App ID not ready, or Auth not ready. Skipping booking listener.");
            Object.values(intervalRefs.current).forEach(intervalId => clearInterval(intervalId));
            intervalRefs.current = {};
            setActiveBookingTimers({});
            return;
        }

        const userBookingsRef = collection(db, `artifacts/${appId}/users/${user.uid}/bookings`);
        const q = query(userBookingsRef, where("status", "==", "active"));

        console.log(`Setting up real-time listener for user ${user.uid}'s active bookings.`);

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const now = Date.now();
            const currentActiveBookingsMap = {};
            const newTimersMap = {};

            snapshot.docs.forEach(doc => {
                const booking = { id: doc.id, ...doc.data() };
                const endTimeMs = new Date(booking.endTime).getTime();

                if (endTimeMs > now) {
                    currentActiveBookingsMap[booking.spotId] = booking;
                    newTimersMap[booking.spotId] = Math.max(0, Math.round((endTimeMs - now) / 1000));
                } else {
                    console.log(`Booking ${booking.id} for spot ${booking.spotId} has expired. Updating Firestore.`);
                    updateDoc(doc(db, `artifacts/${appId}/users/${user.uid}/bookings`, booking.id), { status: 'expired' })
                        .catch(error => console.error("Error updating expired booking status:", error));
                }
            });

            setSpots(prevSpots => prevSpots.map(spot => {
                if (currentActiveBookingsMap[spot.id]) {
                    return { ...spot, status: 'booked', timer: currentActiveBookingsMap[spot.id].endTime };
                } else if (spot.status === 'booked' && !currentActiveBookingsMap[spot.id]) {
                    return { ...spot, status: 'available', timer: null };
                }
                return spot;
            }));

            Object.keys(intervalRefs.current).forEach(spotId => {
                if (!newTimersMap[spotId]) {
                    clearInterval(intervalRefs.current[spotId]);
                    delete intervalRefs.current[spotId];
                }
            });

            Object.keys(newTimersMap).forEach(spotId => {
                if (!intervalRefs.current[spotId]) {
                    intervalRefs.current[spotId] = setInterval(() => {
                        setActiveBookingTimers(prevTimers => {
                            const updatedTimers = { ...prevTimers };
                            const remainingSeconds = Math.max(0, Math.round((new Date(currentActiveBookingsMap[spotId].endTime).getTime() - Date.now()) / 1000));
                            if (remainingSeconds <= 0) {
                                clearInterval(intervalRefs.current[spotId]);
                                delete intervalRefs.current[spotId];
                                delete updatedTimers[spotId];
                                console.log(`Timer for spot ${spotId} finished.`);
                                showModal(`Your booking for ${currentActiveBookingsMap[spotId].spotName} (${spotId}) has ended.`, "info");
                            } else {
                                updatedTimers[spotId] = remainingSeconds;
                            }
                            return updatedTimers;
                        });
                    }, 1000);
                }
            });
            setActiveBookingTimers(newTimersMap);
        }, (error) => {
            console.error("Error listening to user bookings:", error);
            showModal("Failed to load your active bookings.", "error");
        });

        return () => {
            unsubscribe();
            Object.values(intervalRefs.current).forEach(intervalId => clearInterval(intervalId));
            intervalRefs.current = {};
            setActiveBookingTimers({});
            console.log("User bookings listener unsubscribed and timers cleared.");
        };
    }, [db, user, appId, isAuthReady, showModal]);


    // --- Effect to add/update markers when spots state changes ---
    useEffect(() => {
        if (!leafletMapRef.current || spots.length === 0) {
            return;
        }

        const updatedMarkerRefs = {};

        spots.forEach(spot => {
            let iconToUse;
            if (spot.status === 'booked') {
                iconToUse = bookedIcon;
            } else if (selectedSpot && selectedSpot.id === spot.id) {
                iconToUse = selectedIcon;
            } else {
                iconToUse = availableIcon;
            }

            let marker = markerRefs.current[spot.id];
            if (marker) {
                marker.setLatLng([spot.lat, spot.lng]);
                marker.setIcon(iconToUse);
            } else {
                marker = L.marker([spot.lat, spot.lng], { icon: iconToUse })
                    .addTo(leafletMapRef.current);
                marker.on('click', () => handleMarkerClick(spot.id));
            }
            marker.bindTooltip(spot.name, { permanent: false, direction: 'top' });
            updatedMarkerRefs[spot.id] = marker;
        });

        Object.keys(markerRefs.current).forEach(markerId => {
            if (!updatedMarkerRefs[markerId]) {
                leafletMapRef.current.removeLayer(markerRefs.current[markerId]);
            }
        });
        markerRefs.current = updatedMarkerRefs;
        console.log("Markers updated/drawn.");
    }, [spots, selectedSpot, handleMarkerClick]);

    const handleBookSpot = () => {
        if (!user) {
            showModal("You must be logged in to book a spot. Please sign in or create an account.", "info", () => navigateTo('/login')); // Changed navigateTo('login') to navigateTo('/login')
            return;
        }

        if (selectedSpot && selectedSpot.status === 'available') {
            setShowPaymentModal(true);
            setUserEnteredAmount(convertAmount(selectedSpot.priceUSD, 'USD', selectedCurrency).toFixed(2));
        }
    };

    const handleCurrencyChange = useCallback((e) => {
        const newCurrency = e.target.value;
        if (selectedSpot) {
            let converted;
            if (newCurrency === 'ZWL') {
                converted = selectedSpot.priceUSD * USD_TO_ZWL_RATE;
            } else {
                converted = selectedSpot.priceUSD;
            }
            setUserEnteredAmount(converted.toFixed(2));
        }
        setSelectedCurrency(newCurrency);
    }, [selectedSpot, convertAmount]);

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        console.log("handlePaymentSubmit called.");

        if (!user) {
            showModal("You must be logged in to complete payment.", "error");
            return;
        }
        if (!db) {
            showModal("Database not ready. Please try again.", "error");
            return;
        }

        if (!selectedSpot || selectedSpot.status !== 'available') {
            console.error("Payment attempted but no available spot is selected or spot is already booked!");
            showModal("Error: Please select an available spot to book.", "error");
            setShowPaymentModal(false);
            setSelectedSpot(null);
            return;
        }

        const amountToPay = parseFloat(userEnteredAmount);
        const originalPriceUSD = selectedSpot.priceUSD;
        const expectedAmountInSelectedCurrency = convertAmount(originalPriceUSD, 'USD', selectedCurrency);

        if (isNaN(amountToPay) || amountToPay <= 0) {
            showModal("Please enter a valid amount to pay.", "error");
            return;
        }

        if (Math.abs(amountToPay - expectedAmountInSelectedCurrency) > 0.01) {
            showModal(`The amount entered (${amountToPay.toFixed(2)} ${selectedCurrency}) does not match the spot price (${expectedAmountInSelectedCurrency.toFixed(2)} ${selectedCurrency}). Please enter the correct amount.`, "error");
            return;
        }

        const phoneValidationMessage = validatePhoneNumber(phoneNumber, selectedPaymentMethod);
        if (phoneValidationMessage) {
            showModal(phoneValidationMessage, "error");
            return;
        }

        setPaymentLoading(true);
        try {
            const isSimulatedPaymentSuccessful = Math.random() > 0.1;
            await new Promise(resolve => setTimeout(resolve, 2000));

            if (isSimulatedPaymentSuccessful) {
                const bookingDurationMinutes = 5;
                const bookingEndTime = new Date(Date.now() + bookingDurationMinutes * 60 * 1000);

                const newBookingData = {
                    spotId: selectedSpot.id,
                    spotName: selectedSpot.name,
                    startTime: new Date().toISOString(),
                    endTime: bookingEndTime.toISOString(),
                    durationMinutes: bookingDurationMinutes,
                    costPaid: amountToPay,
                    currencyPaid: selectedCurrency,
                    originalPriceUSD: selectedSpot.priceUSD,
                    paymentMethod: selectedPaymentMethod,
                    phoneNumber: phoneNumber,
                    bookedAt: new Date().toISOString(),
                    status: 'active',
                    userId: user.uid,
                };

                const bookingsCollectionRef = collection(db, `artifacts/${appId}/users/${user.uid}/bookings`);
                await addDoc(bookingsCollectionRef, newBookingData);

                showModal(`Payment of ${selectedCurrency} ${amountToPay.toFixed(2)} successful! Spot ${selectedSpot.id} booked for ${bookingDurationMinutes} minutes via ${selectedPaymentMethod}.`, "success");

                setSelectedSpot(null);
                setShowPaymentModal(false);
                setPhoneNumber('');
                setUserEnteredAmount('');
                console.log(`Spot ${selectedSpot.id} booked via ${selectedPaymentMethod} and added to Firestore.`);

            } else {
                showModal("Payment failed. Please try again.", "error");
                console.log("Payment failed (simulated).");
            }
        } catch (error) {
            console.error("Error during payment or booking:", error);
            showModal(`An unexpected error occurred: ${error.message}`, "error");
        } finally {
            setPaymentLoading(false);
        }
    };

    const handleCancelBooking = async () => {
        if (!user || !db) {
            showModal("You must be logged in and database ready to cancel a booking.", "error");
            return;
        }

        if (selectedSpot && selectedSpot.status === 'booked') {
            showModal(`Confirm cancellation for ${selectedSpot.name} (${selectedSpot.id})?`, "confirm", async () => {
                try {
                    const bookingsRef = collection(db, `artifacts/${appId}/users/${user.uid}/bookings`);
                    const q = query(bookingsRef,
                        where("spotId", "==", selectedSpot.id),
                        where("status", "==", "active")
                    );
                    const querySnapshot = await getDocs(q);

                    if (!querySnapshot.empty) {
                        const bookingDoc = querySnapshot.docs[0];
                        const bookingDocRef = doc(db, `artifacts/${appId}/users/${user.uid}/bookings`, bookingDoc.id);
                        await updateDoc(bookingDocRef, { status: 'cancelled', cancelledAt: new Date().toISOString() });
                        showModal(`Booking for ${selectedSpot.id} has been cancelled.`, "success");
                        console.log(`Booking for ${selectedSpot.id} cancelled in Firestore.`);
                    } else {
                        showModal("No active booking found for this spot.", "info");
                    }
                    setSelectedSpot(null);
                } catch (error) {
                    console.error("Error cancelling booking:", error);
                    showModal(`Failed to cancel booking: ${error.message}`, "error");
                }
            });
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <section className="map-page-section">
            <div className="map-header">
                <h1 className="map-page-title">Interactive Parking Map - Zimbabwe</h1>
                <p className="map-page-subtitle">Click on a marker to view details and book a spot.</p>
            </div>

            <div id="map-container" ref={mapRef} className="map-canvas-container">
                {/* Leaflet map will be rendered here */}
            </div>

            {/* Conditional rendering for booking modal: Only show if selectedSpot is true AND payment modal is NOT showing */}
            {selectedSpot && !showPaymentModal && (
                <div className="booking-modal-overlay">
                    <div className="booking-modal">
                        <button className="close-modal-btn" onClick={() => setSelectedSpot(null)}>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                        <h2>Spot Details: {selectedSpot.name} ({selectedSpot.id})</h2>
                        {/* Display both USD and ZWL prices */}
                        <p className="spot-price">
                            <FontAwesomeIcon icon={faDollarSign} /> Price: ${selectedSpot.priceUSD.toFixed(2)} USD
                            (ZWL {(selectedSpot.priceUSD * USD_TO_ZWL_RATE).toFixed(2)}) / hour
                        </p>
                        <p className="spot-status">
                            <FontAwesomeIcon icon={selectedSpot.status === 'available' ? faCheckCircle : faTimesCircle}
                                className={selectedSpot.status === 'available' ? 'status-icon-available' : 'status-icon-booked'} />
                            Status: <span className={selectedSpot.status === 'available' ? 'status-available' : 'status-booked'}>{selectedSpot.status.toUpperCase()}</span>
                        </p>

                        {selectedSpot.status === 'available' && (
                            <button
                                className="btn btn-primary ripple-effect"
                                onClick={handleBookSpot}
                                disabled={!isAuthReady || !user} // Disable if auth not ready or not logged in
                            >
                                {isAuthReady && !user ? 'Login to Book' : 'Book This Spot'}
                            </button>
                        )}

                        {selectedSpot.status === 'booked' && (
                            <div className="booked-info">
                                <p className="booking-timer">
                                    <FontAwesomeIcon icon={faClock} /> Time Left:
                                    <span>{formatTime(activeBookingTimers[selectedSpot.id] || 0)}</span>
                                </p>
                                <button className="btn btn-secondary ripple-effect btn-cancel-booking" onClick={handleCancelBooking}>
                                    Cancel Booking
                                </button>
                            </div>
                        )}
                        {!user && isAuthReady && ( // Show login/signup prompt if not logged in and auth is ready
                            <p className="login-prompt-message">
                                Please <Link to="/login">login</Link> or <Link to="/signup">sign up</Link> to book a spot.
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Payment Modal */}
            {showPaymentModal && selectedSpot && (
                <div className="payment-modal-overlay">
                    <div className="payment-modal">
                        <button className="close-modal-btn" onClick={() => {
                            setShowPaymentModal(false);
                        }}>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                        <h2>Complete Payment for {selectedSpot.name}</h2>
                        <p className="payment-amount">Amount:
                            <span className="currency-display">{selectedCurrency === 'ZWL' ? 'ZWL' : '$'}</span>
                            {parseFloat(userEnteredAmount).toFixed(2)}
                        </p>

                        <form onSubmit={handlePaymentSubmit} className="payment-form">
                            <div className="form-group">
                                <label>Payment Method:</label>
                                <div className="radio-group">
                                    <label>
                                        <input
                                            type="radio"
                                            value="ecocash"
                                            checked={selectedPaymentMethod === 'ecocash'}
                                            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                                        /> EcoCash
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            value="onemoney"
                                            checked={selectedPaymentMethod === 'onemoney'}
                                            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                                        /> OneMoney
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            value="omari"
                                            checked={selectedPaymentMethod === 'omari'}
                                            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                                        /> Omari
                                    </label>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="currency">Currency:</label>
                                <select id="currency" value={selectedCurrency} onChange={handleCurrencyChange} className="currency-select">
                                    <option value="ZWL">ZWL</option>
                                    <option value="USD">USD</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="phoneNumber">Phone Number:</label>
                                <input
                                    type="text"
                                    id="phoneNumber"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    placeholder="e.g., 0771234567"
                                    required
                                    className="phone-input"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="amount">Amount (Auto-filled):</label>
                                <input
                                    type="number"
                                    id="amount"
                                    value={userEnteredAmount}
                                    onChange={(e) => setUserEnteredAmount(e.target.value)}
                                    step="0.01"
                                    readOnly={false}
                                    required
                                    className="amount-input"
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary ripple-effect btn-pay"
                                disabled={paymentLoading || !userEnteredAmount || parseFloat(userEnteredAmount) <= 0}
                            >
                                {paymentLoading ? (
                                    <>
                                        <FontAwesomeIcon icon={faSpinner} spin /> Processing...
                                    </>
                                ) : (
                                    <>
                                        <FontAwesomeIcon icon={faMoneyBillWave} /> Pay Now
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
};

export default MapPage;