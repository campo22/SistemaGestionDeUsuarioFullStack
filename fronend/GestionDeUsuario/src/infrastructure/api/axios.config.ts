import axios, { AxiosError, AxiosInstance } from "axios";
import { refreshToken } from "@services/auth.service";
import {
  getLocalStorageTokens,
  setLocalStorageTokens,
  removeLocalStorageTokens,
} from "@utils/storage";

interface ErrorResponse {
  error?: string;
  message?: string;
}

// Create axios instance with the correct base URL and CORS settings
const apiClient: AxiosInstance = axios.create({
  baseURL: "http://localhost:1010",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // Enable credentials for CORS
});

// Request interceptor to add Authorization header
apiClient.interceptors.request.use(
  (config) => {
    const tokens = getLocalStorageTokens();
    if (tokens?.token && config.headers) {
      config.headers["Authorization"] = `Bearer ${tokens.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (
  error: AxiosError | null,
  token: string | null = null
) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    // Si no hay respuesta del servidor, es un error de red
    if (!error.response) {
      return Promise.reject(
        new Error("Network error: Could not connect to server")
      );
    }

    // Si es un error 401 y no es un intento de refresh, intentamos refrescar el token
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh"
    ) {
      if (isRefreshing) {
        try {
          const token = await new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
          return apiClient(originalRequest);
        } catch (err) {
          return Promise.reject(err);
        }
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const tokens = getLocalStorageTokens();
      if (!tokens?.refreshToken) {
        removeLocalStorageTokens();
        window.location.href = "/login";
        return Promise.reject(new Error("No refresh token available"));
      }

      try {
        const response = await refreshToken(tokens.refreshToken);

        // Validar la respuesta del refresh token
        if (!response || !response.token) {
          throw new Error("No se pudo renovar la sesión");
        }

        // Guardamos los nuevos tokens
        setLocalStorageTokens({
          token: response.token,
          refreshToken: response.refreshToken,
          expirationToken: response.expirationToken,
        });

        // Actualizamos los headers y reintentamos la petición original
        originalRequest.headers["Authorization"] = `Bearer ${response.token}`;
        processQueue(null, response.token);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);

        // Limpiar tokens y redirigir al login
        removeLocalStorageTokens();

        // Guardar la URL actual para redireccionar después del login
        const currentPath = window.location.pathname;
        if (currentPath !== "/login") {
          sessionStorage.setItem("redirectUrl", currentPath);
        }

        // Mostrar mensaje al usuario
        if (
          window.confirm(
            "Su sesión ha expirado. ¿Desea iniciar sesión nuevamente?"
          )
        ) {
          window.location.href = "/login";
        }

        return Promise.reject(
          new Error(
            "Su sesión ha expirado. Por favor, inicie sesión nuevamente."
          )
        );
      } finally {
        isRefreshing = false;
      }
    }

    // Para otros errores, intentamos obtener un mensaje significativo
    const errorResponse = error.response.data as ErrorResponse;
    const errorMessage =
      errorResponse?.error ||
      errorResponse?.message ||
      "An unexpected error occurred";

    return Promise.reject(new Error(errorMessage));
  }
);

export default apiClient;
