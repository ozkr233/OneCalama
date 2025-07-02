// app/(tabs)/historial.tsx - CREADO DESDE CERO CON GLASSMORPHISM
import React, { useState, useEffect } from 'react';
import { SafeAreaView, Alert, FlatList, RefreshControl } from 'react-native';
import { Text, YStack, XStack, H4, H5 } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import AppHeader from '../../src/components/layout/AppHeader';
import GlassCard, { GlassStatsCard } from '../../src/components/ui/GlassCard';
import LoadingSpinner from '../../src/components/ui/Loading';
import { HistorialDenuncia, EstadisticasHistorial } from '../../src/types/historial';
import { formatearFecha, getEstadoColor, getEstadoTexto } from '../../src/utils/formatters';
import {
  denunciasPlaceholder,
  estadisticasPlaceholder,
  obtenerDenunciasFiltradas
} from '../../src/data/historialData';

export default function HistorialScreen() {
  const router = useRouter();

  // Estados principales
  const [denuncias, setDenuncias] = useState<HistorialDenuncia[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasHistorial | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarDatos();
  }, []);

  // Función para cargar datos (simula API)
  const cargarDatos = async (isRefresh: boolean = false) => {
    try {
      if (!isRefresh) setLoading(true);
      setError(null);

      // Simular carga de API
      await new Promise(resolve => setTimeout(resolve, 800));

      // Cargar datos placeholder
      setDenuncias(denunciasPlaceholder);
      setEstadisticas(estadisticasPlaceholder);

      console.log('[HISTORIAL] Datos cargados exitosamente');
    } catch (error) {
      console.error('[HISTORIAL] Error cargando datos:', error);
      setError('No se pudieron cargar las denuncias');
      Alert.alert('Error', 'No se pudieron cargar las denuncias. Intenta nuevamente.');
    } finally {
      setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  };

  // Manejar refresh
  const onRefresh = () => {
    setRefreshing(true);
    cargarDatos(true);
  };

  // Navegar al detalle de denuncia
  const handleVerDetalle = (denuncia: HistorialDenuncia) => {
    console.log('[HISTORIAL] Navegando a detalle:', denuncia.id);
    router.push(`/denuncia/${denuncia.id}`);
  };

  // Calcular notificaciones no leídas
  const getNotificacionesNoLeidas = (): number => {
    return denuncias.reduce((total, denuncia) => {
      return total + denuncia.respuestas.filter(resp => !resp.leida).length;
    }, 0);
  };

  // Renderizar estadísticas con glassmorphism
  const renderEstadisticas = () => {
    if (!estadisticas) return null;

    return (
      <GlassCard variant="primary" intensity="strong" style={{ marginBottom: 20, marginHorizontal: 16 }}>
        <YStack padding="$5" space="$4">
          {/* Header de estadísticas */}
          <YStack alignItems="center" space="$2">
            <H4 textAlign="center" color="white" fontWeight="800" fontSize="$6">
              ✨ Mi Historial
            </H4>
            <Text fontSize="$3" color="rgba(255,255,255,0.95)" textAlign="center" fontWeight="600">
              Seguimiento de denuncias y respuestas
            </Text>
          </YStack>

          {/* Contenedores de estadísticas */}
          <XStack justifyContent="space-around" paddingTop="$3">
            {/* Total */}
            <YStack alignItems="center" space="$2">
              <YStack
                backgroundColor="rgba(255,255,255,0.9)"
                borderRadius="$5"
                padding="$4"
                borderWidth={2}
                borderColor="rgba(255,255,255,1)"
                shadowColor="rgba(255,255,255,0.5)"
                shadowRadius={12}
                elevation={6}
                minWidth={70}
                alignItems="center"
              >
                <Text fontSize="$8" fontWeight="900" color="#1A237E" textAlign="center">
                  {estadisticas.totalDenuncias}
                </Text>
              </YStack>
              <Text fontSize="$2" color="white" fontWeight="800">
                Total
              </Text>
            </YStack>

            {/* Resueltas */}
            <YStack alignItems="center" space="$2">
              <YStack
                backgroundColor="rgba(34, 197, 94, 0.9)"
                borderRadius="$5"
                padding="$4"
                borderWidth={2}
                borderColor="rgba(34, 197, 94, 1)"
                shadowColor="rgba(34, 197, 94, 0.6)"
                shadowRadius={12}
                elevation={6}
                minWidth={70}
                alignItems="center"
              >
                <Text fontSize="$8" fontWeight="900" color="white" textAlign="center">
                  {estadisticas.resueltas}
                </Text>
              </YStack>
              <Text fontSize="$2" color="white" fontWeight="800">
                Resueltas
              </Text>
            </YStack>

            {/* Pendientes */}
            <YStack alignItems="center" space="$2">
              <YStack
                backgroundColor="rgba(156, 163, 175, 0.9)"
                borderRadius="$5"
                padding="$4"
                borderWidth={2}
                borderColor="rgba(156, 163, 175, 1)"
                shadowColor="rgba(156, 163, 175, 0.6)"
                shadowRadius={12}
                elevation={6}
                minWidth={70}
                alignItems="center"
              >
                <Text fontSize="$8" fontWeight="900" color="white" textAlign="center">
                  {estadisticas.pendientes}
                </Text>
              </YStack>
              <Text fontSize="$2" color="white" fontWeight="800">
                Pendientes
              </Text>
            </YStack>
          </XStack>

          {/* Indicador de progreso */}
          <YStack space="$2" marginTop="$3">
            <XStack justifyContent="space-between" alignItems="center">
              <Text fontSize="$3" color="white" fontWeight="700">
                Progreso de resolución
              </Text>
              <Text fontSize="$4" color="white" fontWeight="900">
                {Math.round((estadisticas.resueltas / estadisticas.totalDenuncias) * 100)}%
              </Text>
            </XStack>
            <YStack
              height={8}
              backgroundColor="rgba(255,255,255,0.3)"
              borderRadius="$3"
              overflow="hidden"
            >
              <YStack
                height="100%"
                backgroundColor="rgba(34, 197, 94, 1)"
                width={`${(estadisticas.resueltas / estadisticas.totalDenuncias) * 100}%`}
                borderRadius="$3"
                shadowColor="rgba(34, 197, 94, 0.5)"
                shadowRadius={4}
              />
            </YStack>
          </YStack>
        </YStack>
      </GlassCard>
    );
  };

  // Renderizar item de denuncia
  const renderDenunciaItem = ({ item }: { item: HistorialDenuncia }) => {
    const respuestasNoLeidas = item.respuestas.filter(resp => !resp.leida).length;
    const ultimaRespuesta = item.respuestas[item.respuestas.length - 1];
    const estadoColor = getEstadoColor(item.estado);

    // Función para obtener colores dinámicos según estado
    const getEstadoColors = (estado: string) => {
      switch (estado) {
        case 'resuelto':
          return {
            main: 'rgba(34, 197, 94, 0.8)',
            border: 'rgba(34, 197, 94, 1)',
            shadow: 'rgba(34, 197, 94, 0.4)'
          };
        case 'en_proceso':
          return {
            main: 'rgba(245, 158, 11, 0.8)',
            border: 'rgba(245, 158, 11, 1)',
            shadow: 'rgba(245, 158, 11, 0.4)'
          };
        case 'pendiente':
          return {
            main: 'rgba(107, 114, 128, 0.8)',
            border: 'rgba(107, 114, 128, 1)',
            shadow: 'rgba(107, 114, 128, 0.4)'
          };
        case 'rechazado':
          return {
            main: 'rgba(239, 68, 68, 0.8)',
            border: 'rgba(239, 68, 68, 1)',
            shadow: 'rgba(239, 68, 68, 0.4)'
          };
        default:
          return {
            main: 'rgba(59, 130, 246, 0.8)',
            border: 'rgba(59, 130, 246, 1)',
            shadow: 'rgba(59, 130, 246, 0.4)'
          };
      }
    };

    const estadoColors = getEstadoColors(item.estado);

    return (
      <GlassCard
        variant="default"
        intensity="medium"
        animated
        style={{ marginBottom: 16, marginHorizontal: 16 }}
        onPress={() => handleVerDetalle(item)}
      >
        <YStack overflow="hidden" borderRadius="$4">
          {/* Header con gradiente del estado usando LinearGradient */}
          <LinearGradient
            colors={[estadoColor, estadoColor + 'CC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 16,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
            }}
          >
            <XStack justifyContent="space-between" alignItems="center">
              <XStack alignItems="center" space="$3" flex={1}>
                <Text fontSize="$4" color="white" fontWeight="800">
                  {item.numeroFolio}
                </Text>
                {respuestasNoLeidas > 0 && (
                  <YStack
                    backgroundColor="rgba(255,255,255,0.95)"
                    paddingHorizontal="$3"
                    paddingVertical="$2"
                    borderRadius="$4"
                    borderWidth={1}
                    borderColor="rgba(255,255,255,0.6)"
                    shadowColor="rgba(0,0,0,0.3)"
                    shadowRadius={6}
                    elevation={4}
                  >
                    <XStack alignItems="center" space="$1">
                      <Text fontSize="$3">🔔</Text>
                      <Text
                        color={estadoColor}
                        fontSize="$2"
                        fontWeight="800"
                      >
                        Nueva respuesta
                      </Text>
                    </XStack>
                  </YStack>
                )}
              </XStack>

              <YStack
                backgroundColor="rgba(255,255,255,0.25)"
                paddingHorizontal="$4"
                paddingVertical="$2"
                borderRadius="$4"
                borderWidth={1}
                borderColor="rgba(255,255,255,0.4)"
                alignItems="center"
              >
                <Text color="white" fontSize="$3" fontWeight="800">
                  {getEstadoTexto(item.estado)}
                </Text>
              </YStack>
            </XStack>
          </LinearGradient>

          {/* Contenido principal */}
          <YStack padding="$4" space="$4">
            {/* Título */}
            <H5 fontSize="$5" numberOfLines={2} color="$gray12" fontWeight="800" lineHeight="$5">
              {item.titulo}
            </H5>

            {/* Descripción */}
            <Text
              fontSize="$3"
              color="$gray11"
              numberOfLines={3}
              lineHeight="$5"
              opacity={0.9}
            >
              {item.descripcion}
            </Text>

            {/* Metadatos con colores dinámicos según estado */}
            <YStack space="$3">
              {/* Fecha y respuestas con color del estado */}
              <XStack justifyContent="space-between" alignItems="center">
                <YStack
                  backgroundColor={estadoColors.main}
                  paddingHorizontal="$3"
                  paddingVertical="$2"
                  borderRadius="$3"
                  borderWidth={1}
                  borderColor={estadoColors.border}
                  shadowColor={estadoColors.shadow}
                  shadowRadius={4}
                  elevation={3}
                >
                  <XStack alignItems="center" space="$2">
                    <Ionicons name="calendar-outline" size={14} color="white" />
                    <Text fontSize="$2" color="white" fontWeight="800">
                      {formatearFecha(item.fechaCreacion)}
                    </Text>
                  </XStack>
                </YStack>

                {ultimaRespuesta && (
                  <YStack
                    backgroundColor={respuestasNoLeidas > 0 ? "rgba(220, 38, 38, 0.8)" : estadoColors.main}
                    paddingHorizontal="$3"
                    paddingVertical="$2"
                    borderRadius="$3"
                    borderWidth={1}
                    borderColor={respuestasNoLeidas > 0 ? "rgba(220, 38, 38, 1)" : estadoColors.border}
                    shadowColor={respuestasNoLeidas > 0 ? "rgba(220, 38, 38, 0.4)" : estadoColors.shadow}
                    shadowRadius={4}
                    elevation={3}
                  >
                    <XStack alignItems="center" space="$2">
                      <Ionicons
                        name={respuestasNoLeidas > 0 ? "mail" : "mail-open-outline"}
                        size={14}
                        color="white"
                      />
                      <Text
                        fontSize="$2"
                        color="white"
                        fontWeight="800"
                      >
                        {item.respuestas.length} respuesta{item.respuestas.length !== 1 ? 's' : ''}
                      </Text>
                    </XStack>
                  </YStack>
                )}
              </XStack>

              {/* Ubicación con color del estado */}
              {item.ubicacion && (
                <YStack
                  backgroundColor={estadoColors.main}
                  padding="$3"
                  borderRadius="$3"
                  borderWidth={1}
                  borderColor={estadoColors.border}
                  shadowColor={estadoColors.shadow}
                  shadowRadius={4}
                  elevation={3}
                >
                  <XStack alignItems="center" space="$2">
                    <Ionicons name="location-outline" size={16} color="white" />
                    <Text fontSize="$3" color="white" numberOfLines={2} flex={1} fontWeight="700">
                      {item.ubicacion.direccion}
                    </Text>
                  </XStack>
                </YStack>
              )}
            </YStack>
          </YStack>
        </YStack>
      </GlassCard>
    );
  };

  // Renderizar estado vacío
  const renderEmpty = () => (
    <YStack flex={1} justifyContent="center" alignItems="center" padding="$8">
      <GlassCard variant="default" intensity="light">
        <YStack padding="$6" alignItems="center" space="$4">
          <Text fontSize="$9">📝</Text>
          <Text fontSize="$5" color="$gray10" textAlign="center" fontWeight="600">
            No tienes denuncias registradas
          </Text>
          <Text fontSize="$3" color="$gray9" textAlign="center" lineHeight="$4">
            Cuando envíes tu primera denuncia aparecerá aquí para que puedas seguir su progreso
          </Text>
        </YStack>
      </GlassCard>
    </YStack>
  );

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
        <AppHeader
          screenTitle="Historial"
          screenSubtitle="Cargando..."
          screenIcon="time-outline"
          showNotifications={false}
        />
        <YStack flex={1} justifyContent="center" alignItems="center">
          <LoadingSpinner />
          <Text marginTop="$4" color="$gray10" fontSize="$4">
            Cargando historial...
          </Text>
        </YStack>
      </SafeAreaView>
    );
  }

  // Render principal
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f1f5f9' }}>
      <AppHeader
        screenTitle="Historial"
        screenSubtitle={`${denuncias.length} denuncias registradas`}
        screenIcon="time-outline"
        showNotifications={true}
      />

      <YStack flex={1}>
        {/* Mensaje de error */}
        {error && (
          <GlassCard
            variant="danger"
            intensity="medium"
            style={{ marginHorizontal: 16, marginBottom: 16 }}
          >
            <YStack padding="$3">
              <Text color="white" textAlign="center" fontWeight="600">
                {error}
              </Text>
            </YStack>
          </GlassCard>
        )}

        {/* Lista principal */}
        <FlatList
          data={denuncias}
          renderItem={renderDenunciaItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderEstadisticas}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#3B82F6']}
              tintColor="#3B82F6"
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 24,
            paddingTop: 8
          }}
        />
      </YStack>
    </SafeAreaView>
  );
}