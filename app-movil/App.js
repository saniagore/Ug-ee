import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LogBox } from 'react-native';
import 'react-native-gesture-handler';
import 'react-native-reanimated';

import { AuthProvider, useAuth } from './src/components/auth/authContext'; 
import useEssentialPermissions from './src/components/permisosApp';
import LoginScreen from './src/views/login';
import HomeUserScreen from './src/views/usuario/componentesUsuario';
import HomeDriverScreen from './src/views/conductor/menuConductor';

const Stack = createNativeStackNavigator();

LogBox.ignoreLogs([
  'expo-notifications', 
  'shadow* style props',
  'style.resizeMode', 
  'props.pointerEvents',
]);

function AuthenticatedStack({ tipoUsuario, celular }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {tipoUsuario === 1 && (
        <Stack.Screen name="MainUser">
          {() => <HomeUserScreen celular={celular} />} 
        </Stack.Screen>
      )}
      
      {tipoUsuario === 2 && (
        <Stack.Screen name="MainDriver">
          {() => <HomeDriverScreen celular={celular} />}
        </Stack.Screen>
      )}
      
      {![1, 2].includes(tipoUsuario) && (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}

function UnauthenticatedStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const { usuarioAuth } = useAuth();
  
  return usuarioAuth ? (
    <AuthenticatedStack 
      tipoUsuario={Number(usuarioAuth?.tipoUsuario) || 0} 
      celular={usuarioAuth?.usuario || ''} 
    />
  ) : (
    <UnauthenticatedStack />
  );
}

export default function App() {
  useEssentialPermissions();

  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}