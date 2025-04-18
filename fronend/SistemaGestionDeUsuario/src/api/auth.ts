import axios from "axios";
import { ReqRes } from "../features/auth/types";

const API_URL = "http://localhost:1010";

// creamos una instancia de axios para la URL base
export const authApi = axios.create({
  baseURL: `${API_URL}/auth`,
});

/**
 * Funcion para hacer login en la API
 * @param credenciales email y password del usuario
 * @returns datos del usuario autenticado
 */
export const login = async (credenciales: {
  email: string;
  password: string;
}): Promise<ReqRes> => {
  const response = await authApi.post<ReqRes>("/login", credenciales);
  return response.data;
};
export const register = async (userData: {
  name: string;
  email: string;
  password: string;
  city: string;
  role: string;
}): Promise<ReqRes> => {
  const response = await authApi.post<ReqRes>("/register", userData);
  return response.data;
};
