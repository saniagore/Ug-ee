export class QueryUsuario {
    static BASE_URL = "http://localhost:5000/api/usuario";

    async obtenerIdPorCelular(celular){
        try{
            const response = await fetch(`${QueryUsuario.BASE_URL}/id/${celular}`);
            const result = await response.json();
            return result.id;
        }catch(error){
            console.error("Error al obtener el ID del usuario:", error);
            return {
                error: true,
                message: "Error de conexión al servidor",
                details: error.message,
            };
        }
    }

}