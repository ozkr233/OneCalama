// app/(tabs)/historial.tsx - CREADO DESDE CERO CON GLASSMORPHISM
import React, { useState, useEffect } from 'react';
import { SafeAreaView, Alert, FlatList, RefreshControl } from 'react-native';
import { Text, YStack, XStack, H4, H5 } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import AppHeader from '../../src/components/layout/AppHeader';
import GlassCard, { GlassStatsCard } from '../../src/components/ui/GlassCard';
import HistorialCard from '../../src/components/ui/HistorialCard';
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

  // Renderizar item de denuncia usando el nuevo componente
  const renderDenunciaItem = ({ item }: { item: HistorialDenuncia }) => (
    <HistorialCard item={item} onPress={handleVerDetalle} />
  );

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