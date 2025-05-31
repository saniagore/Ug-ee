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


}