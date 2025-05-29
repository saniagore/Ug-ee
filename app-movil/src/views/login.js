import { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Image } from "react-native";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { useAuth } from "../components/auth/authContext";
import { ValidarDatos } from "../components/validaciones/validacionesInfo";

export default function LoginScreen() {
  const [usuario, setUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");
  const { login } = useAuth();

  const handleLogin = () => {
    try {
        ValidarDatos.celular(usuario);
        ValidarDatos.contraseña(contraseña)

        const loginExitoso = login(usuario, contraseña);

        if (!loginExitoso) {
          Alert.alert("Error", "Usuario o contraseña incorrectos");
        }
    } catch (error) {
      Alert.alert("Error de validación", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image 
          source={require("../../assets/UwayLogo.png")}
          style={styles.logo}
        />
      </View>

      <Text style={styles.title}>Bienvenido</Text>
      <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

      <View style={styles.inputContainer}>
        <MaterialIcons name="person" size={24} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Celular"
          placeholderTextColor="#999"
          value={usuario}
          onChangeText={setUsuario}
          autoCapitalize="none"
          keyboardType="default"
        />
      </View>

      <View style={styles.inputContainer}>
        <FontAwesome name="lock" size={24} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#999"
          value={contraseña}
          onChangeText={setContraseña}
          secureTextEntry
        />
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Ingresar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 30,
    backgroundColor: "#f8f9fa",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 250,
    height: 250,
    resizeMode: "contain",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
    color: "#2c3e50",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: "center",
    color: "#7f8c8d",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: "#333",
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: "#7e46d2",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#2980b9",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  }
});