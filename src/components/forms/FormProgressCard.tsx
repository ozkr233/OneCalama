// src/components/forms/FormProgressCard.tsx - ACTUALIZADO CON EVIDENCIAS
import React from 'react';
import { Text, YStack, XStack, Card } from 'tamagui';
import { DenunciaFormData } from '../../types/denuncias';

interface FormProgressCardProps {
  formData: DenunciaFormData;
}

interface ProgressItem {
  key: string;
  label: string;
  isValid: boolean;
  requirement?: string;
  isOptional?: boolean;
}

const FormProgressCard: React.FC<FormProgressCardProps> = ({ formData }) => {
  // Calcular el estado de cada campo (ACTUALIZADO con evidencias)
  const progressItems: ProgressItem[] = [
    {
      key: 'titulo',
      label: 'Título',
      isValid: formData.titulo.length >= 10,
      requirement: 'mínimo 10 caracteres'
    },
    {
      key: 'descripcion',
      label: 'Descripción',
      isValid: formData.descripcion.length >= 20,
      requirement: 'mínimo 20 caracteres'
    },
    {
      key: 'categoria',
      label: 'Categoría',
      isValid: Boolean(formData.categoria),
      requirement: 'seleccionada'
    },
    {
      key: 'departamento',
      label: 'Departamento',
      isValid: Boolean(formData.departamento),
      requirement: 'seleccionado'
    },
    {
      key: 'evidencias',
      label: 'Evidencias',
      isValid: formData.evidencias && formData.evidencias.length > 0,
      requirement: `${formData.evidencias?.length || 0} foto(s)`,
      isOptional: true
    }
  ];

  // Calcular progreso general (solo campos obligatorios)
  const requiredItems = progressItems.filter(item => !item.isOptional);
  const completedRequiredItems = requiredItems.filter(item => item.isValid).length;
  const totalRequiredItems = requiredItems.length;
  const isFormComplete = completedRequiredItems === totalRequiredItems;
  const progressPercentage = Math.round((completedRequiredItems / totalRequiredItems) * 100);

  // Contar items opcionales completados
  const optionalItems = progressItems.filter(item => item.isOptional);
  const completedOptionalItems = optionalItems.filter(item => item.isValid).length;

  return (
    <Card elevate p="$4" gap="$3">
      {/* Header con progreso general */}
      <XStack jc="space-between" ai="center">
        <Text fontSize="$4" fontWeight="bold" color="$textPrimary">
          Progreso del formulario
        </Text>
        <XStack ai="center" gap="$2">
          <Text fontSize="$4" fontWeight="bold" color={isFormComplete ? "$success" : "$warning"}>
            {progressPercentage}%
          </Text>
          <Text fontSize="$4" fontWeight="bold" color={isFormComplete ? "$success" : "$warning"}>
            {isFormComplete ? '✅ Completo' : '⏳ Incompleto'}
          </Text>
        </XStack>
      </XStack>

      {/* Barra de progreso visual */}
      <YStack gap="$1">
        <YStack
          h={6}
          bg="$gray4"
          borderRadius="$3"
          overflow="hidden"
        >
          <YStack
            h="100%"
            bg={isFormComplete ? "$success" : "$primary"}
            width={`${progressPercentage}%`}
            borderRadius="$3"
            style={{
              transition: 'width 0.3s ease-in-out'
            }}
          />
        </YStack>
        <XStack jc="space-between" ai="center">
          <Text fontSize="$2" color="$textSecondary">
            {completedRequiredItems} de {totalRequiredItems} campos obligatorios
          </Text>
          {completedOptionalItems > 0 && (
            <Text fontSize="$2" color="$blue11">
              +{completedOptionalItems} opcional(es)
            </Text>
          )}
        </XStack>
      </YStack>

      {/* Lista detallada de campos */}
      <YStack gap="$1">
        {progressItems.map((item) => (
          <XStack key={item.key} jc="space-between" ai="center">
            <XStack ai="center" gap="$2">
              <Text fontSize="$3" color={item.isValid ? "$success" : "$textSecondary"}>
                {item.isValid ? '✅' : '⭕'}
              </Text>
              <XStack ai="center" gap="$1">
                <Text fontSize="$3" color={item.isValid ? "$success" : "$textSecondary"}>
                  {item.label}
                </Text>
                {item.isOptional && (
                  <Text fontSize="$2" color="$blue10">
                    (opcional)
                  </Text>
                )}
              </XStack>
            </XStack>
            <Text fontSize="$2" color="$textSecondary">
              ({item.requirement})
            </Text>
          </XStack>
        ))}
      </YStack>

      {/* Mensaje motivacional */}
      {!isFormComplete && (
        <YStack gap="$1" mt="$2" p="$2" bg="$blue2" borderRadius="$3">
          <Text fontSize="$3" color="$blue11" textAlign="center" fontWeight="600">
            💡 Completa todos los campos obligatorios para enviar tu denuncia
          </Text>
          {completedRequiredItems > 0 && (
            <Text fontSize="$2" color="$blue10" textAlign="center">
              ¡Vas muy bien! Solo faltan {totalRequiredItems - completedRequiredItems} campo{totalRequiredItems - completedRequiredItems > 1 ? 's' : ''}
            </Text>
          )}
        </YStack>
      )}

      {/* Mensaje de éxito */}
      {isFormComplete && (
        <YStack gap="$1" mt="$2" p="$2" bg="$green2" borderRadius="$3">
          <Text fontSize="$3" color="$green11" textAlign="center" fontWeight="600">
            🎉 ¡Formulario completo! Ya puedes enviar tu denuncia
          </Text>
          {formData.evidencias && formData.evidencias.length > 0 && (
            <Text fontSize="$2" color="$green10" textAlign="center">
              📷 Excelente! Incluiste {formData.evidencias.length} evidencia(s) que ayudarán a procesar tu denuncia más rápido
            </Text>
          )}
        </YStack>
      )}
    </Card>
  );
};

export default FormProgressCard;