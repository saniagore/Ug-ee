import '../css/homePage.css';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import { useState } from 'react';
import { PhoneInput } from './homePages/homePagePhone';
import Register from './homePages/homePageSingUp';

function HomePage() {
    const [currentView, setCurrentView] = useState('phoneInput');
    const caliPosition = [3.375658, -76.529885];

    return (
        <div className="App" style={{ display: 'flex', padding: '20px' }}>
            <div className="container" style={{width: '100%', maxWidth: '400px'}}>
                
                {currentView === 'phoneInput' && (
                    <PhoneInput onRegister={() => setCurrentView('verification')} />
                )}
                
                {currentView === 'verification' && (
                    <Register onBack={() => setCurrentView('phoneInput')} />
                )}
                
                {/* Puedes añadir más vistas aquí */}
            </div>

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