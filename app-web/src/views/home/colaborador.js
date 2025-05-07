import "../../css/colaboradorHome.css";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ColaboratorRegister from './colaboradorPages/colaboratorSingUp';
import ColaboratorLogin from './colaboradorPages/colaboratorSingIn';

function ColaboratorHomePage() {
    const [currentView, setCurrentView] = useState('welcome');
    const navigate = useNavigate();

    const handleLoginSuccess = () => {
        navigate('/colaborator/menu');
    };
    return (
        <div className="colaborator-app">
            <div className="colaborator-container">
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
                
                {currentView === 'register' && (
                    <ColaboratorRegister 
                        onBack={() => setCurrentView('welcome')} 
                        onSuccess={handleLoginSuccess}
                    />
                )}
                
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