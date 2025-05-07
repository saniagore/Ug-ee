import { FaArrowLeft } from "react-icons/fa";
import { VscAccount } from "react-icons/vsc";
import "../../../css/homePageSingUp.css";
import { getInstituciones } from "../../../components/instituciones";
import { useState, useEffect } from "react";
import { QueryUser } from "../../../components/queryUser";
import { Validar_datos } from "../../../components/dataValid";

export default function Register({ onBack }) {
  const [formData, setFormData] = useState({
    nombre: "",
    celular: "",
    contraseña: "",
    numeroIdentificacion: "",
    correo: "",
    tipoIdentificacion: "",
    institucion: "",
  });

  const userQuery = new QueryUser();
  const [instituciones, setInstituciones] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alertType, setAlertType] = useState("error");

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  useEffect(() => {
    const loadInstitutions = async () => {
      try {
        const data = await getInstituciones();
        setInstituciones(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
        console.error("Error al cargar instituciones:", err);
      } finally {
        setLoading(false);
      }
    };

    loadInstitutions();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      Validar_datos.celular(formData.celular);
      Validar_datos.nombre(formData.nombre);
      Validar_datos.correo(formData.correo);
      Validar_datos.contraseña(formData.contraseña);
      Validar_datos.Identificacion(formData.numeroIdentificacion);
      Validar_datos.tipo_documento(formData.tipoIdentificacion);
      Validar_datos.institucion(formData.institucion);
    } catch (err) {
      setAlertMessage(err.message);
      setShowAlert(true);
      return;
    }

    try {
      const exists = await userQuery.verificarExistencia(formData.celular);
      if (exists.existe) {
        setAlertMessage("Número de celular ya registrado");
        setShowAlert(true);
        return;
      }
      await userQuery.crearUsuario(formData);
      setAlertMessage(
        "Usuario registrado, espere la validación de la institución"
      );
      setAlertType("success");
      setShowAlert(true);
      setTimeout(() => {
        onBack();
      }, 5000);
    } catch (error) {
      setAlertMessage(error.message);
      setAlertType("error");
      setShowAlert(true);
    }
  };

  if (loading) return <div>Cargando instituciones...</div>;
  if (error) return <div>Error: {error}</div>;
  return (
    <>
      <button
        className="back-button"
        onClick={onBack}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "20px",
          marginBottom: "20px",
          color: "#7e46d2",
        }}
      >
        <FaArrowLeft />
      </button>

      <h2 className="Title">Perfil</h2>

      <div>
        <VscAccount className="Profile" />
        <input
          className="input"
          placeholder="Nombre completo"
          value={formData.nombre}
          onChange={handleChange("nombre")}
          style={{ width: "150px", marginLeft: "80px" }}
        />
      </div>

      <div
        className="inputs-section-register"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <input
          className="input"
          placeholder="Contraseña"
          style={{ width: "150px" }}
          value={formData.contraseña}
          onChange={handleChange("contraseña")}
          type="password"
        />
        <input
          className="input"
          placeholder="Numero de identificación"
          style={{
            width: "200px",
            position: "relative",
            left: 0,
          }}
          value={formData.numeroIdentificacion}
          onChange={handleChange("numeroIdentificacion")}
        />
      </div>

      <div
        className="inputs-section-register"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <input
          className="input"
          placeholder="Correo"
          style={{ width: "150px" }}
          value={formData.correo}
          onChange={handleChange("correo")}
        />
        <select
          className="select"
          value={formData.tipoIdentificacion}
          onChange={handleChange("tipoIdentificacion")}
        >
          <option className="input-label" value="">
            Tipo de documento
          </option>
          <option className="input-label" value="CC">
            Cédula de Ciudadanía (CC)
          </option>
          <option className="input-label" value="TI">
            Tarjeta de Identidad (TI)
          </option>
          <option className="input-label" value="CE">
            Cédula de Extranjería (CE)
          </option>
          <option className="input-label" value="PP">
            Pasaporte (PP)
          </option>
        </select>
      </div>

      <div
        className="inputs-section-register"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          marginBottom: "270px",
        }}
      >
        <input
          className="input"
          placeholder="Celular"
          style={{ width: "150px" }}
          value={formData.celular}
          onChange={handleChange("celular")}
        />
        <select
          className="select"
          value={formData.institucion}
          onChange={handleChange("institucion")}
        >
          <option className="input-label" value="">
            Institucion educativa
          </option>
          {instituciones.map((institucion, index) => (
            <option key={index} className="input-label" value={institucion}>
              {institucion}
            </option>
          ))}
        </select>
      </div>

      <button className="Register-button" onClick={handleSubmit}>
        Registrar
      </button>

      {showAlert && (
        <div
          className={`custom-alert ${
            alertType === "success" ? "alert-success" : "alert-error"
          }`}
        >
          <div className="alert-content">
            <h3>{alertType === "success" ? "Éxito" : "Error"}</h3>
            <p>{alertMessage}</p>
            <button onClick={() => setShowAlert(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </>
  );
}
