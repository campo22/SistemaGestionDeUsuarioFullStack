import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@store/store";
import {
  fetchAllUsers,
  fetchUserById,
  updateUserById,
  deleteUserById,
  clearSelectedUser,
  clearUsersError,
} from "@store/slices/usersSlice";
import { UserUpdate } from "@/domain/types/user.types";

export const useUsers = () => {
  const dispatch: AppDispatch = useDispatch();
  const { users, selectedUser, isLoading, error } = useSelector(
    (state: RootState) => state.users
  );

  const getAllUsers = async () => {
    return await dispatch(fetchAllUsers()).unwrap();
  };

  const getUserById = async (userId: number) => {
    return await dispatch(fetchUserById(userId)).unwrap();
  };

  const updateUser = async (userId: number, userData: UserUpdate) => {
    return await dispatch(updateUserById({ userId, userData })).unwrap();
  };

  const deleteUser = async (userId: number) => {
    return await dispatch(deleteUserById(userId)).unwrap();
  };

  const clearUser = () => {
    dispatch(clearSelectedUser());
  };

  const clearError = () => {
    dispatch(clearUsersError());
  };

  return {
    users,
    selectedUser,
    isLoading,
    error,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    clearUser,
    clearError,
  };
};

export default useUsers;
