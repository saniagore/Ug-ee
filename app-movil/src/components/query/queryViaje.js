export class QueryViaje {
    static BASE_URL = "http://localhost:5000/api/viaje";

    async verViajesDisponibles(usuarioId) {
    try {
      const response = await fetch(
        `${QueryViaje.BASE_URL}/viajes-disponibles/${usuarioId}`
      );

      const result = await response.json();
      if (!response.ok) {
        return {
          error: true,
          message: result.message || "Error al obtener viajes disponibles",
          details: result.details,
        };
      }

      return result.result;
    } catch (error) {
      return {
        error: true,
        message: "Error de conexión al servidor",
        details: error.message,
      };
    }
  }

  async unirseViaje(viajeId, usuarioId) {
    try {
      const response = await fetch(`${QueryViaje.BASE_URL}/unirse-viaje`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        },
        body: JSON.stringify({ viajeId, usuarioId }),
      });

      const result = await response.json();
      if (!response.ok) {
        return {
          error: true,
          message: result.message || "Error al unirse al viaje",
          details: result.details,
        };
      }
    } catch (error) {
      return {
        error: true,
        message: "Error de conexión al servidor",
        details: error.message,
      };
    }
  }

  async obtenerHistorial(usuarioId) {
    try {
      const response = await fetch(
        `${QueryViaje.BASE_URL}/historial/${usuarioId}`
      );
      const result = await response.json();
      if (!response.ok) {
        return {
          error: true,
          message: result.message || "Error al obtener el historial",
          details: result.details,
        };
      }
      return result.result;
    } catch (error) {
      return {
        error: true,
        message: "Error de conexión al servidor",
        details: error.message,
      };
    }
  }

  async cancelarViajeUsuario(viajeId, usuarioId) {
    try {
      const response = await fetch(
        `${QueryViaje.BASE_URL}/cancelar-viaje-usuario`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },
          body: JSON.stringify({ viajeId, usuarioId }),
        }
      );
      const result = await response.json();
      if (!response.ok) {
        return {
          error: true,
          message: result.message || "Error al cancelar el viaje",
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

  async viajesActivos(conductorId) {
    try {
      const response = await fetch(
        `${QueryViaje.BASE_URL}/viajes-activos/${conductorId}`
      );
      const result = await response.json();
      if (!response.ok) {
        return {
          error: true,
          message: result.message || "Error al obtener viajes activos",
          details: result.details,
        };
      }
      return result.result;
    } catch (error) {
      return {
        error: true,
        message: "Error de conexión al servidor",
        details: error.message,
      };
    }
  }

  async terminarViaje(viajeId) {
    try {
      const response = await fetch(`${QueryViaje.BASE_URL}/terminar-viaje`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        },
        body: JSON.stringify({ viajeId }),
      });

      const result = await response.json();
      if (!response.ok) {
        return {
          error: true,
          message: result.message || "Error al aceptar el viaje",
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

  async cancelarViaje(viajeId) {
    try {
      const response = await fetch(`${QueryViaje.BASE_URL}/cancelar-viaje`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        },
        body: JSON.stringify({ viajeId }),
      });

      const result = await response.json();
      if (!response.ok) {
        return {
          error: true,
          message: result.message || "Error al aceptar el viaje",
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

  async iniciarViaje(viajeId) {
    try {
      const response = await fetch(`${QueryViaje.BASE_URL}/iniciar-viaje`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        },
        body: JSON.stringify({ viajeId }),
      });
      const result = await response.json();
      if (!response.ok) {
        return {
          error: true,
          message: result.message || "Error al iniciar el viaje",
          details: result.details,
        };
      }
      return result;
    }
    catch (error) {
      return {
        error: true,
        message: "Error de conexión al servidor",
        details: error.message,
      };
    }
  }
}