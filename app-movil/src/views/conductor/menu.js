import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import {
  useViajesConductor,
  cancelarViaje,
  finalizarViaje,
  iniciarViaje
} from "./utils/viajes";
import { styles } from "./estilos/menu";
import { useConductorId } from "./utils/useConductorId";

export default function HomeContent({ route }) {
  const { celular } = route.params || {};
  const { conductorId } = useConductorId(celular);
  const { viajes, loading, error, refetch } = useViajesConductor(conductorId);

  const handleCancelarViaje = async (viajeId) => {
    try {
      await cancelarViaje(viajeId);
      await refetch();
    } catch (error) {
      console.error("Error al cancelar viaje:", error);
    }
  };

  const handleIniciarViaje = async (viajeId) => {
    try {
      await iniciarViaje(viajeId);
      await refetch();
    } catch (error) {
      console.error("Error al iniciar viaje:", error);
    }
  };

  const handleFinalizarViaje = async (viajeId) => {
    try {
      await finalizarViaje(viajeId);
      await refetch();
    } catch (error) {
      console.error("Error al finalizar viaje:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7e46d2" />
        <Text style={styles.loadingText}>Cargando viajes...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Error al cargar los viajes: {error.message}
        </Text>
      </View>
    );
  }

  if (!viajes || viajes.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No tienes viajes programados</Text>
        <Text style={styles.emptySubtext}>
          Cuando tengas viajes, aparecerán aquí
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Tus Viajes</Text>
        <Text style={styles.instructions}>Gestiona tus viajes programados</Text>
      </View>

      <View style={styles.viajesContainer}>
        {viajes.map((viaje) => (
          <View key={viaje.id} style={styles.viajeCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.viajeTitle}>Viaje #{viaje.id}</Text>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      viaje.estado === "pendiente" ? "#FFA000" : "#4CAF50",
                  },
                ]}
              >
                <Text style={styles.statusText}>
                  {viaje.estado.toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={styles.routeInfo}>
              <View style={styles.routePoint}>
                <View style={styles.dot} />
                <Text style={styles.routeText}>{viaje.puntopartida}</Text>
              </View>

              <View style={styles.routeDivider}>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.routePoint}>
                <View style={styles.dotDestination} />
                <Text style={styles.routeText}>{viaje.puntodestino}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Fecha:</Text>
              <Text style={styles.detailText}>
                {new Date(viaje.fechasalida).toLocaleString()}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Pasajeros:</Text>
              <Text style={styles.detailText}>
                {viaje.cantidadpasajeros} ({viaje.pasajerosdisponibles}{" "}
                disponibles)
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Tipo:</Text>
              <Text style={styles.detailText}>{viaje.tipoviaje}</Text>
            </View>

            {viaje.estado === "pendiente" && (
              <View style={styles.historyActions}>
                <TouchableOpacity
                  style={[styles.historyButton, styles.cancelButton]}
                  onPress={() => handleCancelarViaje(viaje.id)}
                >
                  <Text style={styles.historyButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.historyButton, styles.iniciarButton]}
                  onPress={() => handleIniciarViaje(viaje.id)}
                >
                  <Text style={styles.historyButtonText}>Iniciar</Text>
                </TouchableOpacity>
              </View>
            )}
            {viaje.estado === "en curso" && (
              <View style={styles.historyActions}>
                <TouchableOpacity
                  style={[styles.historyButton, styles.cancelButton]}
                  onPress={() => handleFinalizarViaje(viaje.id)}
                >
                  <Text style={styles.historyButtonText}>Finalizar</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
