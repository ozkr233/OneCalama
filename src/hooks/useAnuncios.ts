// src/hooks/useAnuncios.ts
import { useState, useEffect } from 'react';
import { AnuncioMunicipal } from '../types/denuncias';
import AnunciosService from '../services/anuncios';

interface UseAnunciosReturn {
  anuncios: AnuncioMunicipal[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useAnuncios = (): UseAnunciosReturn => {
  const [anuncios, setAnuncios] = useState<AnuncioMunicipal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnuncios = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔄 Obteniendo anuncios municipales...');
      const data = await AnunciosService.obtenerAnuncios();

      console.log('✅ Anuncios obtenidos:', data);
      setAnuncios(data);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      console.error('❌ Error obteniendo anuncios:', errorMessage);
      setError(errorMessage);

      // Si hay error, usar datos mock como fallback
      setAnuncios([]);

    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    await fetchAnuncios();
  };

  useEffect(() => {
    fetchAnuncios();
  }, []);

  return {
    anuncios,
    loading,
    error,
    refetch
  };
};