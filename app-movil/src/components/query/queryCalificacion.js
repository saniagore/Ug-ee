export class QueryCalificacion {
  static BASE_URL = "http://localhost:5000/api/calificacion";

  async calificarViaje(viajeId, calificacion, comentario) {
    try {
      const response = await fetch(`${QueryCalificacion.BASE_URL}/calificar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        },
        body: JSON.stringify({ viajeId, calificacion, comentario }),
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