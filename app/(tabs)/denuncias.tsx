import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import DenunciaForm, { DenunciaFormData } from '../../src/components/forms/DenunciaForm';
import AppHeader from '../../src/components/layout/AppHeader';
import { DenunciasService } from '../../src/services';
import { Alert } from 'react-native';

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
  const [departamentos, setDepartamentos] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);

  // Cargar datos iniciales desde la API
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      console.log('🔄 Cargando datos desde la API...');

      // Cargar departamentos y categorías en paralelo
      const [deptData, catData] = await Promise.all([
        DenunciasService.getDepartamentos(),
        DenunciasService.getCategorias(),
      ]);

      setDepartamentos(deptData);
      setCategorias(catData);

      console.log('✅ Datos cargados:', {
        departamentos: deptData.length,
        categorias: catData.length
      });

    } catch (error) {
      console.error('❌ Error cargando datos iniciales:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos necesarios. Se usarán datos por defecto.');
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      console.log('📤 Enviando publicación:', formData);

      // Llamada real a la API usando el service
      const nuevaPublicacion = await DenunciasService.crearPublicacion(formData);

      console.log('✅ Publicación creada:', nuevaPublicacion);

      Alert.alert(
        '✅ Denuncia Enviada',
        `Tu denuncia ha sido registrada con el código: ${nuevaPublicacion.codigo}. Te notificaremos sobre su progreso.`,
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
      console.error('❌ Error enviando publicación:', error);
      Alert.alert(
        '❌ Error',
        'No se pudo enviar la denuncia. Verifica tu conexión e intenta nuevamente.'
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
            console.log('📸 Abrir cámara');
            Alert.alert('🚧 En desarrollo', 'La función de cámara estará disponible próximamente');
          }
        },
        {
          text: 'Galería',
          onPress: () => {
            console.log('🖼️ Abrir galería');
            Alert.alert('🚧 En desarrollo', 'La función de galería estará disponible próximamente');
          }
        },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  const handleUsarUbicacion = async () => {
    console.log('📍 Obteniendo ubicación GPS');
    Alert.alert(
      '📍 Ubicación GPS',
      '¿Deseas usar tu ubicación actual para completar automáticamente la dirección?',
      [
        {
          text: 'Sí, usar GPS',
          onPress: async () => {
            try {
              console.log('🛰️ Obteniendo coordenadas...');
              Alert.alert('🚧 En desarrollo', 'La función de GPS estará disponible próximamente');
            } catch (error) {
              console.error('Error obteniendo ubicación:', error);
              Alert.alert('Error', 'No se pudo obtener la ubicación');
            }
          }
        },
        { text: 'Cancelar', style: 'cancel' }
      ]
    );
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
        {/* Header unificado - Solo título de pantalla */}
        <AppHeader
          screenTitle="Nueva Denuncia"
          screenSubtitle="Reporta problemas en tu comunidad"
          screenIcon="document-text"
          showAppInfo={false}
        />

        {/* Formulario */}
        <DenunciaForm
          formData={formData}
          onFormDataChange={setFormData}
          onSubmit={handleSubmit}
          onTomarFoto={handleTomarFoto}
          onUsarUbicacion={handleUsarUbicacion}
          loading={loading}
          categorias={categorias}
          departamentos={departamentos}
        />
      </SafeAreaView>
    </>
  );
}