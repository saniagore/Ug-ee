import React, { useState } from 'react';

export default function ColaboratorLogin({ onBack, onLoginSuccess }) {
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Lógica de login aquí
        // Si es exitoso: onLoginSuccess();
    };

    return (
        <div className="login-form">
            <h2>Ingreso de Colaborador</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Correo Electrónico</label>
                    <input 
                        type="email" 
                        value={credentials.email}
                        onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label>Contraseña</label>
                    <input 
                        type="password" 
                        value={credentials.password}
                        onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                        required
                    />
                </div>
                
                <div className="form-actions">
                    <button type="button" className="back-btn" onClick={onBack}>
                        Volver
                    </button>
                    <button type="submit" className="submit-btn">
                        Ingresar
                    </button>
                </div>
            </form>
        </div>
    );
}