import React, { useState } from 'react';
import { QueryInstitucion } from '../../../../components/queryInstitucion';

export default function ColaboratorInstitucion({ onBack, onSuccess }) {
    const queryInstitucion = new QueryInstitucion();
    const [formData, setFormData] = useState({
        nombre: '',
        contraseña: '',
        colorPrimario: '',
        colorSecundario: '',
        direccion: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            await queryInstitucion.crearInstitucion(formData);
        }catch(error){
            console.log('error')
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
                    <label>Direccion</label>
                    <input 
                        value={formData.direccion}
                        onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label>Color primario</label>
                    <input 
                        value={formData.colorPrimario}
                        onChange={(e) => setFormData({...formData, colorPrimario: e.target.value})}
                        required
                    />
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
                
                <div className="form-group">
                    <label>Color Secundario</label>
                    <input 
                        value={formData.colorSecundario}
                        onChange={(e) => setFormData({...formData, colorSecundario: e.target.value})}
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