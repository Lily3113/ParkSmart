// src/components/MessageModal.jsx

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheckCircle, faExclamationTriangle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import './MessageModal.css'; // New CSS file for the modal

const MessageModal = ({ message, type = 'info', onConfirm, onCancel, onClose }) => {
    let icon;
    let title;
    let className;

    switch (type) {
        case 'success':
            icon = faCheckCircle;
            title = 'Success!';
            className = 'modal-success';
            break;
        case 'error':
            icon = faExclamationTriangle;
            title = 'Error!';
            className = 'modal-error';
            break;
        case 'confirm':
            icon = faExclamationTriangle;
            title = 'Confirm Action';
            className = 'modal-confirm';
            break;
        case 'info':
        default:
            icon = faInfoCircle;
            title = 'Information';
            className = 'modal-info';
            break;
    }

    // Determine if confirm/cancel buttons should be shown
    const showConfirmButtons = type === 'confirm';

    return (
        <div className="modal-overlay">
            <div className={`modal-content ${className}`}>
                <button className="modal-close-btn" onClick={onClose}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>
                <div className="modal-header">
                    <FontAwesomeIcon icon={icon} className="modal-icon" />
                    <h2>{title}</h2>
                </div>
                <div className="modal-body">
                    <p>{message}</p>
                </div>
                <div className="modal-footer">
                    {showConfirmButtons ? (
                        <>
                            <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
                            <button className="btn btn-primary" onClick={onConfirm}>Confirm</button>
                        </>
                    ) : (
                        <button className="btn btn-primary" onClick={onClose}>OK</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessageModal;