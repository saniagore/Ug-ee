export const verificarContraseña = async(phone,contraseña) => {
    try{
        const response = await fetch(`http://localhost:5000/api/usuario/${phone}/contraseña`);

        if(!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.details|| errorData.error || 'Error al verificar el estado del usuario');
        }

        const data = await response.json();

        if(contraseña===data.contraseña){
            return true;
        }
        return false;

    } catch (error) {
        console.error('Error al verificar estado del usuario:', error);
        throw error;
      }
};