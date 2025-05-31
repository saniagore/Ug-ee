import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
    },
    header: {
        padding: 20,
        backgroundColor: "#f8f9fa",
        alignItems: "center",
        justifyContent: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
    },
    welcomeText: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 5,
    },
    instructions: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
    },
    viajesContainer: {
        flex: 1,
        padding: 15,
    },
    viajeCard: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    viajeTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "600",
    },
    routeInfo: {
        marginBottom: 12,
    },
    routePoint: {
        flexDirection: "row",
        alignItems: "center",
    },
    routeText: {
        marginLeft: 8,
        fontSize: 15,
        color: "#333",
    },
    routeDivider: {
        flexDirection: "column",
        alignItems: "center",
        marginVertical: 4,
        marginLeft: 7,
    },
    dividerLine: {
        width: 1,
        height: 8,
        backgroundColor: "#ddd",
    },
    detailRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    detailText: {
        marginLeft: 8,
        fontSize: 14,
        color: "#555",
    },
    historyActions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 12,
    },
    historyButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: "#7e46d2",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    historyButtonText: {
        color: "#fff",
        fontWeight: "600",
        marginLeft: 6,
        fontSize: 14,
    },
    cancelButton: {
        backgroundColor: "#f44336",
    },
    calificarButton: {
        backgroundColor: "#FFC107",
    },
    loadingContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    loadingText: {
        marginLeft: 10,
        color: "#555",
    },
    errorContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    errorText: {
        marginLeft: 10,
        color: "#F44336",
    },
    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
    },
    emptyText: {
        fontSize: 18,
        color: "#888",
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: 14,
        color: "#aaa",
        marginTop: 8,
        textAlign: "center",
    },
});