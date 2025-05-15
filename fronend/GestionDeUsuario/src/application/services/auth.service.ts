import apiClient from "@api/axios.config";
import {
  LoginResponse,
  RefreshTokenResponse,
  RegisterResponse,
} from "@/domain/types/auth.types";
import { RegisterUserData, UserCredentials } from "@/domain/types/user.types";
import { getLocalStorageTokens } from "@utils/storage";

// Register new user
export const registerUser = async (
  userData: RegisterUserData
): Promise<RegisterResponse> => {
  try {
    const response = await apiClient.post<RegisterResponse>(
      "/auth/register",
      userData
    );
    if (response.data.error) {
      throw new Error(response.data.error);
    }
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      throw new Error(
        error.response.data.error ||
          error.response.data.message ||
          "Registration failed"
      );
    }
    throw error;
  }
};

// Login user
export const loginUser = async (
  credentials: UserCredentials
): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>(
      "/auth/login",
      credentials
    );

    if (!response.data || response.data.error) {
      throw new Error(
        response.data?.error || "Login failed: Invalid server response"
      );
    }

    if (!response.data.token) {
      throw new Error("Login failed: No token received");
    }

    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      throw new Error(
        error.response.data.error ||
          error.response.data.message ||
          "Login failed"
      );
    }
    throw error;
  }
};

// Refresh token
export const refreshToken = async (
  refreshToken: string
): Promise<RefreshTokenResponse> => {
  try {
    const response = await apiClient.post<RefreshTokenResponse>(
      "/auth/refresh",
      { refreshToken }
    );
    if (response.data.error) {
      throw new Error(response.data.error);
    }
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      throw new Error(
        error.response.data.error ||
          error.response.data.message ||
          "Token refresh failed"
      );
    }
    throw error;
  }
};

// Get user profile
export const getUserProfile = async () => {
  try {
    // Verificar si tenemos el token antes de hacer la petición
    const tokens = getLocalStorageTokens();
    if (!tokens?.token) {
      throw new Error("No authentication token available");
    }

    const response = await apiClient.get("/adminuser/get-profile");
    if (response.data.error) {
      throw new Error(response.data.error);
    }
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      throw new Error(
        error.response.data.error ||
          error.response.data.message ||
          "Failed to get profile"
      );
    }
    throw error;
  }
};

// Logout (client-side only, no API call needed)
export const logout = (): void => {
  // This is handled by the auth slice, clearing local storage
};
