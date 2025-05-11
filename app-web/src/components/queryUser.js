export class QueryUser {
  static BASE_URL = "http://localhost:5000/api/usuario";

  async verificarContraseña(celular, contraseña) {
    try {
      const response = await fetch(`${QueryUser.BASE_URL}/login`, {
        method: "POST",
        credentials: 'include', // Importante para cookies
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ celular, contraseña }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Error en autenticación");
      }

      // Guardar token en localStorage por si acaso
      if (data.token) {
        localStorage.setItem("jwt_token", data.token);
      }
      
      return data;

    } catch (error) {
      console.error("Error en verificarContraseña:", error);
      throw error;
    }
  }

  async verificarExistencia(celular) {
    try {
      const response = await fetch(`${QueryUser.BASE_URL}/existe/${celular}`);

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
      const response = await fetch(`${QueryUser.BASE_URL}/estado/${celular}`);

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
      const response = await fetch(`${QueryUser.BASE_URL}/crearusuario`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          error: true,
          message: result.message || "Error al crear usuario",
          details: result.details,
        };
      }

      return result;
    } catch (err) {
      console.error("Error al crear el usuario:", err);
      return {
        error: true,
        message: "Error de conexión al servidor",
      };
    }
  }

  async verifyAuth() {
    try {
      const response = await fetch(`${QueryUser.BASE_URL}/auth/verify`, {
        method: "GET",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("jwt_token")}`
        }
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        // Manejar diferentes tipos de errores
        if (response.status === 403) {
          localStorage.removeItem("jwt_token"); // Limpiar token inválido
        }
        throw new Error(data.error || "Error de autenticación");
      }
      
      return data;
  
    } catch (error) {
      console.error("Error en verifyAuth:", error);
      throw error;
    }
  }

  async verifyAuthWithCookiesOnly() {
    try {
      const response = await fetch(`${QueryUser.BASE_URL}/auth/verify`, {
        method: "GET",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json"
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Error en verificación con cookies");
      }
      if (data.token) {
        localStorage.setItem("jwt_token", data.token);
      }
      
      return data;

    } catch (error) {
      console.error("Error en verifyAuthWithCookiesOnly:", error);
      throw error;
    }
  }

  async verifyAuthWithoutToken() {
    try {
      const response = await fetch(`${QueryUser.BASE_URL}/auth/verify`, {
        method: "GET",
        credentials: 'include',
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Error en verificación");
      }      
      if (data.token) {
        localStorage.setItem("jwt_token", data.token);
      }
      
      return data;

    } catch (error) {
      console.error("Error en verifyAuthWithoutToken:", error);
      throw error;
    }
  }
}


