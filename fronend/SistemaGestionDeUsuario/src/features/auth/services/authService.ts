// src/features/auth/services/authService.ts
import api from "../../../app/api/axiosRefreshInterceptor"; // Utilizando la instancia centralizada de axios

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  city: string;
}

// Función para iniciar sesión
export const login = async (credentials: LoginCredentials) => {
  try {
    console.log("Intentando iniciar sesión con:", credentials.email);

    const response = await api.post("/auth/login", credentials);

    console.log("Respuesta de login:", response.data);

    // Guardar tokens en localStorage
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    if (response.data.refreshToken) {
      localStorage.setItem("refreshToken", response.data.refreshToken);
    }

    return response.data;
  } catch (error) {
    console.error("Error en login:", error);
    throw error;
  }
};

// Función para registrar un nuevo usuario
export const register = async (userData: RegisterData) => {
  try {
    console.log("Intentando registrar usuario:", userData.email);

    const response = await api.post("/auth/register", userData);

    return response.data;
  } catch (error) {
    console.error("Error en registro:", error);
    throw error;
  }
};

// Función para refrescar el token
export const refreshToken = async (refreshTokenValue: string) => {
  try {
    console.log("Intentando refrescar token");

    const response = await api.post("/auth/refresh", {
      refreshToken: refreshTokenValue,
    });

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    if (response.data.refreshToken) {
      localStorage.setItem("refreshToken", response.data.refreshToken);
    }

    return response.data;
  } catch (error) {
    console.error("Error al refrescar token:", error);
    throw error;
  }
};

// Función para obtener el perfil del usuario
export const getUserProfile = async () => {
  try {
    const response = await api.get("/adminuser/get-profile");
    return response.data.ourUsers;
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    throw error;
  }
};

// Función para cerrar sesión
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
};

// Función para verificar si el usuario está autenticado
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

export default {
  login,
  register,
  refreshToken,
  logout,
  isAuthenticated,
  getUserProfile,
};
