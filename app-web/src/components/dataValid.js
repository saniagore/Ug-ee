export class Validar_datos {
  static celular(celular) {
    if (!typeof celular === "string")
      throw new Error("El celular debe de ser un string");
    if (!celular.length === 10)
      throw new Error("La longitud del celular debe de ser de 10");
    if (!/^[0-9]+$/.test(celular))
      throw new Error("El celular solo debe de contener numeros");
  }
  static nombre(nombre) {
    if (!typeof nombre === "string")
      throw new Error("El nombre debe de ser un string");
    if (!nombre.trim().length >= 1)
      throw new Error("El nombre debe tener longitud mayor a 1");
  }
  static correo(correo) {
    if (!typeof correo === "string")
      throw new Error("El correo debe de ser un string");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo))
      throw new Error("El correo no es valido");
  }
  static Identificacion(Identificacion) {
    if (!typeof Identificacion === "string")
      throw new Error("La identificación debe de ser un string");
    if (!/^[0-9]+$/.test(Identificacion))
      throw new Error("La identificacion solo debe de contener numeros");
  }
  static contraseña(contraseña) {
    if (typeof contraseña !== "string")
      throw new Error("La contraseña debe de ser un string");
    if (contraseña.trim() === "")
      throw new Error("La contraseña no puede estar vacía");
    if (contraseña.length < 8)
      throw new Error("La contraseña debe de tener minimo longitud 8");
  }
  static tipo_documento(tipo_documento) {
    if (!typeof tipo_documento === "string")
      throw new Error("El tipo de documento debe de ser un string");
    if (tipo_documento.trim() === "")
      throw new Error("Tipo de documento nulo");
  }

  static institucion(institucion) {
    if (typeof institucion !== "string") 
      throw new Error("La institución debe de ser un string");
    if (institucion.trim() === "") 
      throw new Error("Institución nula");
}
}
