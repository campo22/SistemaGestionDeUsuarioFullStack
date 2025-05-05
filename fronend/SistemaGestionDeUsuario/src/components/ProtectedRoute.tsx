import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

/**
 * Componente que protege rutas basado en autenticación y roles
 * @param allowedRoles - Roles permitidos para acceder a la ruta (opcional)
 */
const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user, status } = useAppSelector(state => state.auth);
  const location = useLocation();

  // Si no está autenticado, redirigir a login
  if (!isAuthenticated) {
    console.log("No autenticado, redirigiendo a login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si está cargando, mostrar spinner
  if (status === 'loading') {
    console.log("Cargando autenticación...");
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Si se requieren roles específicos y el usuario no tiene ninguno de ellos
  if (
    allowedRoles &&
    allowedRoles.length > 0 &&
    user &&
    !allowedRoles.includes(user.role ?? '')
  ) {
    console.log(`Usuario no tiene los roles requeridos: ${allowedRoles.join(', ')}`);
    // Redirigir a una página de acceso denegado
    return <Navigate to="/unauthorized" replace />;
  }

  // Si todo está bien, mostrar el contenido protegido
  console.log("Usuario autenticado y autorizado");
  return <Outlet />;
};

export default ProtectedRoute;
