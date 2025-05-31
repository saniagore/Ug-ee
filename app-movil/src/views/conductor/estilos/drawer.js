import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
    paddingTop: 40,
  },

  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  instructions: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },

  // Estilos para el botón de emergencia
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  boton: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width * 0.35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  activeButton: {
    backgroundColor: '#ff3b30',
  },
  disabledButton: {
    backgroundColor: '#ff8a80',
  },
  buttonIcon: {
    marginBottom: 15,
  },
  botonText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },

  // Estilos para mensajes de error
  errorText: {
    color: '#ff3b30',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
  },

  // Estilos para el drawer
  drawerContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  drawerHeader: {
    padding: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#29235c',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  userInfo: {
    marginLeft: 15,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  menuItems: {
    flex: 1,
    paddingTop: 15,
    paddingHorizontal: 10,
  },
  drawerItem: {
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  drawerLabel: {
    marginLeft: 15,
    fontSize: 16,
  },
  logoutContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#29235c',
    marginTop: 'auto',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fb2f2f',
    borderRadius: 8,
    paddingVertical: 14,
  },
  logoutButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },

  // Estilos adicionales para el chat
  chatContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  chatHeader: {
    backgroundColor: '#4a8cff',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },

  // Estilos para el reporte
  reportContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  reportTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#4a8cff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  




  reportContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  reportTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  reportSubtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 15,
    fontWeight: '500',
  },
  reportTypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  reportTypeButton: {
    width: '48%',
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reportTypeButtonSelected: {
    borderColor: '#4a8cff',
    backgroundColor: '#e6f0ff',
  },
  reportTypeText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  reportTypeTextSelected: {
    color: '#4a8cff',
    fontWeight: '500',
  },
  reportDescriptionInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    minHeight: 120,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 25,
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reportSubmitButton: {
    backgroundColor: '#29235c',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  reportSubmitButtonDisabled: {
    backgroundColor: '#a0c0ff',
  },
  reportSubmitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logo: {
    resizeMode: 'contain',
    aspectRatio: 1,
    width: 70,
    height: 70,
    marginRight: 20,
  },
  });