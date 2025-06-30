// src/components/forms/DenunciaForm.tsx
import React from 'react';
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
import Selector from './Selector';
import MapSelector from './MapSelector';
import UbicacionSection from './UbicacionSection';

interface DenunciaFormProps {
  formData: DenunciaFormData;
  onFormDataChange: (data: DenunciaFormData) => void;
  onSubmit: () => void;
  onTomarFoto?: () => void;
  onUsarUbicacion?: () => void;
  loading?: boolean;
  categorias: any[];
  departamentos: any[];
}

const DenunciaForm: React.FC<DenunciaFormProps> = ({
  formData,
  onFormDataChange,
  onSubmit,
  onTomarFoto,
  onUsarUbicacion,
  loading = false,
  categorias,
  departamentos
}) => {
  const [isMapVisible, setIsMapVisible] = React.useState(false);

  const handleLocationSelect = (location: LocationData) => {
    onFormDataChange({
      ...formData,
      ubicacion: location,
      direccion: location.address || formData.direccion
    });
    setIsMapVisible(false);
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <YStack gap="$4" p="$4" pb="$6">
        {/* Información Básica */}
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
                onChangeText={(text) =>
                  onFormDataChange({ ...formData, titulo: text })
                }
                bg="white"
                borderColor="$textDisabled"
                focusStyle={{ borderColor: '$primary' }}
              />
            </YStack>

            <YStack gap="$2">
              <Text fontSize="$4" fontWeight="bold" color="$textPrimary">
                Descripción Detallada *
              </Text>
              <TextArea
                placeholder="Explica en detalle lo que está ocurriendo..."
                value={formData.descripcion}
                onChangeText={(text) =>
                  onFormDataChange({ ...formData, descripcion: text })
                }
                bg="white"
                borderColor="$textDisabled"
                focusStyle={{ borderColor: '$primary' }}
                numberOfLines={4}
              />
            </YStack>
          </YStack>
        </Card>

        {/* Categorización */}
        <Card elevate p="$4" gap="$4">
          <H4 color="$textPrimary">🏷️ Categorización</H4>
          <YStack gap="$3">
            <Selector
              title="Departamento"
              placeholder="Selecciona un departamento"
              selectedValue={formData.departamento}
              options={departamentos}
              onSelect={(value) =>
                onFormDataChange({ ...formData, departamento: value })
              }
              color="primary"
            />

            <Selector
              title="Categoría"
              placeholder="Selecciona una categoría"
              selectedValue={formData.categoria}
              options={categorias}
              onSelect={(value) =>
                onFormDataChange({ ...formData, categoria: value })
              }
              color="secondary"
            />
          </YStack>
        </Card>

        {/* Ubicación */}
        <UbicacionSection
          direccion={formData.direccion}
          ubicacion={formData.ubicacion}
          onDireccionChange={(value) =>
            onFormDataChange({ ...formData, direccion: value })
          }
          onOpenMap={() => setIsMapVisible(true)}
          onRemoveLocation={() =>
            onFormDataChange({ ...formData, ubicacion: undefined })
          }
        />

        {/* Evidencias */}
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
              onPress={onTomarFoto}
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
              onPress={onTomarFoto}
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
          onPress={onSubmit}
          disabled={loading}
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
          {loading ? (
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
