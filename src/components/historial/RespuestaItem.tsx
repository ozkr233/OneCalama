
// src/components/historial/RespuestaItem.tsx
import React, { useState } from 'react';
import { Card, XStack, YStack, Text, Button, Image } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { Respuesta, Evidencia } from '../../types/historial';
import { formatearFecha } from '../../utils/formatters';

interface RespuestaItemProps {
  respuesta: Respuesta;
  onMarcarComoLeida?: (respuestaId: string) => void;
  onVerEvidencia?: (evidencia: Evidencia) => void;
}

export const RespuestaItem: React.FC<RespuestaItemProps> = ({
  respuesta,
  onMarcarComoLeida,
  onVerEvidencia
}) => {
  const [mostrarEvidencias, setMostrarEvidencias] = useState(false);

  const handleMarcarLeida = () => {
    if (onMarcarComoLeida) {
      onMarcarComoLeida(respuesta.id);
    }
  };

  return (
    <Card
      elevate
      p="$4"
      mb="$3"
      bg={respuesta.esRespuestaOficial ? '$blue1' : '$gray1'}
      borderLeftWidth={4}
      borderLeftColor={respuesta.esRespuestaOficial ? '$primary' : '$gray6'}
    >
      <YStack gap="$3">
        {/* Header con autor y fecha */}
        <XStack justifyContent="space-between" alignItems="flex-start">
          <YStack gap="$1" flex={1}>
            <XStack alignItems="center" gap="$2">
              <Ionicons
                name={respuesta.esRespuestaOficial ? "shield-checkmark" : "person"}
                size={16}
                color="#E67E22"
              />
              <Text fontSize="$4" fontWeight="bold" color="$textPrimary">
                {respuesta.autorRespuesta}
              </Text>
            </XStack>
            <Text fontSize="$2" color="$textSecondary">
              {respuesta.cargoAutor}
            </Text>
          </YStack>
          <Text fontSize="$2" color="$textSecondary">
            {formatearFecha(respuesta.fechaRespuesta)}
          </Text>
        </XStack>

        {/* Contenido de la respuesta */}
        <Text fontSize="$3" color="$textPrimary" lineHeight="$4">
          {respuesta.contenido}
        </Text>

        {/* Evidencias */}
        {respuesta.evidencias.length > 0 && (
          <YStack gap="$2">
            <Button
              size="$2"
              variant="outlined"
              onPress={() => setMostrarEvidencias(!mostrarEvidencias)}
              iconAfter={
                <Ionicons
                  name={mostrarEvidencias ? "chevron-up" : "chevron-down"}
                  size={16}
                />
              }
            >
              Ver evidencias ({respuesta.evidencias.length})
            </Button>

            {mostrarEvidencias && (
              <YStack gap="$2">
                {respuesta.evidencias.map((evidencia) => (
                  <Card
                    key={evidencia.id}
                    p="$2"
                    bg="white"
                    pressStyle={{ scale: 0.98 }}
                    onPress={() => onVerEvidencia?.(evidencia)}
                  >
                    <XStack alignItems="center" gap="$2">
                      <Ionicons
                        name={
                          evidencia.tipo === 'imagen' ? 'image' :
                          evidencia.tipo === 'video' ? 'videocam' : 'document'
                        }
                        size={20}
                        color="#757575"
                      />
                      <YStack flex={1}>
                        <Text fontSize="$3" fontWeight="500">
                          {evidencia.nombre}
                        </Text>
                        {evidencia.descripcion && (
                          <Text fontSize="$2" color="$textSecondary">
                            {evidencia.descripcion}
                          </Text>
                        )}
                      </YStack>
                      <Ionicons name="chevron-forward" size={16} color="#757575" />
                    </XStack>
                  </Card>
                ))}
              </YStack>
            )}
          </YStack>
        )}

        {/* Botón marcar como leída */}
        {onMarcarComoLeida && (
          <Button
            size="$2"
            variant="outlined"
            alignSelf="flex-start"
            onPress={handleMarcarLeida}
          >
            <Ionicons name="checkmark" size={16} />
            <Text ml="$1">Marcar como leída</Text>
          </Button>
        )}
      </YStack>
    </Card>
  );
};