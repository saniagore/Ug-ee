import '../css/WaitForValid.css';
import React from "react";
import UwayLogo from '../resources/UwayLogo.png';

export default function Menu() {
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
            <p>MENU POR EL MOMENTO</p>
        </div>
    </div>
  );
}