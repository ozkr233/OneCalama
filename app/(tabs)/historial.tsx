import React from 'react';
import { Text, YStack, Card } from 'tamagui';
import { SafeAreaView } from 'react-native';
import AppHeader from '../../src/components/layout/AppHeader';

export default function HistorialScreen() {
  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
        {/* Header unificado - Solo título de pantalla */}
        <AppHeader
          screenTitle="Historial de Denuncias"
          screenSubtitle="Seguimiento de tus reportes"
          screenIcon="time"
          showAppInfo={false}
        />

        <YStack f={1} p="$4" gap="$4">
          <Card 
            elevate 
            p="$4" 
            gap="$3"
            bg="white"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Text fontSize="$5" fontWeight="bold">
              Denuncia #P-2025-06-001
            </Text>
            <Text color="$textSecondary">
              Estado: En progreso
            </Text>
            <Text fontSize="$3" color="$textSecondary">
              Fecha: 28 Jun 2025
            </Text>
            <Text fontSize="$3" color="$textPrimary">
              Bache en Av. Argentina 123
            </Text>
          </Card>
          
          <Card 
            elevate 
            p="$4" 
            gap="$3"
            bg="white"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Text fontSize="$5" fontWeight="bold">
              Denuncia #P-2025-06-002
            </Text>
            <Text color="$success">
              Estado: Resuelto
            </Text>
            <Text fontSize="$3" color="$textSecondary">
              Fecha: 25 Jun 2025
            </Text>
            <Text fontSize="$3" color="$textPrimary">
              Luminaria dañada en Calle Los Aromos
            </Text>
          </Card>
        </YStack>
      </SafeAreaView>
    </>
  );
}