// src/components/TestimonialsSection.jsx

import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuoteLeft, faStar } from '@fortawesome/free-solid-svg-icons';
// IMPORTANT: Change this import if TestimonialsSection.css is in the same directory.
// If TestimonialsSection.css is in src/components/, then it should be './TestimonialsSection.css'
// If App.css is the ONLY CSS file you want to use, then keep '../App.css'.
// Based on our structure, it should be './TestimonialsSection.css'.
import '../App.css'; 

const TestimonialsSection = () => {
    const testimonials = [
        {
            quote: "ParkSmart has transformed my daily commute! Finding parking used to be a nightmare, but now it's effortless. The real-time availability is a game-changer.",
            author: "Sarah M.",
            title: "Daily Commuter",
            rating: 5,
            // CORRECTED PATH: Use absolute path from public folder
            avatar: "/images/Sarah M.jpeg" 
        },
        {
            quote: "I travel frequently for work, and ParkSmart is my go-to for guaranteed parking. The booking process is so smooth, and I love the secure payment options.",
            author: "John D.",
            title: "Business Traveler",
            rating: 5,
            // CORRECTED PATH: Use absolute path from public folder
            avatar: "/images/John D.jpeg" 
        },
        {
            quote: "Finally, a parking app that actually works! Transparent pricing and easy navigation. Highly recommend it to anyone tired of circling for spots.",
            author: "Emily R.",
            title: "City Resident",
            rating: 4,
            // CORRECTED PATH: Use absolute path from public folder
            avatar: "/images/Emily R.jpeg" 
        }
    ];

    const sectionRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        observer.unobserve(entry.target); // Stop observing once visible
                    }
                });
            },
            {
                threshold: 0.3 // Trigger when 30% of the section is visible
            }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    return (
        <section 
            ref={sectionRef} 
            className={`testimonials-section ${isVisible ? 'fade-in-on-scroll' : ''}`}
        >
            <div className="testimonials-header">
                <h2 className="testimonials-title">What Our Clients Say</h2>
                <p className="testimonials-subtitle">Hear from real users who love ParkSmart.</p>
            </div>
            <div className="testimonials-grid">
                {testimonials.map((testimonial, index) => (
                    <div className="testimonial-card" key={index}>
                        <div className="testimonial-avatar-wrapper">
                            <img 
                                src={testimonial.avatar} 
                                alt={testimonial.author} 
                                className="testimonial-avatar" 
                                onError={(e) => { e.target.onerror = null; e.target.src='https://via.placeholder.com/80/CCCCCC/333333?text=User'; }}
                            />
                        </div>
                        <FontAwesomeIcon icon={faQuoteLeft} className="quote-icon" />
                        <p className="testimonial-quote">"{testimonial.quote}"</p>
                        <div className="testimonial-author-info">
                            <span className="author-name">{testimonial.author}</span>
                            <span className="author-title">{testimonial.title}</span>
                        </div>
                        <div className="star-rating">
                            {[...Array(5)].map((_, i) => (
                                <FontAwesomeIcon 
                                    key={i} 
                                    icon={faStar} 
                                    className={i < testimonial.rating ? 'star-filled' : 'star-empty'} 
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default TestimonialsSection;