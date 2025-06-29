import React from 'react';
import { Text, YStack, XStack, Image } from 'tamagui';
import { StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AppHeaderProps {
  screenTitle: string;
  screenSubtitle?: string;
  screenIcon?: keyof typeof Ionicons.glyphMap;
  showNotifications?: boolean;
  showAppInfo?: boolean; // Nueva prop para mostrar info de la app
}

export default function AppHeader({ 
  screenTitle, 
  screenSubtitle,
  screenIcon,
  showNotifications = true,
  showAppInfo = false 
}: AppHeaderProps) {
  return (
    <>
      <StatusBar backgroundColor="#1A237E" barStyle="light-content" />
      
      {/* Una sola barra */}
      <YStack 
        bg="$primary"
        px="$4"
        py="$3"
        pb="$2"
        pt="$6"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
        }}
      >
        <XStack jc="space-between" ai="center">
          {/* Lado izquierdo - Condicional */}
          <XStack ai="center" gap="$3" f={1}>
            {showAppInfo ? (
              // En pantalla principal: Logo + nombre de la app
              <>
                <YStack 
                  w={36} 
                  h={36} 
                  bg="rgba(255,255,255,0.1)" 
                  br="$6" 
                  ai="center" 
                  jc="center"
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.2,
                    shadowRadius: 2,
                    elevation: 2,
                  }}
                >
                  <Image 
                    source={require('../../../assets/images/icon.png')}
                    w={28} 
                    h={28} 
                    br="$3"
                  />
                </YStack>
                
                <YStack>
                  <Text fontSize="$6" fontWeight="bold" color="white">
                    OneCalama
                  </Text>
                  <Text fontSize="$2" color="rgba(255,255,255,0.8)">
                    Municipalidad de Calama
                  </Text>
                </YStack>
              </>
            ) : (
              // En otras pantallas: Solo icono + título de la pantalla
              <>
                {screenIcon && (
                  <Ionicons name={screenIcon} size={24} color="white" />
                )}
                <YStack>
                  <Text fontSize="$6" fontWeight="bold" color="white">
                    {screenTitle}
                  </Text>
                  {screenSubtitle && (
                    <Text fontSize="$2" color="rgba(255,255,255,0.8)">
                      {screenSubtitle}
                    </Text>
                  )}
                </YStack>
              </>
            )}
          </XStack>

          {/* Lado derecho - Notificaciones */}
          {showNotifications && (
            <YStack 
              w={36} 
              h={36} 
              bg="rgba(255,255,255,0.1)" 
              br="$8" 
              ai="center" 
              jc="center"
              pressStyle={{
                bg: "rgba(255,255,255,0.2)",
                scale: 0.95
              }}
            >
              <Ionicons name="notifications-outline" size={20} color="white" />
            </YStack>
          )}
        </XStack>
      </YStack>
    </>
  );
}