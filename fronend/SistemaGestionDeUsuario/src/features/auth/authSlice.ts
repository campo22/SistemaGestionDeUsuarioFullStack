import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { login, register } from "../../api/auth";
import { ReqRes } from "./types";

interface AuthState {
  user: ReqRes["ourUsers"] | null;
  token: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  status: "idle",
  error: null,
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await login(credentials);

      if (response.data.error) {
        return rejectWithValue(response.data.error); // 👈 manejar error explícito
      }

      localStorage.setItem("token", response.data.token || "");
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Login fallido");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    userData: {
      name: string;
      email: string;
      password: string;
      city: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await register(userData);

      if (response.error) {
        return rejectWithValue(response.error); // 👈 manejar error explícito
      }

      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Registro fallido");
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
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<ReqRes>) => {
        if (action.payload.error) {
          state.status = "failed";
          state.error = action.payload.error;
        } else {
          state.status = "succeeded";
          state.user = action.payload.ourUsers || null;
          state.token = action.payload.token || null;
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
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
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
