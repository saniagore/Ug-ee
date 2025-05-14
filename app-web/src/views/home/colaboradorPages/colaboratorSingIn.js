import React, { useState } from 'react';
import "../../../css/colaboradorHome.css";
import ConductorSingIn from './singIn/conductorSingIn';
import InstitucionSingIn from './singIn/institucionSingIn';

export default function ColaboratorLogin({ onBack, onSuccess }) {
    const [currentView, setCurrentView] = useState('welcome');

    const handleInstitutionClick = () => {
        setCurrentView('institucion');
    };

    const handleDriverClick = () => {
        setCurrentView('conductor');
    };

    return (
        <div>
            {currentView === 'welcome' && ( 
                <div className="register-form">
                    <h2 style={{textAlign: 'center'}}>Registro de Colaborador</h2>
                    <div className="action-buttons">
                        <button className="btn-primary" onClick={handleInstitutionClick}>
                            Ingresar como Institución
                        </button>
                    </div>
                    <div className="action-buttons" style={{marginTop: 10}}>
                        <button className="btn-primary" onClick={handleDriverClick}>
                            Ingresar como Conductor
                        </button>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="back-btn" onClick={onBack}>
                            Volver
                        </button>
                    </div>
                </div>
            )}
            
            {currentView === 'institucion' && (
                <InstitucionSingIn
                    onBack={() => setCurrentView('welcome')}
                    onLoginSuccess={onSuccess}
                />
            )}

            {currentView === 'conductor' &&(
                <ConductorSingIn
                    onBack={() => setCurrentView('welcome')}
                    onLoginSuccess={onSuccess}
                />
            )}
        </div>
    );
}