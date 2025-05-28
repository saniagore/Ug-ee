export class QueryReserva {
  static BASE_URL = "http://localhost:5000/api/reserva";

  async registrarReserva(formData){
    try{
      const response = await fetch(`${QueryReserva.BASE_URL}/registrar`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formData }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error en autenticación");
      }

      if (data.token) {
        localStorage.setItem("jwt_token", data.token);
      }

      return data;
    }catch(error){
      return {
                error: true,
                message: "Error de conexión al servidor",
                details: error.message
      };
    }
  }

  async historialReservas(usuarioId){
    try{
      const response = await fetch(`${QueryReserva.BASE_URL}/historial/${usuarioId}`)
      const result = await response.json();

      if (!response.ok) {
        return {
          error: true,
          message: result.message || "Error al obtener viajes activos",
          details: result.details,
        };
      }

      return result.result;
    }catch(error){
      return {
        error: true,
        message: "Error de conexión al servidor",
        details: error.message,
      };
    }
  }

  async reservasDisponibles(conductorId) {
    try{
      const response = await fetch(`${QueryReserva.BASE_URL}/disponibles/${conductorId}`);
      const result = await response.json();

      if (!response.ok) {
        return {
          error: true,
          message: result.message || "Error al obtener reservas disponibles",
          details: result.details,
        };
      }
      return result.result;
    }catch(error){
      return {
        error: true,
        message: "Error de conexión al servidor",
        details: error.message
      };
    }
  }

}