import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  getAllUsers as getAllUsersService,
  getUserById as getUserByIdService,
  updateUser as updateUserService,
  deleteUser as deleteUserService 
} from '@services/user.service';
import { User, UserUpdate } from '@/domain/types/user.types';

interface UsersState {
  users: User[];
  selectedUser: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  selectedUser: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchAllUsers = createAsyncThunk(
  'users/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllUsersService();
      
      if (response.error || response.status !== 200) {
        return rejectWithValue(response.error || 'Failed to fetch users');
      }
      
      return response.ourUsersList || [];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserById = createAsyncThunk(
  'users/fetchById',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await getUserByIdService(userId);
      
      if (response.error || response.status !== 200) {
        return rejectWithValue(response.error || `Failed to fetch user with ID ${userId}`);
      }
      
      return response.ourUsers;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserById = createAsyncThunk(
  'users/update',
  async ({ userId, userData }: { userId: number; userData: UserUpdate }, { rejectWithValue }) => {
    try {
      const response = await updateUserService(userId, userData);
      
      if (response.error || response.status !== 200) {
        return rejectWithValue(response.error || `Failed to update user with ID ${userId}`);
      }
      
      return response.ourUsers;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteUserById = createAsyncThunk(
  'users/delete',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await deleteUserService(userId);
      
      if (response.error || response.status !== 200) {
        return rejectWithValue(response.error || `Failed to delete user with ID ${userId}`);
      }
      
      return userId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Users slice
const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
    clearUsersError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all users
    builder.addCase(fetchAllUsers.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchAllUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
      state.isLoading = false;
      state.users = action.payload;
    });
    builder.addCase(fetchAllUsers.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Fetch user by ID
    builder.addCase(fetchUserById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchUserById.fulfilled, (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.selectedUser = action.payload;
    });
    builder.addCase(fetchUserById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Update user
    builder.addCase(updateUserById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateUserById.fulfilled, (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.selectedUser = action.payload;
      state.users = state.users.map(user => 
        user.id === action.payload.id ? action.payload : user
      );
    });
    builder.addCase(updateUserById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Delete user
    builder.addCase(deleteUserById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deleteUserById.fulfilled, (state, action: PayloadAction<number>) => {
      state.isLoading = false;
      state.users = state.users.filter(user => user.id !== action.payload);
      if (state.selectedUser?.id === action.payload) {
        state.selectedUser = null;
      }
    });
    builder.addCase(deleteUserById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearSelectedUser, clearUsersError } = usersSlice.actions;

export default usersSlice.reducer;