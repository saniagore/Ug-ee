/**
 * API Service Class for Driver Management
 * 
 * @class QueryConductor
 * @description Centralizes all driver-related API calls including:
 * - Driver registration and authentication
 * - Vehicle and document management
 * - Location tracking and verification
 * 
 * @property {string} BASE_URL - Base API endpoint URL
 * 
 * @example
 * // Example usage:
 * const driverService = new QueryConductor();
 * const authResult = await driverService.loginConductor('3101234567', 'password123');
 */
export class QueryConductor {
    static BASE_URL = "http://localhost:5000/api/conductor";

    /**
     * Registers a new driver
     * @async
     * @method registrarConductor
     * @param {Object} formData - Driver registration data
     * @returns {Promise<Object>} Registration result or error
     */
    async registrarConductor(formData) {
        try {
            const response = await fetch(`${QueryConductor.BASE_URL}/registro`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!response.ok) {
                return {
                    error: true,
                    message: result.message || "Error al registrar conductor",
                    details: result.details,
                };
            }

            return result;
        } catch (error) {
            return {
                error: true,
                message: "Error de conexión al servidor",
                details: error.message
            };
        }
    }

    /**
     * Authenticates a driver
     * @async
     * @method loginConductor
     * @param {string} celular - Driver's phone number
     * @param {string} contraseña - Driver's password
     * @returns {Promise<Object>} Authentication result with token
     * @throws {Error} When authentication fails
     */
    async loginConductor(celular, contraseña) {
        try {
            const response = await fetch(`${QueryConductor.BASE_URL}/login`, {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ celular, contraseña }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Error en autenticación");
            }

            if (data.token) {
                localStorage.setItem("jwt_token", data.token);
                localStorage.setItem("user_type", "conductor");
            }

            return data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Verifies driver authentication status
     * @async
     * @method verificarAutenticacion
     * @returns {Promise<Object>} Verification result
     * @throws {Error} When verification fails
     */
    async verificarAutenticacion() {
        try {
            const response = await fetch(`${QueryConductor.BASE_URL}/auth/verify`, {
                method: "GET",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("jwt_token")}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 403) {
                    this.limpiarSesion();
                }
                throw new Error(data.error || "Error de autenticación");
            }

            return data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Gets driver's vehicles
     * @async
     * @method obtenerVehiculos
     * @param {string} conductorId - Driver ID
     * @returns {Promise<Object>} List of vehicles or error
     */
    async obtenerVehiculos(conductorId) {
        try {
            const response = await fetch(`${QueryConductor.BASE_URL}/vehiculos/${conductorId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("jwt_token")}`
                }
            });

            const result = await response.json();

            if (!response.ok) {
                return {
                    error: true,
                    message: result.error || "Error al obtener vehículos",
                    details: result.details
                };
            }

            return result;
        } catch (error) {
            return {
                error: true,
                message: "Error de conexión al servidor",
                details: error.message
            };
        }
    }

    /**
     * Updates driver's documents
     * @async
     * @method actualizarDocumentos
     * @param {string} conductorId - Driver ID
     * @param {Object} documentos - Documents to update (license, ID)
     * @returns {Promise<Object>} Update result or error
     */
    async actualizarDocumentos(conductorId, documentos) {
        try {
            const formData = new FormData();
            if (documentos.licencia) formData.append('licencia', documentos.licencia);
            if (documentos.identificacion) formData.append('identificacion', documentos.identificacion);

            const response = await fetch(`${QueryConductor.BASE_URL}/documentos/${conductorId}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("jwt_token")}`
                },
                body: formData
            });

            const result = await response.json();

            if (!response.ok) {
                return {
                    error: true,
                    message: result.message || "Error al actualizar documentos",
                    details: result.details,
                };
            }

            return result;
        } catch (error) {
            return {
                error: true,
                message: "Error de conexión al servidor",
                details: error.message
            };
        }
    }

    /**
     * Updates driver's location
     * @async
     * @method actualizarUbicacion
     * @param {string} conductorId - Driver ID
     * @param {Object} ubicacion - Location coordinates {latitud, longitud}
     * @returns {Promise<Object>} Update result or error
     */
    async actualizarUbicacion(conductorId, ubicacion) {
        try {
            const response = await fetch(`${QueryConductor.BASE_URL}/ubicacion`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("jwt_token")}`
                },
                body: JSON.stringify({
                    conductorId,
                    latitud: ubicacion.latitud,
                    longitud: ubicacion.longitud
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                return {
                    error: true,
                    message: result.message || "Error al actualizar ubicación",
                    details: result.details,
                };
            }

            return result;
        } catch (error) {
            return {
                error: true,
                message: "Error de conexión al servidor",
                details: error.message
            };
        }
    }

    /**
     * Gets all drivers for an institution
     * @async
     * @method obtenerTodosConductores
     * @param {string} institucionId - Institution ID
     * @returns {Promise<Object>} List of drivers or error
     */
    async obtenerTodosConductores(institucionId) {
        try {
            const response = await fetch(`${QueryConductor.BASE_URL}/institucion/${institucionId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("jwt_token")}`
                }
            });

            const result = await response.json();

            if (!response.ok) {
                return {
                    error: true,
                    message: result.error || "Error al obtener conductores",
                    details: result.details
                };
            }

            return result;
        } catch (error) {
            return {
                error: true,
                message: "Error de conexión al servidor",
                details: error.message
            };
        }
    }

    /**
     * Updates driver verification status
     * @async
     * @method actualizarEstadoConductor
     * @param {string} conductorId - Driver ID
     * @param {boolean} nuevoEstado - New verification status
     * @returns {Promise<Object>} Update result or error
     */
    async actualizarEstadoConductor(conductorId, nuevoEstado) {
        try {
            const response = await fetch(`${QueryConductor.BASE_URL}/estado/${conductorId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("jwt_token")}`
                },
                body: JSON.stringify({ estado: nuevoEstado })
            });

            const result = await response.json();

            if (!response.ok) {
                return {
                    error: true,
                    message: result.message || "Error al actualizar estado",
                    details: result.details,
                };
            }

            return result;
        } catch (error) {
            return {
                error: true,
                message: "Error de conexión al servidor",
                details: error.message
            };
        }
    }

    /**
     * Clears session data
     * @method limpiarSesion
     */
    limpiarSesion() {
        localStorage.removeItem("jwt_token");
        localStorage.removeItem("user_type");
    }
}