// app/denuncia/[id].tsx - ACTUALIZADO CON EVIDENCIAS EN RESPUESTAS
import React, { useState, useEffect } from 'react';
import { SafeAreaView, Alert, FlatList, ScrollView } from 'react-native';
import { Text, YStack, XStack, Card, H4, H5, Separator } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AppHeader from '../../src/components/layout/AppHeader';
import SatisfactionSurvey from '../../src/components/ui/SatisfactionSurvey';
import { RespuestaItem } from '../../src/components/historial/RespuestaItem';
import { EvidenciaViewerModal } from '../../src/components/historial/EvidenciaViewerModal';
import { HistorialDenuncia, Respuesta, Evidencia } from '../../src/types/historial';
import { formatearFecha, formatearFechaCompleta, getEstadoColor, getEstadoTexto } from '../../src/utils/formatters';
import { obtenerDenunciaPorId, marcarRespuestasLeidas } from '../../src/data/historialData';
import LoadingSpinner from '../../src/components/ui/Loading';

export default function DenunciaDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  // Estados principales
  const [denuncia, setDenuncia] = useState<HistorialDenuncia | null>(null);
  const [loading, setLoading] = useState(true);

  // Estados para evidencias
  const [evidenciaVisible, setEvidenciaVisible] = useState(false);
  const [evidenciaSeleccionada, setEvidenciaSeleccionada] = useState<Evidencia | null>(null);

  useEffect(() => {
    if (id) {
      cargarDetalleDenuncia();
    }
  }, [id]);

  const cargarDetalleDenuncia = async () => {
    try {
      setLoading(true);

      // Simular carga de API
      await new Promise(resolve => setTimeout(resolve, 500));

      const denunciaData = obtenerDenunciaPorId(id);
      if (denunciaData) {
        setDenuncia(denunciaData);
        // Marcar respuestas como leídas
        marcarRespuestasLeidas(id);
      } else {
        Alert.alert('Error', 'No se encontró la denuncia');
        router.back();
      }
    } catch (error) {
      console.error('[API] Error cargando detalle:', error);
      Alert.alert('Error', 'No se pudo cargar el detalle de la denuncia');
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar la calificación
  const handleSatisfactionRating = async (rating: number) => {
    try {
      // Actualizar estado local inmediatamente para feedback visual
      setDenuncia(prev => prev ? { ...prev, satisfaccionCiudadano: rating } : null);

      console.log(`[API] Enviando calificación: ${rating} para denuncia ${id}`);

      // TODO: Aquí iría la llamada a la API
      // await HistorialService.calificarSatisfaccion(id, rating);

      Alert.alert('¡Gracias!', 'Tu calificación ha sido registrada.');
    } catch (error) {
      console.error('[API] Error enviando calificación:', error);
      // Revertir cambio local si hay error
      setDenuncia(prev => prev ? { ...prev, satisfaccionCiudadano: undefined } : null);
      Alert.alert('Error', 'No se pudo enviar la calificación. Intenta nuevamente.');
    }
  };

  // Manejar visualización de evidencias
  const handleVerEvidencia = (evidencia: Evidencia) => {
    setEvidenciaSeleccionada(evidencia);
    setEvidenciaVisible(true);
  };

  // Manejar marcar respuesta como leída
  const handleMarcarRespuestaLeida = async (respuestaId: string) => {
    try {
      // Actualizar estado local
      setDenuncia(prev => {
        if (!prev) return null;

        const respuestasActualizadas = prev.respuestas.map(resp =>
          resp.id === respuestaId ? { ...resp, leida: true } : resp
        );

        return { ...prev, respuestas: respuestasActualizadas };
      });

      // TODO: Llamada a la API
      // await HistorialService.marcarRespuestaComoLeida(respuestaId);

    } catch (error) {
      console.error('Error marcando respuesta como leída:', error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
        <AppHeader
          screenTitle="Cargando..."
          screenSubtitle=""
          screenIcon="document-text"
          showBackButton={true}
          onBackPress={() => router.back()}
        />
        <YStack flex={1} justifyContent="center" alignItems="center">
          <LoadingSpinner />
          <Text mt="$4" color="$textSecondary">
            Cargando detalles de la denuncia...
          </Text>
        </YStack>
      </SafeAreaView>
    );
  }

  if (!denuncia) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
        <AppHeader
          screenTitle="Error"
          screenSubtitle=""
          screenIcon="alert-circle"
          showBackButton={true}
          onBackPress={() => router.back()}
        />
        <YStack flex={1} justifyContent="center" alignItems="center" p="$4">
          <Ionicons name="document-text" size={64} color="#ccc" />
          <Text fontSize="$5" fontWeight="bold" color="$textPrimary" mt="$4">
            Denuncia no encontrada
          </Text>
          <Text fontSize="$3" color="$textSecondary" textAlign="center" mt="$2">
            No se pudo cargar la información de esta denuncia
          </Text>
        </YStack>
      </SafeAreaView>
    );
  }

  const respuestasNoLeidas = denuncia.respuestas.filter(r => !r.leida).length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
      <AppHeader
        screenTitle={`${denuncia.numeroFolio}`}
        screenSubtitle={getEstadoTexto(denuncia.estado)}
        screenIcon="document-text"
        showBackButton={true}
        onBackPress={() => router.back()}
        showNotifications={respuestasNoLeidas > 0}
        notificationCount={respuestasNoLeidas}
      />

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <YStack gap="$4" p="$4">

          {/* Información principal */}
          <Card elevate p="$4" gap="$3">
            <XStack justifyContent="space-between" alignItems="flex-start">
              <YStack flex={1} gap="$2">
                <H4 color="$textPrimary">{denuncia.titulo}</H4>
                <Text fontSize="$3" color="$textSecondary" lineHeight="$4">
                  {denuncia.descripcion}
                </Text>
              </YStack>
              <Card
                bg={getEstadoColor(denuncia.estado)}
                px="$3"
                py="$1"
                br="$3"
                ml="$3"
              >
                <Text color="white" fontSize="$2" fontWeight="bold">
                  {getEstadoTexto(denuncia.estado).toUpperCase()}
                </Text>
              </Card>
            </XStack>

            <Separator />

            {/* Metadatos */}
            <YStack gap="$2">
              <XStack alignItems="center" gap="$2">
                <Ionicons name="calendar" size={16} color="#667eea" />
                <Text fontSize="$3" color="$textSecondary">
                  Creada: {formatearFecha(denuncia.fechaCreacion)}
                </Text>
              </XStack>

              {denuncia.categoria && (
                <XStack alignItems="center" gap="$2">
                  <Ionicons name="pricetag" size={16} color="#667eea" />
                  <Text fontSize="$3" color="$textSecondary">
                    Categoría: {denuncia.categoria}
                  </Text>
                </XStack>
              )}

              {denuncia.ubicacion && (
                <XStack alignItems="center" gap="$2">
                  <Ionicons name="location" size={16} color="#667eea" />
                  <Text fontSize="$3" color="$textSecondary">
                    {denuncia.ubicacion.direccion}
                  </Text>
                </XStack>
              )}

              {denuncia.departamentoAsignado && (
                <XStack alignItems="center" gap="$2">
                  <Ionicons name="business" size={16} color="#667eea" />
                  <Text fontSize="$3" color="$textSecondary">
                    {denuncia.departamentoAsignado}
                  </Text>
                </XStack>
              )}
            </YStack>
          </Card>

          {/* Evidencias iniciales */}
          {denuncia.evidenciasIniciales && denuncia.evidenciasIniciales.length > 0 && (
            <Card elevate p="$4" gap="$3">
              <H5 color="$textPrimary">📎 Evidencias iniciales</H5>
              <YStack gap="$2">
                {denuncia.evidenciasIniciales.map((evidencia) => (
                  <XStack
                    key={evidencia.id}
                    alignItems="center"
                    gap="$3"
                    p="$2"
                    bg="$gray1"
                    br="$3"
                    pressStyle={{ bg: "$gray2" }}
                    onPress={() => handleVerEvidencia(evidencia)}
                  >
                    <Ionicons name="image" size={20} color="#667eea" />
                    <Text flex={1} fontSize="$3" color="$textPrimary">
                      {evidencia.nombre}
                    </Text>
                    <Ionicons name="eye" size={16} color="#999" />
                  </XStack>
                ))}
              </YStack>
            </Card>
          )}

          {/* Respuestas */}
          <Card elevate p="$4" gap="$3">
            <XStack justifyContent="space-between" alignItems="center">
              <H5 color="$textPrimary">💬 Respuestas ({denuncia.respuestas.length})</H5>
              {respuestasNoLeidas > 0 && (
                <Card bg="$red10" px="$2" py="$1" br="$2">
                  <Text color="white" fontSize="$1" fontWeight="bold">
                    {respuestasNoLeidas} NUEVA{respuestasNoLeidas > 1 ? 'S' : ''}
                  </Text>
                </Card>
              )}
            </XStack>

            {denuncia.respuestas.length === 0 ? (
              <YStack alignItems="center" py="$6" gap="$2">
                <Ionicons name="chatbubble-outline" size={48} color="#ccc" />
                <Text fontSize="$4" color="$textSecondary" textAlign="center">
                  Aún no hay respuestas
                </Text>
                <Text fontSize="$3" color="$textSecondary" textAlign="center">
                  Te notificaremos cuando recibas una respuesta oficial
                </Text>
              </YStack>
            ) : (
              <YStack gap="$3">
                {denuncia.respuestas.map((respuesta) => (
                  <RespuestaItem
                    key={respuesta.id}
                    respuesta={respuesta}
                    onMarcarComoLeida={handleMarcarRespuestaLeida}
                    onVerEvidencia={handleVerEvidencia}
                  />
                ))}
              </YStack>
            )}
          </Card>

          {/* Encuesta de satisfacción */}
          {denuncia.estado === 'resuelto' && (
            <SatisfactionSurvey
              denunciaId={denuncia.id}
              currentRating={denuncia.satisfaccionCiudadano}
              onRatingChange={handleSatisfactionRating}
            />
          )}
        </YStack>
      </ScrollView>

      {/* Modal de visualización de evidencias */}
      <EvidenciaViewerModal
        visible={evidenciaVisible}
        evidencia={evidenciaSeleccionada}
        onClose={() => {
          setEvidenciaVisible(false);
          setEvidenciaSeleccionada(null);
        }}
      />
    </SafeAreaView>
  );
}