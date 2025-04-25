import axios, { AxiosError } from "axios";
import { ReqRes } from "../features/auth/types";

const API_URL = "http://localhost:1010";

// Configuración de Axios con interceptores para manejo de errores
export const authApi = axios.create({
  baseURL: `${API_URL}/auth`,
  withCredentials: true, // Habilita credenciales si usas cookies/sesiones
});

// Interceptor para manejar errores globales
authApi.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (!error.response) {
      // Error de red (ej: servidor no disponible)
      return Promise.reject({ message: "Error de conexión con el servidor" });
    }
    return Promise.reject(error);
  }
);

/**
 * Función para hacer login en la API
 */
export const login = async (credenciales: {
  email: string;
  password: string;
}): Promise<ReqRes> => {
  try {
    const response = await authApi.post<ReqRes>("/login", credenciales);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { error: "Error en el inicio de sesión" };
  }
};

/**
 * Función para registrar un nuevo usuario
 */
export const register = async (userData: {
  name: string;
  email: string;
  password: string;
  city: string;
}): Promise<ReqRes> => {
  try {
    const response = await authApi.post<ReqRes>("/register", userData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { error: "Error en el registro" };
  }
};

/**
 * Función para refrescar el token de acceso
 */
export const refreshToken = async (): Promise<ReqRes> => {
  try {
    const response = await authApi.post<ReqRes>("/refresh", {});
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { error: "Error al refrescar sesión" };
  }
};
