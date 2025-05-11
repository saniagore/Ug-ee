import React, { useEffect } from "react";
import { QueryInstitucion } from "../../components/queryInstitucion";
import { useNavigation } from "../../components/navigations";

export default function MenuInstitucion({ onLogout }) {
    const institucionQuery = new QueryInstitucion();
    const { goToHomePage, goToWaitForValid} = useNavigation();

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const token = localStorage.getItem("jwt_token");
                if (!token) {
                    goToHomePage();
                    return;
                }
                const decodedToken = JSON.parse(atob(token.split('.')[1]));
                
                if(!decodedToken.estadoVerificacion){
                    goToWaitForValid();
                }
            } catch(error) {
                localStorage.removeItem("jwt_token");
                goToHomePage();
            }
        };
        verifyAuth();
    }, [goToHomePage, goToWaitForValid]);

    return (
        <div className="menu-institucion">
            <h2>Panel de la Institución</h2>
            <div className="menu-options">
                <button>Gestión de Conductores</button>
                <button>Reportes</button>
                <button>Configuración</button>
                            <button onClick={onLogout}>Cerrar Sesión</button>
                        </div>
                    </div>
                );
            }