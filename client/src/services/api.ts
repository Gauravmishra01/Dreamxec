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

  // Headers
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> ?? {}),
  };

  // Attach JWT automatically
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  console.log("📡 API CALL:", endpoint);

  // ===============================
  // BUILD QUERY STRING (NEW)
  // ===============================
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

  // Remove params before sending to fetch
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
    // HANDLE 401 AUTH ERRORS
    // ===============================
    if (response.status === 401) {
      console.warn("🔒 Not authenticated");

      return {
        success: false,
        message: "Not authenticated",
      } as ApiResponse<T>;
    }

    // ===============================
    // HANDLE OTHER ERRORS
    // ===============================
    if (!response.ok) {
      console.error("❌ API Error:", data);

      return {
        success: false,
        message:
          data?.message ||
          data?.error ||
          "Something went wrong",
      } as ApiResponse<T>;
    }

    // ===============================
    // SUCCESS
    // ===============================
    return data as ApiResponse<T>;


    // ===============================
    // SUCCESS
    // ===============================
    return data as ApiResponse<T>;

  } catch (error) {
    console.error("🚨 Network Error:", error);

    return {
      success: false,
      message: "Network error. Please try again.",
    } as ApiResponse<T>;
  }
}

export default apiRequest;
