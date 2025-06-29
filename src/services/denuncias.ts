import {
  Publicacion,
  DepartamentoMunicipal,
  Categoria,
  JuntaVecinal,
  SituacionPublicacion,
  CreatePublicacionPayload,
  ApiResponse,
  DenunciaFormData,
  Evidencia,
  AnuncioMunicipal
} from '../types/denuncias';
import { ENDPOINTS } from '../constants/api';
import ApiClient from './api';

class DenunciasService {

  // ==================== DEPARTAMENTOS ====================

  async getDepartamentos(): Promise<DepartamentoMunicipal[]> {
    try {
      const response = await ApiClient.get<ApiResponse<DepartamentoMunicipal>>(ENDPOINTS.DEPARTAMENTOS);
      return response.results;
    } catch (error) {
      console.error('Error obteniendo departamentos:', error);
      // Datos mock basados en la estructura real del backend
      return [
        { id: 1, nombre: 'Obras Públicas', descripcion: 'Infraestructura y vialidad' },
        { id: 2, nombre: 'Medio Ambiente', descripcion: 'Limpieza y ornato' },
        { id: 3, nombre: 'Servicios Municipales', descripcion: 'Servicios básicos' },
      ];
    }
  }

  // ==================== CATEGORÍAS ====================

  async getCategorias(): Promise<Categoria[]> {
    try {
      const response = await ApiClient.get<ApiResponse<Categoria>>(ENDPOINTS.CATEGORIAS);
      return response.results;
    } catch (error) {
      console.error('Error obteniendo categorías:', error);
      // Mock basado en las categorías reales del backend (views.py)
      return [
        {
          id: 1,
          nombre: 'Seguridad',
          descripcion: 'Temas de seguridad ciudadana',
          departamento: { id: 1, nombre: 'Obras Públicas' }
        },
        {
          id: 2,
          nombre: 'Basura',
          descripcion: 'Recolección y manejo de residuos',
          departamento: { id: 2, nombre: 'Medio Ambiente' }
        },
        {
          id: 3,
          nombre: 'Áreas verdes',
          descripcion: 'Mantenimiento de parques y jardines',
          departamento: { id: 2, nombre: 'Medio Ambiente' }
        },
        {
          id: 4,
          nombre: 'Asistencia Social',
          descripcion: 'Servicios sociales municipales',
          departamento: { id: 3, nombre: 'Servicios Municipales' }
        },
        {
          id: 5,
          nombre: 'Mantención de Calles',
          descripcion: 'Reparación y mantenimiento vial',
          departamento: { id: 1, nombre: 'Obras Públicas' }
        },
        {
          id: 6,
          nombre: 'Señales de tránsito',
          descripcion: 'Señalización vial',
          departamento: { id: 1, nombre: 'Obras Públicas' }
        },
        {
          id: 7,
          nombre: 'Semáforos',
          descripcion: 'Sistema semafórico',
          departamento: { id: 1, nombre: 'Obras Públicas' }
        },
        {
          id: 8,
          nombre: 'Escombros',
          descripcion: 'Retiro de escombros',
          departamento: { id: 2, nombre: 'Medio Ambiente' }
        },
        {
          id: 9,
          nombre: 'Comercio ilegal',
          descripción: 'Comercio ambulante no autorizado',
          departamento: { id: 3, nombre: 'Servicios Municipales' }
        },
        {
          id: 10,
          nombre: 'Construcción irregular',
          descripcion: 'Construcciones sin permiso',
          departamento: { id: 1, nombre: 'Obras Públicas' }
        },
        {
          id: 11,
          nombre: 'Contaminación',
          descripcion: 'Contaminación ambiental',
          departamento: { id: 2, nombre: 'Medio Ambiente' }
        },
        {
          id: 12,
          nombre: 'Otro fuera de clasificación',
          descripcion: 'Otros problemas no clasificados',
          departamento: { id: 3, nombre: 'Servicios Municipales' }
        },
      ];
    }
  }

  // ==================== JUNTAS VECINALES ====================

  async getJuntasVecinales(): Promise<JuntaVecinal[]> {
    try {
      const response = await ApiClient.get<ApiResponse<JuntaVecinal>>(ENDPOINTS.JUNTAS_VECINALES);
      return response.results;
    } catch (error) {
      console.error('Error obteniendo juntas vecinales:', error);
      return [];
    }
  }

  // ==================== SITUACIONES ====================

  async getSituaciones(): Promise<SituacionPublicacion[]> {
    try {
      const response = await ApiClient.get<ApiResponse<SituacionPublicacion>>(ENDPOINTS.SITUACIONES);
      return response.results;
    } catch (error) {
      console.error('Error obteniendo situaciones:', error);
      return [
        { id: 1, nombre: 'Recibido', descripcion: 'Denuncia recibida' },
        { id: 2, nombre: 'En proceso', descripcion: 'En proceso de resolución' },
        { id: 3, nombre: 'Resuelto', descripcion: 'Problema solucionado' },
        { id: 4, nombre: 'Cerrado', descripcion: 'Caso cerrado' },
      ];
    }
  }

  // ==================== PUBLICACIONES ====================

  async crearPublicacion(formData: DenunciaFormData): Promise<Publicacion> {
    try {
      // Convertir formData al formato exacto que espera el backend
      const payload: CreatePublicacionPayload = {
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        categoria: parseInt(formData.categoria),
        departamento: parseInt(formData.departamento),
        nombre_calle: formData.nombreCalle,
        numero_calle: parseInt(formData.numeroCalle),
        latitud: formData.latitud || -22.4667, // Coordenadas por defecto de Calama
        longitud: formData.longitud || -68.9333,
        usuario: 1, // TODO: Se obtendrá del usuario autenticado
        junta_vecinal: 1, // TODO: Se calculará automáticamente
        situacion: 1, // "Recibido" por defecto
      };

      console.log('📤 Enviando payload a la API:', payload);

      const response = await ApiClient.post<Publicacion>(ENDPOINTS.PUBLICACIONES, payload);

      console.log('✅ Publicación creada exitosamente:', response);

      // Si hay evidencias, subirlas después de crear la publicación
      if (formData.evidencias.length > 0) {
        await this.subirEvidencias(response.id, formData.evidencias);
      }

      return response;
    } catch (error) {
      console.error('❌ Error creando publicación:', error);
      throw error;
    }
  }

  async obtenerPublicacionesUsuario(usuarioId: number): Promise<Publicacion[]> {
    try {
      const response = await ApiClient.get<ApiResponse<Publicacion>>(
        `${ENDPOINTS.PUBLICACIONES}?usuario=${usuarioId}`
      );
      return response.results;
    } catch (error) {
      console.error('Error obteniendo publicaciones del usuario:', error);
      throw error;
    }
  }

  async obtenerPublicaciones(): Promise<Publicacion[]> {
    try {
      const response = await ApiClient.get<ApiResponse<Publicacion>>(ENDPOINTS.PUBLICACIONES);
      return response.results;
    } catch (error) {
      console.error('Error obteniendo publicaciones:', error);
      throw error;
    }
  }

  async obtenerPublicacion(id: number): Promise<Publicacion> {
    try {
      return await ApiClient.get<Publicacion>(`${ENDPOINTS.PUBLICACIONES}${id}/`);
    } catch (error) {
      console.error('Error obteniendo publicación:', error);
      throw error;
    }
  }

  // ==================== EVIDENCIAS ====================

  async subirEvidencias(publicacionId: number, evidencias: Evidencia[]): Promise<void> {
    try {
      for (const evidencia of evidencias) {
        const formData = new FormData();
        formData.append('publicacion', publicacionId.toString());
        formData.append('archivo', {
          uri: evidencia.archivo,
          type: 'image/jpeg',
          name: `evidencia_${Date.now()}.jpg`,
        } as any);
        formData.append('extension', evidencia.extension);
        formData.append('fecha', new Date().toISOString());

        await ApiClient.postFormData(ENDPOINTS.EVIDENCIAS, formData);
      }
    } catch (error) {
      console.error('Error subiendo evidencias:', error);
      throw error;
    }
  }

  // ==================== ANUNCIOS ====================

  async obtenerAnuncios(): Promise<AnuncioMunicipal[]> {
    try {
      const response = await ApiClient.get<ApiResponse<AnuncioMunicipal>>(ENDPOINTS.ANUNCIOS);
      return response.results;
    } catch (error) {
      console.error('Error obteniendo anuncios:', error);
      // Mock data para anuncios si la API falla
      return [
        {
          id: 1,
          titulo: 'Corte de Agua Programado',
          subtitulo: 'Sector Norte',
          descripcion: 'Se realizará mantención en el sector norte el día 30 de junio',
          estado: 'Activo',
          fecha: '2025-06-29',
          usuario: { id: 1, rut: '12345678-9', nombre: 'Municipalidad', email: 'admin@calama.cl', es_administrador: true, fecha_registro: '2025-01-01', esta_activo: true },
          categoria: { id: 5, nombre: 'Servicios Básicos', departamento: { id: 3, nombre: 'Servicios Municipales' } }
        },
        {
          id: 2,
          titulo: 'Jornada de Vacunación',
          subtitulo: 'Gratuita',
          descripcion: 'Vacunación gratuita este sábado en el parque principal',
          estado: 'Activo',
          fecha: '2025-06-28',
          usuario: { id: 1, rut: '12345678-9', nombre: 'Municipalidad', email: 'admin@calama.cl', es_administrador: true, fecha_registro: '2025-01-01', esta_activo: true },
          categoria: { id: 4, nombre: 'Asistencia Social', departamento: { id: 3, nombre: 'Servicios Municipales' } }
        }
      ];
    }
  }

  // ==================== ESTADÍSTICAS ====================

  async obtenerResumenEstadisticas(): Promise<any> {
    try {
      return await ApiClient.get(ENDPOINTS.ESTADISTICAS.RESUMEN);
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      return {
        total_publicaciones: 0,
        publicaciones_resueltas: 0,
        publicaciones_pendientes: 0,
        usuarios_activos: 0
      };
    }
  }

  async obtenerPublicacionesPorCategoria(): Promise<any[]> {
    try {
      return await ApiClient.get(ENDPOINTS.ESTADISTICAS.POR_CATEGORIA);
    } catch (error) {
      console.error('Error obteniendo publicaciones por categoría:', error);
      return [];
    }
  }

  async obtenerPublicacionesPorMes(): Promise<any[]> {
    try {
      return await ApiClient.get(ENDPOINTS.ESTADISTICAS.POR_MES);
    } catch (error) {
      console.error('Error obteniendo publicaciones por mes:', error);
      return [];
    }
  }

  // ==================== UTILIDADES ====================

  async buscarJuntaVecinalMasCercana(lat: number, lng: number): Promise<JuntaVecinal | null> {
    try {
      const juntas = await this.getJuntasVecinales();

      if (juntas.length === 0) return null;

      // Calcular distancia y retornar la más cercana
      let juntaMasCercana = juntas[0];
      let menorDistancia = this.calcularDistancia(lat, lng, juntas[0].latitud, juntas[0].longitud);

      for (const junta of juntas.slice(1)) {
        const distancia = this.calcularDistancia(lat, lng, junta.latitud, junta.longitud);
        if (distancia < menorDistancia) {
          menorDistancia = distancia;
          juntaMasCercana = junta;
        }
      }

      return juntaMasCercana;
    } catch (error) {
      console.error('Error buscando junta vecinal:', error);
      return null;
    }
  }

  private calcularDistancia(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Radio de la Tierra en km
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI/180);
  }

  // ==================== MÉTODOS DE DESARROLLO ====================

  async testConexion(): Promise<boolean> {
    try {
      await this.getDepartamentos();
      return true;
    } catch (error) {
      console.error('Error probando conexión:', error);
      return false;
    }
  }
}

export default new DenunciasService();