import '../css/colaboradorMenu.css';
import { useEffect, useState } from "react";
import { useNavigation } from '../components/navigations';
import MenuConductor from './menuColaborador/menuConductor'; // Componente para conductores
import MenuInstitucion from './menuColaborador/menuInstitucion'; // Componente para instituciones

export default function MenuColaborador() {
    const { goToHomePage, goToValidando } = useNavigation();
    const [userType, setUserType] = useState(null); // 'conductor' o 'institucion'
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const token = localStorage.getItem("jwt_token");
                
                if (!token) {
                    goToHomePage();
                    return;
                }
                const decodedToken = JSON.parse(atob(token.split('.')[1]));   
                if (decodedToken.esConductor) {
                    setUserType('conductor');
                } else if (decodedToken.esInstitucion) {
                    setUserType('institucion');
                } else {
                    throw new Error("Tipo de usuario no reconocido");
                }

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
                
                console.log("1");
                goToHomePage();
            }
        };

        verifyAuth();
    }, [goToHomePage, goToValidando]);

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

            localStorage.removeItem("jwt_token");
            localStorage.removeItem("user_type");
            
            goToHomePage();
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            setError("Error al cerrar sesión");
        }
    };
    if (loading) {
        return <div className="loading-container">Cargando...</div>;
    }

    if (error) {
        return <div className="error-container">Error: {error}</div>;
    }

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