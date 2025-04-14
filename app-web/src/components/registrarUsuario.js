export const registrarUsuario = async (
    nombre,
    contraseña,
    numeroIdentificacion,
    tipoIdentificacion,
    correo,
    celular,
    institucion
  ) => {
    try {
      const response = await fetch('http://localhost:5000/api/usuario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre,
          contraseña,
          nid: numeroIdentificacion,
          tid: tipoIdentificacion,
          correo,
          telefono: celular,
          institucion
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al registrar usuario');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error completo:', error);
      throw error;
    }
  };