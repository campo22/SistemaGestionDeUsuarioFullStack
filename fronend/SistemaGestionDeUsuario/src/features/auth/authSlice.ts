// Importamos la función de login que se comunica con la API
import { login } from "../../api/auth";

// Importamos el tipo de respuesta que esperamos desde la API
import { ReqRes } from "./types";

// Importamos funciones y tipos desde Redux Toolkit
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

/**
 * Definimos la interfaz que representa el estado del slice de autenticación.
 */
interface AuthState {
  user: ReqRes["ourUsers"] | null; // Datos del usuario logueado
  token: string | null; // Token de autenticación JWT
  status: "loading" | "succeeded" | "failed" | "idle"; // Estado del proceso de login
  error: string | null; // Mensaje de error (si ocurre)
}

/**
 * Estado inicial del slice de autenticación.
 */
const initialState: AuthState = {
  user: null,
  token: null,
  status: "idle",
  error: null,
};

/**
 * Acción asincrónica para iniciar sesión (login).
 * Utilizamos `createAsyncThunk` para manejar:
 * - `pending`  → cuando se inicia la petición
 * - `fulfilled` → cuando la petición fue exitosa
 * - `rejected`  → cuando ocurrió un error
 */
export const loginUser = createAsyncThunk(
  "auth/login", // Nombre único para identificar la acción
  async (
    credencials: { email: string; password: string }, // Credenciales de inicio de sesión
    { rejectWithValue } // Método para retornar errores personalizados
  ) => {
    try {
      // Llamamos a la API con las credenciales
      const response = await login(credencials);

      // Guardamos el token en localStorage para mantener la sesión
      localStorage.setItem("token", response.token || "");

      // Retornamos la respuesta para manejarla en el slice
      return response;
    } catch (error: any) {
      // En caso de error, lo enviamos al `rejected` del extraReducer
      return rejectWithValue(
        error.response?.data?.error || "Error de autenticación"
      );
    }
  }
);

/**
 * Slice de autenticación.
 * Aquí definimos el nombre, el estado inicial, las acciones sincrónicas (reducers)
 * y cómo se manejan las acciones asincrónicas (extraReducers).
 */
const authSlice = createSlice({
  name: "auth", // Nombre del slice
  initialState, // Estado inicial definido arriba

  reducers: {
    /**
     * Acción sincrónica para cerrar sesión (logout).
     * Limpia el estado de usuario y token, y elimina el token de localStorage.
     */
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
  },

  /**
   * Manejadores de estados para la acción asincrónica `loginUser`.
   */
  extraReducers: (builder) => {
    builder
      // Mientras se está realizando la petición de login
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      // Cuando la petición fue exitosa
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<ReqRes>) => {
        state.status = "succeeded";
        state.user = action.payload.ourUsers || null;
        state.token = action.payload.token || null;
      })
      // Cuando ocurre un error en la petición
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

/**
 * Exportamos la acción `logout` para poder usarla en nuestros componentes
 * (por ejemplo, para cerrar sesión al hacer clic en un botón).
 */
export const { logout } = authSlice.actions;

/**
 * Exportamos el reducer del slice para integrarlo en el `store` global de Redux.
 */
export default authSlice.reducer;
