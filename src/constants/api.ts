// Constantes para la API

export const API_CONFIG = {
  BASE_URL: 'https://backendmunicipalidadawstid-production.up.railway.app/api/v1',
  TIMEOUT: 10000, // 10 segundos
  RETRY_ATTEMPTS: 3,
} as const;

export const ENDPOINTS = {
  // Autenticación
  AUTH: {
    LOGIN: '/token/',
    REFRESH: '/token/refresh/',
    REGISTER: '/registro/',
  },
  
  // Recursos principales
  PUBLICACIONES: '/publicaciones/',
  DEPARTAMENTOS: '/departamentos/',
  CATEGORIAS: '/categorias/',
  JUNTAS_VECINALES: '/juntas-vecinales/',
  SITUACIONES: '/situaciones/',
  EVIDENCIAS: '/evidencias/',
  ANUNCIOS: '/anuncios/',
  
  // Estadísticas
  ESTADISTICAS: {
    RESUMEN: '/resumen-estadisticas/',
    POR_CATEGORIA: '/publicaciones-por-categoria/',
    POR_MES: '/publicaciones-por-mes-y-categoria/',
    RESUELTOS_MES: '/resueltos-por-mes/',
  },
  
  // Utilidades
  EXPORT_EXCEL: '/export-to-excel/',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const REQUEST_HEADERS = {
  CONTENT_TYPE_JSON: 'application/json',
  CONTENT_TYPE_FORM_DATA: 'multipart/form-data',
} as const;