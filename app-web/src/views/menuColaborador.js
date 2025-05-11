import '../css/colaboradorMenu.css';
import React, {useEffect, useState} from "react";
import { useNavigation } from '../components/navigations';

export default function MenuColaborador(){
    const {goToHomePage, goToWaitForValid} = useNavigation();
    const {estadoVerificacion, setEstadoVerificacion} = useState(false);
    const {esConductor, setEsConductor} = useState(false);
    const {link, setLink} = useState("");

    useEffect(()=>{
        const verifytAuth = async()=>{
            try{

            }catch(error){
                goToHomePage();
            }
        }
    }, [goToHomePage,goToWaitForValid,estadoVerificacion]);

    const handleLogout = async() => {
        try{
            switch(esConductor){
                case true:
                    setLink('http://localhost:5000/api/conductor/logout');
                    break;
                case false:
                    setLink('http://localhost:5000/api/institucion/logout');
                    break;
                default:
                    break;
            }
            await fetch(link,{
                method: 'POST',
                credentials: 'include'
            });
            goToHomePage();
        }catch(error){
            console.error("Error al cerrar sesión:", error);
        }
    };

    return(
        <>
            <div>
                hola
            </div>
            <button onClick={handleLogout}>Cerrar sesion</button>
        </>
    );

}