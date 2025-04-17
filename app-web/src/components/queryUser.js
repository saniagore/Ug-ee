export class QueryUser {
  static BASE_URL = "http://localhost:5000";

  async verificarContraseña(celular, contraseña) {
    try {
      const response = await fetch(
        `${QueryUser.BASE_URL}/api/usuario/verificar-contraseña`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ celular, contraseña }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const { coincide } = await response.json();
      return coincide;
    } catch (error) {
      console.error("Error en verificar contraseña:", error);
      return false;
    }
  }

  async verificarExistencia(celular) {
    try {
      const response = await fetch(
        `${QueryUser.BASE_URL}/api/usuario/existe/${celular}`
      );

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const  existe  = await response.json();
      return existe;
    } catch (error) {
      console.error("Error en verificar existencia:", error);
      return false;
    }
  }

  async verificarEstado(celular){
    try{
        const response = await fetch(
            `${QueryUser.BASE_URL}/api/usuario/estado/${celular}`
        );

        if(!response.ok){
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const { estado } = await response.json();
        return estado;
    }catch(err){
        console.error("Error en verificar el estado del usuario:", err);
        return false;
    }
  }
}
