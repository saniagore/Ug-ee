import React, { useState } from 'react';
import { QueryInstitucion } from '../../../../components/queryInstitucion';
import { Validar_datos } from '../../../../components/dataValid';

export default function ColaboratorInstitucion({ onBack, onSuccess }) {
    const queryInstitucion = new QueryInstitucion();
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("success"); // "success" or "error"
    const [formData, setFormData] = useState({
        nombre: '',
        contraseña: '',
        colorPrimario: '#ffffff',
        colorSecundario: '#000000',
        direccion: '',
    });
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            Validar_datos.nombre(formData.nombre);
            Validar_datos.contraseña(formData.contraseña);
            Validar_datos.direccion(formData.direccion);

            await queryInstitucion.crearInstitucion(formData);
            setAlertType("success");
            setAlertMessage("Institución creada exitosamente, espere la validación de la plataforma.");
            setShowAlert(true);
        } catch(error) {
            setAlertType("error");
            setAlertMessage("Error al crear institución: " + (error.message || error));
            setShowAlert(true);
    }
    };

    const handleAlertClose = () => {
        setShowAlert(false);
        if (alertType === "success") {
            onBack(); // Solo llamamos onBack() cuando se cierra la alerta de éxito
        }
    };

    return (
        <div className="register-form">
            <h2>Registro de Colaborador</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nombre Oficial</label>
                    <input 
                        value={formData.nombre}
                        onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label>Dirección</label>
                    <input 
                        value={formData.direccion}
                        onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                        required
                    />
                </div>
                
                <div className="form-group color-picker-group">
                    <label>Color primario</label>
                    <div className="color-picker-container">
                        <input 
                            type="color" 
                            value={formData.colorPrimario}
                            onChange={(e) => setFormData({...formData, colorPrimario: e.target.value})}
                            required
                        />
                        <span>{formData.colorPrimario}</span>
                    </div>
                </div>
                
                <div className="form-group">
                    <label>Contraseña</label>
                    <input 
                        type="password" 
                        value={formData.contraseña}
                        onChange={(e) => setFormData({...formData, contraseña: e.target.value})}
                        required
                    />
                </div>
                
                <div className="form-group color-picker-group">
                    <label>Color Secundario</label>
                    <div className="color-picker-container">
                        <input 
                            type="color" 
                            value={formData.colorSecundario}
                            onChange={(e) => setFormData({...formData, colorSecundario: e.target.value})}
                            required
                        />
                        <span>{formData.colorSecundario}</span>
                    </div>
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
            
            <style>{`
                .color-picker-group {
                    display: flex;
                    flex-direction: column;
                }
                
                .color-picker-container {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                input[type="color"] {
                    width: 50px;
                    height: 30px;
                    padding: 2px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    cursor: pointer;
                }

                .custom-alert {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
                }

                .alert-content {
                background: white;
                padding: 20px;
                border-radius: 8px;
                text-align: center;
                max-width: 300px;
                }

                .alert-content h3 {
                margin-top: 0;
                color: #ff0000;
                }

                .alert-content button {
                margin-top: 15px;
                padding: 8px 16px;
                background: #007bff;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                }
            `}</style>
            {showAlert && (
                <div className={`custom-alert ${alertType === "success" ? "alert-success" : "alert-error"}`}>
                    <div className="alert-content">
                        <h3>{alertType === "success" ? "Éxito" : "Error"}</h3>
                        <p>{alertMessage}</p>
                        <button onClick={handleAlertClose}>Aceptar</button>
                    </div>
                </div>
            )}
        </div>
    );
}