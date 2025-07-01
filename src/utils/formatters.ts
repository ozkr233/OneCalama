// src/utils/formatters.ts

/**
 * Formatea una fecha en formato legible
 */
export const formatearFecha = (fecha: string): string => {
  try {
    const date = new Date(fecha);
    const ahora = new Date();
    const diferencia = ahora.getTime() - date.getTime();
    const diasDiferencia = Math.floor(diferencia / (1000 * 60 * 60 * 24));

    // Si es hoy
    if (diasDiferencia === 0) {
      return 'Hoy';
    }

    // Si es ayer
    if (diasDiferencia === 1) {
      return 'Ayer';
    }

    // Si es esta semana (últimos 7 días)
    if (diasDiferencia <= 7) {
      return `${diasDiferencia} días atrás`;
    }

    // Formato normal
    return date.toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    return fecha;
  }
};

/**
 * Obtiene el color según el estado de la denuncia
 */
export const getEstadoColor = (estado: string) => {
  switch (estado) {
    case 'pendiente': return '#FF9800'; // Naranja
    case 'en_proceso': return '#2196F3'; // Azul
    case 'resuelto': return '#4CAF50'; // Verde
    case 'rechazado': return '#F44336'; // Rojo
    case 'cerrado': return '#757575'; // Gris
    default: return '#757575';
  }
};

/**
 * Obtiene el texto legible del estado
 */
export const getEstadoTexto = (estado: string) => {
  switch (estado) {
    case 'pendiente': return 'Pendiente';
    case 'en_proceso': return 'En Proceso';
    case 'resuelto': return 'Resuelto';
    case 'rechazado': return 'Rechazado';
    case 'cerrado': return 'Cerrado';
    default: return estado;
  }
};