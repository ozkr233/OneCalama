// src/services/api.ts
// import AsyncStorage from '@react-native-async-storage/async-storage';

export interface RequestOptions extends RequestInit {
  timeout?: number;
  retries?: number;
  cache?: boolean;
  cacheTTL?: number;
}

interface CacheData<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

// Alternativa temporal para AsyncStorage
class TempStorage {
  private storage: Map<string, string> = new Map();

  async getItem(key: string): Promise<string | null> {
    return this.storage.get(key) || null;
  }

  async setItem(key: string, value: string): Promise<void> {
    this.storage.set(key, value);
  }

  async removeItem(key: string): Promise<void> {
    this.storage.delete(key);
  }
}

const AsyncStorage = new TempStorage();

export interface RequestOptions extends RequestInit {
  timeout?: number;
  retries?: number;
  cache?: boolean;
  cacheTTL?: number;
}

interface CacheData<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

class ApiClient {
  private baseURL: string;
  private defaultTimeout: number;
  private cache: Map<string, CacheData<any>>;
  private pendingRequests: Map<string, Promise<any>>;

  constructor() {
    this.baseURL = process.env.EXPO_PUBLIC_API_URL || 'https://tu-api.com/api';
    this.defaultTimeout = 8000;
    this.cache = new Map();
    this.pendingRequests = new Map();

    // Limpiar cache cada 5 minutos
    setInterval(() => this.cleanExpiredCache(), 5 * 60 * 1000);
  }

  private cleanExpiredCache(): void {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now > value.timestamp + value.expiry) {
        this.cache.delete(key);
      }
    }
  }

  private getCacheKey(url: string, options?: RequestOptions): string {
    const body = options?.body || '';
    const method = options?.method || 'GET';
    return `${url}-${JSON.stringify(body)}-${method}`;
  }

  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) {
      return null;
    }

    const now = Date.now();
    if (now > cached.timestamp + cached.expiry) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  private setCache<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiry: ttl
    });
  }

  private async getAuthToken(): Promise<string | null> {
    try {
      // Por ahora retorna null - puedes implementar tu lógica de auth aquí
      // return await AsyncStorage.getItem('authToken');
      return null;
    } catch (error) {
      console.warn('Error obteniendo token:', error);
      return null;
    }
  }

  private async requestWithTimeout(url: string, options: RequestOptions = {}): Promise<Response> {
    const timeout = options.timeout || this.defaultTimeout;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error(`Tiempo de espera agotado (${timeout}ms)`);
      }
      throw error;
    }
  }

  private async requestWithRetry<T>(url: string, options: RequestOptions = {}): Promise<T> {
    const maxRetries = options.retries || 2;
    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await this.requestWithTimeout(url, options);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.detail ||
            errorData.message ||
            `HTTP ${response.status}: ${response.statusText}`
          );
        }

        return await response.json();
      } catch (error) {
        lastError = error as Error;

        // No reintentar errores 4xx
        if (error.message.includes('4')) {
          throw error;
        }

        // Esperar antes del siguiente intento
        if (attempt < maxRetries) {
          const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError;
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const cacheKey = this.getCacheKey(url, options);

    // Verificar cache para GET requests
    if ((!options.method || options.method === 'GET') && options.cache !== false) {
      const cached = this.getFromCache<T>(cacheKey);
      if (cached) {
        console.log(`[CACHE] Hit: ${endpoint}`);
        return cached;
      }

      // Evitar requests duplicados
      if (this.pendingRequests.has(cacheKey)) {
        console.log(`[API] Request pendiente: ${endpoint}`);
        return this.pendingRequests.get(cacheKey);
      }
    }

    const token = await this.getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const requestOptions: RequestOptions = {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    };

    const requestPromise = this.requestWithRetry<T>(url, requestOptions);

    // Guardar request pendiente para GET
    if ((!options.method || options.method === 'GET') && options.cache !== false) {
      this.pendingRequests.set(cacheKey, requestPromise);
    }

    try {
      const result = await requestPromise;

      // Cachear resultado para GET requests
      if ((!options.method || options.method === 'GET') && options.cache !== false) {
        const ttl = options.cacheTTL || 5 * 60 * 1000;
        this.setCache(cacheKey, result, ttl);
      }

      return result;
    } catch (error) {
      console.error(`[API] Error en ${endpoint}:`, error.message);
      throw error;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  async get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'GET',
      cache: options.cache !== false,
      cacheTTL: options.cacheTTL || 5 * 60 * 1000
    });
  }

  async post<T>(endpoint: string, data?: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      cache: false,
    });
  }

  async put<T>(endpoint: string, data?: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      cache: false,
    });
  }

  async patch<T>(endpoint: string, data?: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      cache: false,
    });
  }

  async delete<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
      cache: false,
    });
  }

  async postFormData<T>(endpoint: string, formData: FormData, options: RequestOptions = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = await this.getAuthToken();

    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const requestOptions: RequestOptions = {
      ...options,
      method: 'POST',
      headers: {
        ...headers,
        ...options.headers,
      },
      body: formData,
      timeout: options.timeout || 15000,
    };

    try {
      return await this.requestWithRetry<T>(url, requestOptions);
    } catch (error) {
      console.error(`[API] Error en FormData ${endpoint}:`, error);
      throw error;
    }
  }

  clearCache(): void {
    this.cache.clear();
    console.log('[CACHE] Cache limpiado');
  }

  getCacheSize(): number {
    return this.cache.size;
  }

  async checkConnection(): Promise<boolean> {
    try {
      await this.get('/health', {
        timeout: 3000,
        cache: false,
        retries: 0
      });
      return true;
    } catch {
      return false;
    }
  }

  async preloadCriticalData(): Promise<void> {
    try {
      console.log('[API] Precargando datos criticos...');
      await Promise.allSettled([
        this.get('/categorias/', { cacheTTL: 30 * 60 * 1000 }),
        this.get('/departamentos/', { cacheTTL: 30 * 60 * 1000 }),
        this.get('/juntas-vecinales/', { cacheTTL: 60 * 60 * 1000 }),
      ]);
      console.log('[API] Datos criticos precargados');
    } catch (error) {
      console.warn('[API] Error precargando datos:', error);
    }
  }
}

export default new ApiClient();