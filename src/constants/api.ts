// Constantes para la API

export const API_CONFIG = {
  BASE_URL: 'https://clubdelamusica-pruebas.com/api/v1',
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

  // Recursos principales (basados en las URLs reales de Django)
  PUBLICACIONES: '/publicaciones/',
  DEPARTAMENTOS: '/departamentos-municipales/', // Nombre correcto del backend
  CATEGORIAS: '/categorias/',
  JUNTAS_VECINALES: '/juntas-vecinales/',
  SITUACIONES: '/situaciones-publicaciones/', // Nombre correcto del backend
  EVIDENCIAS: '/evidencias/',
  ANUNCIOS: '/anuncios-municipales/', // Nombre correcto del backend

  // Respuestas municipales
  RESPUESTAS: '/respuestas-municipales/',

  // Estadísticas (basadas en las URLs de views.py)
  ESTADISTICAS: {
    RESUMEN: '/resumen-estadisticas/',
    POR_CATEGORIA: '/publicaciones-por-categoria/',
    POR_MES: '/publicaciones-por-mes-y-categoria/',
    RESUELTOS_MES: '/resueltos-por-mes/',
    TASA_RESOLUCION: '/tasa-resolucion-departamento/',
    POR_JUNTA_VECINAL: '/publicaciones-por-junta-vecinal/',
  },

  // Utilidades
  EXPORT_EXCEL: '/export-to-excel/',
  GENERATE_PDF: '/generate-pdf-report/',
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