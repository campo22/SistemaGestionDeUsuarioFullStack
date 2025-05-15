// Auth domain types
import { User } from './user.types';

export interface AuthTokens {
  token: string; // JWT access token
  refreshToken: string;
  expirationToken: string; // e.g., "1h"
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginResponse {
  status: number;
  message: string;
  error?: string;
  token: string;
  refreshToken: string;
  expirationToken: string;
  ourUsers?: User;
}

export interface RegisterResponse {
  status: number;
  message: string;
  error?: string;
  ourUsers?: User;
}

export interface RefreshTokenResponse {
  status: number;
  message: string;
  error?: string;
  token: string;
  refreshToken: string;
  expirationToken: string;
}

export interface ApiResponse<T = any> {
  status: number;
  message: string;
  error?: string;
  [key: string]: any; // For additional fields
}