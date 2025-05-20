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

  async obtenerVehiculos() {
    try {
      const token = localStorage.getItem("jwt_token");
      const response = await fetch(
        `${QueryVehicle.BASE_URL}/vehiculos`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al obtener los vehículos");
      }
      const data = await response.json();
      return data.vehiculos;
    } catch (error) {
      console.error("Error en obtenerVehiculos:", error);
      throw error;
    }
  }

  /**
   * Gets vehicles by driver ID
   * @async
   * @function obtenerVehiculosPorConductor
   * @param {number} conductorId - Driver ID
   * @returns {Promise<Array>} Array of vehicles for the specified driver
   */
  async obtenerVehiculosPorConductor(conductorId) {
    try {
      const token = localStorage.getItem("jwt_token");
      const response = await fetch(
        `${QueryVehicle.BASE_URL}/vehiculos/conductor/${conductorId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al obtener los vehículos del conductor");
      }

      const data = await response.json();
      return data.vehiculos;
    } catch (error) {
      console.error("Error en obtenerVehiculosPorConductor:", error);
      throw error;
    }
  }

  /**
   * Updates verification status of a vehicle
   * @async
   * @function cambiarEstadoVerificacion
   * @param {number} vehiculoId - Vehicle ID
   * @param {boolean} estado - New verification status
   * @returns {Promise<Object>} Updated vehicle data
   */
  async cambiarEstadoVerificacion(vehiculoId, estado) {
    try {
      const token = localStorage.getItem("jwt_token");
      const response = await fetch(
        `${QueryVehicle.BASE_URL}/vehiculos/${vehiculoId}/verificacion`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ estado }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar el estado de verificación");
      }

      const data = await response.json();
      return data.vehiculo;
    } catch (error) {
      console.error("Error en cambiarEstadoVerificacion:", error);
      throw error;
    }
  }
}