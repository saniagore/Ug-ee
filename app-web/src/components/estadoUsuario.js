export const checkUserStatus = async (phone) => {
    try {
      const response = await fetch(`http://localhost:5000/api/usuario/${phone}/estado`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Error al verificar el estado del usuario');
      }
      
      const data = await response.json();
      return data.estado;
      
    } catch (error) {
      console.error('Error al verificar estado del usuario:', error);
      throw error;
    }
  };