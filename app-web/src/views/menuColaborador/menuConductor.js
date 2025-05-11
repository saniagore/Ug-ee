export default function MenuConductor({ onLogout }) {
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