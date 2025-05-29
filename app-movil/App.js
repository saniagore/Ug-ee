import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import 'react-native-gesture-handler';
import 'react-native-reanimated';

import { AuthProvider, useAuth } from './src/components/auth/authContext'; 
import useEssentialPermissions from './src/components/permisosApp';

import LoginScreen from './src/views/login';

const Stack = createNativeStackNavigator();

function AuthenticatedStack({ tipoUsuario }) {
  if (!tipoUsuario) {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    );
  }
  return (
    <Stack.Navigator>
      {tipoUsuario === 1 && (
        <Stack.Screen name="Home Usuario" component={homeAdminScreen} />
      )}
      {tipoUsuario === 2 && (
        <Stack.Screen name="Home Conductor" component={homeUserScreen} />
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

function RootNavigator(){
  const { user } = useAuth();

  if (!user) {
    return <UnauthenticatedStack />;
  }

  const tipoUsuario = Number(user?.tipoUsuario) || 0;

  return <AuthenticatedStack tipoUsuario={tipoUsuario} />;
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

