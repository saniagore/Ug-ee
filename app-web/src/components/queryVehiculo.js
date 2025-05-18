export class QueryVehicle {
  static BASE_URL = "http://localhost:5000/api/vehiculo";
  /**
   * Registers a new vehicle
   * @async
   * @function registrarVehiculo
   * @param {FormData} formData - Vehicle data including documents
   * @returns {Promise<Object>} Response from the server
   */
  async registrarVehiculo(formData) {
    try {
      const token = localStorage.getItem("jwt_token");
      const response = await fetch(
        `${QueryVehicle.BASE_URL}/registrar`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al registrar el vehículo");
      }

      return await response.json();
    } catch (error) {
      console.error("Error en registrarVehiculo:", error);
      throw error;
    }
  }
}
