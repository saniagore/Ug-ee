import { useEffect } from "react";
import { useNavigation } from "../../components/navigations";

export default function MenuConductor({ onLogout }) {
    const { goToHomePage, goToWaitForValid } = useNavigation();

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
    }, [goToHomePage,goToWaitForValid]);

    return (
        <div className="menu-conductor">
            <h2>Panel del Conductor</h2>
            <div className="menu-options">
                <button>Mis Viajes</button>
                <button>Mi Vehículo</button>
                <button>Documentos</button>
                <button onClick={onLogout}>Cerrar Sesión</button>
            </div>
        </div>
    );
}