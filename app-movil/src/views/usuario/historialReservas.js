import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useReservas } from './utils/reservas';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { styles } from './estilos/historialReservas';
import { useUsuarioId } from './utils/useUsuarioId';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export default function HistorialReservas({ route }) {
    const { celular } = route.params || {};
    const { usuarioId, loading, error } = useUsuarioId(celular);
    const { reservas, loadingReservas, errorReservas, refetch } = useReservas(usuarioId);

    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [refetch])
    );

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    if (loading || loadingReservas) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Cargando reservas...</Text>
            </View>
        );
    }

    if (error || errorReservas) {
        return (
            <View style={styles.errorContainer}>
                <MaterialIcons name="error-outline" size={24} color="#F44336" />
                <Text style={styles.errorText}>Error al cargar las reservas</Text>
            </View>
        );
    }

    if (!reservas || reservas.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No hay reservas registradas</Text>
                <Text style={styles.emptySubtext}>Todavía no has realizado ninguna reserva en nuestro sistema.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.welcomeText}>Historial de reservas</Text>
                <Text style={styles.instructions}>Aquí puedes ver todas tus reservas anteriores</Text>
            </View>

            <View style={styles.viajesContainer}>
                {reservas.map((reserva, index) => (
                    <View key={index} style={styles.viajeCard}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.viajeTitle}>Reserva #{reserva.id}</Text>
                            <View style={[styles.statusBadge, { backgroundColor: "#FFC107" }]}>
                                <Text style={styles.statusText}>{reserva.estado.toUpperCase()}</Text>
                            </View>
                        </View>

                        <View style={styles.routeInfo}>
                            <View style={styles.routePoint}>
                                <Ionicons name="location-outline" size={16} color="#7e46d2" />
                                <Text style={styles.routeText}>{reserva.puntopartida}</Text>
                            </View>
                            <View style={styles.routeDivider}>
                                <View style={styles.dividerLine} />
                            </View>
                            <View style={styles.routePoint}>
                                <Ionicons name="flag-outline" size={16} color="#F44336" />
                                <Text style={styles.routeText}>{reserva.puntodestino}</Text>
                            </View>
                        </View>

                        <View style={styles.detailRow}>
                            <Ionicons name="calendar-outline" size={16} color="#555" />
                            <Text style={styles.detailText}>Fecha: {formatDate(reserva.fecha)}</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <Ionicons name="time-outline" size={16} color="#555" />
                            <Text style={styles.detailText}>Hora de salida: {formatDate(reserva.horasalida)}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}