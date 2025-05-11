import '../css/colaboradorMenu.css';
import React, {useEffect, useState} from "react";
import { useNavigation } from '../components/navigations';

export default function MenuColaborador(){
    const {goToHomePage, goToWaitForValid} = useNavigation();
    const {estadoVerificacion, setEstadoVerificacion} = useState(false);

    useEffect(()=>{
        const verifytAuth = async()=>{
            try{

            }catch(error){
                
            }
        }
    })
}