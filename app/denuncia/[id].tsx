// app/denuncia/[id].tsx - PANTALLA DE DETALLE CON COMPONENTE DE ENCUESTA
import React, { useState, useEffect } from 'react';
import { SafeAreaView, Alert, FlatList, ScrollView } from 'react-native';
import { Text, YStack, XStack, Card, H4, H5, Separator, Image } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AppHeader from '../../src/components/layout/AppHeader';
import SatisfactionSurvey from '../../src/components/ui/SatisfactionSurvey';
import { HistorialDenuncia, Respuesta, Evidencia } from '../../src/types/historial';
import { formatearFecha, formatearFechaCompleta, getEstadoColor, getEstadoTexto } from '../../src/utils/formatters';
import { obtenerDenunciaPorId, marcarRespuestasLeidas } from '../../src/data/historialData';
import LoadingSpinner from '../../src/components/ui/Loading';

export default function DenunciaDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [denuncia, setDenuncia] = useState<HistorialDenuncia | null>(null);
  const [loading, setLoading] = useState(true);

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
      setDenuncia(prev => prev ? { ...prev, satisfaccion: rating } : null);

      console.log(`[API] Enviando calificación: ${rating} para denuncia ${id}`);

      // TODO: Aquí iría la llamada a la API
      // await DenunciasService.calificarDenuncia(id, rating);

    } catch (error) {
      console.error('[API] Error enviando calificación:', error);
      // Revertir cambio local si hay error
      setDenuncia(prev => prev ? { ...prev, satisfaccion: undefined } : null);
      Alert.alert('Error', 'No se pudo enviar la calificación. Intenta nuevamente.');
    }
  };

  // Función para manejar comentarios
  const handleCommentPress = () => {
    Alert.alert(
      'Agregar comentario',
      'Esta funcionalidad se implementará próximamente',
      [{ text: 'OK' }]
    );
  };

  const renderEvidencia = (evidencia: Evidencia) => (
    <Card key={evidencia.id} padding="$3" marginRight="$3" width={120}>
      <YStack space="$2">
        {evidencia.tipo === 'imagen' && (
          <Image
            source={{ uri: evidencia.url }}
            width="100%"
            height={80}
            borderRadius="$3"
            backgroundColor="$gray3"
          />
        )}
        <Text fontSize="$1" color="$gray10" numberOfLines={2}>
          {evidencia.descripcion || evidencia.nombre}
        </Text>
      </YStack>
    </Card>
  );

  const renderRespuesta = ({ item }: { item: Respuesta }) => (
    <Card
      marginBottom="$3"
      padding="$4"
      backgroundColor={item.esRespuestaOficial ? "$blue1" : "$gray1"}
      borderLeftWidth={4}
      borderLeftColor={item.esRespuestaOficial ? "$blue8" : "$gray6"}
    >
      <YStack space="$3">
        {/* Header de la respuesta */}
        <XStack justifyContent="space-between" alignItems="flex-start">
          <YStack flex={1} marginRight="$3">
            <XStack alignItems="center" space="$2">
              <Ionicons
                name={item.esRespuestaOficial ? "shield-checkmark" : "person"}
                size={16}
                color={item.esRespuestaOficial ? "#3B82F6" : "#6B7280"}
              />
              <Text fontSize="$3" fontWeight="600" color="$gray12">
                {item.autorRespuesta}
              </Text>
              {!item.leida && (
                <YStack
                  width={8}
                  height={8}
                  borderRadius={4}
                  backgroundColor="$red8"
                />
              )}
            </XStack>
            <Text fontSize="$2" color="$gray10">
              {item.cargoAutor}
            </Text>
            {item.departamento && (
              <Text fontSize="$2" color="$gray9">
                {item.departamento}
              </Text>
            )}
          </YStack>

          <Text fontSize="$2" color="$gray9">
            {formatearFechaCompleta(item.fechaRespuesta)}
          </Text>
        </XStack>

        {/* Contenido de la respuesta */}
        <Text fontSize="$3" color="$gray12" lineHeight="$4">
          {item.contenido}
        </Text>

        {/* Evidencias de la respuesta */}
        {item.evidencias && item.evidencias.length > 0 && (
          <YStack space="$2">
            <Text fontSize="$3" fontWeight="600" color="$gray11">
              Evidencias adjuntas:
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <XStack>
                {item.evidencias.map(renderEvidencia)}
              </XStack>
            </ScrollView>
          </YStack>
        )}
      </YStack>
    </Card>
  );

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <AppHeader
        screenTitle="Detalle"
        screenSubtitle="Cargando..."
        showBack={true}
        showNotifications={false}
      />
        <YStack flex={1} justifyContent="center" alignItems="center">
          <LoadingSpinner />
          <Text marginTop="$3" color="$gray10">
            Cargando detalle...
          </Text>
        </YStack>
      </SafeAreaView>
    );
  }

  if (!denuncia) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
        <AppHeader
          screenTitle="Error"
          screenSubtitle="Denuncia no encontrada"
          showBack={true}
          showNotifications={false}
        />
        <YStack flex={1} justifyContent="center" alignItems="center" padding="$6">
          <Ionicons name="document-text-outline" size={64} color="#9CA3AF" />
          <Text fontSize="$4" color="$gray10" textAlign="center" marginTop="$3">
            No se encontró la denuncia
          </Text>
        </YStack>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <AppHeader
        screenTitle={denuncia.numeroFolio}
        screenSubtitle={getEstadoTexto(denuncia.estado)}
        showBack={true}
        showNotifications={false}
      />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        {/* Información principal */}
        <Card marginBottom="$4" padding="$4" backgroundColor="white">
          <YStack space="$3">
            <XStack justifyContent="space-between" alignItems="flex-start">
              <H4 flex={1} marginRight="$3">{denuncia.titulo}</H4>
              <YStack
                backgroundColor={getEstadoColor(denuncia.estado)}
                paddingHorizontal="$3"
                paddingVertical="$1"
                borderRadius="$3"
              >
                <Text color="white" fontSize="$2" fontWeight="600">
                  {getEstadoTexto(denuncia.estado)}
                </Text>
              </YStack>
            </XStack>

            <Text fontSize="$3" color="$gray11" lineHeight="$4">
              {denuncia.descripcion}
            </Text>

            <Separator />

            {/* Metadatos */}
            <YStack space="$2">
              <XStack justifyContent="space-between">
                <Text fontSize="$2" color="$gray12">{formatearFechaCompleta(denuncia.fechaCreacion)}</Text>
              </XStack>

              {denuncia.fechaActualizacion && (
                <XStack justifyContent="space-between">
                  <Text fontSize="$2" color="$gray10">Actualizada:</Text>
                  <Text fontSize="$2" color="$gray12">{formatearFechaCompleta(denuncia.fechaActualizacion)}</Text>
                </XStack>
              )}

              {denuncia.categoria && (
                <XStack justifyContent="space-between">
                  <Text fontSize="$2" color="$gray10">Categoría:</Text>
                  <Text fontSize="$2" color="$gray12">{denuncia.categoria}</Text>
                </XStack>
              )}

              {denuncia.ubicacion && (
                <XStack justifyContent="space-between">
                  <Text fontSize="$2" color="$gray10">Ubicación:</Text>
                  <Text fontSize="$2" color="$gray12" flex={1} textAlign="right">
                    {denuncia.ubicacion.direccion}
                  </Text>
                </XStack>
              )}

              {denuncia.departamentoAsignado && (
                <XStack justifyContent="space-between">
                  <Text fontSize="$2" color="$gray10">Departamento:</Text>
                  <Text fontSize="$2" color="$gray12">{denuncia.departamentoAsignado}</Text>
                </XStack>
              )}

              {denuncia.funcionarioAsignado && (
                <XStack justifyContent="space-between">
                  <Text fontSize="$2" color="$gray10">Asignado a:</Text>
                  <Text fontSize="$2" color="$gray12">{denuncia.funcionarioAsignado}</Text>
                </XStack>
              )}

              {denuncia.tiempoRespuesta !== undefined && (
                <XStack justifyContent="space-between">
                  <Text fontSize="$2" color="$gray10">Tiempo de respuesta:</Text>
                  <Text fontSize="$2" color="$gray12">
                    {denuncia.tiempoRespuesta < 1
                      ? `${Math.round(denuncia.tiempoRespuesta * 24)} horas`
                      : `${Math.round(denuncia.tiempoRespuesta)} días`
                    }
                  </Text>
                </XStack>
              )}
            </YStack>
          </YStack>
        </Card>

        {/* Evidencias iniciales */}
        {denuncia.evidenciasIniciales && denuncia.evidenciasIniciales.length > 0 && (
          <Card marginBottom="$4" padding="$4" backgroundColor="white">
            <YStack space="$3">
              <H5>Evidencias Iniciales</H5>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <XStack>
                  {denuncia.evidenciasIniciales.map(renderEvidencia)}
                </XStack>
              </ScrollView>
            </YStack>
          </Card>
        )}

        {/* Respuestas */}
        <YStack space="$3">
          <H5>
            Respuestas ({denuncia.respuestas.length})
            {denuncia.respuestas.filter(r => !r.leida).length > 0 && (
              <Text color="$red10"> • {denuncia.respuestas.filter(r => !r.leida).length} nuevas</Text>
            )}
          </H5>

          {denuncia.respuestas.length > 0 ? (
            <FlatList
              data={denuncia.respuestas.sort((a, b) =>
                new Date(a.fechaRespuesta).getTime() - new Date(b.fechaRespuesta).getTime()
              )}
              renderItem={renderRespuesta}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          ) : (
            <Card padding="$4" backgroundColor="$gray2">
              <YStack alignItems="center" space="$2">
                <Ionicons name="chatbubbles-outline" size={32} color="#9CA3AF" />
                <Text fontSize="$3" color="$gray10" textAlign="center">
                  Aún no hay respuestas para esta denuncia
                </Text>
                <Text fontSize="$2" color="$gray9" textAlign="center">
                  Te notificaremos cuando recibas una respuesta oficial
                </Text>
              </YStack>
            </Card>
          )}
        </YStack>

        {/* Encuesta de satisfacción - Para denuncias resueltas o cerradas */}
        {(denuncia.estado === 'resuelto' || denuncia.estado === 'cerrado' || denuncia.estado === 'en_proceso') && (
          <YStack marginTop="$4" marginBottom="$4">
            <SatisfactionSurvey
              currentRating={denuncia.satisfaccion}
              onRatingChange={handleSatisfactionRating}
              title={`¿Cómo calificas ${denuncia.estado === 'resuelto' ? 'la resolución' : 'el servicio hasta ahora'}?`}
              subtitle="Tu opinión nos ayuda a mejorar el servicio"
              showCommentField={true}
              existingComment={denuncia.comentariosSatisfaccion}
              onCommentPress={handleCommentPress}
            />
          </YStack>
        )}

        {/* Espacio adicional al final */}
        <YStack height="$4" />
      </ScrollView>
    </SafeAreaView>
  );
}