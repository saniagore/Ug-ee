import '../css/colaboradorMenu.css';
import React, { useEffect, useState } from "react";
import { useNavigation } from '../components/navigations';
import MenuConductor from './menuColaborador/menuConductor'; // Componente para conductores
import MenuInstitucion from './menuColaborador/menuInstitucion'; // Componente para instituciones

/**
 * Main collaborator menu component that handles authentication and renders the appropriate
 * menu based on user type (driver or institution).
 * 
 * @component
 * @name MenuColaborador
 * @description This component serves as a gateway for authenticated collaborators, verifying
 * the user's credentials and rendering the appropriate menu interface based on their role
 * (either driver or institution). It handles authentication state, token verification, and
 * logout functionality.
 * 
 * @property {Function} handleLogout - Handles the logout process for both user types
 * @property {string|null} userType - Tracks whether user is 'conductor' or 'institucion'
 * @property {boolean} loading - Manages loading state during authentication verification
 * @property {string|null} error - Stores error messages during authentication process
 * 
 * @example
 * // Usage in router configuration
 * <Route path='/Colaborador/Menu' element={<MenuColaborador />} />
 * 
 * @returns {React.Element} Returns either:
 * - A loading indicator during authentication
 * - An error message if authentication fails
 * - The appropriate menu component (MenuConductor or MenuInstitucion) based on user type
 */
export default function MenuColaborador() {
    const { goToHomePage, goToWaitForValid } = useNavigation();
    const [userType, setUserType] = useState(null); // 'conductor' o 'institucion'
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /**
     * Effect hook that verifies user authentication on component mount.
     * @effect
     * @name verifyAuth
     * @description Performs JWT token verification, checks user type, and validates
     * the token with the backend. Handles both driver and institution authentication flows.
     */
    useEffect(() => {
        const verifyAuth = async () => {
            try {
                // Verify stored token
                const token = localStorage.getItem("jwt_token");
                
                if (!token) {
                    goToHomePage();
                    return;
                }

                // Decode token to get user type
                const decodedToken = JSON.parse(atob(token.split('.')[1]));
                
                // Determine user type
                if (decodedToken.esConductor) {
                    setUserType('conductor');
                } else if (decodedToken.esInstitucion) {
                    setUserType('institucion');
                } else {
                    throw new Error("Tipo de usuario no reconocido");
                }

                // Verify with backend
                const verifyEndpoint = decodedToken.esConductor 
                    ? 'http://localhost:5000/api/conductor/auth/verify'
                    : 'http://localhost:5000/api/institucion/auth/verify';

                const response = await fetch(verifyEndpoint, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error("Token inválido o expirado");
                }

                setLoading(false);
            } catch (error) {
                console.error("Error de autenticación:", error);
                setError(error.message);
                localStorage.removeItem("jwt_token");
                goToHomePage();
            }
        };

        verifyAuth();
    }, [goToHomePage, goToWaitForValid]);

    /**
     * Handles the logout process for both driver and institution users.
     * @async
     * @function handleLogout
     * @description Makes a POST request to the appropriate logout endpoint,
     * clears local storage, and redirects to the home page.
     */
    const handleLogout = async () => {
        try {
            const logoutEndpoint = userType === 'conductor'
                ? 'http://localhost:5000/api/conductor/logout'
                : 'http://localhost:5000/api/institucion/logout';

            await fetch(logoutEndpoint, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("jwt_token")}`
                }
            });

            // Clear storage
            localStorage.removeItem("jwt_token");
            localStorage.removeItem("user_type");
            
            // Redirect to home
            goToHomePage();
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            setError("Error al cerrar sesión");
        }
    };

    // Loading state
    if (loading) {
        return <div className="loading-container">Cargando...</div>;
    }

    // Error state
    if (error) {
        return <div className="error-container">Error: {error}</div>;
    }

    // Render appropriate menu based on user type
    return (
        <div className="menu-colaborador-container">
            {userType === 'conductor' ? (
                <MenuConductor onLogout={handleLogout} />
            ) : (
                <MenuInstitucion onLogout={handleLogout} />
            )}
        </div>
    );
}