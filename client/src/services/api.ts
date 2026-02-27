// ===============================
// API BASE URL
// ===============================
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";


// ===============================
// TYPES
// ===============================
export interface ApiResponse<T> {
  success: boolean;
  status?: string;
  message?: string;
  data?: T;
  meta?: any;
  token?: string;
  otp?: string;
  results?: number;
}

export interface ApiError {
  status: "error";
  message: string;
}


// ===============================
// TOKEN HELPERS
// ===============================
export const getToken = (): string | null =>
  localStorage.getItem("token");

export const setToken = (token: string): void =>
  localStorage.setItem("token", token);

export const removeToken = (): void =>
  localStorage.removeItem("token");


// ===============================
// EXTENDED REQUEST TYPE
// ===============================
interface ExtendedRequestInit extends RequestInit {
  params?: Record<string, any>;
}


// ===============================
// MAIN API FUNCTION
// ===============================
async function apiRequest<T>(
  endpoint: string,
  options: ExtendedRequestInit = {}
): Promise<ApiResponse<T>> {

  const token = getToken();

  // ✅ Handle FormData correctly
  const isFormData = options.body instanceof FormData;

  const headers: Record<string, string> = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers as Record<string, string> ?? {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const queryString = options.params
    ? "?" +
    new URLSearchParams(
      Object.entries(options.params)
        .filter(([_, value]) => value !== undefined && value !== null)
        .reduce((acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        }, {} as Record<string, string>)
    ).toString()
    : "";

  const { params, ...fetchOptions } = options;

  try {
    const response = await fetch(
      `${API_BASE_URL}${endpoint}${queryString}`,
      {
        ...fetchOptions,
        headers,
      }
    );

    const data = await response.json().catch(() => ({}));

    // ===============================
    // 🔐 HANDLE 401
    // ===============================
    if (response.status === 401) {
      removeToken();
      throw new Error("Your session has expired. Please login again.");
    }

    // ===============================
    // ❌ HANDLE BACKEND ERRORS
    // ===============================
    if (!response.ok) {

      // 🔥 Handle Zod structured errors
      if (data?.errors && Array.isArray(data.errors)) {
        const combinedMessage = data.errors
          .map((e: any) => e.message)
          .join("\n");

        throw new Error(combinedMessage);
      }

      throw new Error(
        data?.message ||
        data?.error ||
        "Something went wrong"
      );
    }

    // ===============================
    // ✅ SUCCESS
    // ===============================
    return data as ApiResponse<T>;

  } catch (error: any) {

    // If already proper Error → rethrow
    if (error instanceof Error) {
      throw error;
    }

    // Real network failure
    throw new Error("Network error. Please check your connection.");
  }
}

export default apiRequest;
