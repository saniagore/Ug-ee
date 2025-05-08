import React, { useState } from 'react';

export default function ColaboratorRegister({ onBack, onSuccess }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        specialty: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        //logica de registro
        

    };

    return (
        <div className="register-form">
            <h2>Registro de Colaborador</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nombre Completo</label>
                    <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label>Correo Electrónico</label>
                    <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label>Teléfono</label>
                    <input 
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label>Contraseña</label>
                    <input 
                        type="password" 
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label>Especialidad</label>
                    <input 
                        type="text" 
                        value={formData.specialty}
                        onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                        required
                    />
                </div>
                
                <div className="form-actions">
                    <button type="button" className="back-btn" onClick={onBack}>
                        Volver
                    </button>
                    <button type="submit" className="submit-btn">
                        Registrarse
                    </button>
                </div>
            </form>
        </div>
    );
}