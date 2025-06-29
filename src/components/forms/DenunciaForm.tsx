// src/components/forms/DenunciaForm.tsx
import React, { useState } from 'react';
import { Modal, ScrollView } from 'react-native';
import {
  Text,
  YStack,
  XStack,
  Button,
  Card,
  H4,
  Input,
  TextArea
} from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { DenunciaFormData, LocationData } from '../../types';
import { useApiData } from '../../hooks/useApiData';
import Selector from './Selector';
import MapSelector from './MapSelector';
import UbicacionSection from './UbicacionSection';


interface DenunciaFormProps {
  onSubmit?: (data: DenunciaFormData) => Promise<void>;
  isSubmitting?: boolean;
}

const DenunciaForm: React.FC<DenunciaFormProps> = ({
  onSubmit,
  isSubmitting = false
}) => {
  const [formData, setFormData] = useState<DenunciaFormData>({
    titulo: '',
    descripcion: '',
    categoria: '',
    departamento: '',
    direccion: '',
    ubicacion: undefined,
  });

  const [errors, setErrors] = useState<Partial<DenunciaFormData>>({});
  const [isMapVisible, setIsMapVisible] = useState(false);

  // Hook para datos de API
  const {
    departamentos,
    categorias,
    isLoadingDepartamentos,
    isLoadingCategorias,
    errorDepartamentos,
    errorCategorias
  } = useApiData();

  const validateForm = (): boolean => {
    const newErrors: Partial<DenunciaFormData> = {};

    if (!formData.titulo.trim()) {
      newErrors.titulo = 'El título es obligatorio';
    }
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es obligatoria';
    }
    if (!formData.categoria) {
      newErrors.categoria = 'Selecciona una categoría';
    }
    if (!formData.departamento) {
      newErrors.departamento = 'Selecciona un departamento';
    }
    if (!formData.direccion.trim() && !formData.ubicacion) {
      newErrors.direccion = 'Ingresa una dirección o selecciona ubicación en el mapa';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        // Implementación por defecto
        console.log('Enviando denuncia:', formData);
        alert('¡Denuncia enviada exitosamente!');
      }

      // Limpiar formulario después del envío exitoso
      setFormData({
        titulo: '',
        descripcion: '',
        categoria: '',
        departamento: '',
        direccion: '',
        ubicacion: undefined,
      });
      setErrors({});

    } catch (error) {
      console.error('Error al enviar denuncia:', error);
      alert('Error al enviar la denuncia. Por favor, intenta nuevamente.');
    }
  };

  const updateField = (field: keyof DenunciaFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Limpiar error del campo al escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleLocationSelect = (location: LocationData) => {
    setFormData(prev => ({
      ...prev,
      ubicacion: location,
      direccion: location.address || prev.direccion,
    }));
    setIsMapVisible(false);

    // Limpiar error de dirección si existía
    if (errors.direccion) {
      setErrors(prev => ({ ...prev, direccion: undefined }));
    }
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <YStack gap="$4" p="$4" pb="$6">
        {/* Sección: Información Básica */}
        <Card elevate p="$4" gap="$4">
          <H4 color="$textPrimary">📝 Información Básica</H4>

          <YStack gap="$3">
            <YStack gap="$2">
              <Text fontSize="$4" fontWeight="bold" color="$textPrimary">
                Título *
              </Text>
              <Input
                placeholder="Describe brevemente el problema"
                value={formData.titulo}
                onChangeText={(text) => updateField('titulo', text)}
                bg="white"
                borderColor={errors.titulo ? "$error" : "$textDisabled"}
                focusStyle={{ borderColor: '$primary' }}
              />
              {errors.titulo && (
                <Text fontSize="$3" color="$error">{errors.titulo}</Text>
              )}
            </YStack>

            <YStack gap="$2">
              <Text fontSize="$4" fontWeight="bold" color="$textPrimary">
                Descripción Detallada *
              </Text>
              <TextArea
                placeholder="Explica en detalle lo que está ocurriendo..."
                value={formData.descripcion}
                onChangeText={(text) => updateField('descripcion', text)}
                bg="white"
                borderColor={errors.descripcion ? "$error" : "$textDisabled"}
                focusStyle={{ borderColor: '$primary' }}
                numberOfLines={4}
              />
              {errors.descripcion && (
                <Text fontSize="$3" color="$error">{errors.descripcion}</Text>
              )}
            </YStack>
          </YStack>
        </Card>

        {/* Sección: Categorización */}
        <Card elevate p="$4" gap="$4">
          <H4 color="$textPrimary">🏷️ Categorización</H4>

          <YStack gap="$3">
            <Selector
              title="Departamento"
              placeholder="Selecciona un departamento"
              selectedValue={formData.departamento}
              options={departamentos}
              onSelect={(value) => updateField('departamento', value)}
              isLoading={isLoadingDepartamentos}
              error={errors.departamento || errorDepartamentos}
              color="primary"
            />

            <Selector
              title="Categoría"
              placeholder="Selecciona una categoría"
              selectedValue={formData.categoria}
              options={categorias}
              onSelect={(value) => updateField('categoria', value)}
              isLoading={isLoadingCategorias}
              error={errors.categoria || errorCategorias}
              color="secondary"
            />
          </YStack>
        </Card>

        {/* Sección: Ubicación */}
        <UbicacionSection
          direccion={formData.direccion}
          ubicacion={formData.ubicacion}
          error={errors.direccion}
          onDireccionChange={(value) => updateField('direccion', value)}
          onOpenMap={() => setIsMapVisible(true)}
          onRemoveLocation={() => setFormData(prev => ({ ...prev, ubicacion: undefined }))}
        />

        {/* Sección: Evidencias */}
        <Card elevate p="$4" gap="$4">
          <H4 color="$textPrimary">📷 Evidencias (Opcional)</H4>

          <XStack gap="$3">
            <Button
              f={1}
              size="$4"
              bg="white"
              borderColor="$primary"
              borderWidth={2}
              color="$primary"
              onPress={() => console.log('Abrir cámara')}
            >
              <Ionicons name="camera" size={20} color="#E67E22" />
              <Text color="$primary" ml="$2">Cámara</Text>
            </Button>

            <Button
              f={1}
              size="$4"
              bg="white"
              borderColor="$primary"
              borderWidth={2}
              color="$primary"
              onPress={() => console.log('Abrir galería')}
            >
              <Ionicons name="images" size={20} color="#E67E22" />
              <Text color="$primary" ml="$2">Galería</Text>
            </Button>
          </XStack>
        </Card>

        {/* Botón de envío */}
        <Button
          size="$5"
          bg="$primary"
          color="white"
          fontWeight="bold"
          onPress={handleSubmit}
          disabled={isSubmitting}
          style={{
            shadowColor: '#E67E22',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 6,
            elevation: 8,
          }}
          pressStyle={{
            scale: 0.98,
            shadowOpacity: 0.2,
            elevation: 4,
          }}
        >
          {isSubmitting ? (
            <Text color="white">Enviando...</Text>
          ) : (
            <>
              <Ionicons name="send" size={20} color="white" />
              <Text color="white" fontWeight="bold" ml="$2">
                Enviar Denuncia
              </Text>
            </>
          )}
        </Button>

        {/* Modal del mapa */}
        <Modal
          visible={isMapVisible}
          animationType="slide"
          presentationStyle="fullScreen"
        >
          <MapSelector
            onLocationSelect={handleLocationSelect}
            onClose={() => setIsMapVisible(false)}
            initialLocation={formData.ubicacion}
          />
        </Modal>
      </YStack>
    </ScrollView>
  );
};

export default DenunciaForm;