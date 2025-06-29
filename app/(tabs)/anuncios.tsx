import React from 'react';
import { Text, YStack, Card } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AnunciosScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack f={1} p="$4" gap="$4">
        <Text fontSize="$7" fontWeight="bold" color="$primary">
          Anuncios Municipales
        </Text>
        
        <Card elevate p="$4" gap="$3">
          <Text fontSize="$5" fontWeight="bold">
            Corte de Agua Programado
          </Text>
          <Text color="$textSecondary">
            Mañana 29 de Junio se realizará mantención en el sector norte
          </Text>
          <Text fontSize="$3" color="$textSecondary">
            Publicado: 28 Jun 2025
          </Text>
        </Card>
        
        <Card elevate p="$4" gap="$3">
          <Text fontSize="$5" fontWeight="bold">
            Nuevo Horario de Atención
          </Text>
          <Text color="$textSecondary">
            Las oficinas municipales atenderán de 8:00 a 17:00 hrs
          </Text>
          <Text fontSize="$3" color="$textSecondary">
            Publicado: 27 Jun 2025
          </Text>
        </Card>
      </YStack>
    </SafeAreaView>
  );
}