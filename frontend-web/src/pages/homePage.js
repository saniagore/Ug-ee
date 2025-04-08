import '../css/homePage.css';
import UwayLogo from '../resources/UwayLogo.png';
import ColombiaFlag from '../resources/ColombiaFlag.png';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';


function HomePage() {
    const [showVerification, setShowVerification] = useState(false);
    const caliPosition = [3.375658, -76.529885];

    return (
        <div className="App" style={{ display: 'flex', padding: '20px' }}>
            
            {!showVerification ? (
                <div className="container" style={{width: '400px'}}>
                    <img src={UwayLogo} alt="Logo" className="logo" />
                    <h1 className="title">Empecemos</h1>
                    <div className="subcontainer">
                        <div className="country-code-container">
                            <img src={ColombiaFlag} alt="Bandera Colombia" className="country-flag" />
                            <span className="country-code">+57</span>
                        </div>
                        <div className="input-section">
                            <input 
                                type="tel" 
                                id="phone" 
                                className="phone-input" 
                                placeholder="Ingresa tu celular"
                            />
                        </div>
                    </div>
                    <button 
                        className="continue-button"
                        onClick={() => setShowVerification(true)}
                    >
                        Continuar
                    </button>
                </div>
            ) : (
                <div className="container" style={{width: '400px', flexShrink: 0}}>
                    <button 
                        className="back-button"
                        onClick={() => setShowVerification(false)}
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
                    
                    <h2>Nuevo contenido aquí</h2>

                    {/* Aquí va lo que quieras mostrar después del click */}
                </div>
            )}

            <div style={{ 
                width: '2000px',
                height: '2000px', 
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

export default HomePage;