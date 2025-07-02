// app/(tabs)/denuncias.tsx - CORREGIDO CON TU APPHEADER
import React, { useState, useEffect } from 'react';
import { SafeAreaView, Alert } from 'react-native';
import { YStack, Text, H4 } from 'tamagui';
import DenunciaForm from '../../src/components/forms/DenunciaForm';
import { DenunciaFormData, Categoria, Departamento } from '../../src/types/denuncias';
import AppHeader from '../../src/components/layout/AppHeader';
import { DenunciasService } from '../../src/services';
import LoadingSpinner from '../../src/components/ui/Loading';

export default function DenunciasScreen() {
  const [formData, setFormData] = useState<DenunciaFormData>({
    titulo: '',
    descripcion: '',
    categoria: '',
    departamento: '',
    direccion: '',
    ubicacion: undefined,
  });

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setInitialLoading(true);
      setError(null);
      console.log('[API] Cargando datos desde la API...');

      // Usar Promise.allSettled para manejar errores individualmente
      const [deptResult, catResult] = await Promise.allSettled([
        DenunciasService.getDepartamentos(),
        DenunciasService.getCategorias(),
      ]);

      // Procesar departamentos
      if (deptResult.status === 'fulfilled') {
        setDepartamentos(deptResult.value);
        console.log('[API] Departamentos cargados:', deptResult.value.length);
      } else {
        console.error('[API] Error cargando departamentos:', deptResult.reason);
      }

      // Procesar categorías
      if (catResult.status === 'fulfilled') {
        setCategorias(catResult.value);
        console.log('[API] Categorías cargadas:', catResult.value.length);
      } else {
        console.error('[API] Error cargando categorías:', catResult.reason);
      }

      // Si ambos fallaron, mostrar error
      if (deptResult.status === 'rejected' && catResult.status === 'rejected') {
        setError('No se pudieron cargar los datos necesarios');
        Alert.alert(
          'Error de Conexión',
          'No se pudieron cargar los datos necesarios. Verifica tu conexión a internet.',
          [
            { text: 'Reintentar', onPress: loadInitialData },
            { text: 'Continuar', style: 'cancel' }
          ]
        );
      }

    } catch (error) {
      console.error('[API] Error cargando datos iniciales:', error);
      setError('Error de conexión');
      Alert.alert(
        'Error',
        'No se pudieron cargar los datos necesarios. Se usarán datos por defecto.',
        [
          { text: 'Reintentar', onPress: loadInitialData },
          { text: 'OK', style: 'cancel' }
        ]
      );
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (loading) return; // Prevenir doble envío

    // Validación básica
    if (!formData.titulo.trim() || !formData.descripcion.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios.');
      return;
    }

    if (!formData.categoria || !formData.departamento) {
      Alert.alert('Error', 'Por favor selecciona una categoría y departamento.');
      return;
    }

    if (!formData.ubicacion) {
      Alert.alert('Error', 'Por favor proporciona la ubicación de la denuncia.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('[API] Enviando denuncia:', formData);

      const nuevaDenuncia = await DenunciasService.crearPublicacion(formData);

      console.log('[API] Denuncia creada:', nuevaDenuncia);

      Alert.alert(
        'Denuncia Enviada',
        `Tu denuncia ha sido registrada con el código: ${nuevaDenuncia.codigo}. Te notificaremos sobre su progreso.`,
        [
          {
            text: 'Ver Historial',
            onPress: () => {
              // TODO: Navegar al historial
              resetForm();
            }
          },
          {
            text: 'Nueva Denuncia',
            onPress: resetForm,
            style: 'cancel'
          }
        ]
      );

    } catch (error) {
      console.error('[API] Error enviando denuncia:', error);
      setError(error.message || 'Error desconocido');

      let errorMessage = 'No se pudo enviar la denuncia. ';

      if (error.message?.includes('Tiempo de espera')) {
        errorMessage += 'La conexión está tardando mucho. Verifica tu internet.';
      } else if (error.message?.includes('400')) {
        errorMessage += 'Los datos enviados no son válidos. Revisa la información.';
      } else if (error.message?.includes('401')) {
        errorMessage += 'Tu sesión ha expirado. Inicia sesión nuevamente.';
      } else if (error.message?.includes('500')) {
        errorMessage += 'Error del servidor. Intenta más tarde.';
      } else {
        errorMessage += 'Intenta nuevamente.';
      }

      Alert.alert('Error', errorMessage, [
        { text: 'Reintentar', onPress: handleSubmit },
        { text: 'Cancelar', style: 'cancel' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      titulo: '',
      descripcion: '',
      categoria: '',
      departamento: '',
      direccion: '',
      ubicacion: undefined,
    });
    setError(null);
  };

  const handleFormChange = (field: keyof DenunciaFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpiar error cuando el usuario empieza a escribir
    if (error) {
      setError(null);
    }
  };

  if (initialLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
        <AppHeader
          screenTitle="Nueva Denuncia"
          screenSubtitle="Reporta problemas en tu comunidad"
          screenIcon="add-circle-outline"
          showNotifications={false}
        />
        <YStack flex={1} justifyContent="center" alignItems="center" padding="$4">
          <LoadingSpinner />
          <Text marginTop="$3" color="$gray10">
            Cargando datos necesarios...
          </Text>
        </YStack>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <AppHeader
        screenTitle="Nueva Denuncia"
        screenSubtitle="Reporta problemas en tu comunidad"
        screenIcon="add-circle-outline"
        showNotifications={true}
      />

      <YStack flex={1} padding="$4">
        {error && (
          <YStack
            backgroundColor="$red2"
            padding="$3"
            borderRadius="$4"
            marginBottom="$4"
            borderWidth={1}
            borderColor="$red6"
          >
            <Text color="$red10" textAlign="center">
              {error}
            </Text>
          </YStack>
        )}

        <DenunciaForm
          formData={formData}
          onFormChange={handleFormChange}
          onSubmit={handleSubmit}
          loading={loading}
          departamentos={departamentos}
          categorias={categorias}
          disabled={loading}
        />

        {(departamentos.length === 0 || categorias.length === 0) && !initialLoading && (
          <YStack
            backgroundColor="$yellow2"
            padding="$3"
            borderRadius="$4"
            marginTop="$4"
            borderWidth={1}
            borderColor="$yellow6"
          >
            <Text color="$yellow11" textAlign="center" fontSize="$3">
              Algunos datos no se cargaron correctamente.
              La funcionalidad puede estar limitada.
            </Text>
          </YStack>
        )}
      </YStack>
    </SafeAreaView>
  );
}