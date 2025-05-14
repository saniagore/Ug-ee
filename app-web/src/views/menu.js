import '../css/WaitForValid.css';
import React, { useEffect } from "react";
import { useNavigation } from '../components/navigations';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';

/**
 * Main Menu component featuring an interactive map and user authentication controls.
 * 
 * @component
 * @name Menu
 * @description The primary navigation interface that displays a map view and handles
 * user authentication state. Verifies user credentials on mount and provides logout functionality.
 * 
 * @property {Function} handleLogout - Handles user logout process
 * @property {Array} caliPosition - Default map coordinates [latitude, longitude] for Cali, Colombia
 * 
 * @example
 * // Usage in router configuration
 * <Route path='/Menu' element={<Menu />} />
 * 
 * @returns {React.Element} Returns a layout with:
 * - A control panel container (currently with logout button)
 * - An interactive map component centered on Cali, Colombia
 */
export default function Menu() {
    const { goToHomePage, goToWaitForValid } = useNavigation();
    const caliPosition = [3.375658, -76.529885]; // Coordinates for Cali, Colombia

    /**
     * Effect hook that verifies user authentication on component mount.
     * @effect
     * @name verifyAuth
     * @description Checks the user's authentication status with the backend API.
     * Redirects to home page if not authenticated or to validation page if account is pending.
     */
    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/usuario/auth/verify', {
                    credentials: 'include'
                });
                
                if (!response.ok) {
                    goToHomePage();
                    return;
                }   
                
                const data = await response.json();
                if (!data.user.estado) {
                    goToWaitForValid();
                }
            } catch (error) {
                goToHomePage();
            }
        };

        verifyAuth();
    }, [goToHomePage, goToWaitForValid]); 

    /**
     * Handles the user logout process.
     * @async
     * @function handleLogout
     * @description Makes a POST request to the logout endpoint and redirects to home page.
     * Logs any errors to the console.
     */
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
            {/* Control panel container */}
            <div className="container" style={{ width: '100%', maxWidth: '400px' }}>
                <button onClick={handleLogout}>Logout</button>
            </div>

            {/* Map container */}
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