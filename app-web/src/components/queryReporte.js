export class QueryReporte {
  static BASE_URL = "http://localhost:5000/api/reporte";

  async registrarReporte(viajeId, descripcion, categoria) {
    try {
      const response = await fetch(`${QueryReporte.BASE_URL}/registrar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ viajeId, descripcion, categoria }),
      });
        if (!response.ok) {
            throw new Error("Error al registrar el reporte");
            }
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error("Error en registrarReporte:", error);
        throw error;
        }
    }
}
