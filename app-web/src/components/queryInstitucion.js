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
            console.error("Error al crear la institucion:", error);
            return {
              error: true,
              message: "Error de conexión al servidor",
            };
        }
    }
}