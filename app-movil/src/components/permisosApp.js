import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location';
import * as Camera from 'expo-camera';
import { Alert } from 'react-native';
import { Platform } from 'react-native';

const useEssentialPermissions = () => {
  useEffect(() => {
    const requestPermissions = async () => {
      try {
        // Configurar manejador de notificaciones
        if(Platform.OS !== 'web') {
          await Notifications.setNotificationHandler({
            handleNotification: async () => ({
              shouldShowAlert: true,
              shouldPlaySound: true,
              shouldSetBadge: true,
            }),
          });
        }

        // Solicitar permiso de notificaciones
        const { status: notifStatus } = await Notifications.requestPermissionsAsync({
          ios: {
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
            allowAnnouncements: true,
          },
        });
        
        if (notifStatus !== 'granted') {
          Alert.alert(
            'Permiso de notificaciones',
            'Para recibir alertas importantes, por favor habilita las notificaciones.'
          );
        }

        // Solicitar permiso de ubicación
        const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
        
        if (locationStatus !== 'granted') {
          Alert.alert(
            'Permiso de ubicación',
            'Necesitamos acceso a tu ubicación para brindarte servicios personalizados.'
          );
        }

        // Solicitar permiso de cámara
        const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
        
        if (cameraStatus !== 'granted') {
          Alert.alert(
            'Permiso de cámara',
            'Necesitamos acceso a tu cámara para funciones de escaneo y fotos.'
          );
        }

      } catch (error) {
        Alert.alert(
          'Error',
          'Ocurrió un problema al solicitar los permisos. Por favor intenta nuevamente.'
        );
      }
    };

    requestPermissions();
  }, []);
};

export default useEssentialPermissions;