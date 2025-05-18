import { useEffect } from "react";
import { useNavigation } from "../../components/navigations";
import { useNavigate } from "react-router-dom";
/**
 * Driver Menu Dashboard Component
 * 
 * @component
 * @name MenuConductor
 * @description Provides a dashboard interface for drivers with navigation options
 * and authentication verification. Handles driver-specific functionality and session management.
 * 
 * @param {Function} onLogout - Callback function triggered when logout is requested
 * 
 * @example
 * // Usage with logout handler
 * <MenuConductor onLogout={handleLogout} />
 * 
 * @returns {React.Element} Returns a driver dashboard with:
 * - Navigation options for driver-specific features
 * - Authentication verification system
 * - Logout functionality
 */
export default function MenuConductor({ onLogout }) {
    const { goToHomePage, goToWaitForValid } = useNavigation();
  const navigate = useNavigate();

    const handleRegistrarVehiculo = () => {
      navigate("/Colaborador/Registrar-vehiculo");
    };
    /**
     * Authentication verification effect
     * @effect
     * @name verifyAuth
     * @description Verifies JWT token on component mount, checks verification status,
     * and redirects appropriately if authentication fails or is pending.
     */
    useEffect(() => {
        const verifyAuth = async () => {
          try {
            const token = localStorage.getItem("jwt_token");
            if (!token) {
              goToHomePage();
              return;
            }
    
            const decodedToken = JSON.parse(atob(token.split(".")[1]));
    
            console.log(decodedToken);
            if (!decodedToken.estadoVerificacion) {
              goToWaitForValid();
              return;
            }
    
          } catch (error) {
            localStorage.removeItem("jwt_token");
            goToHomePage();
          }
        };
        verifyAuth();
    }, [goToHomePage, goToWaitForValid]);

    return (
        <div className="menu-conductor">
            <h2>Panel del Conductor</h2>
            <div className="menu-options">
                <button>Mis Viajes</button>
                <button onClick={handleRegistrarVehiculo}>Registrar Vehiculo</button>
                <button>Mi Vehículo</button>
                <button>Documentos</button>
                <button onClick={onLogout}>Cerrar Sesión</button>
            </div>
        </div>
    );
}