import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReqRes } from "./types";
import authService from "./services/authService";

interface AuthState {
  user: ReqRes["ourUsers"] | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  refreshToken: localStorage.getItem("refreshToken"),
  isAuthenticated: !!localStorage.getItem("token"),
  status: "idle",
  error: null,
};

// authSlice.ts
// Thunks
export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await authService.login(credentials);
      // After login, get user profile
      dispatch(getUserProfile());
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Login fallido");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    userData: { name: string; email: string; password: string; city: string },
    { rejectWithValue }
  ) => {
    try {
      return await authService.register(userData);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Error en el registro"
      );
    }
  }
);

export const refreshTokenThunk = createAsyncThunk(
  "auth/refreshToken",
  async (refreshTokenArg: string, { rejectWithValue }) => {
    try {
      const response = await authService.refreshToken(refreshTokenArg);

      if (!response.token) {
        return rejectWithValue("No hay refresh token disponible");
      }

      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Error al refrescar sesión"
      );
    }
  }
);

export const getUserProfile = createAsyncThunk(
  "auth/getUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      return await authService.getUserProfile();
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Error al obtener perfil de usuario"
      );
    }
  }
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  await authService.logout();
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{
        token: string;
        refreshToken?: string;
        user?: ReqRes["ourUsers"];
      }>
    ) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken || null;
      state.user = action.payload.user || null;
      state.status = "succeeded";
      state.error = null;

      // Store tokens in localStorage
      localStorage.setItem("token", action.payload.token);
      if (action.payload.refreshToken) {
        localStorage.setItem("refreshToken", action.payload.refreshToken);
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;

      // Clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.ourUsers || null;
        state.token = action.payload.token || null;
        state.refreshToken = action.payload.refreshToken || null;
        state.isAuthenticated = true;
        state.error = null;

        // Store tokens in localStorage
        if (action.payload.token) {
          localStorage.setItem("token", action.payload.token);
        }
        if (action.payload.refreshToken) {
          localStorage.setItem("refreshToken", action.payload.refreshToken);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // Register
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // Refresh Token
      .addCase(refreshTokenThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(refreshTokenThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token || null;
        state.refreshToken = action.payload.refreshToken || null;
        state.user = action.payload.ourUsers || null;
        state.error = null;

        // Store tokens in localStorage
        if (action.payload.token) {
          localStorage.setItem("token", action.payload.token);
        }
        if (action.payload.refreshToken) {
          localStorage.setItem("refreshToken", action.payload.refreshToken);
        }
      })
      .addCase(refreshTokenThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;

        // Clear localStorage on refresh token failure
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
      })

      // Get User Profile
      .addCase(getUserProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
        // If profile fetch fails, it might be due to expired token
        if (action.error.message?.includes("Sesión expirada")) {
          state.token = null;
          state.refreshToken = null;
          state.isAuthenticated = false;
          state.user = null;
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
        }
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.status = "idle";
        state.error = null;
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
      });
  },
});

export const { loginSuccess, logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
