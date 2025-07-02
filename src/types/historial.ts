export interface Evidencia {
  id: string;
tipo: 'imagen' | 'documento' | 'video';
url: string;
nombre: string;
fechaSubida: string;
descripcion?: string;
size?: number; // Tamaño en bytes
mimeType?: string;
}

export interface Respuesta {
id: string;
contenido: string;
fechaRespuesta: string;
autorRespuesta: string; // Nombre del funcionario
cargoAutor: string; // Cargo del funcionario
evidencias: Evidencia[];
esRespuestaOficial: boolean;
leida?: boolean; // Para marcar si el usuario ya leyó la respuesta
departamento?: string;
}

export interface Ubicacion {
direccion: string;
coordenadas?: {
latitud: number;
longitud: number;
};
sector?: string;
comuna?: string;
}

export type EstadoDenuncia = 'pendiente' | 'en_proceso' | 'resuelto' | 'rechazado' | 'cerrado';
export type PrioridadDenuncia = 'baja' | 'media' | 'alta' | 'critica';

export interface HistorialDenuncia {
id: string;
numeroFolio: string;
titulo: string;
descripcion: string;
categoria?: string;
estado: EstadoDenuncia;
prioridad?: PrioridadDenuncia;
fechaCreacion: string;
fechaActualizacion?: string;
fechaResolucion?: string;
ubicacion?: Ubicacion;
evidenciasIniciales?: Evidencia[];
respuestas: Respuesta[];
tiempoRespuesta?: number; // Días para primera respuesta
departamentoAsignado?: string;
funcionarioAsignado?: string;
satisfaccion?: number; // 1-5 estrellas
comentariosSatisfaccion?: string;
// Campos adicionales para seguimiento
vistas?: number;
likes?: number;
compartido?: boolean;
notificacionesActivas?: boolean;
}

export interface EstadisticasHistorial {
totalDenuncias: number;
resueltas: number;
pendientes: number;
enProceso: number;
rechazadas?: number;
cerradas?: number;
tiempoPromedioRespuesta: number; // En días
satisfaccionPromedio: number; // 1-5
porcentajeResolucion?: number;
// Estadísticas adicionales
denunciasPorCategoria?: Record<string, number>;
denunciasPorMes?: Record<string, number>;
tendencia?: 'mejorando' | 'empeorando' | 'estable';
}

export interface FiltrosHistorial {
estado?: EstadoDenuncia | EstadoDenuncia[];
categoria?: string | string[];
prioridad?: PrioridadDenuncia | PrioridadDenuncia[];
fechaDesde?: string;
fechaHasta?: string;
departamento?: string | string[];
busqueda?: string; // Búsqueda en título/descripción
ordenarPor?: 'fecha_creacion' | 'fecha_actualizacion' | 'prioridad' | 'estado';
orden?: 'asc' | 'desc';
limite?: number;
pagina?: number;
}

export interface ResultadosFiltrados {
denuncias: HistorialDenuncia[];
total: number;
paginas: number;
paginaActual: number;
filtrosAplicados: FiltrosHistorial;
}

// Tipos para notificaciones
export interface NotificacionDenuncia {
id: string;
denunciaId: string;
tipo: 'respuesta' | 'cambio_estado' | 'asignacion' | 'resolucion';
titulo: string;
mensaje: string;
fecha: string;
leida: boolean;
accionRequerida?: boolean;
url?: string; // Deep link a la denuncia
}

// Tipos para exportación de datos
export interface ExportConfig {
formato: 'pdf' | 'excel' | 'csv';
incluirEvidencias: boolean;
incluirRespuestas: boolean;
filtros?: FiltrosHistorial;
campos?: (keyof HistorialDenuncia)[];
}

// Estados de carga para historial
export interface HistorialLoadingState {
  cargandoDenuncias: boolean;
  cargandoEstadisticas: boolean;
  actualizandoDenuncia: boolean;
  exportando: boolean;
  error: string | null;
  ultimaActualizacion?: string;
}