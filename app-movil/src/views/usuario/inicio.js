import { View, Text } from "react-native";
import { useState, useEffect } from "react";
import { QueryUsuario } from "../../components/query/queryUsuario";
import { styles } from "./estilos/menu";

export default function HomeContent({route}) {
  const { celular } = route.params || {};
  const [usuarioId, setUsuarioId] = useState(null);

  useEffect(() => {
    const fetchUsuarioId = async () => {
      if (celular) {
        try {
          const id = await obtenerIdUsuario(celular);
          console.log("ID de usuario obtenido:", id);
          setUsuarioId(id);
        } catch (error) {
          console.error("Error al obtener ID de usuario:", error);
        }
      }
    };
    fetchUsuarioId();
  }, [celular]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>
          Bienvenido, {celular || "Usuario"}
        </Text>
        <Text style={styles.instructions}>
          Presiona el botón en caso de emergencia
        </Text>
      </View>
    </View>
  );
}

async function obtenerIdUsuario(celular) {
  const queryUsuario = new QueryUsuario();
  const result = await queryUsuario.obtenerIdPorCelular(celular);
  return result;
}