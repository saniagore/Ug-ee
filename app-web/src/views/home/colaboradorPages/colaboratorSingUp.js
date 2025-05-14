import React, { useState } from 'react';
import "../../../css/colaboradorHome.css";
import ColaboratorInstitucion from './singUp/singUpInstitucion';
import ColaboratorConductor from './singUp/singUpConductor';

/**
 * Collaborator Registration Component
 * 
 * @component
 * @name ColaboratorRegister
 * @description Provides a multi-step registration flow for collaborators with:
 * - Initial role selection (Institution or Driver)
 * - Institution-specific registration form
 * - Driver-specific registration form
 * - Navigation controls between views
 * 
 * @param {Function} onBack - Callback for returning to previous screen
 * @param {Function} onSuccess - Callback for successful registration
 * 
 * @property {string} currentView - Tracks current registration view state
 *                                 ('welcome', 'institucion', or 'conductor')
 * 
 * @example
 * // Usage in parent component
 * <ColaboratorRegister 
 *   onBack={() => setCurrentView('welcome')}
 *   onSuccess={handleRegistrationSuccess}
 * />
 * 
 * @returns {React.Element} Returns a multi-step registration interface with:
 * - Role selection screen
 * - Institution registration form
 * - Driver registration form
 * - Navigation controls
 */
export default function ColaboratorRegister({ onBack, onSuccess }) {
    const [currentView, setCurrentView] = useState('welcome');

    /**
     * Handles institution registration selection
     * @function handleInstitutionClick
     * @description Navigates to institution registration form
     */
    const handleInstitutionClick = () => {
        setCurrentView('institucion');
    };

    /**
     * Handles driver registration selection
     * @function handleDriverClick
     * @description Navigates to driver registration form
     */
    const handleDriverClick = () => {
        setCurrentView('conductor');
    };

    return (
        <div className="colaborator-registration">
            {/* Role Selection View */}
            {currentView === 'welcome' && ( 
                <div className="register-form">
                    <h2 style={{textAlign: 'center'}}>Registro de Colaborador</h2>
                    <div className="action-buttons">
                        <button 
                            className="btn-primary" 
                            onClick={handleInstitutionClick}
                        >
                            Registrarse como Institución
                        </button>
                    </div>
                    <div className="action-buttons" style={{marginTop: 10}}>
                        <button 
                            className="btn-primary" 
                            onClick={handleDriverClick}
                        >
                            Registrarse como conductor
                        </button>
                    </div>

                    <div className="form-actions">
                        <button 
                            type="button" 
                            className="back-btn" 
                            onClick={onBack}
                        >
                            Volver
                        </button>
                    </div>
                </div>
            )}
            
            {/* Institution Registration View */}
            {currentView === 'institucion' && (
                <ColaboratorInstitucion
                    onBack={() => setCurrentView('welcome')}
                    onSuccess={onSuccess}
                />
            )}

            {/* Driver Registration View */}
            {currentView === 'conductor' && (
                <ColaboratorConductor
                    onBack={() => setCurrentView('welcome')}
                    onSuccess={onSuccess}
                />
            )}
        </div>
    );
}