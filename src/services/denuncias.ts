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
  
  // ==================== DEPARTAMENTOS Y CATEGORÍAS ====================

  async getDepartamentos(): Promise<DepartamentoMunicipal[]> {
    try {
      const response = await ApiClient.get<ApiResponse<DepartamentoMunicipal>>(ENDPOINTS.DEPARTAMENTOS);
      return response.results;
    } catch (error) {
      console.error('Error obteniendo departamentos:', error);
      // Datos mock basados en tu estructura
      return [
        { id: 1, nombre: 'Obras Públicas', descripcion: 'Infraestructura y vialidad' },
        { id: 2, nombre: 'Medio Ambiente', descripcion: 'Limpieza y ornato' },
        { id: 3, nombre: 'Servicios Municipales', descripcion: 'Servicios básicos' },
      ];
    }
  }

  async getCategorias(): Promise<Categoria[]> {
    try {
      const response = await ApiClient.get<ApiResponse<Categoria>>(ENDPOINTS.CATEGORIAS);
      return response.results;
    } catch (error) {
      console.error('Error obteniendo categorías:', error);
      // Mock basado en tu estructura con departamento completo
      return [
        { 
          id: 1, 
          nombre: 'Infraestructura Vial',
          descripcion: 'Baches, pavimento, señalización',
          departamento: { id: 1, nombre: 'Obras Públicas' }
        },
        { 
          id: 2, 
          nombre: 'Alumbrado Público',
          descripcion: 'Luminarias, cables eléctricos',
          departamento: { id: 1, nombre: 'Obras Públicas' }
        },
        { 
          id: 3, 
          nombre: 'Limpieza y Ornato',
          descripcion: 'Basura, áreas verdes',
          departamento: { id: 2, nombre: 'Medio Ambiente' }
        },
        { 
          id: 4, 
          nombre: 'Espacios Públicos',
          descripcion: 'Plazas, parques, juegos',
          departamento: { id: 2, nombre: 'Medio Ambiente' }
        },
        { 
          id: 5, 
          nombre: 'Servicios Básicos',
          descripcion: 'Agua, alcantarillado',
          departamento: { id: 3, nombre: 'Servicios Municipales' }
        },
      ];
    }
  }

  async getJuntasVecinales(): Promise<JuntaVecinal[]> {
    try {
      const response = await ApiClient.get<ApiResponse<JuntaVecinal>>(ENDPOINTS.JUNTAS_VECINALES);
      return response.results;
    } catch (error) {
      console.error('Error obteniendo juntas vecinales:', error);
      return [];
    }
  }

  async getSituaciones(): Promise<SituacionPublicacion[]> {
    try {
      const response = await ApiClient.get<ApiResponse<SituacionPublicacion>>(ENDPOINTS.SITUACIONES);
      return response.results;
    } catch (error) {
      console.error('Error obteniendo situaciones:', error);
      return [
        { id: 1, nombre: 'Recibido', descripcion: 'Denuncia recibida' },
        { id: 2, nombre: 'En curso', descripcion: 'En proceso de resolución' },
        { id: 3, nombre: 'Resuelto', descripcion: 'Problema solucionado' },
      ];
    }
  }

  // ==================== PUBLICACIONES ====================

  async crearPublicacion(formData: DenunciaFormData): Promise<Publicacion> {
    try {
      // Convertir formData al formato exacto de CreatePublicacionPayload
      const payload: CreatePublicacionPayload = {
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        categoria: parseInt(formData.categoria),
        departamento: parseInt(formData.departamento),
        nombre_calle: formData.nombreCalle,
        numero_calle: parseInt(formData.numeroCalle),
        latitud: -22.4667, // Coordenadas de Calama
        longitud: -68.9333,
        usuario: 1, // Se obtendrá del usuario autenticado
        junta_vecinal: 1, // Se calculará o seleccionará
        situacion: 1, // "Recibido" por defecto
      };

      const response = await ApiClient.post<Publicacion>(ENDPOINTS.PUBLICACIONES, payload);

      // Si hay evidencias, subirlas después
      if (formData.evidencias.length > 0) {
        await this.subirEvidencias(response.id, formData.evidencias);
      }

      return response;
    } catch (error) {
      console.error('Error creando publicación:', error);
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
        formData.append('publicacion_id', publicacionId.toString());
        formData.append('archivo', {
          uri: evidencia.archivo,
          type: 'image/jpeg',
          name: `evidencia_${Date.now()}.jpg`,
        } as any);
        formData.append('extension', evidencia.extension);

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
      return [];
    }
  }

  // ==================== ESTADÍSTICAS ====================

  async obtenerResumenEstadisticas(): Promise<any> {
    try {
      return await ApiClient.get(ENDPOINTS.ESTADISTICAS.RESUMEN);
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      return { publicaciones: 0, usuarios: 0, problemas_resueltos: 0 };
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
}

// Una sola exportación default
export default new DenunciasService();