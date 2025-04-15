function phoneValidation(number) {
    return typeof number === 'string' && 
           number.length === 10 && 
           /^[0-9]+$/.test(number);
}

function nameValidation(nombre) {
    return typeof nombre === 'string' && 
           nombre.trim().length >= 1 && 
           /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre);
}


function correoValidation(correo) {
    return typeof correo === 'string' && 
           /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}

function numeroIdValidation(nid) {
    return typeof nid === 'string' && 
           /^[0-9]+$/.test(nid);
}

function contraseñaValidation(password) {
    return typeof password === 'string' && 
           password.length >= 8;
}

function tipoIdVal(tipo) {
    return typeof tipo === 'string' && 
           tipo.trim() !== "";
}

function institucionVal(institucion) {
    return typeof institucion === 'string' && 
           institucion.trim() !== "";
}

function dataValid(celular, nombre, correo, nid, password, tipo, institucion) {
    return phoneValidation(celular) &&
           nameValidation(nombre) &&
           correoValidation(correo) &&
           numeroIdValidation(nid) &&
           contraseñaValidation(password) &&
           tipoIdVal(tipo) &&
           institucionVal(institucion);
}

export {
    phoneValidation,
    nameValidation,
    correoValidation,
    numeroIdValidation,
    contraseñaValidation,
    tipoIdVal,
    institucionVal,
    dataValid
};