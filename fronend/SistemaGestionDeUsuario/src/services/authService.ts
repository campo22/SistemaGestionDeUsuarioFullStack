import axios from "axios";

const API_URL = "http://localhost:1010";

// Función para iniciar sesión
export const login = async (credentials: {
  email: string;
  password: string;
}) => {
  try {
    console.log("Intentando iniciar sesión con:", credentials.email);

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
  } catch (error: any) {
    console.error("Error en login:", error);
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
      // Si hay error 401, intentar login y volver a intentar
      if (error.response && error.response.status === 401) {
        console.log("Token expirado, intentando refrescar...");

        // Intentar refrescar token
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          try {
            const refreshResponse = await axios.post(
              `${API_URL}/auth/refresh`,
              {
                refreshToken,
              },
              {
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
              }
            );

            // Guardar nuevo token
            if (refreshResponse.data.token) {
              localStorage.setItem("token", refreshResponse.data.token);
              token = refreshResponse.data.token;

              // Reintentar con el nuevo token
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
            }
          } catch (refreshError) {
            console.error("Error al refrescar token:", refreshError);
            // Limpiar tokens y redirigir a login
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            throw new Error(
              "Sesión expirada, por favor inicia sesión nuevamente"
            );
          }
        } else {
          // No hay refresh token, limpiar tokens y redirigir a login
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
  localStorage.removeItem("currentUser");
};

export default {
  login,
  getUserProfile,
  logout,
};
