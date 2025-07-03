// src/components/layout/AppHeader.tsx - ACTUALIZADO
import React from 'react';
import { Text, YStack, XStack, Image, Button } from 'tamagui';
import { StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface AppHeaderProps {
  screenTitle: string;
  screenSubtitle?: string;
  screenIcon?: keyof typeof Ionicons.glyphMap;
  showNotifications?: boolean;
  showAppInfo?: boolean;
  showBackButton?: boolean; // Nueva prop para mostrar botón de regreso
  onBackPress?: () => void; // Función personalizada para el botón de regreso
}

export default function AppHeader({
  screenTitle,
  screenSubtitle,
  screenIcon,
  showNotifications = true,
  showAppInfo = false,
  showBackButton = false,
  onBackPress
}: AppHeaderProps) {
  const router = useRouter();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <>
      <StatusBar backgroundColor="#E67E22" barStyle="light-content" />

      {/* Header unificado */}
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
          {/* Lado izquierdo */}
          <XStack ai="center" gap="$3" f={1}>
            {/* Botón de regreso (si está habilitado) */}
            {showBackButton && (
              <Button
                size="$3"
                circular
                bg="rgba(255,255,255,0.1)"
                onPress={handleBackPress}
                pressStyle={{
                  bg: "rgba(255,255,255,0.2)",
                  scale: 0.95
                }}
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.2,
                  shadowRadius: 2,
                  elevation: 2,
                }}
              >
                <Ionicons name="arrow-back" size={20} color="white" />
              </Button>
            )}

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
              // En otras pantallas: Icono + título de la pantalla
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
            <Button
              size="$3"
              circular
              bg="rgba(255,255,255,0.1)"
              pressStyle={{
                bg: "rgba(255,255,255,0.2)",
                scale: 0.95
              }}
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 2,
                elevation: 2,
              }}
            >
              <Ionicons name="notifications-outline" size={20} color="white" />
            </Button>
          )}
        </XStack>
      </YStack>
    </>
  );
}