import '../../css/homePagePhone.css';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import { MapContainer, TileLayer } from 'react-leaflet';

import { useState } from 'react';
import { PhoneInput } from './homePages/homePagePhone';
import { useNavigation } from '../../components/navigations';

import Register from './homePages/homePageSingUp';
import Login from './homePages/homePageSingIn';


function HomePage() {
    const [currentView, setCurrentView] = useState('phoneInput');
    const caliPosition = [3.375658, -76.529885];
    const { goToMenu } = useNavigation();
    const [celular,setCelular] = useState('');

    /**
     * Handles successful login event
     * @function handleLoginSuccess
     * @description Redirects user to main menu after successful login
     */
    const handleLoginSuccess = () => {
        goToMenu();
    };

    return (
        <div className="App" style={{ display: 'flex', padding: '20px' }}>
            {/* Authentication Panel */}
            <div className="container" style={{width: '100%', maxWidth: '400px'}}>
                {currentView === 'phoneInput' && (
                    <PhoneInput 
                        onRegister={() => setCurrentView('register')}
                        onLogin={() => setCurrentView('login')}
                        setCelular={setCelular}
                    />
                )}
                                
                {/* Registration View */}
                {currentView === 'register' && (
                    <Register onBack={() => setCurrentView('phoneInput')} />
                )}
                
                {/* Login View */}
                {currentView === 'login' && (
                    <Login 
                        onBack={() => setCurrentView('phoneInput')}
                        onLoginSuccess={handleLoginSuccess}
                        celular={celular}
                    />
                )}
            </div>

            {/* Map Panel */}
            <div style={mapContainerStyle}>
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

const mapContainerStyle = { 
    width: '2000px',
    height: '900px', 
    marginLeft: '20px', 
    borderRadius: '15px', 
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
};

export default HomePage;