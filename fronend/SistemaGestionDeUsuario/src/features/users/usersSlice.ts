import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "../../types/user";
import userService from "./services/userService";

// Definir el tipo de estado
interface UsersState {
  currentUser: User | null;
  users: User[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// Estado inicial
const initialState: UsersState = {
  currentUser: null,
  users: [],
  status: "idle",
  error: null,
};

// Thunk para obtener el perfil del usuario actual
export const fetchMyProfile = createAsyncThunk(
  "users/fetchMyProfile",
  async (_, { rejectWithValue }) => {
    try {
      return await userService.getMyProfile();
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Error al obtener perfil"
      );
    }
  }
);

// Thunk para obtener todos los usuarios
export const fetchAllUsers = createAsyncThunk(
  "users/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      return await userService.getAllUsers();
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Error al obtener usuarios"
      );
    }
  }
);

// Thunk para obtener un usuario por ID
export const fetchUserById = createAsyncThunk(
  "users/fetchUserById",
  async (userId: number, { rejectWithValue }) => {
    try {
      return await userService.getUserById(userId);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Error al obtener usuario"
      );
    }
  }
);

// Thunk para actualizar un usuario
export const updateUser = createAsyncThunk(
  "users/updateUser",
  async (
    { userId, userData }: { userId: number; userData: Partial<User> },
    { rejectWithValue }
  ) => {
    try {
      return await userService.updateUser(userId, userData);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Error al actualizar usuario"
      );
    }
  }
);

// Thunk para eliminar un usuario
export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (userId: number, { rejectWithValue }) => {
    try {
      await userService.deleteUser(userId);
      return userId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Error al eliminar usuario"
      );
    }
  }
);

// Slice
const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
    clearUsersError: (state) => {
      state.error = null;
    },
    // Acción para establecer un usuario ficticio (para pruebas)
    setFakeUser: (state) => {
      state.currentUser = {
        id: 1,
        name: "Usuario de Prueba",
        email: "usuario@ejemplo.com",
        city: "Ciudad",
        role: "ADMIN",
      };
      state.status = "succeeded";
    },
    // Nueva acción para establecer el usuario actual directamente
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
      state.status = "succeeded";
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchMyProfile
      .addCase(fetchMyProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMyProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentUser = action.payload;
        state.error = null;
      })
      .addCase(fetchMyProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // fetchAllUsers
      .addCase(fetchAllUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload;
        state.error = null;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // fetchUserById
      .addCase(fetchUserById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentUser = action.payload;
        state.error = null;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // updateUser
      .addCase(updateUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = "succeeded";

        // Actualizar el usuario en la lista si existe
        const index = state.users.findIndex(
          (user) => user.id === action.payload.id
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }

        // Si es el usuario actual, actualizarlo también
        if (state.currentUser?.id === action.payload.id) {
          state.currentUser = action.payload;
        }

        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // deleteUser
      .addCase(deleteUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = state.users.filter((user) => user.id !== action.payload);

        // Si es el usuario actual, limpiarlo
        if (state.currentUser?.id === action.payload) {
          state.currentUser = null;
        }

        state.error = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const {
  clearCurrentUser,
  clearUsersError,
  setFakeUser,
  setCurrentUser,
} = usersSlice.actions;
export default usersSlice.reducer;
