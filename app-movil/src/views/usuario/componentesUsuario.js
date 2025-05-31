import { createDrawerNavigator } from "@react-navigation/drawer";
import { View, Text, TouchableOpacity, Dimensions, Image } from "react-native";
import { useAuth } from "../../components/auth/authContext";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { styles } from "./estilos/drawer";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import HomeContent from "./menu";
import HistorialViajes from "./historialViajes";

const Drawer = createDrawerNavigator();
const { width } = Dimensions.get("window");

function CustomDrawerContent(props) {
  const { user, logout } = useAuth();

  return (
    <DrawerContentScrollView {...props} style={styles.drawerContainer}>
      <View style={styles.drawerHeader}>
        <View style={styles.userContainer}>
          <Image
            source={require("../../../assets/UwayLogo.png")}
            style={styles.logo}
          />
          <View style={styles.userInfo}>
            <Text style={styles.username}>{user?.usuario || "Usuario"}</Text>
          </View>
        </View>
      </View>

      <View style={styles.menuItems}>
        <DrawerItemList
          {...props}
          activeTintColor="#4a8cff"
          inactiveTintColor="#666"
          labelStyle={styles.drawerLabel}
        />
      </View>

      <View style={styles.logoutContainer}>
        <TouchableOpacity
          style={[
            styles.logoutButton,
            { flexDirection: "row", alignItems: "center" },
          ]}
          onPress={logout}
        >
          <MaterialIcons
            name="logout"
            size={20}
            color="white"
            style={{ marginRight: 10 }}
          />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

export default function HomeUserScreen({ celular }) {
  return (
    <Drawer.Navigator
      initialRouteName="Viajes Disponibles"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          backgroundColor: "#ffffff",
          width: width * 0.8,
        },
        drawerActiveTintColor: "#4a8cff",
        drawerInactiveTintColor: "#666",
        drawerLabelStyle: {
          marginLeft: -15,
          fontSize: 16,
        },
        drawerItemStyle: {
          borderRadius: 8,
          paddingHorizontal: 10,
          marginVertical: 4,
        },
        drawerActiveBackgroundColor: "#e6f0ff",
        headerStyle: {
          backgroundColor: "#29235c",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Drawer.Screen
        name="Viajes Disponibles"
        component={HomeContent}
        initialParams={{celular}}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons
              name="home"
              size={22}
              color={color}
              style={{ marginRight: 10 }}
            />
          ),
          title: "Viajes Disponibles",
        }}
      />
      <Drawer.Screen
        name="Agendar Reserva"
        component={HomeContent}
        initialParams={{celular}}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons
              name="home"
              size={22}
              color={color}
              style={{ marginRight: 10 }}
            />
          ),
          title: "Agendar Reserva",
        }}
      />
      <Drawer.Screen
        name="Historial de Viajes"
        component={HistorialViajes}
        initialParams={{celular}}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons
              name="home"
              size={22}
              color={color}
              style={{ marginRight: 10 }}
            />
          ),
          title: "Historial de Viajes",
        }}
      />
      <Drawer.Screen
        name="Historial de Reservas"
        component={HomeContent}
        initialParams={{celular}}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons
              name="home"
              size={22}
              color={color}
              style={{ marginRight: 10 }}
            />
          ),
          title: "Historial de Reservas",
        }}
      />
    </Drawer.Navigator>
  );
}