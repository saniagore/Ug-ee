import {FaArrowLeft} from 'react-icons/fa';

export default function Register({ onBack }) {
    return (
        <>
            <button 
                className="back-button"
                onClick={onBack}
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '20px',
                    marginBottom: '20px',
                    color: '#7e46d2'
                }}
            >
                <FaArrowLeft />
            </button>
            <h2>Ingresa tu código de verificación</h2>
            {/* Más contenido aquí */}
        </>
    );
}