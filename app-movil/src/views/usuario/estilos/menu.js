import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  instructions: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f3f4',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 10,
  },
  searchText: {
    marginLeft: 10,
    color: '#666',
    fontSize: 16,
  },
  viajesContainer: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f8f9fa',
  },
  viajeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viajeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  routeInfo: {
    marginBottom: 12,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeText: {
    marginLeft: 8,
    fontSize: 15,
    color: '#333',
  },
  routeDivider: {
    flexDirection: 'column',
    alignItems: 'center',
    marginVertical: 4,
    marginLeft: 7,
  },
  dividerLine: {
    width: 1,
    height: 8,
    backgroundColor: '#ddd',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#555',
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  driverAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#7e46d2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 13,
    color: '#666',
  },
  driverPhone: {
    fontSize: 13,
    color: '#666',
  },
  messageButton: {
    padding: 8,
  },
  bookButton: {
    backgroundColor: '#7e46d2',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  bookButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginLeft: 10,
    color: '#555',
  },
  errorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginLeft: 10,
    color: '#F44336',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 8,
    textAlign: 'center',
  },
});