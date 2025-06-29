import React from 'react';
import { Text, YStack, XStack, Button, Card, Input, TextArea, Select, H3 } from 'tamagui';
import { ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface DenunciaFormData {
  titulo: string;
  descripcion: string;
  categoria: string;
  departamento: string;
  nombreCalle: string;
  numeroCalle: string;
  evidencias: any[];
}

interface DenunciaFormProps {
  formData: DenunciaFormData;
  onFormDataChange: (data: DenunciaFormData) => void;
  onSubmit: () => void;
  onTomarFoto: () => void;
  onUsarUbicacion: () => void;
  loading?: boolean;
  categorias?: Array<{ id: number; nombre: string; departamento?: any }>;
  departamentos?: Array<{ id: number; nombre: string }>;
}

export default function DenunciaForm({
  formData,
  onFormDataChange,
  onSubmit,
  onTomarFoto,
  onUsarUbicacion,
  loading = false,
  categorias = [],
  departamentos = []
}: DenunciaFormProps) {

  const updateField = (field: keyof DenunciaFormData, value: any) => {
    onFormDataChange({
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
    if (!formData.categoria) {
      Alert.alert('Error', 'Selecciona una categoría');
      return false;
    }
    if (!formData.nombreCalle.trim() || !formData.numeroCalle.trim()) {
      Alert.alert('Error', 'La dirección es obligatoria');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit();
    }
  };

  return (
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
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 2,
                  elevation: 2,
                }}
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
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 2,
                  elevation: 2,
                }}
              />
            </YStack>
          </YStack>
        </Card>

        {/* Categorización */}
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
          <H3 color="$textPrimary" mb="$3">🏢 Categorización</H3>

          <YStack gap="$3">
            <YStack gap="$2">
              <Text fontWeight="600" color="$textPrimary">Departamento Municipal *</Text>
              {loading ? (
                <Input
                  value="Cargando departamentos..."
                  editable={false}
                  borderColor="$secondary"
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 2,
                    elevation: 2,
                  }}
                />
              ) : (
                <Select
                  value={formData.departamento}
                  onValueChange={(value) => updateField('departamento', value)}
                >
                  <Select.Trigger
                    borderColor="$secondary"
                    style={{
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.1,
                      shadowRadius: 2,
                      elevation: 2,
                    }}
                  >
                    <Select.Value placeholder="Selecciona un departamento" />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.ScrollUpButton />
                    <Select.Viewport>
                      {departamentos.map((dept) => (
                        <Select.Item key={dept.id} index={dept.id} value={dept.id.toString()}>
                          <Select.ItemText>{dept.nombre}</Select.ItemText>
                        </Select.Item>
                      ))}
                    </Select.Viewport>
                    <Select.ScrollDownButton />
                  </Select.Content>
                </Select>
              )}
            </YStack>

            <YStack gap="$2">
              <Text fontWeight="600" color="$textPrimary">Categoría *</Text>
              {loading ? (
                <Input
                  value="Cargando categorías..."
                  editable={false}
                  borderColor="$secondary"
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 2,
                    elevation: 2,
                  }}
                />
              ) : (
                <Select
                  value={formData.categoria}
                  onValueChange={(value) => updateField('categoria', value)}
                >
                  <Select.Trigger
                    borderColor="$secondary"
                    style={{
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.1,
                      shadowRadius: 2,
                      elevation: 2,
                    }}
                  >
                    <Select.Value placeholder="Selecciona una categoría" />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.ScrollUpButton />
                    <Select.Viewport>
                      {categorias.map((cat) => (
                        <Select.Item key={cat.id} index={cat.id} value={cat.id.toString()}>
                          <Select.ItemText>{cat.nombre}</Select.ItemText>
                        </Select.Item>
                      ))}
                    </Select.Viewport>
                    <Select.ScrollDownButton />
                  </Select.Content>
                </Select>
              )}
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
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 2,
                    elevation: 2,
                  }}
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
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 2,
                    elevation: 2,
                  }}
                />
              </YStack>
            </XStack>

            <Button
              variant="outlined"
              borderColor="$secondary"
              color="$secondary"
              onPress={onUsarUbicacion}
              disabled={loading}
              style={{
                shadowColor: '#009688',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 3,
              }}
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

            {/* Mostrar evidencias agregadas */}
            {formData.evidencias.length > 0 && (
              <YStack gap="$2">
                <Text fontWeight="600" color="$textPrimary">
                  Archivos agregados: {formData.evidencias.length}
                </Text>
              </YStack>
            )}

            <Button
              variant="outlined"
              borderColor="$primary"
              borderStyle="dashed"
              onPress={onTomarFoto}
              h={80}
              disabled={loading}
              style={{
                shadowColor: '#E67E22',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 3,
              }}
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
  );
}