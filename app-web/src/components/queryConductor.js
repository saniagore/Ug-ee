export class QueryConductor {
    static BASE_URL = "http://localhost:5000/api/conductor";

    // Registrar nuevo conductor
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

    // Login de conductor
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

    // Verificar autenticación
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

    // Obtener vehículos del conductor
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

    // Actualizar documentos del conductor
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

    // Actualizar ubicación del conductor
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

    // Verificar existencia de conductor
    async existeConductor(celular) {
        try {
            const response = await fetch(`${QueryConductor.BASE_URL}/existe/${celular}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });

            const result = await response.json();

            if (!response.ok) {
                return {
                    error: true,
                    message: result.error || "Error al verificar conductor",
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
            const response = await fetch(`${QueryConductor.BASE_URL}/logout`, {
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

            this.limpiarSesion();
            return result;
        } catch (error) {
            return {
                error: true,
                message: "Error de conexión al servidor",
                details: error.message
            };
        }
    }

    // Limpiar datos de sesión
    limpiarSesion() {
        localStorage.removeItem("jwt_token");
        localStorage.removeItem("user_type");
    }

    // Obtener estado de verificación del conductor
    async obtenerEstadoVerificacion(celular) {
        try {
            const response = await fetch(`${QueryConductor.BASE_URL}/estado/${celular}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });

            const result = await response.json();

            if (!response.ok) {
                return {
                    error: true,
                    message: result.error || "Error al obtener estado",
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

  async actualizarEstadoVehiculo(vehiculoId, nuevoEstado) {
    try {
      const response = await fetch(`${QueryConductor.BASE_URL}/vehiculo/estado/${vehiculoId}`, {
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
          message: result.message || "Error al actualizar estado del vehículo",
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
}