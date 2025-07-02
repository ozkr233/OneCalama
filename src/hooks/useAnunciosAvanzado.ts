// src/hooks/useAnunciosAvanzado.ts
import { useState, useEffect, useCallback } from 'react';
import { AnuncioMunicipal } from '../types/denuncias';
import AnunciosService from '../services/anuncios';

interface UseAnunciosAvanzadoReturn {
  // Datos
  anuncios: AnuncioMunicipal[];
  anunciosFiltrados: AnuncioMunicipal[];
  estadisticas: {
    total: number;
    activos: number;
    programados: number;
    finalizados: number;
  } | null;

  // Estados
  loading: boolean;
  error: string | null;

  // Filtros
  filtroEstado: string | null;
  filtroCategoria: number | null;
  busqueda: string;

  // Acciones
  refetch: () => Promise<void>;
  filtrarPorEstado: (estado: string | null) => void;
  filtrarPorCategoria: (categoriaId: number | null) => void;
  buscar: (query: string) => void;
  limpiarFiltros: () => void;
  obtenerAnuncioPorId: (id: number) => Promise<AnuncioMunicipal | null>;
}

export const useAnunciosAvanzado = (): UseAnunciosAvanzadoReturn => {
  const [anuncios, setAnuncios] = useState<AnuncioMunicipal[]>([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados de filtros
  const [filtroEstado, setFiltroEstado] = useState<string | null>(null);
  const [filtroCategoria, setFiltroCategoria] = useState<number | null>(null);
  const [busqueda, setBusqueda] = useState('');

  // Función para obtener datos iniciales
  const fetchDatos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔄 Obteniendo anuncios y estadísticas...');

      // Obtener anuncios y estadísticas en paralelo
      const [anunciosData, statsData] = await Promise.all([
        AnunciosService.obtenerAnuncios(),
        AnunciosService.obtenerEstadisticasAnuncios()
      ]);

      console.log('✅ Datos obtenidos:', {
        anuncios: anunciosData.length,
        estadisticas: statsData
      });

      setAnuncios(anunciosData);
      setEstadisticas(statsData);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      console.error('❌ Error obteniendo datos:', errorMessage);
      setError(errorMessage);

    } finally {
      setLoading(false);
    }
  }, []);

  // Función para refrescar datos
  const refetch = useCallback(async () => {
    await fetchDatos();
  }, [fetchDatos]);

  // Función para obtener un anuncio específico
  const obtenerAnuncioPorId = useCallback(async (id: number): Promise<AnuncioMunicipal | null> => {
    try {
      return await AnunciosService.obtenerAnuncioPorId(id);
    } catch (error) {
      console.error('❌ Error obteniendo anuncio por ID:', error);
      return null;
    }
  }, []);

  // Funciones de filtrado
  const filtrarPorEstado = useCallback((estado: string | null) => {
    setFiltroEstado(estado);
  }, []);

  const filtrarPorCategoria = useCallback((categoriaId: number | null) => {
    setFiltroCategoria(categoriaId);
  }, []);

  const buscar = useCallback((query: string) => {
    setBusqueda(query);
  }, []);

  const limpiarFiltros = useCallback(() => {
    setFiltroEstado(null);
    setFiltroCategoria(null);
    setBusqueda('');
  }, []);

  // Calcular anuncios filtrados
  const anunciosFiltrados = useCallback(() => {
    let resultado = [...anuncios];

    // Filtrar por estado
    if (filtroEstado) {
      resultado = resultado.filter(anuncio =>
        anuncio.estado.toLowerCase() === filtroEstado.toLowerCase()
      );
    }

    // Filtrar por categoría
    if (filtroCategoria) {
      resultado = resultado.filter(anuncio =>
        anuncio.categoria.id === filtroCategoria
      );
    }

    // Filtrar por búsqueda
    if (busqueda.trim()) {
      const queryLower = busqueda.toLowerCase();
      resultado = resultado.filter(anuncio =>
        anuncio.titulo.toLowerCase().includes(queryLower) ||
        anuncio.descripcion.toLowerCase().includes(queryLower) ||
        anuncio.subtitulo.toLowerCase().includes(queryLower) ||
        anuncio.categoria.nombre.toLowerCase().includes(queryLower)
      );
    }

    return resultado;
  }, [anuncios, filtroEstado, filtroCategoria, busqueda]);

  // Efecto inicial
  useEffect(() => {
    fetchDatos();
  }, [fetchDatos]);

  return {
    // Datos
    anuncios,
    anunciosFiltrados: anunciosFiltrados(),
    estadisticas,

    // Estados
    loading,
    error,

    // Filtros
    filtroEstado,
    filtroCategoria,
    busqueda,

    // Acciones
    refetch,
    filtrarPorEstado,
    filtrarPorCategoria,
    buscar,
    limpiarFiltros,
    obtenerAnuncioPorId
  };
};