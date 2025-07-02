// src/constants/api.ts - CONSTANTES DE API OPTIMIZADAS

// URLs base según ambiente
export const API_CONFIG = {
  development: {
    baseURL: 'http://localhost:8000/api',
    timeout: 10000,
    retries: 2
  },
  staging: {
    baseURL: 'https://staging-api.onecalama.cl/api',
    timeout: 8000,
    retries: 3
  },
  production: {
    baseURL: 'https://api.onecalama.cl/api',
    timeout: 8000,
    retries: 2
  }
};

// Ambiente actual
export const CURRENT_ENV = process.env.NODE_ENV === 'production' ? 'production' :
                          process.env.EXPO_PUBLIC_ENV === 'staging' ? 'staging' :
                          'development';

// Configuración activa
export const ACTIVE_CONFIG = API_CONFIG[CURRENT_ENV];

// Endpoints principales
export const ENDPOINTS = {
  // Autenticación
  AUTH: {
    LOGIN: '/auth/login/',
    REGISTER: '/auth/register/',
    REFRESH: '/auth/refresh/',
    LOGOUT: '/auth/logout/',
    PROFILE: '/auth/profile/',
    CHANGE_PASSWORD: '/auth/change-password/',
    RESET_PASSWORD: '/auth/reset-password/',
  },

  // Datos maestros
  CATEGORIAS: '/categorias/',
  DEPARTAMENTOS: '/departamentos/',
  JUNTAS_VECINALES: '/juntas-vecinales/',
  SITUACIONES: '/situaciones/',

  // Publicaciones (denuncias)
  PUBLICACIONES: '/publicaciones/',
  MIS_PUBLICACIONES: '/publicaciones/mis-publicaciones/',
  PUBLICACION_DETALLE: (id: number) => `/publicaciones/${id}/`,

  // Evidencias
  EVIDENCIAS: '/evidencias/',
  SUBIR_EVIDENCIA: '/evidencias/upload/',

  // Anuncios
  ANUNCIOS: '/anuncios/',
  ANUNCIO_DETALLE: (id: number) => `/anuncios/${id}/`,

  // Notificaciones
  NOTIFICACIONES: '/notificaciones/',
  MARCAR_LEIDA: (id: number) => `/notificaciones/${id}/marcar-leida/`,

  // Estadísticas
  ESTADISTICAS: '/estadisticas/',
  ESTADISTICAS_USUARIO: '/estadisticas/usuario/',

  // Utilidades
  HEALTH: '/health/',
  VERSION: '/version/',
  GEOCODING: '/geocoding/',
} as const;

// Configuraciones de cache (TTL en milisegundos)
export const CACHE_CONFIG = {
  // Datos que cambian poco - cache largo
  CATEGORIAS: 30 * 60 * 1000,        // 30 minutos
  DEPARTAMENTOS: 30 * 60 * 1000,     // 30 minutos
  JUNTAS_VECINALES: 60 * 60 * 1000,  // 1 hora
  SITUACIONES: 60 * 60 * 1000,       // 1 hora

  // Datos dinámicos - cache corto
  PUBLICACIONES: 2 * 60 * 1000,      // 2 minutos
  ANUNCIOS: 5 * 60 * 1000,           // 5 minutos
  NOTIFICACIONES: 1 * 60 * 1000,     // 1 minuto
  ESTADISTICAS: 5 * 60 * 1000,       // 5 minutos

  // Perfil usuario - cache medio
  PROFILE: 10 * 60 * 1000,           // 10 minutos
} as const;

// Timeouts específicos por tipo de operación
export const TIMEOUTS = {
  // Operaciones rápidas
  GET_LIST: 5000,         // 5 segundos
  GET_DETAIL: 5000,       // 5 segundos

  // Operaciones de escritura
  CREATE: 10000,          // 10 segundos
  UPDATE: 8000,           // 8 segundos
  DELETE: 5000,           // 5 segundos

  // Operaciones especiales
  LOGIN: 8000,            // 8 segundos
  UPLOAD: 30000,          // 30 segundos
  DOWNLOAD: 15000,        // 15 segundos
} as const;

// Límites de paginación
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
  ANUNCIOS_PAGE_SIZE: 5,
  NOTIFICACIONES_PAGE_SIZE: 20,
} as const;

// Configuración de reintentos por tipo de error
export const RETRY_CONFIG = {
  // Códigos de estado que deberían reintentarse
  RETRYABLE_STATUS_CODES: [500, 502, 503, 504, 408],

  // Tipos de error de red que deberían reintentarse
  RETRYABLE_NETWORK_ERRORS: [
    'NETWORK_ERROR',
    'TIMEOUT',
    'CONNECTION_ERROR',
    'DNS_ERROR'
  ],

  // Delay entre reintentos (ms)
  RETRY_DELAYS: [1000, 2000, 4000], // Backoff exponencial

  // Máximo número de reintentos por operación
  MAX_RETRIES: {
    GET: 2,
    POST: 1,
    PUT: 1,
    DELETE: 0,
    UPLOAD: 1
  }
} as const;

// Headers comunes
export const COMMON_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'X-Client-Version': process.env.EXPO_PUBLIC_APP_VERSION || '1.0.0',
  'X-Platform': 'mobile',
} as const;

// Configuración para uploads
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024,     // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'text/plain'],
  CHUNK_SIZE: 1024 * 1024,              // 1MB chunks
} as const;

// Mensajes de error estandarizados
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Verifica tu internet.',
  TIMEOUT: 'La operación tardó demasiado. Intenta nuevamente.',
  UNAUTHORIZED: 'Tu sesión ha expirado. Inicia sesión nuevamente.',
  FORBIDDEN: 'No tienes permisos para realizar esta acción.',
  NOT_FOUND: 'El recurso solicitado no fue encontrado.',
  SERVER_ERROR: 'Error del servidor. Intenta más tarde.',
  VALIDATION_ERROR: 'Los datos enviados no son válidos.',
  UNKNOWN_ERROR: 'Ocurrió un error inesperado.',
} as const;

// Estados de la aplicación
export const APP_STATES = {
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
  IDLE: 'idle',
} as const;

// Prioridades para la cola de requests
export const REQUEST_PRIORITIES = {
  HIGH: 'high',      // Autenticación, acciones críticas
  MEDIUM: 'medium',  // Datos de usuario, operaciones normales
  LOW: 'low',        // Cache, precarga, analytics
} as const;

// Configuración de logs
export const LOG_CONFIG = {
  ENABLE_API_LOGS: __DEV__, // Solo en desarrollo
  LOG_LEVEL: __DEV__ ? 'debug' : 'error',
  LOG_REQUESTS: __DEV__,
  LOG_RESPONSES: __DEV__,
  LOG_ERRORS: true,
} as const;