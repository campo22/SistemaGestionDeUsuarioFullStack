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
    const { token } = useAppSelector((state) => state.auth);
    const { currentUser } = useAppSelector((state) => state.users);
    const location = useLocation();

    // Si no hay token, redirigir a login
    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Si se especifican roles y el usuario no tiene un rol permitido
    if (
        allowedRoles &&
        allowedRoles.length > 0 &&
        currentUser &&
        !allowedRoles.includes(currentUser.role)
    ) {
        // Redirigir a una página de acceso denegado o al dashboard
        return <Navigate to="/unauthorized" replace />;
    }

    // Si está autenticado y tiene los permisos necesarios, mostrar el contenido
    return <Outlet />;
};

export default ProtectedRoute;