export const Arrayinstituciones = async() => {
    try {
        const response = await fetch('http://localhost:5000/api/institucion');
        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.details || errorData.error || 'Error en la peticion');
        }

        const data = await response.json();
        return data;
    } catch(error) {
        console.error('Error completo', error);
        throw error;
    }
};