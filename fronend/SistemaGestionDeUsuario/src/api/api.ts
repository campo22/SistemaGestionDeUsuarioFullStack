import axios from "axios";
import { store } from "../app/store";
import { refreshTokenThunk } from "../features/auth/authSlice";

// URL base de la API
const API_URL = "http://localhost:1010";

// Crear una instancia de Axios con la configuración correcta
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Interceptor para añadir el token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    console.log(`Enviando petición a: ${config.url}`);
    
    const token = localStorage.getItem("token");
    if (token) {
      // Añadir token como parámetro de consulta
      config.params = config.params || {};
      config.params.token = token;
      
      // También mantener el header por compatibilidad
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error("Error en la petición:", error);
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

// Interceptor para manejar respuestas y refresh token
api.interceptors.response.use(
  (response) => {
    console.log(`Respuesta exitosa de: ${response.config.url}`);
    return response;
  },
  async (error) => {
    if (error.response) {
      console.error(`Error ${error.response.status} en: ${error.config?.url}`, error.response.data);
    } else {
      console.error(`Error en: ${error.config?.url}`, error.message);
    }

    const originalRequest = error.config;
    if (!originalRequest) {
      return Promise.reject(error);
    }

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
        console.log("Intentando refrescar token...");
        // Despacha el thunk y espera el resultado
        const resultAction = await store.dispatch(
          refreshTokenThunk(refreshToken)
        );
        if (refreshTokenThunk.fulfilled.match(resultAction)) {
          console.log("Token refrescado exitosamente");
          const newToken = resultAction.payload.token;
          // Actualizar el token en la petición original
          originalRequest.params = originalRequest.params || {};
          originalRequest.params.token = newToken;
          processQueue(null, newToken);
          return api(originalRequest);
        } else {
          console.error("Error al refrescar token:", resultAction.payload);
          processQueue(resultAction.payload, null);
          return Promise.reject(resultAction.payload);
        }
      } catch (err) {
        console.error("Error al refrescar token:", err);
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Función para probar una petición directa sin interceptores
export const testDirectRequest = async (endpoint: string) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${API_URL}${endpoint}?token=${token}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    console.log(`Respuesta directa de ${endpoint}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error en petición directa a ${endpoint}:`, error);
    throw error;
  }
};

export default api;
