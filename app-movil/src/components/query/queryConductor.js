export class QueryConductor {
    static BASE_URL = "http://localhost:5000/api/conductor";

    async obtenerIdPorCelular(celular){
        try{
            const response = await fetch(`${QueryConductor.BASE_URL}/id/${celular}`);
            const result = await response.json();
            return result.id;
        }catch(error){
            console.error("Error al obtener el ID del conductor:", error);
            return {
                error: true,
                message: "Error de conexión al servidor",
                details: error.message,
            };
        }
    }

}