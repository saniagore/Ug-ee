import { createContext, useState, useContext } from "react";
import { queryLogin } from "../validaciones/login";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [usuarioAuth, setUsuarioAuth] = useState({ usuario: null, tipoUsuario: null });
    

    const login = async (usuario, contraseña) => {
        try{
            const login = new queryLogin();
            const esValido = await login.verificarUsuario(usuario, contraseña); 
        if (esValido===1 || esValido===2) {
            const userData = { usuario, tipoUsuario: esValido};
            setUsuarioAuth(userData);
            return true;
        }
        return false;
        }catch(error){
            console.error(error);
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{ usuarioAuth, login }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(){
    return useContext(AuthContext);
}

