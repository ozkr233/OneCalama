// app/(tabs)/denuncias.tsx - ACTUALIZADO CON EVIDENCIAS
import React, { useState, useEffect } from 'react';
import { SafeAreaView, Alert } from 'react-native';
import DenunciaForm from '../../src/components/forms/DenunciaForm';
import { DenunciaFormData } from '../../src/types/denuncias';
import AppHeader from '../../src/components/layout/AppHeader';
import { DenunciasService } from '../../src/services';

export default function DenunciasScreen() {
  // ACTUALIZADO: Estado inicial con evidencias
  const [formData, setFormData] = useState<DenunciaFormData>({
    titulo: '',
    descripcion: '',
    categoria: '',
    departamento: '',
    direccion: '',
    ubicacion: undefined,
    evidencias: [], // ← NUEVO: Array de evidencias vacío
  });

  const [loading, setLoading] = useState(false);
  const [departamentos, setDepartamentos] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      console.log('🔄 Cargando datos desde la API...');
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
      console.log('📷 Evidencias a enviar:', formData.evidencias.length);

      const nuevaPublicacion = await DenunciasService.crearPublicacion(formData);

      console.log('✅ Publicación creada:', nuevaPublicacion);

      Alert.alert(
        '✅ Denuncia Enviada',
        `Tu denuncia ha sido registrada con el código: ${nuevaPublicacion.codigo}. ${formData.evidencias.length > 0 ?
          `Se subieron ${formData.evidencias.length} evidencia(s).` : ''} Te notificaremos sobre su progreso.`,
        [
          {
            text: 'OK',
            onPress: () => {
              // ACTUALIZADO: Reset completo del formulario incluyendo evidencias
              setFormData({
                titulo: '',
                descripcion: '',
                categoria: '',
                departamento: '',
                direccion: '',
                ubicacion: undefined,
                evidencias: [], // ← IMPORTANTE: Limpiar evidencias
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

  // ELIMINADO: handleTomarFoto (ya no se necesita, lo maneja EvidenceSection)
  // ELIMINADO: handleUsarUbicacion (lo maneja UbicacionSection)

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
      <AppHeader
        screenTitle="Nueva Denuncia"
        screenSubtitle="Reporta problemas en tu comunidad"
        screenIcon="document-text"
        showAppInfo={false}
      />
      <DenunciaForm
        formData={formData}
        onFormDataChange={setFormData}
        onSubmit={handleSubmit}
        loading={loading}
        categorias={categorias}
        departamentos={departamentos}
      />
    </SafeAreaView>
  );
}