export class QueryViaje {
  static BASE_URL = "http://localhost:5000/api/viaje";

  /**
   * Registers a new trip
   * @async
   * @method registrarViaje
   * @param {Object} tripData - Trip data including:
   *   @param {string} puntoPartida - Starting point coordinates
   *   @param {string} puntoDestino - Destination coordinates
   *   @param {string} tipoViaje - Trip type
   *   @param {string} usuarioId - User ID
   * @returns {Promise<Object>} Registration result or error
   */
  async registrarViaje(puntoPartida, puntoDestino, tipoViaje, usuarioId) {
    try {
      const response = await fetch(`${QueryViaje.BASE_URL}/solicitar-viaje`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        },
        body: JSON.stringify({
          puntoPartida,
          puntoDestino,
          tipoViaje,
          usuarioId,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        return {
          error: true,
          message: result.message || "Error al registrar el viaje",
          details: result.details,
        };
      }

      return {
        error: false,
        data: result,
        message: "Viaje registrado exitosamente",
      };
    } catch (error) {
      return {
        error: true,
        message: "Error de conexión al servidor",
        details: error.message,
      };
    }
  }

  /**
   * Gets trip history for a user
   * @async
   * @method obtenerHistorialViajes
   * @param {string} usuarioId - User ID
   * @param {number} [limit=10] - Number of trips to return
   * @returns {Promise<Object>} Trip history or error
   */
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
}
