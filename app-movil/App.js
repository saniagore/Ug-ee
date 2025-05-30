import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import 'react-native-gesture-handler';
import 'react-native-reanimated';

import { AuthProvider, useAuth } from './src/components/auth/authContext'; 
import useEssentialPermissions from './src/components/permisosApp';

import LoginScreen from './src/views/login';
import { AppDrawerNavigator } from './src/views/menuUsuario';

const Stack = createNativeStackNavigator();

function AuthenticatedStack({ tipoUsuario }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>

      {tipoUsuario === 1 && (
        <Stack.Screen name="MainUser">
          {() => <AppDrawerNavigator userType="user" />}
        </Stack.Screen>
      )}
      
      {tipoUsuario === 2 && (
        <Stack.Screen name="MainDriver">
          {() => <AppDrawerNavigator userType="driver" />}
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
    <AuthenticatedStack tipoUsuario={Number(usuarioAuth?.tipoUsuario) || 0} />
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