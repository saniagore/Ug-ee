export class QueryViaje {
  static BASE_URL = "http://localhost:5000/api/viaje";

  async crearViaje(viajeData) {
    try {
      // Convertir las coordenadas a formato compatible con tu backend
      const rutaPlanificada = viajeData.rutaPlanificada.map((point) => ({
        latitud: point.lat,
        longitud: point.lng,
      }));

      const ubicacionPartida = {
        latitud: viajeData.ubicacionPartida.lat,
        longitud: viajeData.ubicacionPartida.lng,
      };

      const response = await fetch(`${QueryViaje.BASE_URL}/crear`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        },
        body: JSON.stringify({
          ...viajeData,
          rutaPlanificada,
          ubicacionPartida,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          error: true,
          message: result.message || "Error al crear el viaje",
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

  async obtenerHistorialViajes(usuarioId) {
    try {
      const response = await fetch(
        `${QueryViaje.BASE_URL}/historial/${usuarioId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        return {
          error: true,
          message: result.error || "Error al obtener historial de viajes",
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

  async ObtenerViajeConductor(conductorId, categoriaViaje) {
    try {
      const response = await fetch(
        `${QueryViaje.BASE_URL}/viajes-disponibles`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },
          body: JSON.stringify({ conductorId, categoriaViaje }),
        }
      );
      const result = await response.json();
      if (!response.ok) {
        return {
          error: true,
          message: result.message || "Error al obtener viajes disponibles",
          details: result.details,
        };
      }
      return result;
    } catch (error) {
      throw error;
    }
  }

  async aceptarViaje(viajeId, vehiculoId) {
    try {
      const response = await fetch(`${QueryViaje.BASE_URL}/aceptar-viaje`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        },
        body: JSON.stringify({ vehiculoId, viajeId }),
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
      throw error;
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
}
