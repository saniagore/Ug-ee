import {FaArrowLeft} from 'react-icons/fa';
import { VscAccount } from "react-icons/vsc";
import '../../css/homePageSingUp.css'
import { Arrayinstituciones } from '../../components/instituciones';
import { useState, useEffect } from 'react';
import { registrarUsuario } from '../../components/registrarUsuario';
import { checkUserInDatabase } from '../../components/phoneValid';

export default function Register({ onBack }) {
    const [nombre,setNombre] = useState('')
    const [celular, setCelular] = useState('')
    const [contraseña, setContraseña] = useState('')
    const [numeroIdentificacion, setNumeroIdentificacion] = useState('');
    const [correo, setCorreo] = useState('');
    const [tipoIdentificacion, setTipoIdentificacion] = useState('');
    const [institucion, setInstitucion] = useState('');
    const [instituciones, setInstituciones] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    //AGREGAR VALIDACIONES PARA LOS CAMPOS INGRESADOS




    useEffect(() => {
        const fetchInstituciones = async () => {
            try {
                const data = await Arrayinstituciones();
                setInstituciones(data.instituciones || []);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
                console.error('Error al cargar instituciones:', err);
            }
        };

        fetchInstituciones();
    }, []);

    if (loading) {
        return <div>Cargando instituciones...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }


    const handleRegistrarUsuario = async (event) => { 
        event.preventDefault();  
        try {
            const { exists } = await checkUserInDatabase(celular);
            if (exists) {
                setAlertMessage('Número de celular ya registrado');
                setShowAlert(true);
            }
            
            await registrarUsuario(nombre, contraseña, numeroIdentificacion, tipoIdentificacion, correo, celular, institucion);
        } catch (error) {
            setAlertMessage(error.message);
            setShowAlert(true);
        }
    };

    return (
        <>
            <button 
                className="back-button"
                onClick={onBack}
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '20px',
                    marginBottom: '20px',
                    color: '#7e46d2'
                }}
            >
                <FaArrowLeft />
            </button>
            <h2 className = "Title">Perfil</h2>
            <div>
                <VscAccount className='Profile'/>
                <input 
                        className="input" 
                        placeholder="Nombre completo"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        style={{ width: '150px', marginLeft: '80px'}}
                />
            </div>
            <div 
                className='inputs-section' style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                }}>
                    <input 
                        className="input" 
                        placeholder="Contraseña"
                        style={{ width: '150px' }}
                        value={contraseña}
                        onChange={(e) => setContraseña(e.target.value)}
                    />
                    <input 
                        className="input" 
                        placeholder="Numero de identificación"
                        style={{ 
                            width: '200px',
                            position: 'relative',
                            left: 0 ,
                        }}
                        value={numeroIdentificacion}
                        onChange={(e) => setNumeroIdentificacion(e.target.value)}
                    />
             </div>

             <div 
                className='inputs-section' style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                }}>
                    <input 
                        className="input" 
                        placeholder="Correo"
                        style={{ width: '150px'}}
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                    />
                    <select 
                        className="select" 
                        value={tipoIdentificacion}
                        onChange={(e) => setTipoIdentificacion(e.target.value)}
                    >
                        <option className='input-label' value="">Tipo de documento</option>
                        <option className='input-label' value="CC">Cédula de Ciudadanía (CC)</option>
                        <option className='input-label' value="TI">Tarjeta de Identidad (TI)</option>
                        <option className='input-label' value="CE">Cédula de Extranjería (CE)</option>
                        <option className='input-label' value="PP">Pasaporte (PP)</option>
                    </select>
             </div>

             <div 
                className='inputs-section' style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    marginBottom: '270px'
                }}>
                    <input 
                        className="input" 
                        placeholder="Celular"
                        style={{ width: '150px'}}
                        value={celular}
                        onChange={(e) => setCelular(e.target.value)}
                    />
                    <select 
                        className="select" 
                        value={institucion}
                        onChange={(e) => setInstitucion(e.target.value)}
                    >
                        <option className='input-label' value="">Institucion educativa</option>
                    {instituciones.map((institucion, index) => (
                        <option 
                            key={index} 
                            className='input-label' 
                            value={institucion.nombre}
                        >
                            {institucion.nombre}
                        </option>
                    ))}
                </select>
            </div>
            
            <button className="continue-button" onClick={handleRegistrarUsuario}>Continuar</button>

            {showAlert && (
                <div className="custom-alert">
                    <div className="alert-content">
                        <h3>Error</h3> 
                        <p>{alertMessage}</p>
                        <button onClick={() => setShowAlert(false)}>Cerrar</button>
                    </div>
                </div>
            )}
        </>
    );
}