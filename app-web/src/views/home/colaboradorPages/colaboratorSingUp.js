import React, { useState } from 'react';
import "../../../css/colaboradorHome.css";
import ColaboratorInstitucion from './singUp/singUpInstitucion';
import ColaboratorConductor from './singUp/singUpConductor';

export default function ColaboratorRegister({ onBack, onSuccess }) {
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
                            Registrarse como Institución
                        </button>
                    </div>
                    <div className="action-buttons" style={{marginTop: 10}}>
                        <button className="btn-primary" onClick={handleDriverClick}>
                            Registrarse como conductor
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
                <ColaboratorInstitucion
                    onBack={() => setCurrentView('welcome')}
                />
            )}

            {currentView === 'conductor' &&(
                <ColaboratorConductor
                    onBack={() => setCurrentView('welcome')}
                />
            )}
        </div>
    );
}