// src/hooks/useHistorial.ts
import { useState, useEffect, useCallback } from 'react';
import { HistorialDenuncia, FiltrosHistorial, EstadisticasHistorial } from '../types/historial';

// Datos placeholder directamente en el hook para evitar problemas de import
const estadisticasPlaceholder: EstadisticasHistorial = {
  totalDenuncias: 12,
  resueltas: 7,
  pendientes: 3,
  enProceso: 2,
  tiempoPromedioRespuesta: 5.2,
  satisfaccionPromedio: 4.1
};

const denunciasPlaceholder: HistorialDenuncia[] = [
  {
    id: '1',
    numeroFolio: 'CAL-2024-001',
    titulo: 'Luminaria dañada en Av. Brasil',
    descripcion: 'La luminaria ubicada en Av. Brasil esquina con Calle Ramírez está intermitente desde hace una semana, causando problemas de visibilidad nocturna.',
    categoria: 'Alumbrado Público',
    estado: 'en_proceso',
    prioridad: 'media',
    fechaCreacion: '2024-12-15T10:30:00Z',
    fechaActualizacion: '2024-12-20T14:00:00Z',
    ubicacion: {
      direccion: 'Av. Brasil esquina con Calle Ramírez, Calama',
      coordenadas: {
        latitud: -22.4569,
        longitud: -68.9270
      }
    },
    evidenciasIniciales: [
      {
        id: 'ev1',
        tipo: 'imagen',
        url: 'https://via.placeholder.com/400x300/E67E22/FFFFFF?text=Luminaria+Dañada',
        nombre: 'luminaria_dañada.jpg',
        fechaSubida: '2024-12-15T10:30:00Z',
        descripcion: 'Foto de la luminaria intermitente'
      }
    ],
    respuestas: [
      {
        id: 'resp1',
        contenido: 'Hemos recibido su reporte y ya se asignó a nuestro equipo técnico. Estimamos tener una solución en 3-5 días hábiles.',
        fechaRespuesta: '2024-12-16T09:00:00Z',
        autorRespuesta: 'María González',
        cargoAutor: 'Coordinadora de Alumbrado Público',
        evidencias: [],
        esRespuestaOficial: true,
        leida: true
      },
      {
        id: 'resp2',
        contenido: 'El equipo técnico visitó el lugar y confirmó el problema. Ya se solicitó el reemplazo de la luminaria. Se realizará la instalación mañana entre 08:00 y 12:00 hrs.',
        fechaRespuesta: '2024-12-20T14:00:00Z',
        autorRespuesta: 'Carlos Pérez',
        cargoAutor: 'Técnico en Electricidad',
        evidencias: [
          {
            id: 'ev2',
            tipo: 'imagen',
            url: 'https://via.placeholder.com/400x300/009688/FFFFFF?text=Evaluación+Técnica',
            nombre: 'evaluacion_tecnica.jpg',
            fechaSubida: '2024-12-20T14:00:00Z',
            descripcion: 'Evaluación técnica del problema'
          }
        ],
        esRespuestaOficial: true,
        leida: false
      }
    ],
    tiempoRespuesta: 1,
    departamentoAsignado: 'Departamento de Servicios Públicos',
    funcionarioAsignado: 'Carlos Pérez'
  },
  {
    id: '2',
    numeroFolio: 'CAL-2024-002',
    titulo: 'Bache en Calle Granaderos',
    descripcion: 'Existe un bache de gran tamaño en Calle Granaderos que puede causar daños a los vehículos.',
    categoria: 'Infraestructura Vial',
    estado: 'resuelto',
    prioridad: 'alta',
    fechaCreacion: '2024-12-10T15:45:00Z',
    fechaActualizacion: '2024-12-18T16:30:00Z',
    ubicacion: {
      direccion: 'Calle Granaderos 1250, Calama'
    },
    evidenciasIniciales: [],
    respuestas: [
      {
        id: 'resp3',
        contenido: 'Recibimos su reporte. El área será inspeccionada dentro de las próximas 48 horas.',
        fechaRespuesta: '2024-12-11T08:30:00Z',
        autorRespuesta: 'Ana Silva',
        cargoAutor: 'Jefa de Mantención Vial',
        evidencias: [],
        esRespuestaOficial: true,
        leida: true
      }
    ],
    tiempoRespuesta: 8,
    satisfaccionCiudadano: 5,
    departamentoAsignado: 'Departamento de Obras Públicas'
  },
  {
    id: '3',
    numeroFolio: 'CAL-2024-003',
    titulo: 'Ruidos molestos en horario nocturno',
    descripcion: 'Vecinos reportan ruidos excesivos provenientes de local comercial durante la madrugada.',
    categoria: 'Ruidos Molestos',
    estado: 'pendiente',
    prioridad: 'media',
    fechaCreacion: '2024-12-22T23:15:00Z',
    fechaActualizacion: '2024-12-22T23:15:00Z',
    ubicacion: {
      direccion: 'Av. O\'Higgins 1856, Calama'
    },
    evidenciasIniciales: [],
    respuestas: [],
    departamentoAsignado: 'Departamento de Fiscalización'
  }
];

export const useHistorial = () => {
  const [denuncias, setDenuncias] = useState<HistorialDenuncia[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasHistorial | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<FiltrosHistorial>({});
  const [notificacionesNoLeidas, setNotificacionesNoLeidas] = useState(0);

  // Simular carga de datos
  const cargarHistorial = useCallback(async (nuevosFiltros?: FiltrosHistorial) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let denunciasFiltradas = [...denunciasPlaceholder];
      const filtrosActuales = nuevosFiltros || filtros;

      // Aplicar filtros
      if (filtrosActuales.busqueda) {
        const busqueda = filtrosActuales.busqueda.toLowerCase();
        denunciasFiltradas = denunciasFiltradas.filter(denuncia => 
          denuncia.titulo.toLowerCase().includes(busqueda) ||
          denuncia.descripcion.toLowerCase().includes(busqueda) ||
          denuncia.numeroFolio.toLowerCase().includes(busqueda)
        );
      }

      if (filtrosActuales.estado?.length) {
        denunciasFiltradas = denunciasFiltradas.filter(denuncia =>
          filtrosActuales.estado?.includes(denuncia.estado)
        );
      }

      if (filtrosActuales.categoria?.length) {
        denunciasFiltradas = denunciasFiltradas.filter(denuncia =>
          filtrosActuales.categoria?.includes(denuncia.categoria)
        );
      }

      // Ordenar por fecha de actualización (más recientes primero)
      denunciasFiltradas.sort((a, b) => 
        new Date(b.fechaActualizacion).getTime() - new Date(a.fechaActualizacion).getTime()
      );

      setDenuncias(denunciasFiltradas);
      
      if (nuevosFiltros) {
        setFiltros(nuevosFiltros);
      }
    } catch (err) {
      setError('Error al cargar el historial');
      console.error('Error simulado:', err);
    } finally {
      setLoading(false);
    }
  }, [filtros]);

  const cargarEstadisticas = useCallback(async () => {
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500));
      setEstadisticas(estadisticasPlaceholder);
    } catch (err) {
      console.error('Error al cargar estadísticas:', err);
    }
  }, []);

  const cargarNotificaciones = useCallback(async () => {
    try {
      // Contar respuestas no leídas
      const noLeidas = denunciasPlaceholder.reduce((total, denuncia) => {
        const respuestasNoLeidas = denuncia.respuestas.filter(respuesta => !respuesta.leida);
        return total + respuestasNoLeidas.length;
      }, 0);
      
      setNotificacionesNoLeidas(noLeidas);
    } catch (err) {
      console.error('Error al cargar notificaciones:', err);
    }
  }, []);

  const aplicarFiltros = useCallback((nuevosFiltros: FiltrosHistorial) => {
    cargarHistorial(nuevosFiltros);
  }, [cargarHistorial]);

  const limpiarFiltros = useCallback(() => {
    setFiltros({});
    cargarHistorial({});
  }, [cargarHistorial]);

  const marcarRespuestaComoLeida = useCallback(async (respuestaId: string) => {
    try {
      // Simular actualización en el backend
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Actualizar estado local
      setDenuncias(prev => prev.map(denuncia => ({
        ...denuncia,
        respuestas: denuncia.respuestas.map(respuesta =>
          respuesta.id === respuestaId 
            ? { ...respuesta, leida: true }
            : respuesta
        )
      })));
      
      // Actualizar notificaciones
      cargarNotificaciones();
      
      console.log('Respuesta marcada como leída:', respuestaId);
    } catch (err) {
      console.error('Error al marcar como leída:', err);
    }
  }, [cargarNotificaciones]);

  const calificarSatisfaccion = useCallback(async (
    denunciaId: string, 
    calificacion: 1 | 2 | 3 | 4 | 5,
    comentario?: string
  ) => {
    try {
      // Simular envío al backend
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Actualizar estado local
      setDenuncias(prev => prev.map(denuncia =>
        denuncia.id === denunciaId 
          ? { ...denuncia, satisfaccionCiudadano: calificacion }
          : denuncia
      ));
      
      console.log('Calificación enviada:', { denunciaId, calificacion, comentario });
    } catch (err) {
      console.error('Error al calificar:', err);
      throw err;
    }
  }, []);

  // Obtener denuncia por ID
  const obtenerDenunciaPorId = useCallback((id: string): HistorialDenuncia | undefined => {
    return denunciasPlaceholder.find(denuncia => denuncia.id === id);
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    cargarHistorial();
    cargarEstadisticas();
    cargarNotificaciones();
  }, []);

  // Función refresh
  const refresh = useCallback(() => {
    cargarHistorial();
    cargarEstadisticas();
    cargarNotificaciones();
  }, [cargarHistorial, cargarEstadisticas, cargarNotificaciones]);

  return {
    // Estado
    denuncias,
    estadisticas,
    loading,
    error,
    filtros,
    notificacionesNoLeidas,
    
    // Acciones
    cargarHistorial,
    cargarEstadisticas,
    aplicarFiltros,
    limpiarFiltros,
    marcarRespuestaComoLeida,
    calificarSatisfaccion,
    obtenerDenunciaPorId,
    refresh
  };
};