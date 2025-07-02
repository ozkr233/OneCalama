// src/types/denuncias.ts - CORREGIDO
export interface DenunciaFormData {
  titulo: string;
descripcion: string;
categoria: string | number; // Flexible para UI y API
departamento: string | number; // Flexible para UI y API
direccion: string;
ubicacion?: {
latitud: number;
longitud: number;
};
evidencias?: File[] | string[]; // Archivos o URLs
}

// Tipos base de la API
export interface Categoria {
id: number;
nombre: string;
descripcion?: string;
activo: boolean;
}

export interface Departamento {
id: number;
nombre: string;
descripcion?: string;
activo: boolean;
}

export interface JuntaVecinal {
id: number;
nombre: string;
sector: string;
}

export interface Situacion {
id: number;
nombre: string;
descripcion?: string;
}

export interface Usuario {
id: number;
username: string;
email: string;
first_name: string;
last_name: string;
}

// Publicacion principal
export interface Publicacion {
id: number;
codigo: string; // Código único generado
titulo: string;
descripcion: string;
fecha_creacion: string;
fecha_actualizacion: string;
nombre_calle?: string;
numero_calle: number;
latitud: number;
longitud: number;
activo: boolean;
categoria: Categoria;
departamento: Departamento;
usuario: Usuario;
junta_vecinal: JuntaVecinal;
situacion?: Situacion;
evidencias: Evidencia[];
}

export interface Evidencia {
id: number;
publicacion: number;
evidencia: string; // CloudinaryField URL
fecha: string;
extension: string;
}

// Anuncios
export interface Anuncio {
id: number;
titulo: string;
descripcion: string;
fecha_creacion: string;
fecha_actualizacion: string;
activo: boolean;
departamento: Departamento;
imagenes: ImagenAnuncio[];
}

export interface ImagenAnuncio {
id: number;
anuncio: number;
imagen: string; // CloudinaryField
fecha: string;
extension: string;
}

// Para la API response con paginación
export interface ApiResponse<T> {
results: T[];
count: number;
next?: string;
previous?: string;
}

// Payload optimizado para crear publicación
export interface CreatePublicacionPayload {
titulo: string;
descripcion: string;
categoria: number; // ID de categoria
departamento: number; // ID de departamento
nombre_calle?: string;
numero_calle: number;
latitud: number;
longitud: number;
junta_vecinal: number; // ID de junta vecinal
situacion?: number; // ID opcional
// usuario se obtiene del token de autenticación
}

// Estados de carga optimizados
export interface LoadingState {
loading: boolean;
error: string | null;
success: boolean;
data?: any;
}

// Tipos para validaciones
export interface ValidationError {
field: keyof DenunciaFormData;
message: string;
}

export interface FormValidation {
isValid: boolean;
errors: ValidationError[];
}

// Respuesta de creación exitosa
export interface CreatePublicacionResponse {
id: number;
codigo: string;
titulo: string;
descripcion: string;
fecha_creacion: string;
categoria: Categoria;
departamento: Departamento;
}

// Tipos para cache y optimización
export interface CacheData<T> {
data: T;
timestamp: number;
expiry: number; // TTL en ms
}

export interface RequestConfig {
timeout?: number;
retries?: number;
cache?: boolean;
cacheTTL?: number;
}