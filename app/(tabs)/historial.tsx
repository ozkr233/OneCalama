// app/(tabs)/historial.tsx
import React, { useState, useEffect } from 'react';
import { SafeAreaView, Alert, FlatList } from 'react-native';
import { Text, YStack, XStack, Card, H4, Button } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AppHeader from '../../src/components/layout/AppHeader';
import { HistorialDenuncia, EstadisticasHistorial } from '../../src/types/historial';
import { formatearFecha, getEstadoColor, getEstadoTexto } from '../../src/utils/formatters';

// Datos placeholder siguiendo la estructura del proyecto
const denunciasPlaceholder: HistorialDenuncia[] = [
  {
    id: '1',
    numeroFolio: 'CAL-2024-001',
    titulo: 'Luminaria dañada en Av. Brasil',
    descripcion: 'La luminaria ubicada en Av. Brasil esquina con Calle Ramírez está intermitente desde hace una semana.',
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
        contenido: 'Hemos recibido su reporte y ya se asignó a nuestro equipo técnico. Estimamos tener una solución en 3-5 días hábiles.',
        fechaRespuesta: '2024-12-16T09:00:00Z',
        autorRespuesta: 'María González',
        cargoAutor: 'Coordinadora de Alumbrado Público',
        evidencias: [],
        esRespuestaOficial: true,
        leida: true
      },
      {
        id: 'resp2',
        contenido: 'El equipo técnico visitó el lugar y confirmó el problema. Ya se solicitó el reemplazo de la luminaria.',
        fechaRespuesta: '2024-12-20T14:00:00Z',
        autorRespuesta: 'Carlos Pérez',
        cargoAutor: 'Técnico en Electricidad',
        evidencias: [],
        esRespuestaOficial: true,
        leida: false // Nueva respuesta no leída
      }
    ]
  },
  {
    id: '2',
    numeroFolio: 'CAL-2024-002',
    titulo: 'Bache en Calle Granaderos',
    descripcion: 'Existe un bache de gran tamaño en Calle Granaderos que puede causar daños a los vehículos.',
    estado: 'resuelto',
    fechaCreacion: '2024-12-10T15:45:00Z',
    ubicacion: {
      direccion: 'Calle Granaderos 1250, Calama'
    },
    evidenciasIniciales: [],
    respuestas: [
      {
        id: 'resp3',
        contenido: 'Se realizó la reparación del bache utilizando mezcla asfáltica. El trabajo quedó terminado.',
        fechaRespuesta: '2024-12-18T16:30:00Z',
        autorRespuesta: 'Roberto Miranda',
        cargoAutor: 'Supervisor de Obras',
        evidencias: [],
        esRespuestaOficial: true,
        leida: true
      }
    ]
  },
  {
    id: '3',
    numeroFolio: 'CAL-2024-003',
    titulo: 'Ruidos molestos en horario nocturno',
    descripcion: 'Vecinos reportan ruidos excesivos provenientes de local comercial durante la madrugada.',
    estado: 'pendiente',
    fechaCreacion: '2024-12-22T23:15:00Z',
    ubicacion: {
      direccion: 'Av. O\'Higgins 1856, Calama'
    },
    evidenciasIniciales: [],
    respuestas: []
  }
];

const estadisticasPlaceholder: EstadisticasHistorial = {
  totalDenuncias: 3,
  resueltas: 1,
  pendientes: 1,
  enProceso: 1
};

// Componente para cada denuncia
const DenunciaCard = ({
  denuncia,
  onPress
}: {
  denuncia: HistorialDenuncia;
  onPress: (denuncia: HistorialDenuncia) => void;
}) => {
  const tieneRespuestasNoLeidas = denuncia.respuestas.some(respuesta => !respuesta.leida);

  return (
    <Card
      elevate
      p="$4"
      mb="$3"
      bg="white"
      borderWidth={tieneRespuestasNoLeidas ? 2 : 0}
      borderColor={tieneRespuestasNoLeidas ? '#E67E22' : 'transparent'}
      pressStyle={{ scale: 0.98 }}
      onPress={() => onPress(denuncia)}
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
          <XStack ai="center" gap="$2">
            <Text fontSize="$4" fontWeight="bold" color="$textPrimary">
              #{denuncia.numeroFolio}
            </Text>
            {tieneRespuestasNoLeidas && (
              <Card bg="$primary" px="$2" py="$1" br="$2">
                <Text fontSize="$1" color="white" fontWeight="600">
                  Nueva respuesta
                </Text>
              </Card>
            )}
          </XStack>
          <Card
            bg={getEstadoColor(denuncia.estado)}
            px="$2"
            py="$1"
            br="$2"
          >
            <Text fontSize="$2" color="white" fontWeight="600">
              {getEstadoTexto(denuncia.estado)}
            </Text>
          </Card>
        </XStack>

        {/* Título */}
        <Text fontSize="$4" fontWeight="600" color="$textPrimary">
          {denuncia.titulo}
        </Text>

        {/* Descripción */}
        <Text fontSize="$3" color="$textSecondary" numberOfLines={2}>
          {denuncia.descripcion}
        </Text>

        {/* Info adicional */}
        <XStack jc="space-between" ai="center">
          <Text fontSize="$2" color="$textSecondary">
            {formatearFecha(denuncia.fechaCreacion)}
          </Text>
          <XStack ai="center" gap="$4">
            {denuncia.evidenciasIniciales && denuncia.evidenciasIniciales.length > 0 && (
              <XStack ai="center" gap="$1">
                <Ionicons name="attach" size={14} color="#757575" />
                <Text fontSize="$2" color="$textSecondary">
                  {denuncia.evidenciasIniciales.length}
                </Text>
              </XStack>
            )}
            {denuncia.respuestas.length > 0 && (
              <XStack ai="center" gap="$1">
                <Ionicons name="chatbubble" size={14} color="#757575" />
                <Text fontSize="$2" color="$textSecondary">
                  {denuncia.respuestas.length}
                </Text>
              </XStack>
            )}
          </XStack>
        </XStack>

        {/* Ubicación */}
        {denuncia.ubicacion && (
          <XStack ai="center" gap="$1">
            <Ionicons name="location" size={14} color="#757575" />
            <Text fontSize="$2" color="$textSecondary" numberOfLines={1}>
              {denuncia.ubicacion.direccion}
            </Text>
          </XStack>
        )}
      </YStack>
    </Card>
  );
};

export default function HistorialScreen() {
  const router = useRouter();
  const [denuncias, setDenuncias] = useState<HistorialDenuncia[]>(denunciasPlaceholder);
  const [estadisticas, setEstadisticas] = useState<EstadisticasHistorial>(estadisticasPlaceholder);
  const [loading, setLoading] = useState(false);

  // Contar notificaciones no leídas
  const notificacionesNoLeidas = denuncias.reduce((total, denuncia) => {
    const respuestasNoLeidas = denuncia.respuestas.filter(respuesta => !respuesta.leida);
    return total + respuestasNoLeidas.length;
  }, 0);

  const handleVerDetalle = (denuncia: HistorialDenuncia) => {
    // Navegar a la pantalla de detalle
    router.push(`/denuncia/${denuncia.id}`);
  };

  const renderDenuncia = ({ item }: { item: HistorialDenuncia }) => (
    <DenunciaCard denuncia={item} onPress={handleVerDetalle} />
  );

  const renderHeader = () => (
    <YStack gap="$4" mb="$3">
      {/* Estadísticas con notificaciones */}
      <XStack gap="$3" jc="space-around">
        <Card bg="$blue2" p="$3" br="$3" f={1} ai="center">
          <Text fontSize="$6" fontWeight="bold" color="$blue11">
            {estadisticas.totalDenuncias}
          </Text>
          <Text fontSize="$2" color="$textSecondary" textAlign="center">
            Total
          </Text>
        </Card>
        <Card bg="$green2" p="$3" br="$3" f={1} ai="center">
          <Text fontSize="$6" fontWeight="bold" color="$green11">
            {estadisticas.resueltas}
          </Text>
          <Text fontSize="$2" color="$textSecondary" textAlign="center">
            Resueltas
          </Text>
        </Card>
        <Card bg="$orange2" p="$3" br="$3" f={1} ai="center" position="relative">
          <Text fontSize="$6" fontWeight="bold" color="$orange11">
            {estadisticas.pendientes}
          </Text>
          <Text fontSize="$2" color="$textSecondary" textAlign="center">
            Pendientes
          </Text>
          {notificacionesNoLeidas > 0 && (
            <Card
              position="absolute"
              top={-5}
              right={-5}
              bg="$primary"
              w={20}
              h={20}
              br="$10"
              ai="center"
              jc="center"
            >
              <Text fontSize="$1" color="white" fontWeight="bold">
                {notificacionesNoLeidas}
              </Text>
            </Card>
          )}
        </Card>
      </XStack>

      {/* Búsqueda */}
      <Button
        bg="$primary"
        onPress={() => Alert.alert('Búsqueda', 'Función de búsqueda próximamente')}
        style={{
          shadowColor: '#E67E22',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 4,
        }}
      >
        <Ionicons name="search" size={18} color="white" />
        <Text ml="$2" color="white" fontWeight="600">Buscar denuncias</Text>
      </Button>
    </YStack>
  );

  const renderEmpty = () => (
    <YStack ai="center" jc="center" p="$6" gap="$3">
      <Ionicons name="document-text-outline" size={60} color="#CCCCCC" />
      <Text fontSize="$5" fontWeight="600" color="$textSecondary" textAlign="center">
        No hay denuncias
      </Text>
      <Text fontSize="$3" color="$textSecondary" textAlign="center">
        Aún no has realizado ninguna denuncia
      </Text>
    </YStack>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
      {/* Header unificado - Solo título de pantalla */}
      <AppHeader
        screenTitle="Mi Historial"
        screenSubtitle="Seguimiento de denuncias y respuestas"
        screenIcon="time"
        showAppInfo={false}
      />

      <YStack f={1} p="$4">
        <FlatList
          data={denuncias}
          renderItem={renderDenuncia}
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