import React, { useState } from 'react';
import "../../../css/colaboradorHome.css";
import ConductorSingIn from './singIn/conductorSingIn';
import InstitucionSingIn from './singIn/institucionSingIn';

/**
 * Collaborator Login Component
 * 
 * @component
 * @name ColaboratorLogin
 * @description Provides a multi-step login flow for collaborators with:
 * - Initial role selection (Institution or Driver)
 * - Institution-specific login form
 * - Driver-specific login form
 * - Navigation controls between views
 * 
 * @param {Function} onBack - Callback for returning to previous screen
 * @param {Function} onLoginSuccess - Callback for successful authentication
 * 
 * @property {string} currentView - Tracks current login view state
 *                                 ('welcome', 'institucion', or 'conductor')
 * 
 * @example
 * // Usage in parent component
 * <ColaboratorLogin 
 *   onBack={() => setCurrentView('welcome')}
 *   onLoginSuccess={handleLoginSuccess}
 * />
 * 
 * @returns {React.Element} Returns a multi-step login interface with:
 * - Role selection screen
 * - Institution login form
 * - Driver login form
 * - Navigation controls
 */
export default function ColaboratorLogin({ onBack, onLoginSuccess }) {
    const [currentView, setCurrentView] = useState('welcome');

    /**
     * Handles institution login selection
     * @function handleInstitutionClick
     * @description Navigates to institution login form
     */
    const handleInstitutionClick = () => {
        setCurrentView('institucion');
    };

    /**
     * Handles driver login selection
     * @function handleDriverClick
     * @description Navigates to driver login form
     */
    const handleDriverClick = () => {
        setCurrentView('conductor');
    };

    return (
        <div className="colaborator-login">
            {/* Role Selection View */}
            {currentView === 'welcome' && ( 
                <div className="login-form">
                    <h2 style={{textAlign: 'center'}}>Inicio de Sesión</h2>
                    <div className="login-options">
                        <div className="action-buttons">
                            <button 
                                className="btn-primary" 
                                onClick={handleInstitutionClick}
                                aria-label="Login as Institution"
                            >
                                Ingresar como Institución
                            </button>
                        </div>
                        <div className="action-buttons" style={{marginTop: '10px'}}>
                            <button 
                                className="btn-primary" 
                                onClick={handleDriverClick}
                                aria-label="Login as Driver"
                            >
                                Ingresar como Conductor
                            </button>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button 
                            type="button" 
                            className="back-btn" 
                            onClick={onBack}
                            aria-label="Go back"
                        >
                            Volver
                        </button>
                    </div>
                </div>
            )}
            
            {/* Institution Login View */}
            {currentView === 'institucion' && (
                <InstitucionSingIn
                    onBack={() => setCurrentView('welcome')}
                    onLoginSuccess={onLoginSuccess}
                />
            )}

            {/* Driver Login View */}
            {currentView === 'conductor' && (
                <ConductorSingIn
                    onBack={() => setCurrentView('welcome')}
                    onLoginSuccess={onLoginSuccess}
                />
            )}
        </div>
    );
}