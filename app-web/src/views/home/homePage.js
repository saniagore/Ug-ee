import '../../css/homePagePhone.css';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import { useState, useEffect } from 'react';
import { PhoneInput } from './homePages/homePagePhone';
import Register from './homePages/homePageSingUp';
import Login from './homePages/homePageSingIn';
import { useNavigation } from '../../components/navigations';


function HomePage() {
    const [currentView, setCurrentView] = useState('phoneInput');
    const caliPosition = [3.375658, -76.529885];
    const { goToMenu } = useNavigation();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/usuario/auth/verify', {
                    credentials: 'include'
                });
                
                if (response.ok) {
                    const data = await response.json();
                    if (data.authenticated) {
                        goToMenu(); 
                    }
                }
            } catch (error) {
                console.error("Error verificando autenticación:", error);
            }
        };

        checkAuth();
    }, [goToMenu]); // Agregar goToMenu como dependencia

    const handleLoginSuccess = () => {
        goToMenu(); // Usar el hook personalizado para redirigir
    };




    return (

        <div className="App" style={{ display: 'flex', padding: '20px' }}>
            <div className="container" style={{width: '100%', maxWidth: '400px'}}>
                
                {currentView === 'phoneInput' && (
                    <PhoneInput 
                        onRegister={() => setCurrentView('register')}
                        onLogin={() => setCurrentView('login')}
                        />
                )}
                
                {currentView === 'register' && (
                    <Register onBack={() => setCurrentView('phoneInput')} />
                )}
                {currentView === 'login' && (
                    <Login onBack={() => setCurrentView('phoneInput')}
                    onLoginSuccess={handleLoginSuccess}
                    />
                )}
                

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

export default HomePage;