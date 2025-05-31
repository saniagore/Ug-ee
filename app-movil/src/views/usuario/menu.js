import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useUsuarioId } from "./utils/useUsuarioId";
import { useViajes, unirseViaje } from "./utils/viajes";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { styles } from "./estilos/menu";
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export default function HomeContent({route}) {
  const { celular } = route.params || {};
  const { usuarioId, loading, error } = useUsuarioId(celular);
  const { viajes, loadingViajes, errorViajes, refetch } = useViajes(usuarioId);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const handleReservar = async(viajeId) => {
    try{
      await unirseViaje(viajeId, usuarioId);
      await refetch();
    }catch(error){
      console.error("Error al reservar el viaje:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>
          Rutas Disponibles
        </Text>
      </View>

      <ScrollView style={styles.viajesContainer}>
        {loadingViajes && (
          <View style={styles.loadingContainer}>
            <Ionicons name="ios-refresh" size={24} color="#555" />
            <Text style={styles.loadingText}>Cargando viajes...</Text>
          </View>
        )}
        
        {errorViajes && (
          <View style={styles.errorContainer}>
            <MaterialIcons name="error-outline" size={24} color="#F44336" />
            <Text style={styles.errorText}>Error al cargar viajes</Text>
          </View>
        )}
        
        {viajes && viajes.length > 0 ? (
          viajes.map((viaje) => (
            <TouchableOpacity 
              key={viaje.id} 
              style={[
                styles.viajeCard,
                { borderLeftColor: "#7e46d2", borderLeftWidth: 4 }
              ]}
              activeOpacity={0.8}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.viajeTitle}>Viaje #{viaje.id}</Text>
                <View style={[styles.statusBadge, { backgroundColor: "#7e46d2" }]}>
                  <Text style={styles.statusText}>{viaje.estado}</Text>
                </View>
              </View>
              
              <View style={styles.routeInfo}>
                <View style={styles.routePoint}>
                  <Ionicons name="location-sharp" size={16} color="#4CAF50" />
                  <Text style={styles.routeText}>{viaje.puntopartida}</Text>
                </View>
                <View style={styles.routeDivider}>
                  <View style={styles.dividerLine} />
                  <Ionicons name="arrow-down" size={14} color="#888" />
                  <View style={styles.dividerLine} />
                </View>
                <View style={styles.routePoint}>
                  <Ionicons name="location-sharp" size={16} color="#F44336" />
                  <Text style={styles.routeText}>{viaje.puntodestino}</Text>
                </View>
              </View>
              
              <View style={styles.detailRow}>
                <Ionicons name="calendar" size={16} color="#555" />
                <Text style={styles.detailText}>{formatDate(viaje.fechasalida)}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Ionicons name="people" size={16} color="#555" />
                <Text style={styles.detailText}>
                  {viaje.pasajerosdisponibles} de {viaje.cantidadpasajeros} asientos disponibles
                </Text>
              </View>
              
              <View style={styles.detailRow}>
                <MaterialIcons name="directions-car" size={16} color="#555" />
                <Text style={styles.detailText}>
                  {viaje.marca} {viaje.modelo} ({viaje.color}, {viaje.placa})
                </Text>
              </View>
              
              <View style={styles.driverInfo}>
                <View style={styles.driverAvatar}>
                  <Ionicons name="person" size={20} color="#fff" />
                </View>
                <View style={styles.driverDetails}>
                  <Text style={styles.driverName}>{viaje.conductornombre}</Text>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={14} color="#FFC107" />
                    <Text style={styles.ratingText}>{viaje.conductorpuntuacion || 'Nuevo'}</Text>
                    <Text style={styles.driverPhone}> • {viaje.conductorcelular}</Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity style={styles.bookButton} activeOpacity={0.7} onPress={() => handleReservar(viaje.id)}>
                <Text style={styles.bookButtonText}>Reservar Asiento</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        ) : (
          !loadingViajes && (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="directions-car" size={48} color="#ddd" />
              <Text style={styles.emptyText}>No hay viajes disponibles</Text>
              <Text style={styles.emptySubtext}>Intenta más tarde o crea tu propio viaje</Text>
            </View>
          )
        )}
      </ScrollView>
    </View>
  );
}
