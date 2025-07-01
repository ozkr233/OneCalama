// app/_layout.tsx
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

// Importar TamaguiProvider
import { TamaguiProvider } from 'tamagui';
import config from '../src/tamagui.config';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <TamaguiProvider config={config} defaultTheme="calama">
      <Stack>
        {/* Grupo principal de tabs */}
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />

        {/* Grupo de autenticación */}
        <Stack.Screen
          name="auth"
          options={{ headerShown: false }}
        />

        {/* Rutas de denuncias */}
        <Stack.Screen
          name="denuncia/[id]"
          options={{
            headerShown: false,
            presentation: 'modal',
            title: 'Detalle de Denuncia'
          }}
        />

        <Stack.Screen
          name="denuncia/crear"
          options={{
            headerShown: false,
            presentation: 'modal',
            title: 'Nueva Denuncia'
          }}
        />

        {/* Pantalla de página no encontrada */}
        <Stack.Screen
          name="+not-found"
          options={{
            title: 'Página no encontrada',
            headerShown: true
          }}
        />
      </Stack>
    </TamaguiProvider>
  );
}