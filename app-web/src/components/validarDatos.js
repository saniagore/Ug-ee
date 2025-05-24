/**
 * Data Validation Utility Class
 * 
 * @class ValidarDatos
 * @description Provides static methods for validating various data types with:
 * - Type checking
 * - Format validation
 * - Length requirements
 * - Custom error messages
 * 
 * @example
 * // Example usage:
 * try {
 *   ValidarDatos.celular('3101234567');
 *   ValidarDatos.correo('usuario@ejemplo.com');
 * } catch (error) {
 *   console.error(error.message);
 * }
 */
export class ValidarDatos {
  /**
   * Validates a phone number
   * @static
   * @method celular
   * @param {string} celular - Phone number to validate
   * @throws {Error} When validation fails
   */
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

  /**
   * Validates a name
   * @static
   * @method nombre
   * @param {string} nombre - Name to validate
   * @throws {Error} When validation fails
   */
  static nombre(nombre) {
    if (typeof nombre !== "string") {
      throw new Error("El nombre debe ser un string");
    }
    if (nombre.trim().length < 1) {
      throw new Error("El nombre debe tener al menos 1 carácter");
    }
  }

  /**
   * Validates an email address
   * @static
   * @method correo
   * @param {string} correo - Email to validate
   * @throws {Error} When validation fails
   */
  static correo(correo) {
    if (typeof correo !== "string") {
      throw new Error("El correo debe ser un string");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      throw new Error("El formato del correo no es válido");
    }
  }

  /**
   * Validates an identification number
   * @static
   * @method Identificacion
   * @param {string} Identificacion - ID number to validate
   * @throws {Error} When validation fails
   */
  static Identificacion(Identificacion) {
    if (typeof Identificacion !== "string") {
      throw new Error("La identificación debe ser un string");
    }
    if (!/^[0-9]+$/.test(Identificacion)) {
      throw new Error("La identificación solo debe contener números");
    }
  }

  /**
   * Validates a password
   * @static
   * @method contraseña
   * @param {string} contraseña - Password to validate
   * @throws {Error} When validation fails
   */
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

  /**
   * Validates a document type
   * @static
   * @method tipoDocumento
   * @param {string} tipoDocumento - Document type to validate
   * @throws {Error} When validation fails
   */
  static tipoDocumento(tipoDocumento) {
    if (typeof tipoDocumento !== "string") {
      throw new Error("El tipo de documento debe ser un string");
    }
    if (tipoDocumento.trim() === "") {
      throw new Error("El tipo de documento no puede estar vacío");
    }
  }

  /**
   * Validates an institution name
   * @static
   * @method institucion
   * @param {string} institucion - Institution name to validate
   * @throws {Error} When validation fails
   */
  static institucion(institucion) {
    if (typeof institucion !== "string") {
      throw new Error("La institución debe ser un string");
    }
    if (institucion.trim() === "") {
      throw new Error("El nombre de la institución no puede estar vacío");
    }
  }

  /**
   * Validates an address
   * @static
   * @method direccion
   * @param {string} direccion - Address to validate
   * @throws {Error} When validation fails
   */
  static direccion(direccion) {
    if (typeof direccion !== "string") {
      throw new Error("La dirección debe ser un string");
    }
    if (direccion.trim() === "") {
      throw new Error("La dirección no puede estar vacía");
    }
  }
}