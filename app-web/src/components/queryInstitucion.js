export class QueryInstitucion {
  static BASE_URL = "http://localhost:5000/api/institucion";

  async obtenerNombresInstituciones() {
    try {
      const response = await fetch(`${QueryInstitucion.BASE_URL}/nombres`, {
        method: "GET",
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          error: true,
          message: result.error || "Error al obtener instituciones",
          details: result.details,
        };
      }

      return result;
    } catch (error) {
      return {
        error: true,
        message: "Error de conexión al servidor",
        details: error.message,
      };
    }
  }

  async obtenerInstituciones(pagina = 1, limite = 10, verificadas = null) {
    try {
      let url = `${QueryInstitucion.BASE_URL}?pagina=${pagina}&limite=${limite}`;
      if (verificadas !== null) {
        url += `&verificadas=${verificadas}`;
      }

      const response = await fetch(url, {
        method: "GET",
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          error: true,
          message: result.error || "Error al obtener instituciones",
          details: result.details,
        };
      }

      return result;
    } catch (error) {
      return {
        error: true,
        message: "Error de conexión al servidor",
        details: error.message,
      };
    }
  }

  async obtenerInstitucionPorId(id) {
    try {
      const response = await fetch(`${QueryInstitucion.BASE_URL}/${id}`, {
        method: "GET",
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          error: true,
          message: result.error || "Error al obtener institución",
          details: result.details,
        };
      }

      return result;
    } catch (error) {
      return {
        error: true,
        message: "Error de conexión al servidor",
        details: error.message,
      };
    }
  }

  async crearInstitucion(formData) {
    try {
      const response = await fetch(`${QueryInstitucion.BASE_URL}`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          error: true,
          message: result.message || "Error al crear institución",
          details: result.details,
        };
      }

      return result;
    } catch (error) {
      return {
        error: true,
        message: "Error de conexión al servidor",
        details: error.message,
      };
    }
  }

  async actualizarInstitucion(id, formData) {
    try {
      const response = await fetch(`${QueryInstitucion.BASE_URL}/${id}`, {
        method: "PUT",
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          error: true,
          message: result.message || "Error al actualizar institución",
          details: result.details,
        };
      }

      return result;
    } catch (error) {
      return {
        error: true,
        message: "Error de conexión al servidor",
        details: error.message,
      };
    }
  }

  async eliminarInstitucion(id) {
    try {
      const response = await fetch(`${QueryInstitucion.BASE_URL}/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          error: true,
          message: result.message || "Error al eliminar institución",
          details: result.details,
        };
      }

      return result;
    } catch (error) {
      return {
        error: true,
        message: "Error de conexión al servidor",
        details: error.message,
      };
    }
  }

  async verificarColaborador(nombre, contraseña) {
    try {
      const response = await fetch(`${QueryInstitucion.BASE_URL}/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre, contraseña }),
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
      throw error;
    }
  }

  async verifyAuth() {
    try {
      const response = await fetch(`${QueryInstitucion.BASE_URL}/auth/verify`, {
        method: "GET",
        credentials: "include",
        headers: {
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
      throw error;
    }
  }

  async obtenerEstadisticasInstitucion(id) {
    try {
      const response = await fetch(
        `${QueryInstitucion.BASE_URL}/${id}/estadisticas`,
        {
          method: "GET",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        return {
          error: true,
          message: result.error || "Error al obtener estadísticas",
          details: result.details,
        };
      }

      return result;
    } catch (error) {
      return {
        error: true,
        message: "Error de conexión al servidor",
        details: error.message,
      };
    }
  }

  /**
   * Updates institution logo
   * @async
   * @method actualizarLogoInstitucion
   * @param {string} id - Institution ID
   * @param {string} logo - Base64 encoded logo
   * @returns {Promise<Object>} Update result or error
   */
  async actualizarLogoInstitucion(id, logo) {
    try {
      const response = await fetch(`${QueryInstitucion.BASE_URL}/${id}/logo`, {
        method: "PUT",
        body: JSON.stringify({ logo }),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          error: true,
          message: result.message || "Error al actualizar logo",
          details: result.details,
        };
      }

      return result;
    } catch (error) {
      return {
        error: true,
        message: "Error de conexión al servidor",
        details: error.message,
      };
    }
  }

  /**
   * Checks if institution exists
   * @async
   * @method existeInstitucion
   * @param {string} nombre - Institution name
   * @returns {Promise<Object>} Existence check result or error
   */
  async existeInstitucion(nombre) {
    try {
      const response = await fetch(
        `${QueryInstitucion.BASE_URL}/existe/${encodeURIComponent(nombre)}`,
        {
          method: "GET",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        return {
          error: true,
          message: result.error || "Error al verificar institución",
          details: result.details,
        };
      }

      return result;
    } catch (error) {
      return {
        error: true,
        message: "Error de conexión al servidor",
        details: error.message,
      };
    }
  }

  /**
   * Logs out institution
   * @async
   * @method logout
   * @returns {Promise<Object>} Logout result or error
   */
  async logout() {
    try {
      const response = await fetch(`${QueryInstitucion.BASE_URL}/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          error: true,
          message: result.message || "Error al cerrar sesión",
          details: result.details,
        };
      }

      localStorage.removeItem("jwt_token");
      return result;
    } catch (error) {
      return {
        error: true,
        message: "Error de conexión al servidor",
        details: error.message,
      };
    }
  }

  async obtenerEstadisticas(id){
    try{
      const response = await fetch(`${QueryInstitucion.BASE_URL}/estadisticas/${id}`);
      const data = await response.json();
      if (!response.ok) {
        return {
          error: true,
          message: data.message || "Error al obtener estadísticas",
          details: data.details,
        };
      }
      return data.estadisticas;
    }catch(error){
      return {
        error: true,
        message: "Error de conexión al servidor",
        details: error.message,
      };
    }
  }
}
