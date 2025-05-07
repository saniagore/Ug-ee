import '../css/WaitForValid.css';
import React, { useEffect, useState } from "react";
//import UwayLogo from '../resources/UwayLogo.png';
import { useNavigation } from '../components/navigations';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';

export default function Menu() {
    const { goToHomePage, goToWaitForValid } = useNavigation();
    const caliPosition = [3.375658, -76.529885];
    const [estadoVerificacion,setEstadoVerificacion] = useState(false);

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/usuario/auth/verify', {
                    credentials: 'include'
                });
                if (!response.ok) {
                    goToHomePage();
                }   
                const data = await response.json();
                setEstadoVerificacion(data.user.estado)
                if(!estadoVerificacion){
                    goToWaitForValid()
                }


            } catch (error) {
                console.error("Error verificando autenticación:", error);
                goToHomePage();
            }
        };

        verifyAuth();
    }, [goToHomePage,goToWaitForValid,estadoVerificacion]); 

    const handleLogout = async () => {
        try {
            await fetch('http://localhost:5000/api/usuario/logout', {
                method: 'POST',
                credentials: 'include'
            });
            goToHomePage();
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    return (

        <div className="App" style={{ display: 'flex', padding: '20px' }}>
            <div className="container" style={{width: '100%', maxWidth: '400px'}}>
                <button onClick={handleLogout}> boton </button>

            </div>

            <div style={{ 
                width: '2000px',
                height: '900px', 
                marginLeft: '20px', 
                borderRadius: '15px', 
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }}>
                <MapContainer 
                    center={caliPosition} 
                    zoom={220} 
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                </MapContainer>
            </div>
        </div>
    );
}