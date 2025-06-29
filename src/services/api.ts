import { API_CONFIG, REQUEST_HEADERS } from '../constants/api';

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  private async getAuthToken(): Promise<string | null> {
    try {
      // TODO: Implementar cuando tengamos AuthService
      // const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      // return await AsyncStorage.getItem('accessToken');
      return null;
    } catch (error) {
      console.error('Error obteniendo token:', error);
      return null;
    }
  }

  private async getHeaders(options: RequestOptions = {}): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      'Content-Type': REQUEST_HEADERS.CONTENT_TYPE_JSON,
    };

    if (options.requiresAuth !== false) {
      const token = await this.getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { requiresAuth = true, ...requestInit } = options;
    
    const headers = await this.getHeaders({ requiresAuth });
    const url = `${this.baseURL}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...requestInit,
        headers: {
          ...headers,
          ...requestInit.headers,
        },
      });

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
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  // Métodos de conveniencia
  async get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  // Método especial para FormData (evidencias)
  async postFormData<T>(endpoint: string, formData: FormData, options: RequestOptions = {}): Promise<T> {
    const token = await this.getAuthToken();
    const headers: Record<string, string> = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    // No agregar Content-Type para FormData - el navegador lo hace automáticamente

    const url = `${this.baseURL}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        method: 'POST',
        headers: {
          ...headers,
          ...options.headers,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API FormData Error [${endpoint}]:`, error);
      throw error;
    }
  }
}

export default new ApiClient();