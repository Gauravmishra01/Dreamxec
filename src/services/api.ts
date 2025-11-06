// API Configuration and Helper Functions
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Types for API responses
export interface ApiResponse<T> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  token?: string;
  results?: number;
}

export interface ApiError {
  status: 'error';
  message: string;
}

// Get token from localStorage
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// Set token in localStorage
export const setToken = (token: string): void => {
  localStorage.setItem('token', token);
};

// Remove token from localStorage
export const removeToken = (): void => {
  localStorage.removeItem('token');
};

// API request helper with authentication
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Merge custom headers if provided
  if (options.headers) {
    const customHeaders = options.headers as Record<string, string>;
    Object.assign(headers, customHeaders);
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      // Log detailed error for debugging
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        data,
      });
      console.error('Full error data:', JSON.stringify(data, null, 2));
      
      // Extract validation errors if they exist
      if (data.errors && Array.isArray(data.errors)) {
        const errorMessages = data.errors.map((err: any) => `${err.field}: ${err.message}`).join(', ');
        throw new Error(`Validation failed: ${errorMessages}`);
      }
      
      throw new Error(data.message || data.error || 'An error occurred');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export default apiRequest;
