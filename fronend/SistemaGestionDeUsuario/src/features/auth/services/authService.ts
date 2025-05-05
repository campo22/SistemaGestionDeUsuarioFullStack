// src/features/auth/services/authService.ts
import axios from "axios";

const API_URL = "http://localhost:1010";

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

    // Usar axios directamente para evitar problemas con interceptores
    const response = await axios.post(`${API_URL}/auth/login`, credentials, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

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

    // Usar axios directamente para evitar problemas con interceptores
    const response = await axios.post(`${API_URL}/auth/register`, userData, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

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

    // Usar axios directamente para evitar problemas con interceptores
    const response = await axios.post(
      `${API_URL}/auth/refresh`,
      {
        refreshToken: refreshTokenValue,
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    // Guardar tokens en localStorage
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
    // Verificar si hay token
    let token = localStorage.getItem("token");

    // Si no hay token, lanzar error
    if (!token) {
      throw new Error("No hay token disponible");
    }

    try {
      // Intentar obtener datos directamente como JSON
      const response = await axios.get(
        `${API_URL}/adminuser/get-profile?token=${token}`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      // Si la respuesta es JSON y contiene datos de usuario
      if (response.data && response.data.ourUsers) {
        return response.data.ourUsers;
      } else {
        throw new Error("La respuesta no contiene datos de usuario");
      }
    } catch (error: any) {
      // Si hay error 401, intentar refrescar token y volver a intentar
      if (error.response && error.response.status === 401) {
        console.log("Token expirado, intentando refrescar...");

        // Intentar refrescar token
        const refreshTokenValue = localStorage.getItem("refreshToken");
        if (refreshTokenValue) {
          try {
            const refreshResponse = await refreshToken(refreshTokenValue);

            // Reintentar con el nuevo token
            token = refreshResponse.token;
            const retryResponse = await axios.get(
              `${API_URL}/adminuser/get-profile?token=${token}`,
              {
                headers: {
                  Accept: "application/json",
                },
              }
            );

            // Si la respuesta es JSON y contiene datos de usuario
            if (retryResponse.data && retryResponse.data.ourUsers) {
              return retryResponse.data.ourUsers;
            }
          } catch (refreshError) {
            console.error("Error al refrescar token:", refreshError);
            // Limpiar tokens
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            throw new Error(
              "Sesión expirada, por favor inicia sesión nuevamente"
            );
          }
        } else {
          // No hay refresh token, limpiar tokens
          localStorage.removeItem("token");
          throw new Error(
            "Sesión expirada, por favor inicia sesión nuevamente"
          );
        }
      }

      // Si no es un error 401 o no se pudo refrescar el token, lanzar el error original
      throw error;
    }
  } catch (error: any) {
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
