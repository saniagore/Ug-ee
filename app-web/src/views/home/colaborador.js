import "../../css/colaboradorHome.css";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ColaboratorRegister from './colaboradorPages/colaboratorSingUp';
import ColaboratorLogin from './colaboradorPages/colaboratorSingIn';

/**
 * Collaborator Homepage Component
 * 
 * @component
 * @name ColaboratorHomePage
 * @description The entry point for collaborators featuring:
 * - Welcome screen with registration/login options
 * - Registration form for new collaborators
 * - Login form for existing collaborators
 * - Success redirection to collaborator menu
 * 
 * @property {string} currentView - Tracks current authentication view state
 *                                 ('welcome', 'register', or 'login')
 * 
 * @example
 * // Usage in router configuration
 * <Route path="/Colaborador" element={<ColaboratorHomePage />} />
 * 
 * @returns {React.Element} Returns a collaborator-specific authentication flow with:
 * - Welcome screen with action buttons
 * - Registration form component
 * - Login form component
 * - Navigation controls between views
 */
function ColaboratorHomePage() {
    const [currentView, setCurrentView] = useState('welcome');
    const navigate = useNavigate();

    /**
     * Handles successful login event
     * @function handleLoginSuccess
     * @description Redirects collaborator to the collaborator menu after successful authentication
     */
    const handleLoginSuccess = () => {
        navigate('/Colaborador/Menu');
    };
    
    return (
        <div className="colaborator-app">
            <div className="colaborator-container">
                {/* Welcome View */}
                {currentView === 'welcome' && (
                    <div className="welcome-screen">
                        <h1>Bienvenido Colaborador</h1>
                        <div className="action-buttons">
                            <button 
                                className="btn-primary"
                                onClick={() => setCurrentView('register')}
                            >
                                Registrarse
                            </button>
                            <button 
                                className="btn-secondary"
                                onClick={() => setCurrentView('login')}
                            >
                                Ingresar
                            </button>
                        </div>
                    </div>
                )}
                
                {/* Registration View */}
                {currentView === 'register' && (
                    <ColaboratorRegister 
                        onBack={() => setCurrentView('welcome')} 
                        onSuccess={handleLoginSuccess}
                    />
                )}
                
                {/* Login View */}
                {currentView === 'login' && (
                    <ColaboratorLogin 
                        onBack={() => setCurrentView('welcome')}
                        onLoginSuccess={handleLoginSuccess}
                    />
                )}
            </div>
        </div>
    );
}

export default ColaboratorHomePage;