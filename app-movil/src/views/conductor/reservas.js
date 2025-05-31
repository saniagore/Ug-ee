import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator
} from "react-native";
import {
    useReservasConductor,
    aceptarReserva
} from "./utils/reservas";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { styles } from "./estilos/reservas";
import { useConductorId } from "./utils/useConductorId";

export default function ReservasContent({ route }) {
    const { celular } = route.params || {};
    const { conductorId } = useConductorId(celular);
    const { reservas, loading, error, fetchReservas } = useReservasConductor(conductorId);

    const handleAceptarReserva = async (reservaId) => {
        try {
            await aceptarReserva(reservaId, conductorId);
            await fetchReservas();
        } catch (error) {
            console.error("Error al aceptar reserva:", error);
        }
    }

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Error al cargar las reservas</Text>
            </View>
        );
    }

    if (reservas.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No hay reservas pendientes</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Reservas pendientes</Text>
            
            {reservas.map((reserva) => (
                <View key={reserva.id} style={styles.reservaCard}>
                    <View style={styles.reservaHeader}>
                        <Text style={styles.reservaId}>Reserva #{reserva.id}</Text>
                        <Text style={styles.reservaFecha}>
                            {new Date(reserva.fecha).toLocaleDateString()} - 
                            {new Date(reserva.horasalida).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </Text>
                    </View>
                    
                    <View style={styles.reservaInfo}>
                        <View style={styles.infoRow}>
                            <Ionicons name="location-outline" size={20} color="#555" />
                            <Text style={styles.infoText}>Desde: {reserva.puntopartida}</Text>
                        </View>
                        
                        <View style={styles.infoRow}>
                            <Ionicons name="location-sharp" size={20} color="#555" />
                            <Text style={styles.infoText}>Hasta: {reserva.puntodestino}</Text>
                        </View>
                    </View>
                    
                    <TouchableOpacity 
                        style={styles.aceptarButton}
                        onPress={() => handleAceptarReserva(reserva.id)}
                    >
                        <Text style={styles.aceptarButtonText}>Aceptar Reserva</Text>
                    </TouchableOpacity>
                </View>
            ))}
        </ScrollView>
    );
}