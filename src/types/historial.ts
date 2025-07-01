// src/types/historial.ts

export interface Evidencia {
  id: string;
  tipo: 'imagen' | 'documento' | 'video';
  url: string;
  nombre: string;
  fechaSubida: string;
  descripcion?: string;
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
}

export interface HistorialDenuncia {
  id: string;
  numeroFolio: string;
  titulo: string;
  descripcion: string;
  estado: 'pendiente' | 'en_proceso' | 'resuelto' | 'rechazado' | 'cerrado';
  fechaCreacion: string;
  respuestas: Respuesta[]; // Ahora array completo de respuestas
  ubicacion?: {
    direccion: string;
  };
  evidenciasIniciales?: Evidencia[];
}

export interface EstadisticasHistorial {
  totalDenuncias: number;
  resueltas: number;
  pendientes: number;
  enProceso: number;
}