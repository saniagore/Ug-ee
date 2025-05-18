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

/**
 * Application Homepage Component
 * 
 * @component
 * @name HomePage
 * @description The main entry point of the application featuring:
 * - Authentication flow (phone input, registration, login)
 * - Interactive map display
 * - Automatic session verification
 * 
 * @property {string} currentView - Tracks current authentication view state
 * @property {Array} caliPosition - Default map coordinates [lat, lng] for Cali, Colombia
 * 
 * @example
 * // Usage as root component
 * <Route path="/" element={<HomePage />} />
 * 
 * @returns {React.Element} Returns a split-view layout with:
 * - Left panel: Authentication forms (phone input/registration/login)
 * - Right panel: Interactive map
 */
function HomePage() {
    const [currentView, setCurrentView] = useState('phoneInput');
    const caliPosition = [3.375658, -76.529885];
    const { goToMenu } = useNavigation();
    const [celular,setCelular] = useState('');

    /**
     * Effect hook for session verification
     * @effect
     * @name checkAuth
     * @description Checks for existing valid session on component mount
     * and redirects to menu if user is already authenticated
     */
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/usuario/auth/verify', {
                    credentials: 'include'
                }).catch(() => {}); 
                
                if (response?.ok) { 
                    const data = await response.json();
                    if (data.authenticated) {
                        goToMenu(); 
                    }
                }
            } catch (error) {
                // Silent error handling for failed auth check
            }
        };
    
        checkAuth();
    }, [goToMenu]);

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

/**
 * Map container style configuration
 * @constant
 * @name mapContainerStyle
 * @type {Object}
 */
const mapContainerStyle = { 
    width: '2000px',
    height: '900px', 
    marginLeft: '20px', 
    borderRadius: '15px', 
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
};

export default HomePage;