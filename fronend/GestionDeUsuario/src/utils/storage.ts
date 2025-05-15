import { AuthTokens } from '@/domain/types/auth.types';
import { User } from '@/domain/types/user.types';

// Constants
const AUTH_TOKENS_KEY = 'auth_tokens';
const USER_KEY = 'user_data';

// Auth tokens
export const getLocalStorageTokens = (): AuthTokens | null => {
  const tokensString = localStorage.getItem(AUTH_TOKENS_KEY);
  if (!tokensString) return null;
  
  try {
    return JSON.parse(tokensString) as AuthTokens;
  } catch (error) {
    console.error('Error parsing auth tokens from localStorage:', error);
    return null;
  }
};

export const setLocalStorageTokens = (tokens: AuthTokens): void => {
  localStorage.setItem(AUTH_TOKENS_KEY, JSON.stringify(tokens));
};

export const removeLocalStorageTokens = (): void => {
  localStorage.removeItem(AUTH_TOKENS_KEY);
};

// User data
export const getLocalStorageUser = (): User | null => {
  const userString = localStorage.getItem(USER_KEY);
  if (!userString) return null;
  
  try {
    return JSON.parse(userString) as User;
  } catch (error) {
    console.error('Error parsing user data from localStorage:', error);
    return null;
  }
};

export const setLocalStorageUser = (user: User): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const removeLocalStorageUser = (): void => {
  localStorage.removeItem(USER_KEY);
};

// Clear all auth-related data
export const clearAuthStorage = (): void => {
  removeLocalStorageTokens();
  removeLocalStorageUser();
};