// ===============================
// API BASE URL
// ===============================
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";


// ===============================
// TYPES
// ===============================
export interface ApiResponse<T> {
  status: "success" | "error";
  message?: string;
  data?: T;
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
// MAIN API FUNCTION
// ===============================
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
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

  // Debug log
  console.log("📡 API CALL:", endpoint);

  try {
    const response = await fetch(
      `${API_BASE_URL}${endpoint}`,
      {
        ...options,
        headers,
      }
    );

    const data = await response.json().catch(() => ({}));

    // ===========================
    // HANDLE 401 AUTH ERRORS
    // ===========================
    if (response.status === 401) {
      console.warn("🔒 Not authenticated");

      return {
        status: "error",
        message: "Not authenticated",
      } as ApiResponse<T>;
    }

    // ===========================
    // HANDLE OTHER ERRORS
    // ===========================
    if (!response.ok) {
      console.error("❌ API Error:", data);

      return {
        status: "error",
        message:
          data?.message ||
          data?.error ||
          "Something went wrong",
      } as ApiResponse<T>;
    }

    // ===========================
    // SUCCESS
    // ===========================
    return data as ApiResponse<T>;

  } catch (error) {
    console.error("🚨 Network Error:", error);

    return {
      status: "error",
      message: "Network error. Please try again.",
    } as ApiResponse<T>;
  }
}

export default apiRequest;
