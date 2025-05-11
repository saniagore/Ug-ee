export class QueryInstitucion {
    static BASE_URL = "http://localhost:5000/api/institucion";

    // Obtener nombres de todas las instituciones
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

    // Obtener todas las instituciones
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

    // Obtener institución por ID
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

    // Crear nueva institución
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

    // Actualizar institución
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

    // Eliminar institución (soft delete)
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

    // Login de institución
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

    // Verificar autenticación
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

    // Obtener estadísticas de la institución
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

    // Actualizar logo de la institución
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

    // Verificar existencia de institución
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

    // Logout
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