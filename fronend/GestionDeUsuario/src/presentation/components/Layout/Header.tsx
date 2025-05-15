import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '@hooks/useAuth';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-primary-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="font-bold text-xl">
              UserMS
            </Link>
            {isAuthenticated && (
              <nav className="ml-10 flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-600 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-600 hover:text-white transition-colors"
                >
                  Perfil
                </Link>
                {user?.role === 'ADMIN' && (
                  <Link
                    to="/admin/users"
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-600 hover:text-white transition-colors"
                  >
                    Gestionar Usuarios
                  </Link>
                )}
              </nav>
            )}
          </div>
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center">
                <span className="mr-4 text-sm hidden sm:inline-block">
                  {user?.name} ({user?.role})
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium bg-primary-800 hover:bg-primary-900 transition-colors"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="space-x-3">
                <Link
                  to="/login"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-600 transition-colors"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-2 rounded-md text-sm font-medium bg-primary-800 hover:bg-primary-900 transition-colors"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;