// API BASE URL
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Types
export interface ApiResponse<T> {
  status: "success" | "error";
  message?: string;
  data?: T;
  token?: string;
  otp?: string; // Added for dev/testing OTP usage
  results?: number;
}

export interface ApiError {
  status: "error";
  message: string;
}

// Token helpers
export const getToken = (): string | null => localStorage.getItem("token");
export const setToken = (token: string): void =>
  localStorage.setItem("token", token);
export const removeToken = (): void => localStorage.removeItem("token");

// Main API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) ?? {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    // 401 = not authenticated (expected when user is logged out — do NOT log as error)
    if (response.status === 401) {
      const error = new Error(data.message || "Not authenticated");
      (error as any).status = 401;
      throw error;
    }

    // --- Other errors ---
    if (!response.ok) {
      // validation errors
      if (data.errors && Array.isArray(data.errors)) {
        const errorMessages = data.errors
          .map((err: any) => `${err.field}: ${err.message}`)
          .join(", ");
        const valErr = new Error(`Validation failed: ${errorMessages}`);
        (valErr as any).status = response.status;
        throw valErr;
      }

      const apiErr = new Error(
        data.message || data.error || "An error occurred",
      );
      (apiErr as any).status = response.status;
      (apiErr as any).data = data;
      throw apiErr;
    }

    return data;
  } catch (error: any) {
    // Only log truly unexpected errors (not 401 — that's normal for unauthenticated state)
    if (error?.status !== 401) {
      console.error("API Error:", error);
    }
    throw error;
  }
}

export default apiRequest;
