export class queryLogin {
    static BASE_URL_USUARIO = "http://localhost:5000/api/usuario";
    static BASE_URL_CONDUCTOR = "http://localhost:5000/api/conductor";
    
    async verificarUsuario(celular, contraseña){
        try{
            const responseUsuario = await fetch(`${queryLogin.BASE_URL_USUARIO}/verificar-contraseña`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ celular, contraseña }),
            });
            const dataUsuario = await responseUsuario.json();

            const responseConductor = await fetch(`${queryLogin.BASE_URL_CONDUCTOR}/verificar-contraseña`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ celular, contraseña }),
            });
            const dataConductor = await responseConductor.json();

            if (!responseUsuario.ok && !responseConductor.ok) {
                throw new Error(dataUsuario.error || dataConductor.error || "Error en autenticación");
            }

            return  dataUsuario.coincide ? 1 : dataConductor.coincide ? 2 : 0; 

        }catch(error){
            console.error("Error en verificarUsuario:", error);
            throw error;
        }   
    }
}