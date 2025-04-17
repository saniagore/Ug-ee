import {FaArrowLeft} from 'react-icons/fa';
import '../../css/homePageSingIn.css';
import { useNavigation } from '../../components/navigations';
import { useState } from 'react';
import { Validar_datos } from '../../components/dataValid';
import { QueryUser } from '../../components/queryUser';

export default function Login({ onBack }) {
    const userQuery = new QueryUser();
    const {goToMenu} = useNavigation();
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [formData, setFormData] = useState({
        celular: '',
        contraseña: '',
      });

    const handleChange = (field) => (e) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
    };

    const handleSubmit = async (event) => { 
        event.preventDefault();  
        
        try{
          Validar_datos.celular(formData.celular);
          Validar_datos.contraseña(formData.contraseña);
        }catch(err){
          setAlertMessage(err);
          setShowAlert(true);
          return;
        }
    
        try {
          const exists = await userQuery.verificarExistencia(formData.celular);
          console.log(exists);
          if (!exists.existe) {
            setAlertMessage('Número de celular no registrado');
            setShowAlert(true);
            setTimeout(() => {
                onBack();
              }, 5000);
          } 

          if(userQuery.verificarContraseña(formData.celular,formData.contraseña)){
            goToMenu();
          }else{
            setAlertMessage('Contraseña incorrecta');
            setShowAlert(true);
          }


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
            <h1 className='Title'>Iniciar sesion</h1>


            <h1 className='indicador'>Numero de celular</h1>
            <div className='inputs-section' style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
            }}>
                <input 
                className="input" 
                placeholder="Numero de celular"
                onChange={handleChange('celular')}
                value = {formData.celular}
                style={{ 
                    width: '500px',
                    position: 'relative',
                    left: 0,
                }}/>
            </div>


            <h1 className='indicador'> Contraseña</h1>
            <div className='inputs-section' style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
            }}>
                <input 
                className="input" 
                placeholder="Contraseña"
                onChange={handleChange('contraseña')}
                value = {formData.contraseña}
                type= 'password'
                style={{ width: '500px' }}
                />
            </div>

            <button className='continue-button' onClick={handleSubmit}>Iniciar</button>


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