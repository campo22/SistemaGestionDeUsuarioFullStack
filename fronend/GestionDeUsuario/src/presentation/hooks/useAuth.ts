import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@store/store';
import { 
  login as loginAction, 
  register as registerAction, 
  logout as logoutAction,
  fetchUserProfile as fetchUserProfileAction,
  clearError as clearErrorAction
} from '@store/slices/authSlice';
import { UserCredentials, RegisterUserData } from '@/domain/types/user.types';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const login = async (credentials: UserCredentials) => {
    return await dispatch(loginAction(credentials)).unwrap();
  };

  const register = async (userData: RegisterUserData) => {
    return await dispatch(registerAction(userData)).unwrap();
  };

  const logout = () => {
    dispatch(logoutAction());
  };

  const fetchUserProfile = async () => {
    return await dispatch(fetchUserProfileAction()).unwrap();
  };

  const clearError = () => {
    dispatch(clearErrorAction());
  };

  const isAdmin = user?.role === 'ADMIN';
  const isUser = user?.role === 'USER';

  return {
    user,
    isAuthenticated,
    isLoading,
    isAdmin,
    isUser,
    error,
    login,
    register,
    logout,
    fetchUserProfile,
    clearError,
  };
};

export default useAuth;