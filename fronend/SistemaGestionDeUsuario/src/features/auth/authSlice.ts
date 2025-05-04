import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { ReqRes } from "./types";
import { login, refreshToken, register } from "./services/ authService";

interface AuthState {
  user: ReqRes["ourUsers"] | null;
  refreshToken: string | null;
  tokenExpiration: number | null;
  token: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  tokenExpiration: null,
  status: "idle",
  error: null,
};

// authSlice.ts
export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await login(credentials);

      if (response.error) {
        return rejectWithValue(response.error); // 👈 manejar error explícito
      }

      localStorage.setItem("token", response.token || "");
      localStorage.setItem("refreshToken", response.refreshToken || "");

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
      const data = await register(userData);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Error en el registro");
    }
  }
);

export const refreshTokenThunk = createAsyncThunk(
  "auth/refreshToken",
  async (refreshTokenArg: string, { rejectWithValue }) => {
    try {
      const response = await refreshToken(refreshTokenArg);
      localStorage.setItem("token", response.token || "");
      if (!response.token) {
        return rejectWithValue("No hay refresh token disponible");
      }

      localStorage.setItem("token", response.token || "");
      if (response.refreshToken) {
        localStorage.setItem("refreshToken", response.refreshToken);
      }
      return response;
    } catch (error: any) {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      return rejectWithValue(error.message || "Error al refrescar sesión");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.tokenExpiration = null;
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
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
      })
      .addCase(refreshTokenThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
