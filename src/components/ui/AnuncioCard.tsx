// src/components/ui/AnuncioCard.tsx
import React, { useState } from 'react';
import { Text, YStack, XStack, Card, Image, Button } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { AnuncioMunicipal } from '../../types/denuncias';

interface AnuncioCardProps {
  anuncio: AnuncioMunicipal;
}

export default function AnuncioCard({ anuncio }: AnuncioCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Función para formatear la fecha
  const formatearFecha = (fechaStr: string) => {
    const fecha = new Date(fechaStr);
    const opciones: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    };
    return fecha.toLocaleDateString('es-CL', opciones);
  };

  // Función para obtener el color del estado
  const getEstadoColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'activo':
        return '#4CAF50'; // Verde
      case 'programado':
        return '#FF9800'; // Naranja
      case 'finalizado':
        return '#9E9E9E'; // Gris
      default:
        return '#2196F3'; // Azul por defecto
    }
  };

  // Mostrar descripción completa o truncada
  const descripcionParaMostrar = expanded
    ? anuncio.descripcion
    : anuncio.descripcion.length > 150
      ? `${anuncio.descripcion.substring(0, 150)}...`
      : anuncio.descripcion;

  const mostrarBotonVerMas = anuncio.descripcion.length > 150;

  return (
    <Card
      elevate
      p="$4"
      gap="$3"
      bg="white"
      br="$4"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 4,
      }}
    >
      {/* Header con título y estado */}
      <XStack ai="flex-start" jc="space-between" gap="$3">
        <YStack f={1} gap="$1">
          <Text fontSize="$6" fontWeight="bold" color="$textPrimary">
            {anuncio.titulo}
          </Text>
          {anuncio.subtitulo && (
            <Text fontSize="$4" color="$textSecondary" fontWeight="600">
              {anuncio.subtitulo}
            </Text>
          )}
        </YStack>

        {/* Badge de estado */}
        <XStack
          ai="center"
          gap="$1"
          bg={getEstadoColor(anuncio.estado)}
          px="$2"
          py="$1"
          br="$3"
        >
          <Ionicons
            name="radio-button-on"
            size={8}
            color="white"
          />
          <Text fontSize="$2" color="white" fontWeight="bold">
            {anuncio.estado}
          </Text>
        </XStack>
      </XStack>

      {/* Imagen placeholder - No funcional por ahora */}
      {(anuncio.imagenes && anuncio.imagenes.length > 0) && (
        <YStack gap="$2">
          {!imageError ? (
            <Card br="$3" overflow="hidden">
              <Image
                source={require('../../../assets/images/icon.png')} // Placeholder
                w="100%"
                h={180}
                objectFit="cover"
                onError={() => setImageError(true)}
              />
            </Card>
          ) : (
            <Card
              bg="$background"
              br="$3"
              h={180}
              ai="center"
              jc="center"
              borderWidth={1}
              borderColor="$borderColor"
            >
              <YStack ai="center" gap="$2">
                <Ionicons name="image-outline" size={40} color="#9E9E9E" />
                <Text fontSize="$3" color="$textSecondary">
                  Imagen no disponible
                </Text>
              </YStack>
            </Card>
          )}
        </YStack>
      )}

      {/* Descripción */}
      <YStack gap="$2">
        <Text fontSize="$4" color="$textPrimary" lineHeight="$5">
          {descripcionParaMostrar}
        </Text>

        {/* Botón Ver más/Ver menos */}
        {mostrarBotonVerMas && (
          <Button
            variant="outlined"
            size="$2"
            alignSelf="flex-start"
            onPress={() => setExpanded(!expanded)}
            bg="transparent"
            borderColor="$primary"
            color="$primary"
            pressStyle={{
              bg: "$primary",
              color: "white"
            }}
          >
            <XStack ai="center" gap="$1">
              <Text fontSize="$3" fontWeight="600">
                {expanded ? 'Ver menos' : 'Ver más'}
              </Text>
              <Ionicons
                name={expanded ? 'chevron-up' : 'chevron-down'}
                size={14}
                color="#E67E22"
              />
            </XStack>
          </Button>
        )}
      </YStack>

      {/* Footer con categoría y fecha */}
      <XStack ai="center" jc="space-between" pt="$2" borderTopWidth={1} borderColor="$borderColor">
        <XStack ai="center" gap="$2">
          <Ionicons name="pricetag-outline" size={16} color="#009688" />
          <Text fontSize="$3" color="$textSecondary">
            {anuncio.categoria.nombre}
          </Text>
        </XStack>

        <XStack ai="center" gap="$2">
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text fontSize="$3" color="$textSecondary">
            {formatearFecha(anuncio.fecha)}
          </Text>
        </XStack>
      </XStack>
    </Card>
  );
}