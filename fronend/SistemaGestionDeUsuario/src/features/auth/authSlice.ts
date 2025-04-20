import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { login } from "../../api/auth";
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
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
