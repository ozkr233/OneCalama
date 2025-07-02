// src/components/forms/DenunciaForm.tsx - REFACTORIZADO CON EVIDENCIAS
import React, { useState } from 'react';
import { Modal, ScrollView } from 'react-native';
import { Text, YStack, XStack, Button, Card, H4 } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { DenunciaFormData, LocationData } from '../../types';

// Componentes refactorizados
import BasicInfoSection from './BasicInfoSection';
import AIAssistantSection from './AIAssistantSection';
import FormProgressCard from './FormProgressCard';
import SubmitButton from './SubmitButton';
import EvidenceSection from './EvidenceSection';

// Componentes existentes
import Selector from './Selector';
import MapSelector from './MapSelector';
import UbicacionSection from './UbicacionSection';

interface DenunciaFormProps {
  formData: DenunciaFormData;
  onFormDataChange: (data: DenunciaFormData) => void;
  onSubmit: () => void;
  loading?: boolean;
  categorias: any[];
  departamentos: any[];
}

const DenunciaForm: React.FC<DenunciaFormProps> = ({
  formData,
  onFormDataChange,
  onSubmit,
  loading = false,
  categorias,
  departamentos
}) => {
  // Estados locales
  const [isMapVisible, setIsMapVisible] = useState(false);

  // Handlers centralizados
  const handleInputChange = (field: keyof DenunciaFormData, value: any) => {
    onFormDataChange({ ...formData, [field]: value });
  };

  const handleLocationSelect = (location: LocationData) => {
    onFormDataChange({
      ...formData,
      ubicacion: location,
      direccion: location.address || formData.direccion
    });
    setIsMapVisible(false);
  };

  const handleAISuggestion = (suggestions: Partial<DenunciaFormData>) => {
    onFormDataChange({ ...formData, ...suggestions });
  };

  // Validaciones
  const shouldShowAI = formData.titulo.length > 3 || formData.descripcion.length > 3;

  const isFormValid = Boolean(
    formData.titulo?.length >= 10 &&
    formData.descripcion?.length >= 20 &&
    formData.categoria &&
    formData.departamento
  );

  return (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      <YStack gap="$4" p="$4" pb="$6">

        {/* Información Básica */}
        <BasicInfoSection
          formData={formData}
          onChange={handleInputChange}
        />

        {/* Asistente IA (solo si hay texto) */}
        {shouldShowAI && (
          <AIAssistantSection
            formData={formData}
            onApplySuggestion={handleAISuggestion}
            categorias={categorias}
            departamentos={departamentos}
          />
        )}

        {/* Categorización */}
        <Card elevate p="$4" gap="$4">
          <H4 color="$textPrimary">🏷️ Categorización</H4>

          <YStack gap="$3">
            <YStack gap="$2">
              <Text fontSize="$4" fontWeight="bold" color="$textPrimary">
                Departamento Municipal *
              </Text>
              <Selector
                title=""
                placeholder="Selecciona el departamento responsable"
                selectedValue={formData.departamento}
                options={departamentos}
                onSelect={(value) => handleInputChange('departamento', value)}
                color="primary"
              />
              {formData.departamento && (
                <Text fontSize="$3" color="$success">
                  ✅ Departamento seleccionado
                </Text>
              )}
            </YStack>

            <YStack gap="$2">
              <Text fontSize="$4" fontWeight="bold" color="$textPrimary">
                Categoría del Problema *
              </Text>
              <Selector
                title=""
                placeholder="Selecciona la categoría que mejor describe el problema"
                selectedValue={formData.categoria}
                options={categorias}
                onSelect={(value) => handleInputChange('categoria', value)}
                color="secondary"
              />
              {formData.categoria && (
                <Text fontSize="$3" color="$success">
                  ✅ Categoría seleccionada
                </Text>
              )}
            </YStack>
          </YStack>
        </Card>

        {/* Ubicación */}
        <UbicacionSection
          direccion={formData.direccion}
          ubicacion={formData.ubicacion}
          onDireccionChange={(value) => handleInputChange('direccion', value)}
          onOpenMap={() => setIsMapVisible(true)}
          onRemoveLocation={() => onFormDataChange({ ...formData, ubicacion: undefined })}
        />

        {/* Evidencias con funcionalidad completa */}
        <EvidenceSection
          evidences={formData.evidencias || []}
          onEvidencesChange={(evidences) => handleInputChange('evidencias', evidences)}
          maxImages={5}
        />

        {/* Progreso del formulario */}
        <FormProgressCard formData={formData} />

        {/* Botón de envío */}
        <SubmitButton
          isValid={isFormValid}
          loading={loading}
          onSubmit={onSubmit}
        />

        {/* Información adicional */}
        <Card elevate p="$3" gap="$2">
          <XStack ai="center" gap="$2">
            <Ionicons name="information-circle" size={18} color="#667eea" />
            <Text fontSize="$4" fontWeight="bold" color="#667eea">
              Información importante
            </Text>
          </XStack>
          <Text fontSize="$3" color="$textSecondary" lineHeight="$1">
            • Una vez enviada la denuncia, recibirás un código de seguimiento
          </Text>
          <Text fontSize="$3" color="$textSecondary" lineHeight="$1">
            • El asistente IA sugiere la categoría y departamento más apropiados
          </Text>
          <Text fontSize="$3" color="$textSecondary" lineHeight="$1">
            • Las evidencias (fotos) aceleran significativamente el procesamiento
          </Text>
        </Card>

        {/* Modal del Mapa */}
        <Modal
          visible={isMapVisible}
          animationType="slide"
          presentationStyle="fullScreen"
          onRequestClose={() => setIsMapVisible(false)}
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