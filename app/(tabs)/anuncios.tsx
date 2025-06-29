import React from 'react';
import { Text, YStack, Card } from 'tamagui';
import { SafeAreaView } from 'react-native';
import AppHeader from '../../src/components/layout/AppHeader';

export default function AnunciosScreen() {
  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
        {/* Header unificado - Solo título de pantalla */}
        <AppHeader
          screenTitle="Anuncios Municipales"
          screenSubtitle="Información oficial y noticias"
          screenIcon="megaphone"
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
              Corte de Agua Programado
            </Text>
            <Text color="$textSecondary">
              Mañana 29 de Junio se realizará mantención en el sector norte
            </Text>
            <Text fontSize="$3" color="$textSecondary">
              Publicado: 28 Jun 2025
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
              Nuevo Horario de Atención
            </Text>
            <Text color="$textSecondary">
              Las oficinas municipales atenderán de 8:00 a 17:00 hrs
            </Text>
            <Text fontSize="$3" color="$textSecondary">
              Publicado: 27 Jun 2025
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
              Jornada de Vacunación Gratuita
            </Text>
            <Text color="$textSecondary">
              Este sábado 30 de junio en el parque principal, de 9:00 a 17:00 hrs
            </Text>
            <Text fontSize="$3" color="$textSecondary">
              Publicado: 26 Jun 2025
            </Text>
          </Card>
        </YStack>
      </SafeAreaView>
    </>
  );
}