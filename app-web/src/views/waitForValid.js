import '../css/WaitForValid.css';
import React from "react";
import UwayLogo from '../resources/UwayLogo.png';
import { useNavigation } from '../components/navigations';

/**
 * Component that displays a waiting screen while user account is being validated.
 * 
 * @component
 * @name WaitForValid
 * @description A full-screen view that shows a loading state while the user's account 
 * is being verified by the system. Includes the application logo, a spinner animation,
 * status message, and a logout button.
 * 
 * @property {Function} handleLogout - Handles the logout process by making an API call
 * to the server and redirecting to the home page upon success.
 * 
 * @example
 * // Usage in router configuration
 * <Route path='/WaitForValid' element={<WaitForValid />} />
 * 
 * @returns {React.Element} Returns a styled div containing:
 * - Application logo
 * - "Waiting for validation" heading
 * - Loading spinner animation
 * - Status message
 * - Logout button
 */
export default function WaitForValid() {
  const { goToHomePage } = useNavigation();

  /**
   * Handles the user logout process.
   * @async
   * @function handleLogout
   * @description Makes a POST request to the logout endpoint, then redirects to home page.
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
            <p>Tu cuenta está siendo verificada. Por favor, espera.</p>
            <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
    </div>
  );
}