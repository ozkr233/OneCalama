// src/hooks/useApiData.ts
import { useState, useEffect } from 'react';
import { OptionItem, Departamento, Categoria } from '../types';
import { ENDPOINTS as API_ROUTES } from '../constants/api.ts';

interface UseApiDataReturn {
  departamentos: OptionItem[];
  categorias: OptionItem[];
  isLoadingDepartamentos: boolean;
  isLoadingCategorias: boolean;
  errorDepartamentos: string | null;
  errorCategorias: string | null;
  refetchDepartamentos: () => void;
  refetchCategorias: () => void;
}

// Datos por defecto como fallback
const DEFAULT_DEPARTAMENTOS: OptionItem[] = [
  { id: '1', nombre: 'Aseo y Ornato' },
  { id: '2', nombre: 'Tránsito' },
  { id: '3', nombre: 'Obras Municipales' },
  { id: '4', nombre: 'Medio Ambiente' },
  { id: '5', nombre: 'Seguridad Ciudadana' },
  { id: '6', nombre: 'Servicios Públicos' },
];

const DEFAULT_CATEGORIAS: OptionItem[] = [
  { id: '1', nombre: 'Seguridad' },
  { id: '2', nombre: 'Basura' },
  { id: '3', nombre: 'Áreas verdes' },
  { id: '4', nombre: 'Mantención de Calles' },
  { id: '5', nombre: 'Señales de tránsito' },
  { id: '6', nombre: 'Contaminación' },
  { id: '7', nombre: 'Escombros' },
  { id: '8', nombre: 'Comercio ilegal' },
];

export const useApiData = (): UseApiDataReturn => {
  const [departamentos, setDepartamentos] = useState<OptionItem[]>([]);
  const [categorias, setCategorias] = useState<OptionItem[]>([]);
  const [isLoadingDepartamentos, setIsLoadingDepartamentos] = useState(false);
  const [isLoadingCategorias, setIsLoadingCategorias] = useState(false);
  const [errorDepartamentos, setErrorDepartamentos] = useState<string | null>(null);
  const [errorCategorias, setErrorCategorias] = useState<string | null>(null);

  const fetchDepartamentos = async () => {
    setIsLoadingDepartamentos(true);
    setErrorDepartamentos(null);

    try {
      const response = await fetch(API_ROUTES.MUNICIPALIDAD.DEPARTAMENTOS);

      if (response.ok) {
        const data: Departamento[] = await response.json();
        const departamentosFormateados = data.map((dept) => ({
          id: dept.id.toString(),
          nombre: dept.nombre
        }));
        setDepartamentos(departamentosFormateados);
      } else {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error cargando departamentos:', error);
      setErrorDepartamentos('Error al cargar departamentos');
      setDepartamentos(DEFAULT_DEPARTAMENTOS);
    } finally {
      setIsLoadingDepartamentos(false);
    }
  };

  const fetchCategorias = async () => {
    setIsLoadingCategorias(true);
    setErrorCategorias(null);

    try {
      const response = await fetch(API_ROUTES.CATEGORIAS);

      if (response.ok) {
        const data: Categoria[] = await response.json();
        const categoriasFormateadas = data.map((cat) => ({
          id: cat.id.toString(),
          nombre: cat.nombre
        }));
        setCategorias(categoriasFormateadas);
      } else {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error cargando categorías:', error);
      setErrorCategorias('Error al cargar categorías');
      setCategorias(DEFAULT_CATEGORIAS);
    } finally {
      setIsLoadingCategorias(false);
    }
  };

  useEffect(() => {
    fetchDepartamentos();
    fetchCategorias();
  }, []);

  return {
    departamentos,
    categorias,
    isLoadingDepartamentos,
    isLoadingCategorias,
    errorDepartamentos,
    errorCategorias,
    refetchDepartamentos: fetchDepartamentos,
    refetchCategorias: fetchCategorias,
  };
};