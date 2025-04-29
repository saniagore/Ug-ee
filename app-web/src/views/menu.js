import '../css/WaitForValid.css';
import React, { useEffect } from "react";
import UwayLogo from '../resources/UwayLogo.png';
import { useNavigation } from '../components/navigations';

export default function Menu() {
    const { goToHomePage } = useNavigation();

    // Verificar autenticación y obtener datos del usuario
    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/usuario/auth/verify', {
                    credentials: 'include'
                });
                
                if (!response.ok) {
                    goToHomePage(); // Usar el hook personalizado para redirigir
                }
                
                const data = await response.json();
                console.log("Usuario autenticado:", data.user);
                // Aquí puedes usar los datos del usuario si los necesitas
                
            } catch (error) {
                console.error("Error verificando autenticación:", error);
                goToHomePage();
            }
        };

        verifyAuth();
    }, [goToHomePage]); // Agregar goToHomePage como dependencia

    const handleLogout = async () => {
        try {
            // Limpiar la cookie del servidor
            await fetch('http://localhost:5000/api/usuario/logout', {
                method: 'POST',
                credentials: 'include'
            });
            
            // Redirigir al home usando el hook personalizado
            goToHomePage();
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    return (
        <div className='wait-for-valid-container' style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            backgroundColor: '#f8f8f8'
        }}>
            <div>
                <img src={UwayLogo} alt="Logo" className="logo"/>
            </div>
            <div style={{ textAlign: 'center', padding: '20px' }}>
                <h1>Esperando validación</h1>
                <div className="spinner"></div>
                <p>MENU POR EL MOMENTO</p>
                <button onClick={handleLogout} style={{
                    marginTop: '20px',
                    padding: '10px 20px',
                    backgroundColor: '#ff4d4d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}>
                    Cerrar sesión
                </button>
            </div>
        </div>
    );
}