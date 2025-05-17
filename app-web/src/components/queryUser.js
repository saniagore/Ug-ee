/**
 * API Service Class for User Management
 * 
 * @class QueryUser
 * @description Centralizes all user-related API calls including:
 * - Authentication and authorization
 * - User verification and state management
 * - User creation and data retrieval
 * 
 * @property {string} BASE_URL - Base API endpoint URL
 * 
 * @example
 * // Example usage:
 * const userService = new QueryUser();
 * const authResult = await userService.login('3101234567', 'password123');
 */
export class QueryUser {
  static BASE_URL = "http://localhost:5000/api/usuario";

  /**
   * Verifies user credentials
   * @async
   * @method verificarContraseña
   * @param {string} celular - User's phone number
   * @param {string} contraseña - User's password
   * @returns {Promise<Object>} Authentication result with token
   * @throws {Error} When authentication fails
   */
  async verificarContraseña(celular, contraseña) {
    try {
      const response = await fetch(`${QueryUser.BASE_URL}/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ celular, contraseña }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error en autenticación");
      }

      if (data.token) {
        localStorage.setItem("jwt_token", data.token);
      }

      return data;
    } catch (error) {
      console.error("Error en verificarContraseña:", error);
      throw error;
    }
  }

  /**
   * Checks if user exists
   * @async
   * @method verificarExistencia
   * @param {string} celular - Phone number to check
   * @returns {Promise<boolean>} Whether user exists
   */
  async verificarExistencia(celular) {
    try {
      const response = await fetch(`${QueryUser.BASE_URL}/existe/${celular}`);
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Error en verificar existencia:", error);
      return false;
    }
  }

  /**
   * Checks user verification status
   * @async
   * @method verificarEstado
   * @param {string} celular - User's phone number
   * @returns {Promise<boolean>} Verification status
   */
  async verificarEstado(celular) {
    try {
      const response = await fetch(`${QueryUser.BASE_URL}/estado/${celular}`);
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      const { estado } = await response.json();
      return estado;
    } catch (err) {
      console.error("Error en verificar estado:", err);
      return false;
    }
  }

  /**
   * Handles user login process
   * @async
   * @method login
   * @param {string} celular - User's phone number
   * @param {string} contraseña - User's password
   * @returns {Promise<Object>} Login result with error status
   */
  async login(celular, contraseña) {
    try {
      const token = await this.verificarContraseña(celular, contraseña);
      if (!token) {
        return { error: true, message: "Credenciales incorrectas" };
      }
      localStorage.setItem("jwt_token", token);
      return { error: false, token };
    } catch (error) {
      console.error("Error al hacer login:", error);
      return { error: true, message: "Error de conexión al servidor" };
    }
  }

  /**
   * Creates a new user
   * @async
   * @method crearUsuario
   * @param {Object} formData - User registration data
   * @returns {Promise<Object>} Creation result with error status
   */
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
      console.error("Error al crear usuario:", err);
      return { error: true, message: "Error de conexión al servidor" };
    }
  }

  /**
   * Verifies authentication with JWT token
   * @async
   * @method verifyAuth
   * @returns {Promise<Object>} Authentication verification result
   * @throws {Error} When verification fails
   */
  async verifyAuth() {
    try {
      const response = await fetch(`${QueryUser.BASE_URL}/auth/verify`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403) {
          localStorage.removeItem("jwt_token");
        }
        throw new Error(data.error || "Error de autenticación");
      }

      return data;
    } catch (error) {
      console.error("Error en verifyAuth:", error);
      throw error;
    }
  }

  /**
   * Gets users by institution
   * @async
   * @method obtenerUsuarios
   * @param {string} institucionId - Institution ID
   * @returns {Promise<Array>} List of users
   * @throws {Error} When request fails
   */
  async obtenerUsuarios(institucionId) {
    try {
      const response = await fetch(
        `${QueryUser.BASE_URL}/obtenerUsuarios?institucionId=${institucionId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },
        }
      );

      if (!response.ok) throw new Error("Error al obtener usuarios");
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updates user verification status
   * @async
   * @method actualizarEstado
   * @param {string} celular - User's phone number
   * @returns {Promise<Object>} Update result
   * @throws {Error} When update fails
   */
  async actualizarEstado(celular, estado) {
    try {
      const response = await fetch(`${QueryUser.BASE_URL}/actualizar/estado`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        },
        body: JSON.stringify({ celular, estado }),
      });

      if (!response.ok) throw new Error("Error al actualizar estado");
      return await response.json();
    } catch (error) {
      console.error("Error en actualizarEstado:", error);
      throw error;
    }
  }
}