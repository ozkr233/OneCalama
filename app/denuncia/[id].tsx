// app/denuncia/[id].tsx
import React, { useState, useEffect } from 'react';
import { SafeAreaView, Alert, FlatList } from 'react-native';
import { Text, YStack, XStack, Card, H4, Button, H5, Separator } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AppHeader from '../../src/components/layout/AppHeader';
import { HistorialDenuncia, Respuesta, Evidencia } from '../../src/types/historial';
import { formatearFecha, getEstadoColor, getEstadoTexto } from '../../src/utils/formatters';

// Datos placeholder - en producción vendría de la API
const denunciaPlaceholder: HistorialDenuncia = {
  id: '1',
  numeroFolio: 'CAL-2024-001',
  titulo: 'Luminaria dañada en Av. Brasil',
  descripcion: 'La luminaria ubicada en Av. Brasil esquina con Calle Ramírez está intermitente desde hace una semana, causando problemas de visibilidad nocturna para los peatones y conductores.',
  estado: 'en_proceso',
  fechaCreacion: '2024-12-15T10:30:00Z',
  ubicacion: {
    direccion: 'Av. Brasil esquina con Calle Ramírez, Calama'
  },
  evidenciasIniciales: [
    {
      id: 'ev1',
      tipo: 'imagen',
      url: 'https://via.placeholder.com/400x300/E67E22/FFFFFF?text=Luminaria+Dañada',
      nombre: 'luminaria_dañada.jpg',
      fechaSubida: '2024-12-15T10:30:00Z',
      descripcion: 'Foto de la luminaria intermitente'
    }
  ],
  respuestas: [
    {
      id: 'resp1',
      contenido: 'Estimado/a ciudadano/a, hemos recibido su reporte de la luminaria intermitente en Av. Brasil esquina con Calle Ramírez. Ya se ha asignado a nuestro equipo técnico especializado en alumbrado público. Estimamos tener una solución definitiva en 3-5 días hábiles.',
      fechaRespuesta: '2024-12-16T09:00:00Z',
      autorRespuesta: 'María González',
      cargoAutor: 'Coordinadora de Alumbrado Público',
      evidencias: [],
      esRespuestaOficial: true,
      leida: true
    },
    {
      id: 'resp2',
      contenido: 'Actualización: El equipo técnico visitó el lugar y confirmó el problema en el sistema eléctrico de la luminaria. Ya se solicitó el reemplazo del equipo completo. Se realizará la instalación mañana entre 08:00 y 12:00 hrs. Agradecemos su paciencia.',
      fechaRespuesta: '2024-12-20T14:00:00Z',
      autorRespuesta: 'Carlos Pérez',
      cargoAutor: 'Técnico en Electricidad',
      evidencias: [
        {
          id: 'ev2',
          tipo: 'imagen',
          url: 'https://via.placeholder.com/400x300/009688/FFFFFF?text=Evaluación+Técnica',
          nombre: 'evaluacion_tecnica.jpg',
          fechaSubida: '2024-12-20T14:00:00Z',
          descripcion: 'Evaluación técnica del problema'
        }
      ],
      esRespuestaOficial: true,
      leida: false // Nueva respuesta no leída
    }
  ]
};

// Componente para mostrar evidencias
const EvidenciaItem = ({ evidencia, onPress }: { evidencia: Evidencia; onPress: (evidencia: Evidencia) => void }) => (
  <Card
    p="$3"
    bg="$gray2"
    pressStyle={{ scale: 0.98 }}
    onPress={() => onPress(evidencia)}
    style={{
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    }}
  >
    <XStack ai="center" gap="$3">
      <Ionicons
        name={
          evidencia.tipo === 'imagen' ? 'image' :
          evidencia.tipo === 'video' ? 'videocam' : 'document'
        }
        size={24}
        color="#757575"
      />
      <YStack f={1}>
        <Text fontSize="$3" fontWeight="500" color="$textPrimary">
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
);

// Componente para cada respuesta
const RespuestaItem = ({
  respuesta,
  onMarcarLeida,
  onVerEvidencia
}: {
  respuesta: Respuesta;
  onMarcarLeida: (id: string) => void;
  onVerEvidencia: (evidencia: Evidencia) => void;
}) => (
  <Card
    p="$4"
    mb="$3"
    bg={respuesta.esRespuestaOficial ? '$blue1' : '$gray1'}
    borderLeftWidth={4}
    borderLeftColor={respuesta.esRespuestaOficial ? '$primary' : '$gray6'}
    style={{
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    }}
  >
    <YStack gap="$3">
      {/* Header con autor y fecha */}
      <XStack jc="space-between" ai="flex-start">
        <YStack gap="$1" f={1}>
          <XStack ai="center" gap="$2">
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
      <Text fontSize="$3" color="$textPrimary" lineHeight={20}>
        {respuesta.contenido}
      </Text>

      {/* Evidencias */}
      {respuesta.evidencias.length > 0 && (
        <YStack gap="$2">
          <Text fontSize="$3" fontWeight="600" color="$textPrimary">
            Evidencias adjuntas ({respuesta.evidencias.length})
          </Text>
          {respuesta.evidencias.map((evidencia) => (
            <EvidenciaItem
              key={evidencia.id}
              evidencia={evidencia}
              onPress={onVerEvidencia}
            />
          ))}
        </YStack>
      )}

      {/* Botón marcar como leída */}
      {!respuesta.leida && (
        <Button
          size="$2"
          variant="outlined"
          alignSelf="flex-start"
          onPress={() => onMarcarLeida(respuesta.id)}
        >
          <Ionicons name="checkmark" size={16} />
          <Text ml="$1">Marcar como leída</Text>
        </Button>
      )}
    </YStack>
  </Card>
);

export default function DenunciaDetalleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [denuncia, setDenuncia] = useState<HistorialDenuncia | null>(denunciaPlaceholder);
  const [loading, setLoading] = useState(false);

  const handleMarcarRespuestaComoLeida = (respuestaId: string) => {
    if (!denuncia) return;

    const nuevasDenuncias = {
      ...denuncia,
      respuestas: denuncia.respuestas.map(respuesta =>
        respuesta.id === respuestaId
          ? { ...respuesta, leida: true }
          : respuesta
      )
    };

    setDenuncia(nuevasDenuncias);
    Alert.alert('Éxito', 'Respuesta marcada como leída');
  };

  const handleVerEvidencia = (evidencia: Evidencia) => {
    Alert.alert(
      'Evidencia',
      `Tipo: ${evidencia.tipo}\nNombre: ${evidencia.nombre}\n\n${evidencia.descripcion || 'Sin descripción'}`,
      [{ text: 'OK' }]
    );
  };

  const renderRespuesta = ({ item }: { item: Respuesta }) => (
    <RespuestaItem
      respuesta={item}
      onMarcarLeida={handleMarcarRespuestaComoLeida}
      onVerEvidencia={handleVerEvidencia}
    />
  );

  const renderHeader = () => {
    if (!denuncia) return null;

    return (
      <YStack gap="$4" mb="$4">
        {/* Información principal */}
        <Card
          p="$4"
          bg="white"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <YStack gap="$3">
            {/* Header con folio y estado */}
            <XStack jc="space-between" ai="center">
              <Text fontSize="$5" fontWeight="bold" color="$textPrimary">
                #{denuncia.numeroFolio}
              </Text>
              <Card
                bg={getEstadoColor(denuncia.estado)}
                px="$3"
                py="$2"
                br="$3"
              >
                <Text fontSize="$3" color="white" fontWeight="600">
                  {getEstadoTexto(denuncia.estado)}
                </Text>
              </Card>
            </XStack>

            <H4 color="$textPrimary">{denuncia.titulo}</H4>

            <Text fontSize="$3" color="$textPrimary" lineHeight={20}>
              {denuncia.descripcion}
            </Text>

            <Separator />

            {/* Información adicional */}
            <YStack gap="$2">
              <XStack jc="space-between">
                <Text fontSize="$3" color="$textSecondary">Fecha:</Text>
                <Text fontSize="$3" fontWeight="500">
                  {formatearFecha(denuncia.fechaCreacion)}
                </Text>
              </XStack>

              {denuncia.ubicacion && (
                <XStack jc="space-between" ai="flex-start">
                  <Text fontSize="$3" color="$textSecondary">Ubicación:</Text>
                  <Text
                    fontSize="$3"
                    fontWeight="500"
                    textAlign="right"
                    f={1}
                    ml="$2"
                  >
                    {denuncia.ubicacion.direccion}
                  </Text>
                </XStack>
              )}
            </YStack>
          </YStack>
        </Card>

        {/* Evidencias iniciales */}
        {denuncia.evidenciasIniciales && denuncia.evidenciasIniciales.length > 0 && (
          <Card
            p="$4"
            bg="white"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <YStack gap="$3">
              <H5 color="$textPrimary">Evidencias Adjuntas</H5>
              {denuncia.evidenciasIniciales.map((evidencia) => (
                <EvidenciaItem
                  key={evidencia.id}
                  evidencia={evidencia}
                  onPress={handleVerEvidencia}
                />
              ))}
            </YStack>
          </Card>
        )}

        {/* Header de respuestas */}
        <XStack jc="space-between" ai="center">
          <H5 color="$textPrimary">
            Respuestas ({denuncia.respuestas.length})
          </H5>
        </XStack>
      </YStack>
    );
  };

  const renderEmpty = () => (
    <Card p="$4" bg="$gray1">
      <YStack ai="center" gap="$2">
        <Ionicons name="chatbubble-outline" size={40} color="#CCCCCC" />
        <Text fontSize="$4" color="$textSecondary" textAlign="center">
          Aún no hay respuestas
        </Text>
        <Text fontSize="$3" color="$textSecondary" textAlign="center">
          Te notificaremos cuando recibas una respuesta oficial
        </Text>
      </YStack>
    </Card>
  );

  if (!denuncia) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
        {/* Header con botón de regresar */}
        <XStack
          p="$4"
          ai="center"
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
          <Button
            size="$3"
            variant="outlined"
            onPress={() => router.back()}
            circular
          >
            <Ionicons name="arrow-back" size={20} color="#E67E22" />
          </Button>
          <YStack f={1}>
            <Text fontSize="$5" fontWeight="bold" color="$textPrimary">
              Detalle de Denuncia
            </Text>
            <Text fontSize="$3" color="$textSecondary">
              Cargando información...
            </Text>
          </YStack>
        </XStack>

        <YStack f={1} jc="center" ai="center">
          <Text>Cargando...</Text>
        </YStack>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
      {/* Header con botón de regresar */}
      <XStack
        p="$4"
        ai="center"
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
        <Button
          size="$3"
          variant="outlined"
          onPress={() => router.back()}
          circular
        >
          <Ionicons name="arrow-back" size={20} color="#E67E22" />
        </Button>
        <YStack f={1}>
          <Text fontSize="$5" fontWeight="bold" color="$textPrimary">
            Detalle de Denuncia
          </Text>
          <Text fontSize="$3" color="$textSecondary">
            Folio {denuncia.numeroFolio}
          </Text>
        </YStack>
      </XStack>

      <YStack f={1} p="$4">
        <FlatList
          data={denuncia.respuestas}
          renderItem={renderRespuesta}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmpty}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 20,
            flexGrow: 1
          }}
        />
      </YStack>
    </SafeAreaView>
  );
}