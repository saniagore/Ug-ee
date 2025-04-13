export const checkUserInDatabase = async (phone) => {
    try {
      const response = await fetch(`http://localhost:5000/api/usuario/${phone}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        // Muestra el error real del backend
        throw new Error(errorData.details || errorData.error || 'Error en la petición');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Error completo:', error);
      throw error;
    }
  };