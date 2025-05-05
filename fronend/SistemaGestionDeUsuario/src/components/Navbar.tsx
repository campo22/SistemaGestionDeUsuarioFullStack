import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { logoutUser } from '../features/auth/authSlice';

const Navbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  // Si no está autenticado, no mostrar la barra de navegación
  if (!isAuthenticated) return null;

  return (
    <nav className="bg-blue-600 text-white shadow-md fixed top-0 left-0 right-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-xl font-bold">
              User Management
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {/* Enlaces comunes para todos los usuarios */}
            <Link to="/dashboard" className="hover:text-blue-200">
              Dashboard
            </Link>

            <Link to="/profile" className="hover:text-blue-200">
              Mi Perfil
            </Link>

            {/* Enlaces solo para administradores */}
            {user?.role === 'ADMIN' && (
              <Link to="/users" className="hover:text-blue-200">
                Gestión de Usuarios
              </Link>
            )}

            {/* Información del usuario y botón de logout */}
            <div className="flex items-center ml-4">
              <span className="mr-2">
                {user?.name} ({user?.role})
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
