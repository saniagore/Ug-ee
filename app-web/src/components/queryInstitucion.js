export class QueryInstitucion {
    static BASE_URL = "http://localhost:5000/api/institucion";

    async crearInstitucion(formData){
        try{
            const response = await fetch(`${QueryInstitucion.BASE_URL}/crearinstitucion`,{
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if(!response.ok){
                return{
                    error: true,
                    message: result.message || "Error al crear usuario",
                    details: result.details,
                };
            }

            return result;
        }catch(error){
            return {
              error: true,
              message: "Error de conexión al servidor",
            };
        }
    }

    async verificarColaborador(nombre,contraseña){
        try{
            const response =  await fetch(`${QueryInstitucion.BASE_URL}/login`,{
                method: "POST",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({nombre,contraseña}),
            });

            const data = await response.json();

            if(!response.ok){
                throw new Error(data.message || "Error en autenticación");
            }

            if(data.token){
                localStorage.setItem("jwt_token", data.token);
            }

            return data;
        }catch(error){
            throw error;
        }
    }

    async verifyAuth(){
        try{
            const response = await fetch(`${QueryInstitucion.BASE_URL}/auth/verify`, {
                method: "GET",
                credentials: 'include',
                headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt_token")}`
                }
            });

            const data = await response.json();

            if(!response.ok){
                if(response.status === 403){
                    localStorage.removeItem("jwt_token");
                }
                throw new Error(data.error || "Error de autenticación");
            }

            return data;
        
        }catch(error){
            throw error;
        }
    }
}