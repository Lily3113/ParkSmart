// src/components/Modal.jsx

import React from 'react';
import '../App.css'; // Create a corresponding CSS file for styling

const Modal = ({ show, message, type, onClose, onConfirm }) => {
    if (!show) {
        return null;
    }

    // Determine CSS class for styling based on type
    const modalTypeClass = type === 'error' ? 'modal-error' : type === 'success' ? 'modal-success' : '';
    const buttonText = type === 'confirm' ? 'Confirm' : 'OK';

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className={`modal-content ${modalTypeClass}`} onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{type === 'error' ? 'Error!' : type === 'success' ? 'Success!' : type === 'confirm' ? 'Confirm Action' : 'Information'}</h2>
                    <button className="modal-close-button" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    <p>{message}</p>
                </div>
                <div className="modal-footer">
                    {type === 'confirm' && (
                        <button className="modal-button modal-cancel-button" onClick={onClose}>Cancel</button>
                    )}
                    <button className="modal-button modal-confirm-button" onClick={onConfirm || onClose}>
                        {buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;