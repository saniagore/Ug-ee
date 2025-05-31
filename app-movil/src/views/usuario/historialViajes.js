import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Pressable,
} from "react-native";
import { useUsuarioId } from "./utils/useUsuarioId";
import { useObtenerHistorial, cancelarViaje } from "./utils/viajes";
import { calificarViaje } from "./utils/calificacion";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { styles } from "./estilos/historialViajes";
import { useState } from "react";

export default function HistorialViajes({ route }) {
  const { celular } = route.params || {};
  const { usuarioId, loading, error } = useUsuarioId(celular);
  const { viajes, loadingViajes, errorViajes, refetch } = useObtenerHistorial(usuarioId);

  const [selectedViaje, setSelectedViaje] = useState(null);
  const [rating, setRating] = useState(0);
  const [comentario, setComentario] = useState("");
  const [isRatingModalVisible, setIsRatingModalVisible] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getStatusColor = (estado) => {
    switch (estado.toLowerCase()) {
      case "pendiente":
        return "#FFA500";
      case "en curso":
        return "#4CAF50";
      case "finalizado":
        return "#F44336";
      default:
        return "#7e46d2";
    }
  };

  const handleCalificarPress = (viaje) => {
    setSelectedViaje(viaje);
    setRating(0);
    setComentario("");
    setIsRatingModalVisible(true);
  };

  const handleRatingSubmit = async() => {
    try{
      await calificarViaje(selectedViaje.id, rating, comentario);
      setIsRatingModalVisible(false);
      await refetch();
    }catch(error){
      console.error("Error al enviar calificación:", error);
    }
  };

  const handleCancelarViaje = async (viajeId) => {
    try {
      await cancelarViaje(viajeId, usuarioId);
      await refetch();
    } catch (error) {
      console.error("Error al cancelar el viaje:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Historial de Viajes</Text>
      </View>

      <ScrollView style={styles.viajesContainer}>
        {loadingViajes && (
          <View style={styles.loadingContainer}>
            <Ionicons name="ios-refresh" size={24} color="#555" />
            <Text style={styles.loadingText}>Cargando historial...</Text>
          </View>
        )}

        {errorViajes && (
          <View style={styles.errorContainer}>
            <MaterialIcons name="error-outline" size={24} color="#F44336" />
            <Text style={styles.errorText}>Error al cargar historial</Text>
          </View>
        )}

        {viajes && viajes.length > 0
          ? viajes.map((viaje) => (
              <TouchableOpacity
                key={viaje.id}
                style={[
                  styles.viajeCard,
                  {
                    borderLeftColor: getStatusColor(viaje.estado),
                    borderLeftWidth: 4,
                  },
                ]}
                activeOpacity={0.8}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.viajeTitle}>Viaje #{viaje.id}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(viaje.estado) },
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {viaje.estado.toUpperCase()}
                    </Text>
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
                  <Text style={styles.detailText}>
                    {formatDate(viaje.fechasalida)}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="car" size={16} color="#555" />
                  <Text style={styles.detailText}>
                    {viaje.tipoviaje} • {viaje.categoria}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="people" size={16} color="#555" />
                  <Text style={styles.detailText}>
                    {viaje.cantidadpasajeros} pasajeros
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
                    <Text style={styles.driverName}>
                      {viaje.conductornombre}
                    </Text>
                    <View style={styles.ratingContainer}>
                      <Ionicons name="star" size={14} color="#FFC107" />
                      <Text style={styles.ratingText}>
                        {viaje.conductorpuntuacion || "Nuevo"}
                      </Text>
                      <Text style={styles.driverPhone}>
                        {" "}
                        • {viaje.conductorcelular}
                      </Text>
                    </View>
                  </View>
                </View>

                {viaje.estado === "pendiente" && (
                  <View style={styles.historyActions}>
                    <TouchableOpacity
                      style={[styles.historyButton, styles.cancelButton]}
                      activeOpacity={0.7}
                      onPress={() => handleCancelarViaje(viaje.id)}
                    >
                      <Ionicons name="close-circle" size={18} color="#fff" />
                      <Text style={styles.historyButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {viaje.estado === "finalizado" && (
                  <View style={styles.historyActions}>
                    <TouchableOpacity
                      style={[styles.historyButton, styles.calificarButton]}
                      activeOpacity={0.7}
                      onPress={() => handleCalificarPress(viaje)}
                    >
                      <Ionicons name="star" size={18} color="#fff" />
                      <Text style={styles.historyButtonText}>Calificar</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            ))
          : !loadingViajes && (
              <View style={styles.emptyContainer}>
                <MaterialIcons name="history" size={48} color="#ddd" />
                <Text style={styles.emptyText}>
                  No hay viajes en tu historial
                </Text>
                <Text style={styles.emptySubtext}>
                  Realiza tu primer viaje para verlo aquí
                </Text>
              </View>
            )}
      </ScrollView>

      {/* Modal de Calificación */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isRatingModalVisible}
        onRequestClose={() => setIsRatingModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Calificar Viaje #{selectedViaje?.id}
            </Text>

            <Text style={styles.modalSubtitle}>
              ¿Cómo calificarías este viaje?
            </Text>

            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                  <Ionicons
                    name={star <= rating ? "star" : "star-outline"}
                    size={32}
                    color="#FFC107"
                  />
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.commentLabel}>Comentario (opcional):</Text>
            <TextInput
              style={styles.commentInput}
              multiline
              numberOfLines={4}
              placeholder="Escribe tu experiencia con este viaje..."
              value={comentario}
              onChangeText={setComentario}
            />

            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsRatingModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </Pressable>

              <Pressable
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleRatingSubmit}
                disabled={rating === 0}
              >
                <Text style={styles.modalButtonText}>Enviar Calificación</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
