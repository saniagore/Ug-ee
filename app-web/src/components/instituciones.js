export async function getInstituciones() {
    try {
        const response = await fetch('http://localhost:5000/api/institucion/nombres');
        
        if (!response.ok) {
            let errorMsg = 'Error al obtener las instituciones';
            try {
                const errorData = await response.json();
                errorMsg = errorData.error || errorData.message || errorMsg;
            } catch (e) {
                errorMsg = `Error ${response.status}: ${response.statusText}`;
            }
            throw new Error(errorMsg);
        }
        
        const data = await response.json();
        return data.instituciones || data || [];
    } catch (err) {
        console.error('Error al obtener instituciones:', err);
        throw err;
    }
};