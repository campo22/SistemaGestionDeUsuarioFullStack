import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  loginUser, 
  registerUser, 
  getUserProfile, 
  refreshToken as refreshTokenService 
} from '@services/auth.service';
import { 
  clearAuthStorage, 
  getLocalStorageTokens, 
  getLocalStorageUser, 
  setLocalStorageTokens, 
  setLocalStorageUser 
} from '@utils/storage';
import { AuthState, AuthTokens } from '@/domain/types/auth.types';
import { RegisterUserData, User, UserCredentials } from '@/domain/types/user.types';

// Initialize state from localStorage
const initialState: AuthState = {
  user: getLocalStorageUser(),
  tokens: getLocalStorageTokens(),
  isAuthenticated: !!getLocalStorageTokens()?.token,
  isLoading: false,
  error: null,
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: UserCredentials, { rejectWithValue }) => {
    try {
      const response = await loginUser(credentials);
      
      if (response.error || response.status !== 200) {
        return rejectWithValue(response.error || 'Login failed');
      }
      
      // Return both user and tokens
      return {
        user: response.ourUsers,
        tokens: {
          token: response.token,
          refreshToken: response.refreshToken,
          expirationToken: response.expirationToken
        }
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: RegisterUserData, { rejectWithValue }) => {
    try {
      const response = await registerUser(userData);
      
      if (response.error || response.status !== 200) {
        return rejectWithValue(response.error || 'Registration failed');
      }
      
      return response.ourUsers;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserProfile();
      
      if (response.error || response.status !== 200) {
        return rejectWithValue(response.error || 'Failed to fetch profile');
      }
      
      return response.ourUsers;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const refreshAccessToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      const refreshTokenVal = state.auth.tokens?.refreshToken;
      
      if (!refreshTokenVal) {
        return rejectWithValue('No refresh token available');
      }
      
      const response = await refreshTokenService(refreshTokenVal);
      
      if (response.error || response.status !== 200) {
        return rejectWithValue(response.error || 'Token refresh failed');
      }
      
      return {
        token: response.token,
        refreshToken: response.refreshToken,
        expirationToken: response.expirationToken
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.tokens = null;
      state.isAuthenticated = false;
      state.error = null;
      clearAuthStorage();
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action: PayloadAction<{ user: User; tokens: AuthTokens }>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.tokens = action.payload.tokens;
      setLocalStorageUser(action.payload.user);
      setLocalStorageTokens(action.payload.tokens);
    });
    builder.addCase(login.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Register
    builder.addCase(register.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.isLoading = false;
      // Registration doesn't log in the user automatically
    });
    builder.addCase(register.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Fetch user profile
    builder.addCase(fetchUserProfile.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
      setLocalStorageUser(action.payload);
    });
    builder.addCase(fetchUserProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Refresh token
    builder.addCase(refreshAccessToken.fulfilled, (state, action: PayloadAction<AuthTokens>) => {
      state.tokens = action.payload;
      setLocalStorageTokens(action.payload);
    });
    builder.addCase(refreshAccessToken.rejected, (state) => {
      state.user = null;
      state.tokens = null;
      state.isAuthenticated = false;
      clearAuthStorage();
    });
  },
});

export const { logout, clearError } = authSlice.actions;

export default authSlice.reducer;