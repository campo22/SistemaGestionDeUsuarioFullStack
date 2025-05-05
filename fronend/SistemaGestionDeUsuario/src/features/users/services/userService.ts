import api, { testDirectRequest } from "../../../api/interceptors";
import { User } from "../../../types/user";

// Obtener el perfil del usuario actual
export const getMyProfile = async () => {
  try {
    console.log("Intentando obtener perfil de usuario");

    // Intentar primero con la petición directa
    try {
      const data = await testDirectRequest("/adminuser/get-profile");
      console.log("Perfil obtenido con petición directa:", data);
      return data.ourUsers;
    } catch (directError) {
      console.error("Error en petición directa:", directError);

      // Si falla, intentar con la instancia de api
      const response = await api.get("/adminuser/get-profile");
      console.log("Perfil obtenido con api:", response.data);
      return response.data.ourUsers;
    }
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    throw error;
  }
};

// Obtener todos los usuarios (solo admin)
export const getAllUsers = async () => {
  try {
    console.log("Intentando obtener todos los usuarios");
    const response = await api.get("/admin/get-all-users");
    return response.data.ourUsersList || [];
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    throw error;
  }
};

// Obtener un usuario por ID (solo admin)
export const getUserById = async (userId: number) => {
  try {
    console.log(`Intentando obtener usuario con ID: ${userId}`);
    const response = await api.get(`/admin/get-users/${userId}`);
    return response.data.ourUsers;
  } catch (error) {
    console.error(`Error al obtener usuario ${userId}:`, error);
    throw error;
  }
};

// Actualizar un usuario (solo admin)
export const updateUser = async (userId: number, userData: Partial<User>) => {
  try {
    console.log(`Intentando actualizar usuario con ID: ${userId}`);
    const response = await api.put(`/admin/update/${userId}`, userData);
    return response.data.ourUsers;
  } catch (error) {
    console.error(`Error al actualizar usuario ${userId}:`, error);
    throw error;
  }
};

// Eliminar un usuario (solo admin)
export const deleteUser = async (userId: number) => {
  try {
    console.log(`Intentando eliminar usuario con ID: ${userId}`);
    const response = await api.delete(`/admin/delete/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar usuario ${userId}:`, error);
    throw error;
  }
};

export default {
  getMyProfile,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
