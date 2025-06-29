import React, { useState, useEffect } from 'react';
import { Text, YStack, XStack, Button, Card, Input, TextArea, H3 } from 'tamagui';
import { SafeAreaView, StatusBar, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Tipo para el formulario
interface DenunciaFormData {
  titulo: string;
  descripcion: string;
  categoria: string;
  departamento: string;
  nombreCalle: string;
  numeroCalle: string;
  evidencias: any[];
}

export default function DenunciasScreen() {
  const [formData, setFormData] = useState<DenunciaFormData>({
    titulo: '',
    descripcion: '',
    categoria: '',
    departamento: '',
    nombreCalle: '',
    numeroCalle: '',
    evidencias: [],
  });

  const [loading, setLoading] = useState(false);

  const updateField = (field: keyof DenunciaFormData, value: any) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const validateForm = (): boolean => {
    if (!formData.titulo.trim()) {
      Alert.alert('Error', 'El título es obligatorio');
      return false;
    }
    if (!formData.descripcion.trim()) {
      Alert.alert('Error', 'La descripción es obligatoria');
      return false;
    }
    if (!formData.nombreCalle.trim() || !formData.numeroCalle.trim()) {
      Alert.alert('Error', 'La dirección es obligatoria');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      console.log('📤 Enviando denuncia:', formData);
      
      // Simulación de envío
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        '✅ Denuncia Enviada', 
        'Tu denuncia ha sido registrada exitosamente. Te notificaremos sobre su progreso.',
        [
          { 
            text: 'OK', 
            onPress: () => {
              // Limpiar formulario después de envío exitoso
              setFormData({
                titulo: '',
                descripcion: '',
                categoria: '',
                departamento: '',
                nombreCalle: '',
                numeroCalle: '',
                evidencias: [],
              });
            }
          }
        ]
      );
      
    } catch (error) {
      console.error('❌ Error enviando denuncia:', error);
      Alert.alert(
        '❌ Error', 
        'No se pudo enviar la denuncia. Intenta nuevamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTomarFoto = () => {
    Alert.alert(
      '📷 Agregar Evidencia',
      'Selecciona una opción',
      [
        { 
          text: 'Cámara', 
          onPress: () => {
            Alert.alert('🚧 En desarrollo', 'La función de cámara estará disponible próximamente');
          }
        },
        { 
          text: 'Galería', 
          onPress: () => {
            Alert.alert('🚧 En desarrollo', 'La función de galería estará disponible próximamente');
          }
        },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  const handleUsarUbicacion = () => {
    Alert.alert('🚧 En desarrollo', 'La función de GPS estará disponible próximamente');
  };

  return (
    <>
      <StatusBar backgroundColor="#1A237E" barStyle="light-content" />
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
        {/* Header */}
        <YStack 
          bg="$municipal" 
          p="$4"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          <XStack ai="center" gap="$3">
            <Ionicons name="document-text" size={28} color="white" />
            <YStack>
              <Text fontSize="$7" fontWeight="bold" color="white">
                Nueva Denuncia
              </Text>
              <Text fontSize="$3" color="rgba(255,255,255,0.9)">
                Reporta problemas en tu comunidad
              </Text>
            </YStack>
          </XStack>
        </YStack>

        {/* Formulario */}
        <ScrollView style={{ flex: 1 }}>
          <YStack p="$4" gap="$4">
            
            {/* Información Básica */}
            <Card 
              bg="white" 
              p="$4" 
              br="$4"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <H3 color="$textPrimary" mb="$3">📝 Información Básica</H3>
              
              <YStack gap="$3">
                <YStack gap="$2">
                  <Text fontWeight="600" color="$textPrimary">Título de la denuncia *</Text>
                  <Input
                    placeholder="Ej: Bache en la calle principal"
                    value={formData.titulo}
                    onChangeText={(text) => updateField('titulo', text)}
                    borderColor="$secondary"
                    focusStyle={{ borderColor: '$primary' }}
                    editable={!loading}
                  />
                </YStack>

                <YStack gap="$2">
                  <Text fontWeight="600" color="$textPrimary">Descripción detallada *</Text>
                  <TextArea
                    placeholder="Describe el problema con el mayor detalle posible..."
                    value={formData.descripcion}
                    onChangeText={(text) => updateField('descripcion', text)}
                    borderColor="$secondary"
                    focusStyle={{ borderColor: '$primary' }}
                    numberOfLines={4}
                    editable={!loading}
                  />
                </YStack>
              </YStack>
            </Card>

            {/* Ubicación */}
            <Card 
              bg="white" 
              p="$4" 
              br="$4"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <H3 color="$textPrimary" mb="$3">📍 Ubicación</H3>
              
              <YStack gap="$3">
                <XStack gap="$3">
                  <YStack f={3} gap="$2">
                    <Text fontWeight="600" color="$textPrimary">Nombre de la calle *</Text>
                    <Input
                      placeholder="Ej: Av. Argentina"
                      value={formData.nombreCalle}
                      onChangeText={(text) => updateField('nombreCalle', text)}
                      borderColor="$secondary"
                      focusStyle={{ borderColor: '$primary' }}
                      editable={!loading}
                    />
                  </YStack>
                  
                  <YStack f={1} gap="$2">
                    <Text fontWeight="600" color="$textPrimary">Número *</Text>
                    <Input
                      placeholder="123"
                      value={formData.numeroCalle}
                      onChangeText={(text) => updateField('numeroCalle', text)}
                      keyboardType="numeric"
                      borderColor="$secondary"
                      focusStyle={{ borderColor: '$primary' }}
                      editable={!loading}
                    />
                  </YStack>
                </XStack>

                <Button
                  variant="outlined"
                  borderColor="$secondary"
                  color="$secondary"
                  onPress={handleUsarUbicacion}
                  disabled={loading}
                >
                  <XStack ai="center" gap="$2">
                    <Ionicons name="location" size={20} color="#009688" />
                    <Text color="$secondary">Usar mi ubicación actual</Text>
                  </XStack>
                </Button>
              </YStack>
            </Card>

            {/* Evidencias */}
            <Card 
              bg="white" 
              p="$4" 
              br="$4"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <H3 color="$textPrimary" mb="$3">📷 Evidencias</H3>
              
              <YStack gap="$3">
                <Text color="$textSecondary">
                  Agrega fotos o videos que ayuden a documentar el problema
                </Text>
                
                <Button
                  variant="outlined"
                  borderColor="$primary"
                  borderStyle="dashed"
                  onPress={handleTomarFoto}
                  h={80}
                  disabled={loading}
                >
                  <YStack ai="center" gap="$2">
                    <Ionicons name="camera" size={24} color="#E67E22" />
                    <Text color="$primary" fontWeight="600">Agregar Foto/Video</Text>
                  </YStack>
                </Button>
              </YStack>
            </Card>

            {/* Botón de Envío */}
            <Card 
              bg="white" 
              p="$4" 
              br="$4"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <Button
                size="$5"
                bg="$primary"
                color="white"
                fontWeight="bold"
                onPress={handleSubmit}
                disabled={loading}
                opacity={loading ? 0.7 : 1}
              >
                <XStack ai="center" gap="$3">
                  <Ionicons name="send" size={20} color="white" />
                  <Text color="white" fontWeight="bold" fontSize="$5">
                    {loading ? 'Enviando...' : 'Enviar Denuncia'}
                  </Text>
                </XStack>
              </Button>
              
              <Text fontSize="$2" color="$textSecondary" textAlign="center" mt="$3">
                * Campos obligatorios
              </Text>
            </Card>
          </YStack>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}