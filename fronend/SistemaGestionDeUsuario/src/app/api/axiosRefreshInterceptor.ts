import axios from "axios";
import { store } from "../store";
import { refreshTokenThunk } from "../../features/auth/authSlice";

// Crea una instancia de Axios
const api = axios.create({
  baseURL: "http://localhost:1010", // Asegúrate de que esta es la URL correcta de tu API
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Interceptor para añadir el token a todas las peticiones como query param
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      // También mantener el header por si acaso
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Flag para evitar múltiples refresh simultáneos
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Interceptor para manejar errores y refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si es 401 y no es el endpoint de refresh
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/refresh")
    ) {
      if (isRefreshing) {
        // Si ya hay un refresh en curso, encola la petición
        return new Promise<string>(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            // Actualizar el token en la petición original
            originalRequest.params = originalRequest.params || {};
            originalRequest.params.token = token;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        // Despacha el thunk y espera el resultado
        const resultAction = await store.dispatch(
          refreshTokenThunk(refreshToken)
        );
        if (refreshTokenThunk.fulfilled.match(resultAction)) {
          const newToken = resultAction.payload.token;
          // Actualizar el token en la petición original
          originalRequest.params = originalRequest.params || {};
          originalRequest.params.token = newToken;
          processQueue(null, newToken);
          return api(originalRequest);
        } else {
          processQueue(resultAction.payload, null);
          return Promise.reject(resultAction.payload);
        }
      } catch (err) {
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
