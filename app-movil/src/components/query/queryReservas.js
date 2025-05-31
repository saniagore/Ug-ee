export class QueryReserva {
  static BASE_URL = "http://localhost:5000/api/reserva";

  async historialReservas(usuarioId) {
    try {
      const response = await fetch(
        `${QueryReserva.BASE_URL}/historial/${usuarioId}`
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

  async reservasDisponibles(conductorId) {
    try {
      const response = await fetch(
        `${QueryReserva.BASE_URL}/disponibles/${conductorId}`
      );
      const result = await response.json();

      if (!response.ok) {
        return {
          error: true,
          message: result.message || "Error al obtener reservas disponibles",
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

  async aceptarReserva(reservaId, conductorId) {
    try {
      const response = await fetch(
        `${QueryReserva.BASE_URL}/aceptar`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reservaId, conductorId }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        return {
          error: true,
          message: data.message || "Error al aceptar la reserva",
          details: data.details,
        };
      }
      return data;
    } catch (error) {
      return {
        error: true,
        message: "Error de conexión al servidor",
        details: error.message,
      };
    }
  }
}
