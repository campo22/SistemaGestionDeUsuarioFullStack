import apiClient from "@api/axios.config";
import { User, UserUpdate } from "@/domain/types/user.types";
import { ApiResponse } from "@/domain/types/auth.types";
import { getLocalStorageTokens } from "@utils/storage";

// Get all users (admin only)
export const getAllUsers = async (): Promise<ApiResponse<User[]>> => {
  try {
    // Verificar primero si hay token
    const tokens = getLocalStorageTokens();
    if (!tokens?.token) {
      throw new Error("No hay sesión activa");
    }

    const response = await apiClient.get<ApiResponse<User[]>>(
      "/admin/get-all-users"
    );

    // Validar la respuesta
    if (!response.data) {
      throw new Error("Respuesta inválida del servidor");
    }

    if (response.data.error) {
      throw new Error(response.data.error);
    }

    return response.data;
  } catch (error: any) {
    // Error de autenticación
    if (error.response?.status === 401) {
      throw new Error(
        "Su sesión ha expirado. Por favor, inicie sesión nuevamente."
      );
    }

    // Error específico del servidor
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }

    // Error genérico o de red
    throw new Error(
      error.message ||
        "Error al obtener los usuarios. Por favor, inténtelo de nuevo."
    );
  }
};

// Get user by ID (admin only)
export const getUserById = async (
  userId: number
): Promise<ApiResponse<User>> => {
  try {
    const response = await apiClient.get<ApiResponse<User>>(
      `/admin/get-users/${userId}`
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return error.response.data;
    }
    throw new Error(`Failed to fetch user with ID ${userId}.`);
  }
};

// Update user (admin only)
export const updateUser = async (
  userId: number,
  userData: UserUpdate
): Promise<ApiResponse<User>> => {
  try {
    const response = await apiClient.put<ApiResponse<User>>(
      `/admin/update/${userId}`,
      userData
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return error.response.data;
    }
    throw new Error(`Failed to update user with ID ${userId}.`);
  }
};

// Delete user (admin only)
export const deleteUser = async (userId: number): Promise<ApiResponse> => {
  try {
    const response = await apiClient.delete<ApiResponse>(
      `/admin/delete/${userId}`
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return error.response.data;
    }
    throw new Error(`Failed to delete user with ID ${userId}.`);
  }
};

// Update own profile (admin and user)
export const updateOwnProfile = async (
  userData: UserUpdate
): Promise<ApiResponse<User>> => {
  try {
    // We'll use the profile endpoint to get the user ID first
    const profileResponse = await apiClient.get<ApiResponse<User>>(
      "/adminuser/get-profile"
    );
    const userId = profileResponse.data.ourUsers?.id;

    if (!userId) {
      throw new Error("Could not determine user ID for profile update.");
    }

    // Then use the admin update endpoint (which works for both roles according to the security config)
    const response = await apiClient.put<ApiResponse<User>>(
      `/admin/update/${userId}`,
      userData
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return error.response.data;
    }
    throw new Error("Failed to update profile. Please try again later.");
  }
};
