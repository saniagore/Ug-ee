import { useState } from 'react';
import { QueryInstitucion } from '../../../../components/queryInstitucion';
import { ValidarDatos } from '../../../../components/validarDatos';

export default function ColaboratorInstitucion({ onBack }) {
    const queryInstitucion = new QueryInstitucion();
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("success");
    const [formData, setFormData] = useState({
        nombre: '',
        contrasena: '',
        colorPrimario: '#ffffff',
        colorSecundario: '#000000',
        direccion: '',
        logo: null
    });
    const [logoPreview, setLogoPreview] = useState(null);

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({...formData, logo: file});
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            ValidarDatos.nombre(formData.nombre);
            ValidarDatos.contraseña(formData.contrasena);
            ValidarDatos.direccion(formData.direccion);
            if(!formData.logo) throw new Error('Introduzca el logo de la institución.');

            const formDataToSend = new FormData();
            Object.keys(formData).forEach(key => {
                formDataToSend.append(key, formData[key]);
            });

            await queryInstitucion.crearInstitucion(formDataToSend);
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
            onBack();
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
                
                <div className="form-group">
                    <label>Logo de la Institución</label>
                    <div className="logo-upload-container">
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleLogoChange}
                            required
                        />
                        {logoPreview && (
                            <div className="logo-preview">
                                <img src={logoPreview} alt="Vista previa del logo" />
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="form-group">
                    <label>Contraseña</label>
                    <input 
                        type="password" 
                        value={formData.contrasena}
                        onChange={(e) => setFormData({...formData, contrasena: e.target.value})}
                        required
                    />
                </div>
                
                <div className="color-pickers-container">
                    <div className="color-picker-group">
                        <label>Color Primario</label>
                        <div className="color-picker">
                            <input 
                                type="color" 
                                value={formData.colorPrimario}
                                onChange={(e) => setFormData({...formData, colorPrimario: e.target.value})}
                                required
                            />
                            <span>{formData.colorPrimario}</span>
                        </div>
                    </div>
                    
                    <div className="color-picker-group">
                        <label>Color Secundario</label>
                        <div className="color-picker">
                            <input 
                                type="color" 
                                value={formData.colorSecundario}
                                onChange={(e) => setFormData({...formData, colorSecundario: e.target.value})}
                                required
                            />
                            <span>{formData.colorSecundario}</span>
                        </div>
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
                .register-form {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                
                .form-group {
                    margin-bottom: 20px;
                }
                
                label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: bold;
                }
                
                input[type="text"],
                input[type="password"] {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                }
                
                .logo-upload-container {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                
                .logo-preview {
                    width: 100px;
                    height: 100px;
                    border: 1px dashed #ccc;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .logo-preview img {
                    max-width: 100%;
                    max-height: 100%;
                }
                
                .color-pickers-container {
                    display: flex;
                    justify-content: space-between;
                    gap: 20px;
                    margin-bottom: 20px;
                }
                
                .color-picker-group {
                    flex: 1;
                }
                
                .color-picker {
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
                
                .form-actions {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 20px;
                }
                
                .back-btn, .submit-btn {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    backgrond-color: 
                }
                
                .back-btn {
                    background-color: #f0f0f0;
                }
                
                .submit-btn {
                    background-color: #7e46d2;
                    color: white;
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
                    color: ${alertType === "success" ? "#4CAF50" : "#ff0000"};
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
                <div className="custom-alert">
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