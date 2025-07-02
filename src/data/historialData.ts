// src/data/historialData.ts - DATOS CENTRALIZADOS
import { HistorialDenuncia, EstadisticasHistorial } from '../types/historial';

export const estadisticasPlaceholder: EstadisticasHistorial = {
  totalDenuncias: 12,
  resueltas: 7,
  pendientes: 3,
  enProceso: 2,
  rechazadas: 0,
  cerradas: 0,
  tiempoPromedioRespuesta: 5.2,
  satisfaccionPromedio: 4.1,
  porcentajeResolucion: 75,
  denunciasPorCategoria: {
    'Alumbrado Público': 4,
    'Calles y Veredas': 3,
    'Recolección de Basura': 2,
    'Áreas Verdes': 2,
    'Seguridad': 1
  },
  denunciasPorMes: {
    '2024-10': 2,
    '2024-11': 4,
    '2024-12': 6
  },
  tendencia: 'mejorando'
};

export const denunciasPlaceholder: HistorialDenuncia[] = [
  {
    id: '1',
    numeroFolio: 'CAL-2024-001',
    titulo: 'Luminaria dañada en Av. Brasil',
    descripcion: 'La luminaria ubicada en Av. Brasil esquina con Calle Ramírez está intermitente desde hace una semana, causando problemas de visibilidad nocturna para los peatones y conductores.',
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
      },
      sector: 'Centro',
      comuna: 'Calama'
    },
    evidenciasIniciales: [
      {
        id: 'ev1',
        tipo: 'imagen',
        url: 'https://via.placeholder.com/400x300/E67E22/FFFFFF?text=Luminaria+Dañada',
        nombre: 'luminaria_dañada.jpg',
        fechaSubida: '2024-12-15T10:30:00Z',
        descripcion: 'Foto de la luminaria intermitente',
        size: 245760,
        mimeType: 'image/jpeg'
      }
    ],
    respuestas: [
      {
        id: 'resp1',
        contenido: 'Estimado/a ciudadano/a, hemos recibido su reporte de la luminaria intermitente en Av. Brasil esquina con Calle Ramírez. Ya se ha asignado a nuestro equipo técnico especializado en alumbrado público. Estimamos tener una solución definitiva en 3-5 días hábiles.',
        fechaRespuesta: '2024-12-16T09:00:00Z',
        autorRespuesta: 'María González',
        cargoAutor: 'Coordinadora de Alumbrado Público',
        evidencias: [],
        esRespuestaOficial: true,
        leida: true,
        departamento: 'Servicios Públicos'
      },
      {
        id: 'resp2',
        contenido: 'Actualización: El equipo técnico visitó el lugar y confirmó el problema en el sistema eléctrico de la luminaria. Ya se solicitó el reemplazo del equipo completo. Se realizará la instalación mañana entre 08:00 y 12:00 hrs. Agradecemos su paciencia.',
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
            descripcion: 'Evaluación técnica del problema',
            size: 189440,
            mimeType: 'image/jpeg'
          }
        ],
        esRespuestaOficial: true,
        leida: false,
        departamento: 'Servicios Públicos'
      }
    ],
    tiempoRespuesta: 1,
    departamentoAsignado: 'Departamento de Servicios Públicos',
    funcionarioAsignado: 'Carlos Pérez',
    vistas: 23,
    likes: 5,
    compartido: false,
    notificacionesActivas: true
  },
  {
    id: '2',
    numeroFolio: 'CAL-2024-002',
    titulo: 'Bache en Calle Granaderos',
    descripcion: 'Existe un bache de gran tamaño en Calle Granaderos que puede causar daños a los vehículos y representa un peligro para los conductores, especialmente durante la noche.',
    categoria: 'Calles y Veredas',
    estado: 'resuelto',
    prioridad: 'alta',
    fechaCreacion: '2024-12-10T15:45:00Z',
    fechaActualizacion: '2024-12-18T11:30:00Z',
    fechaResolucion: '2024-12-18T11:30:00Z',
    ubicacion: {
      direccion: 'Calle Granaderos 1250, Calama',
      sector: 'Norte',
      comuna: 'Calama'
    },
    evidenciasIniciales: [
      {
        id: 'ev3',
        tipo: 'imagen',
        url: 'https://via.placeholder.com/400x300/DC3545/FFFFFF?text=Bache+Grande',
        nombre: 'bache_granaderos.jpg',
        fechaSubida: '2024-12-10T15:45:00Z',
        descripcion: 'Foto del bache en Calle Granaderos',
        size: 312840,
        mimeType: 'image/jpeg'
      }
    ],
    respuestas: [
      {
        id: 'resp3',
        contenido: 'Gracias por su reporte. Hemos programado una inspección técnica para mañana en la mañana. El equipo evaluará el daño y determinará el tipo de reparación necesaria.',
        fechaRespuesta: '2024-12-11T08:15:00Z',
        autorRespuesta: 'Ana Morales',
        cargoAutor: 'Coordinadora de Obras Viales',
        evidencias: [],
        esRespuestaOficial: true,
        leida: true,
        departamento: 'Obras Municipales'
      },
      {
        id: 'resp4',
        contenido: 'Se realizó la reparación del bache utilizando mezcla asfáltica de alta resistencia. El trabajo quedó terminado y la calle está en perfectas condiciones. Agradecemos su colaboración ciudadana.',
        fechaRespuesta: '2024-12-18T11:30:00Z',
        autorRespuesta: 'Roberto Silva',
        cargoAutor: 'Jefe de Obras Viales',
        evidencias: [
          {
            id: 'ev4',
            tipo: 'imagen',
            url: 'https://via.placeholder.com/400x300/28A745/FFFFFF?text=Reparación+Completa',
            nombre: 'reparacion_completa.jpg',
            fechaSubida: '2024-12-18T11:30:00Z',
            descripcion: 'Calle reparada con mezcla asfáltica',
            size: 278560,
            mimeType: 'image/jpeg'
          }
        ],
        esRespuestaOficial: true,
        leida: true,
        departamento: 'Obras Municipales'
      }
    ],
    tiempoRespuesta: 1,
    departamentoAsignado: 'Departamento de Obras Municipales',
    funcionarioAsignado: 'Roberto Silva',
    satisfaccion: 5,
    comentariosSatisfaccion: 'Excelente trabajo, muy rápida la solución.',
    vistas: 45,
    likes: 12,
    compartido: true,
    notificacionesActivas: false
  },
  {
    id: '3',
    numeroFolio: 'CAL-2024-003',
    titulo: 'Acumulación de basura en Plaza Central',
    descripcion: 'Hay acumulación de basura en la Plaza Central que no ha sido recogida en varios días, generando malos olores y atrayendo insectos.',
    categoria: 'Recolección de Basura',
    estado: 'pendiente',
    prioridad: 'media',
    fechaCreacion: '2024-12-22T08:20:00Z',
    ubicacion: {
      direccion: 'Plaza Central, Calama',
      coordenadas: {
        latitud: -22.4580,
        longitud: -68.9250
      },
      sector: 'Centro',
      comuna: 'Calama'
    },
    evidenciasIniciales: [
      {
        id: 'ev5',
        tipo: 'imagen',
        url: 'https://via.placeholder.com/400x300/FFA500/FFFFFF?text=Basura+Acumulada',
        nombre: 'basura_plaza.jpg',
        fechaSubida: '2024-12-22T08:20:00Z',
        descripcion: 'Acumulación de basura en la plaza',
        size: 198720,
        mimeType: 'image/jpeg'
      }
    ],
    respuestas: [],
    departamentoAsignado: 'Departamento de Medio Ambiente',
    vistas: 8,
    likes: 2,
    compartido: false,
    notificacionesActivas: true
  },
  {
    id: '4',
    numeroFolio: 'CAL-2024-004',
    titulo: 'Árbol caído en Av. Libertador',
    descripcion: 'Un árbol se cayó durante la tormenta de anoche y está bloqueando parcialmente el tráfico en Av. Libertador.',
    categoria: 'Áreas Verdes',
    estado: 'resuelto',
    prioridad: 'alta',
    fechaCreacion: '2024-12-05T06:30:00Z',
    fechaActualizacion: '2024-12-05T14:20:00Z',
    fechaResolucion: '2024-12-05T14:20:00Z',
    ubicacion: {
      direccion: 'Av. Libertador altura 2100, Calama',
      sector: 'Sur',
      comuna: 'Calama'
    },
    evidenciasIniciales: [],
    respuestas: [
      {
        id: 'resp5',
        contenido: 'Recibimos su reporte de emergencia. Nuestro equipo de emergencias ya está en camino al lugar para remover el árbol caído.',
        fechaRespuesta: '2024-12-05T07:00:00Z',
        autorRespuesta: 'Pedro Ramírez',
        cargoAutor: 'Jefe de Emergencias',
        evidencias: [],
        esRespuestaOficial: true,
        leida: true,
        departamento: 'Servicios de Emergencia'
      },
      {
        id: 'resp6',
        contenido: 'El árbol ha sido removido completamente y el tráfico se ha normalizado. Se realizará una inspección de otros árboles en la zona para prevenir futuros incidentes.',
        fechaRespuesta: '2024-12-05T14:20:00Z',
        autorRespuesta: 'Pedro Ramírez',
        cargoAutor: 'Jefe de Emergencias',
        evidencias: [],
        esRespuestaOficial: true,
        leida: true,
        departamento: 'Servicios de Emergencia'
      }
    ],
    tiempoRespuesta: 0.3,
    departamentoAsignado: 'Departamento de Emergencias',
    funcionarioAsignado: 'Pedro Ramírez',
    satisfaccion: 5,
    comentariosSatisfaccion: 'Respuesta muy rápida y eficiente.',
    vistas: 67,
    likes: 18,
    compartido: true,
    notificacionesActivas: false
  },
  {
    id: '5',
    numeroFolio: 'CAL-2024-005',
    titulo: 'Ruido excesivo en construcción nocturna',
    descripcion: 'Una construcción en el sector residencial está haciendo ruido durante horarios nocturnos, afectando el descanso de los vecinos.',
    categoria: 'Seguridad',
    estado: 'en_proceso',
    prioridad: 'media',
    fechaCreacion: '2024-12-18T22:15:00Z',
    fechaActualizacion: '2024-12-19T10:30:00Z',
    ubicacion: {
      direccion: 'Pasaje Los Aromos 450, Calama',
      sector: 'Norte',
      comuna: 'Calama'
    },
    evidenciasIniciales: [],
    respuestas: [
      {
        id: 'resp7',
        contenido: 'Hemos recibido su denuncia por ruido nocturno. Se enviará un inspector municipal para verificar el cumplimiento de las ordenanzas sobre horarios de construcción.',
        fechaRespuesta: '2024-12-19T10:30:00Z',
        autorRespuesta: 'Luis Torres',
        cargoAutor: 'Inspector Municipal',
        evidencias: [],
        esRespuestaOficial: true,
        leida: true,
        departamento: 'Inspección Municipal'
      }
    ],
    tiempoRespuesta: 0.5,
    departamentoAsignado: 'Departamento de Inspección',
    funcionarioAsignado: 'Luis Torres',
    vistas: 15,
    likes: 3,
    compartido: false,
    notificacionesActivas: true
  }
];

// Función para obtener denuncias filtradas
export const obtenerDenunciasFiltradas = (
  filtros: {
    estado?: string;
    categoria?: string;
    busqueda?: string;
  } = {}
): HistorialDenuncia[] => {
  let denunciasFiltradas = [...denunciasPlaceholder];

  if (filtros.estado) {
    denunciasFiltradas = denunciasFiltradas.filter(d => d.estado === filtros.estado);
  }

  if (filtros.categoria) {
    denunciasFiltradas = denunciasFiltradas.filter(d => d.categoria === filtros.categoria);
  }

  if (filtros.busqueda) {
    const busqueda = filtros.busqueda.toLowerCase();
    denunciasFiltradas = denunciasFiltradas.filter(d =>
      d.titulo.toLowerCase().includes(busqueda) ||
      d.descripcion.toLowerCase().includes(busqueda) ||
      d.numeroFolio.toLowerCase().includes(busqueda)
    );
  }

  return denunciasFiltradas;
};

// Función para obtener denuncia por ID
export const obtenerDenunciaPorId = (id: string): HistorialDenuncia | undefined => {
  return denunciasPlaceholder.find(d => d.id === id);
};

// Función para marcar respuestas como leídas
export const marcarRespuestasLeidas = (denunciaId: string): void => {
  const denuncia = denunciasPlaceholder.find(d => d.id === denunciaId);
  if (denuncia) {
    denuncia.respuestas.forEach(respuesta => {
      respuesta.leida = true;
    });
  }
};

// Función para obtener estadísticas actualizadas
export const obtenerEstadisticasActualizadas = (): EstadisticasHistorial => {
  const denuncias = denunciasPlaceholder;

  const stats = {
    totalDenuncias: denuncias.length,
    resueltas: denuncias.filter(d => d.estado === 'resuelto').length,
    pendientes: denuncias.filter(d => d.estado === 'pendiente').length,
    enProceso: denuncias.filter(d => d.estado === 'en_proceso').length,
    rechazadas: denuncias.filter(d => d.estado === 'rechazado').length,
    cerradas: denuncias.filter(d => d.estado === 'cerrado').length,
    tiempoPromedioRespuesta: 0,
    satisfaccionPromedio: 0,
    porcentajeResolucion: 0,
    denunciasPorCategoria: {} as Record<string, number>,
    denunciasPorMes: {} as Record<string, number>,
    tendencia: 'estable' as const
  };

  // Calcular tiempo promedio de respuesta
  const denunciasConRespuesta = denuncias.filter(d => d.tiempoRespuesta !== undefined);
  if (denunciasConRespuesta.length > 0) {
    stats.tiempoPromedioRespuesta = denunciasConRespuesta.reduce((sum, d) => sum + (d.tiempoRespuesta || 0), 0) / denunciasConRespuesta.length;
  }

  // Calcular satisfacción promedio
  const denunciasConSatisfaccion = denuncias.filter(d => d.satisfaccion !== undefined);
  if (denunciasConSatisfaccion.length > 0) {
    stats.satisfaccionPromedio = denunciasConSatisfaccion.reduce((sum, d) => sum + (d.satisfaccion || 0), 0) / denunciasConSatisfaccion.length;
  }

  // Calcular porcentaje de resolución
  stats.porcentajeResolucion = stats.totalDenuncias > 0 ? Math.round((stats.resueltas / stats.totalDenuncias) * 100) : 0;

  // Contar por categoría
  denuncias.forEach(d => {
    if (d.categoria) {
      stats.denunciasPorCategoria[d.categoria] = (stats.denunciasPorCategoria[d.categoria] || 0) + 1;
    }
  });

  return stats;
};