export class ValidarDatos {

    static celular(celular) {
        if (typeof celular !== "string") {
            throw new Error("El celular debe ser un string");
        }
        if (celular.length !== 10) {
            throw new Error("La longitud del celular debe ser de 10 caracteres");
        }
        if (!/^[0-9]+$/.test(celular)) {
            throw new Error("El celular solo debe contener números");
        }
    }

    static contraseña(contraseña) {
        if (typeof contraseña !== "string") {
            throw new Error("La contraseña debe ser un string");
        }
        if (contraseña.trim() === "") {
            throw new Error("La contraseña no puede estar vacía");
        }
        if (contraseña.length < 8) {
            throw new Error("La contraseña debe tener mínimo 8 caracteres");
        }
    }
}
