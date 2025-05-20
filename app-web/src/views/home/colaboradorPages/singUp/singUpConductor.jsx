import React, { useState, useEffect } from "react";
import { QueryInstitucion } from "../../../../components/queryInstitucion";
import { Validar_datos } from "../../../../components/dataValid";
import { QueryConductor } from "../../../../components/queryConductor";

export default function ColaboratorInstitucion({ onBack, onSuccess }) {
  const conductorQuery = new QueryConductor();
  const institucionQuery = React.useMemo(() => new QueryInstitucion(), []);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [instituciones, setInstituciones] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    contrasena: "",
    correo: "",
    celular: "",
    numeroIdentificacion: "",
    tipoIdentificacion: "",
    institucion: "",
    direccion: "",
    tipo: "",
    documentoIdentificacion: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      Validar_datos.nombre(formData.nombre);
      Validar_datos.contraseña(formData.contrasena);
      Validar_datos.direccion(formData.direccion);
      Validar_datos.Identificacion(formData.numeroIdentificacion);
      Validar_datos.tipo_documento(formData.tipoIdentificacion);
      Validar_datos.celular(formData.celular);
      Validar_datos.institucion(formData.institucion);
      Validar_datos.correo(formData.correo);
      if (!formData.documentoIdentificacion)
        throw new Error("Suba un documento para identificarse");
      if (formData.tipo === "")
        throw new Error("Escoja un tipo de categoria de viaje.");

      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key =>{
        formDataToSend.append(key, formData[key]);
      });

      await conductorQuery.registrarConductor(formDataToSend); // Asegúrate que tu QueryConductor pueda manejar FormData
      setAlertType("success");
      setAlertMessage(
        "Conductor registrado exitosamente, espere la validación de su institucion."
      );
      setShowAlert(true);
    } catch (error) {
      setAlertType("error");
      setAlertMessage(
        "Error al intentar registrarse: " + (error.message || error)
      );
      setShowAlert(true);
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({
      ...formData,
      [name]: files[0],
    });
  };

  const handleAlertClose = () => {
    setShowAlert(false);
    if (alertType === "success") {
      onBack();
    }
  };

  useEffect(() => {
    const loadInstitutions = async () => {
      try {
        const data = await institucionQuery.obtenerNombresInstituciones();
        const institucionesArray = data.instituciones || [];
        setInstituciones(institucionesArray);
      } catch (err) {
        console.error("Error al cargar instituciones:", err);
      }
    };

    loadInstitutions();
  }, [institucionQuery]);

  return (
    <div className="register-form">
      <h2>Registro de Colaborador</h2>
      <form onSubmit={handleSubmit}>
        {/* Nombre */}
        <div className="form-group">
          <label>Nombre</label>
          <input
            value={formData.nombre}
            onChange={(e) =>
              setFormData({ ...formData, nombre: e.target.value })
            }
            required
          />
        </div>

        {/* Contraseña */}
        <div className="form-group">
          <label>Contraseña</label>
          <input
            type="password"
            value={formData.contrasena}
            onChange={(e) =>
              setFormData({ ...formData, contrasena: e.target.value })
            }
            required
          />
        </div>

        {/* Correo */}
        <div className="form-group">
          <label>Correo</label>
          <input
            type="email"
            value={formData.correo}
            onChange={(e) =>
              setFormData({ ...formData, correo: e.target.value })
            }
            required
          />
        </div>

        {/* Celular */}
        <div className="form-group">
          <label>Celular</label>
          <input
            type="tel"
            value={formData.celular}
            onChange={(e) =>
              setFormData({ ...formData, celular: e.target.value })
            }
            required
          />
        </div>

        {/* Número Identificación */}
        <div className="form-group">
          <label>Número de Identificación</label>
          <input
            value={formData.numeroIdentificacion}
            onChange={(e) =>
              setFormData({ ...formData, numeroIdentificacion: e.target.value })
            }
            required
          />
        </div>

        {/* Tipo Identificación */}
        <div className="form-group">
          <label>Tipo de Identificación</label>
          <select
            value={formData.tipoIdentificacion}
            onChange={(e) =>
              setFormData({ ...formData, tipoIdentificacion: e.target.value })
            }
            required
          >
            <option value="">Seleccione...</option>
            <option value="CC">Cédula de Ciudadanía (CC)</option>
            <option value="TI">Tarjeta de Identidad (TI)</option>
            <option value="CE">Cédula de Extranjería (CE)</option>
            <option value="PP">Pasaporte (PP)</option>
          </select>
        </div>

        <div className="form-group">
          <label>Categoria de Viaje</label>
          <select
            value={formData.tipo}
            onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
            required
          >
            <option value="">Seleccione...</option>
            <option value="campus">Campus</option>
            <option value="metropolitano">Metropolitano</option>
            <option value="intermunicipal">Intermunicipal</option>
          </select>
        </div>

        {/* Direccion */}
        <div className="form-group">
          <label>Dirección</label>
          <input
            value={formData.direccion}
            onChange={(e) =>
              setFormData({ ...formData, direccion: e.target.value })
            }
          />
        </div>

        {/* Institucion ID */}
        <div className="form-group">
          <label>Institución</label>
          <select
            className="select"
            value={formData.institucion}
            onChange={(e) =>
              setFormData({ ...formData, institucion: e.target.value })
            }
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
        <div className="form-group">
          <label>Documento de Identificación</label>
          <input
            type="file"
            name="documentoIdentificacion"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png"
            style={{
              width: "100%",
              padding: "0.5rem",
              borderRadius: "4px",
            }}
          />
        </div>

        <div className="form-actions">
          <button type="button" className="back-btn" onClick={onBack}>
            Volver
          </button>
          <button type="submit" className="submit-btn">
            Registrarse
          </button>
        </div>
      </form>

      <style>{`
                .register-form {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    max-height: 90vh;
                    overflow-y: auto;
                }
                
                .form-group {
                    margin-bottom: 15px;
                }
                
                .form-group label {
                    display: block;
                    margin-bottom: 5px;
                }
                
                .form-group input,
                .form-group select {
                    width: 100%;
                    padding: 8px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                }
                
                .form-actions {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 20px;
                }
                
                .back-btn {
                    background: #ccc;
                    padding: 8px 16px;
                    border: none;
                    border-radius: 4px;
                }
                
                .submit-btn {
                    background: #7e46d2;
                    color: white;
                    padding: 8px 16px;
                    border: none;
                    border-radius: 4px;
                }
                
                .custom-alert {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }
                
                .alert-content {
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    text-align: center;
                    max-width: 300px;
                }
                
                .alert-content h3 {
                    margin-top: 0;
                    color: #ff0000;
                }
                
                .alert-content button {
                    margin-top: 15px;
                    padding: 8px 16px;
                    background: #007bff;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
            `}</style>

      {showAlert && (
        <div className="custom-alert">
          <div className="alert-content">
            <h3>{alertType === "success" ? "Éxito" : "Error"}</h3>
            <p>{alertMessage}</p>
            <button onClick={handleAlertClose}>Aceptar</button>
          </div>
        </div>
      )}
    </div>
  );
}
