export class QueryUser {
  static BASE_URL = "http://localhost:5000";

  async verificarContraseña(celular, contraseña) {
    try {
      const response = await fetch(`${QueryUser.BASE_URL}/api/usuario/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ celular, contraseña }),
      });

      const data = await response.json();

      if (!response.ok || data.coincide === false) {
        return false;
      }
      return data.token;
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

      const existe = await response.json();
      return existe;
    } catch (error) {
      console.error("Error en verificar existencia:", error);
      return false;
    }
  }

  async verificarEstado(celular) {
    try {
      const response = await fetch(
        `${QueryUser.BASE_URL}/api/usuario/estado/${celular}`
      );

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const { estado } = await response.json();
      return estado;
    } catch (err) {
      console.error("Error en verificar el estado del usuario:", err);
      return false;
    }
  }
  
  async login(celular, contraseña) {
    try {
      const token = await this.verificarContraseña(celular, contraseña);

      if (!token) {
        return {
          error: true,
          message: "Credenciales incorrectas",
        };
      }
      localStorage.setItem("jwt_token", token);

      return {
        error: false,
        token,
      };
    } catch (error) {
      console.error("Error al hacer login:", error);
      return {
        error: true,
        message: "Error de conexión al servidor",
      };
    }
  }

  async crearUsuario(formData) {
    try {
      const response = await fetch(
        `${QueryUser.BASE_URL}/api/usuario/crearusuario`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        }
      );
  
      const result = await response.json();
      
      if (!response.ok) {
        return {
          error: true,
          message: result.message || "Error al crear usuario",
          details: result.details
        };
      }
  
      return result;
    } catch (err) {
      console.error("Error al crear el usuario:", err);
      return { 
        error: true,
        message: "Error de conexión al servidor"
      };
    }
  }
}
