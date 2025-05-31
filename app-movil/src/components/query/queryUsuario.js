export class QueryUsuario {
    static BASE_URL = "http://localhost:5000/api/usuario";

    async obtenerIdPorCelular(celular){
        try{
            const response = await fetch(`${QueryUsuario.BASE_URL}/id/${celular}`);
            const result = await response.json();
            if(!response.ok){
                return {
                    error: true,
                    message: result.message || "Error al obtener el ID del usuario",
                    details: result.details,
                };
            }
            return result.result;
        }catch(error){
            return {
                error: true,
                message: "Error de conexión al servidor",
                details: error.message,
            };
        }
    }

}