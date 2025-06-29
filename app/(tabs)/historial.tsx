import React from 'react';
import { Text, YStack, Card } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HistorialScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack f={1} p="$4" gap="$4">
        <Text fontSize="$7" fontWeight="bold" color="$primary">
          Historial de Denuncias
        </Text>
        
        <Card elevate p="$4" gap="$3">
          <Text fontSize="$5" fontWeight="bold">
            Denuncia #001
          </Text>
          <Text color="$textSecondary">
            Estado: En progreso
          </Text>
          <Text fontSize="$3" color="$textSecondary">
            Fecha: 28 Jun 2025
          </Text>
        </Card>
        
        <Card elevate p="$4" gap="$3">
          <Text fontSize="$5" fontWeight="bold">
            Denuncia #002
          </Text>
          <Text color="$textSecondary">
            Estado: Resuelto
          </Text>
          <Text fontSize="$3" color="$textSecondary">
            Fecha: 25 Jun 2025
          </Text>
        </Card>
      </YStack>
    </SafeAreaView>
  );
}