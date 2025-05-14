/**
 * API Service Class for Institution Management
 * 
 * @class QueryInstitucion
 * @description Centralizes all institution-related API calls including:
 * - Institution CRUD operations
 * - Authentication and authorization
 * - Statistics and logo management
 * 
 * @property {string} BASE_URL - Base API endpoint URL
 * 
 * @example
 * // Example usage:
 * const institucionService = new QueryInstitucion();
 * const instituciones = await institucionService.obtenerInstituciones(1, 10);
 */
export class QueryInstitucion {
    static BASE_URL = "http://localhost:5000/api/institucion";

    /**
     * Gets names of all institutions
     * @async
     * @method obtenerNombresInstituciones
     * @returns {Promise<Object>} List of institution names or error
     */
    async obtenerNombresInstituciones() {
        try {
            const response = await fetch(`${QueryInstitucion.BASE_URL}/nombres`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });

            const result = await response.json();

            if (!response.ok) {
                return {
                    error: true,
                    message: result.error || "Error al obtener instituciones",
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
     * Gets paginated list of institutions
     * @async
     * @method obtenerInstituciones
     * @param {number} [pagina=1] - Page number
     * @param {number} [limite=10] - Items per page
     * @param {boolean|null} [verificadas=null] - Filter by verification status
     * @returns {Promise<Object>} Paginated institutions or error
     */
    async obtenerInstituciones(pagina = 1, limite = 10, verificadas = null) {
        try {
            let url = `${QueryInstitucion.BASE_URL}?pagina=${pagina}&limite=${limite}`;
            if (verificadas !== null) {
                url += `&verificadas=${verificadas}`;
            }

            const response = await fetch(url, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });

            const result = await response.json();

            if (!response.ok) {
                return {
                    error: true,
                    message: result.error || "Error al obtener instituciones",
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
     * Gets institution by ID
     * @async
     * @method obtenerInstitucionPorId
     * @param {string} id - Institution ID
     * @returns {Promise<Object>} Institution data or error
     */
    async obtenerInstitucionPorId(id) {
        try {
            const response = await fetch(`${QueryInstitucion.BASE_URL}/${id}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });

            const result = await response.json();

            if (!response.ok) {
                return {
                    error: true,
                    message: result.error || "Error al obtener institución",
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
     * Creates new institution
     * @async
     * @method crearInstitucion
     * @param {Object} formData - Institution data
     * @returns {Promise<Object>} Creation result or error
     */
    async crearInstitucion(formData) {
        try {
            const response = await fetch(`${QueryInstitucion.BASE_URL}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!response.ok) {
                return {
                    error: true,
                    message: result.message || "Error al crear institución",
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
     * Updates institution
     * @async
     * @method actualizarInstitucion
     * @param {string} id - Institution ID
     * @param {Object} formData - Updated institution data
     * @returns {Promise<Object>} Update result or error
     */
    async actualizarInstitucion(id, formData) {
        try {
            const response = await fetch(`${QueryInstitucion.BASE_URL}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!response.ok) {
                return {
                    error: true,
                    message: result.message || "Error al actualizar institución",
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
     * Deletes institution (soft delete)
     * @async
     * @method eliminarInstitucion
     * @param {string} id - Institution ID
     * @returns {Promise<Object>} Deletion result or error
     */
    async eliminarInstitucion(id) {
        try {
            const response = await fetch(`${QueryInstitucion.BASE_URL}/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" }
            });

            const result = await response.json();

            if (!response.ok) {
                return {
                    error: true,
                    message: result.message || "Error al eliminar institución",
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
     * Authenticates institution collaborator
     * @async
     * @method verificarColaborador
     * @param {string} nombre - Institution name
     * @param {string} contraseña - Password
     * @returns {Promise<Object>} Authentication result
     * @throws {Error} When authentication fails
     */
    async verificarColaborador(nombre, contraseña) {
        try {
            const response = await fetch(`${QueryInstitucion.BASE_URL}/login`, {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ nombre, contraseña }),
            });
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || "Error en autenticación");
            }

            if (data.token) {
                localStorage.setItem("jwt_token", data.token);
            }

            return data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Verifies authentication status
     * @async
     * @method verifyAuth
     * @returns {Promise<Object>} Verification result
     * @throws {Error} When verification fails
     */
    async verifyAuth() {
        try {
            const response = await fetch(`${QueryInstitucion.BASE_URL}/auth/verify`, {
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
                    localStorage.removeItem("jwt_token");
                }
                throw new Error(data.error || "Error de autenticación");
            }

            return data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Gets institution statistics
     * @async
     * @method obtenerEstadisticasInstitucion
     * @param {string} id - Institution ID
     * @returns {Promise<Object>} Statistics or error
     */
    async obtenerEstadisticasInstitucion(id) {
        try {
            const response = await fetch(`${QueryInstitucion.BASE_URL}/${id}/estadisticas`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });

            const result = await response.json();

            if (!response.ok) {
                return {
                    error: true,
                    message: result.error || "Error al obtener estadísticas",
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
     * Updates institution logo
     * @async
     * @method actualizarLogoInstitucion
     * @param {string} id - Institution ID
     * @param {string} logo - Base64 encoded logo
     * @returns {Promise<Object>} Update result or error
     */
    async actualizarLogoInstitucion(id, logo) {
        try {
            const response = await fetch(`${QueryInstitucion.BASE_URL}/${id}/logo`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ logo }),
            });

            const result = await response.json();

            if (!response.ok) {
                return {
                    error: true,
                    message: result.message || "Error al actualizar logo",
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
     * Checks if institution exists
     * @async
     * @method existeInstitucion
     * @param {string} nombre - Institution name
     * @returns {Promise<Object>} Existence check result or error
     */
    async existeInstitucion(nombre) {
        try {
            const response = await fetch(`${QueryInstitucion.BASE_URL}/existe/${encodeURIComponent(nombre)}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });

            const result = await response.json();

            if (!response.ok) {
                return {
                    error: true,
                    message: result.error || "Error al verificar institución",
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
     * Logs out institution
     * @async
     * @method logout
     * @returns {Promise<Object>} Logout result or error
     */
    async logout() {
        try {
            const response = await fetch(`${QueryInstitucion.BASE_URL}/logout`, {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("jwt_token")}`
                }
            });

            const result = await response.json();

            if (!response.ok) {
                return {
                    error: true,
                    message: result.message || "Error al cerrar sesión",
                    details: result.details,
                };
            }

            localStorage.removeItem("jwt_token");
            return result;
        } catch (error) {
            return {
                error: true,
                message: "Error de conexión al servidor",
                details: error.message
            };
        }
    }
}