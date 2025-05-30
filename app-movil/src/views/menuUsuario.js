import { createDrawerNavigator } from "@react-navigation/drawer";
import { View, Text, TouchableOpacity, Dimensions, Image, SafeAreaView, ImageBackground, StyleSheet } from "react-native";
import { useState } from "react";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { Ionicons, FontAwesome, MaterialIcons } from "@expo/vector-icons";

import {styles} from './estilos/menu'; 

const mapImage = require('../../assets/UwayLogo.png');
const Drawer = createDrawerNavigator();
const { width, height } = Dimensions.get("window");


function CustomDrawerContent(props) {

  return (
    <DrawerContentScrollView {...props} style={styles.drawerContainer}>
      <View style={styles.drawerHeader}>
        <View style={styles.userContainer}>
          <Image
            source={mapImage}
            style={styles.logo}
          />
          <View style={styles.userInfo}>
            <Text style={styles.username}>Servicio UW</Text>
            <Text style={{ color: '#666' }}>Transporte universitario seguro</Text>
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
          style={styles.logoutButton}
        >
          <MaterialIcons name="logout" size={20} color="white" />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

// Componente MapBackground que faltaba
const MapBackground = ({ children, routeCoordinates }) => {
  return (
    <View style={styles.container}>
      <ImageBackground 
        source={mapImage} 
        style={styles.mapImage}
        resizeMode="cover"
      >
        {routeCoordinates && routeCoordinates.length === 2 && (
          <View style={styles.routeContainer}>
            <View style={[styles.marker, { left: routeCoordinates[0].x, top: routeCoordinates[0].y }]}>
              <Text style={styles.markerText}>Inicio</Text>
            </View>
            <View style={[styles.marker, { left: routeCoordinates[1].x, top: routeCoordinates[1].y }]}>
              <Text style={styles.markerText}>Destino</Text>
            </View>
            <View style={styles.lineContainer}>
              <View style={[styles.line, {
                width: Math.sqrt(
                  Math.pow(routeCoordinates[1].x - routeCoordinates[0].x, 2) + 
                  Math.pow(routeCoordinates[1].y - routeCoordinates[0].y, 2)
                ),
                left: routeCoordinates[0].x,
                top: routeCoordinates[0].y,
                transform: [{
                  rotate: Math.atan2(
                    routeCoordinates[1].y - routeCoordinates[0].y,
                    routeCoordinates[1].x - routeCoordinates[0].x
                  ) + 'rad'
                }]
              }]} />
            </View>
          </View>
        )}
      </ImageBackground>
      <View style={styles.overlay}>
        {children}
      </View>
    </View>
  );
};

// Componente MenuScreen que faltaba
const MenuScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Bienvenido al Servicio UW</Text>
      <Text style={{ marginBottom: 30, color: '#666' }}>Selecciona una opción del menú lateral</Text>
    </SafeAreaView>
  );
};

export const AppDrawerNavigator = ({ userType }) => {
  const [routeCoordinates, setRouteCoordinates] = useState(null);

  const handleViewRoute = (rutaPlanificada) => {
    try {
      const startPoint = { x: width * 0.3, y: height * 0.4 };
      const endPoint = { x: width * 0.7, y: height * 0.6 };
      setRouteCoordinates([startPoint, endPoint]);
    } catch (error) {
      console.error("Error setting route:", error);
      setRouteCoordinates(null);
    }
  };

  // Pantallas comunes para todos los tipos de usuario
  const commonScreens = [
    <Drawer.Screen
      key="Inicio"
      name="Inicio"
      options={{
        drawerIcon: ({ color }) => (
          <Ionicons name="home" size={22} color={color} style={{ marginRight: 10 }} />
        ),
      }}
    >
      {(props) => (
        <MapBackground routeCoordinates={routeCoordinates}>
          <MenuScreen {...props} />
        </MapBackground>
      )}
    </Drawer.Screen>,
    
    <Drawer.Screen
      key="Rutas Disponibles"
      name="Rutas Disponibles"
      options={{
        drawerIcon: ({ color }) => (
          <Ionicons name="car" size={22} color={color} style={{ marginRight: 10 }} />
        ),
      }}
    >
      {(props) => (
        <MapBackground routeCoordinates={routeCoordinates}>
          {/* <Rutas {...props} onViewRoute={handleViewRoute} /> */}
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Pantalla de Rutas Disponibles</Text>
          </View>
        </MapBackground>
      )}
    </Drawer.Screen>
  ];

  // Pantallas específicas para conductores
  const driverScreens = userType === 'driver' ? [
    <Drawer.Screen
      key="Mis Viajes"
      name="Mis Viajes"
      options={{
        drawerIcon: ({ color }) => (
          <FontAwesome name="road" size={22} color={color} style={{ marginRight: 10 }} />
        ),
      }}
    >
      {(props) => (
        <MapBackground routeCoordinates={routeCoordinates}>
          {/* <DriverTripsScreen {...props} /> */}
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Pantalla de Viajes del Conductor</Text>
          </View>
        </MapBackground>
      )}
    </Drawer.Screen>
  ] : [];

  // Pantallas específicas para usuarios normales
  const userScreens = userType === 'user' ? [
    <Drawer.Screen
      key="Reservar Rutas"
      name="Reservar Rutas"
      options={{
        drawerIcon: ({ color }) => (
          <FontAwesome name="calendar" size={22} color={color} style={{ marginRight: 10 }} />
        ),
      }}
    >
      {(props) => (
        <MapBackground routeCoordinates={routeCoordinates}>
          {/* <AgendarReserva {...props} /> */}
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Pantalla de Reservar Rutas</Text>
          </View>
        </MapBackground>
      )}
    </Drawer.Screen>,
    
    <Drawer.Screen
      key="Historial de Viajes"
      name="Historial de Viajes"
      options={{
        drawerIcon: ({ color }) => (
          <FontAwesome name="history" size={22} color={color} style={{ marginRight: 10 }} />
        ),
      }}
    >
      {(props) => (
        <MapBackground routeCoordinates={routeCoordinates}>
          {/* <HistorialViajes {...props} onViewRoute={handleViewRoute} /> */}
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Pantalla de Historial de Viajes</Text>
          </View>
        </MapBackground>
      )}
    </Drawer.Screen>
  ] : [];

  return (
    <Drawer.Navigator
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
        headerShown: false,
      }}
    >
      {[...commonScreens, ...driverScreens, ...userScreens]}
    </Drawer.Navigator>
  );
};