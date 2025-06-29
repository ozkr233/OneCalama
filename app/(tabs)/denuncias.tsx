import React from 'react';
import { Text, YStack, Button } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DenunciasScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack f={1} jc="center" ai="center" gap="$4" p="$4">
        <Text fontSize="$7" fontWeight="bold" color="$primary">
          Nueva Denuncia
        </Text>
        <Text fontSize="$4" color="$textSecondary" textAlign="center">
          Aquí podrás crear una nueva denuncia ciudadana
        </Text>
        
        <Button
          size="$5"
          theme="active"
          onPress={() => console.log('Crear formulario de denuncia')}
        >
          Crear Denuncia
        </Button>
      </YStack>
    </SafeAreaView>
  );
}