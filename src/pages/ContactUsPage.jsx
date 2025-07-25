// src/pages/ContactUsPage.jsx

import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faMapMarkerAlt, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../App.css';

// Fix for default Leaflet icons not showing correctly with Webpack
delete L.Icon.Default.prototype._getIconUrl; 
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ContactUsPage = ({ navigateTo }) => {
    const mapRef = useRef(null);
    const leafletMapInstance = useRef(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [submissionStatus, setSubmissionStatus] = useState(null);

    // Dummy coordinates for Harare CBD (approximate for "123 Smart Parking St, Harare")
    const harareCoords = [-17.8252, 31.0335]; 

    useEffect(() => {
        // Initialize map only if it hasn't been initialized yet
        if (mapRef.current && !leafletMapInstance.current) {
            leafletMapInstance.current = L.map(mapRef.current, {
                center: harareCoords,
                zoom: 13,
                layers: [
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    })
                ],
                zoomControl: false,
                dragging: false,
                scrollWheelZoom: false,
                doubleClickZoom: false
            });

            // Add a single marker at the business location
            L.marker(harareCoords).addTo(leafletMapInstance.current)
                // CHANGED: Popup text now explicitly says "Head Office"
                .bindPopup("<b>ParkSmart Head Office</b><br>123 Smart Parking St, Harare")
                .openPopup();

            leafletMapInstance.current.invalidateSize();
        }

        // Cleanup function: remove map instance when component unmounts
        return () => {
            if (leafletMapInstance.current) {
                leafletMapInstance.current.remove();
                leafletMapInstance.current = null;
            }
        };
    }, []);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmissionStatus('submitting');

        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            setSubmissionStatus('error');
            alert('Please fill in all fields.');
            return;
        }

        console.log('Simulating sending message:', formData);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));

            const isSuccess = Math.random() > 0.2;
            if (isSuccess) {
                setSubmissionStatus('success');
                alert('Your message has been sent successfully!');
                setFormData({
                    name: '',
                    email: '',
                    subject: '',
                    message: ''
                });
            } else {
                setSubmissionStatus('error');
                alert('Failed to send message. Please try again later.');
            }
        } catch (error) {
            console.error('An unexpected error occurred during simulation:', error);
            setSubmissionStatus('error');
            alert('An unexpected error occurred. Please try again.');
        }
    };

    return (
        <section className="contact-us-section">
            <div className="contact-header">
                <h1 className="contact-title">Get in Touch</h1>
                <p className="contact-subtitle">We'd love to hear from you! Send us a message or find our contact details below.</p>
            </div>

            <div className="contact-content">
                {/* Contact Information Section */}
                <div className="contact-info">
                    <h3>Our Contact Information</h3>
                    <p><FontAwesomeIcon icon={faEnvelope} /> Email: info@parksmart.com</p>
                    <p><FontAwesomeIcon icon={faPhone} /> Phone: +263 77 123 4567</p>
                    <p><FontAwesomeIcon icon={faMapMarkerAlt} /> Address: 123 Smart Parking St, Harare, Zimbabwe</p>
                    
                    {/* Map Container - this will only show ONE location */}
                    <div id="contact-map" ref={mapRef} className="contact-map-container">
                        {/* Leaflet map will be rendered here */}
                    </div>
                </div>

                {/* Contact Form Section */}
                <div className="contact-form-container">
                    <h3>Send Us a Message</h3>
                    <form onSubmit={handleSubmit} className="contact-form">
                        <div className="form-group">
                            <label htmlFor="name">Name:</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="form-input"
                                placeholder="Your Name"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="form-input"
                                placeholder="your.email@example.com"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="subject">Subject:</label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                                className="form-input"
                                placeholder="Subject of your message"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="message">Message:</label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows="5"
                                className="form-input"
                                placeholder="Your message here..."
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary ripple-effect btn-send-message"
                            disabled={submissionStatus === 'submitting'}
                        >
                            <FontAwesomeIcon icon={faPaperPlane} />
                            {submissionStatus === 'submitting' ? 'Sending...' : 'Send Message'}
                        </button>

                        {submissionStatus === 'success' && (
                            <p className="submission-message success">Message sent successfully!</p>
                        )}
                        {submissionStatus === 'error' && (
                            <p className="submission-message error">Failed to send message. Please try again.</p>
                        )}
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ContactUsPage;