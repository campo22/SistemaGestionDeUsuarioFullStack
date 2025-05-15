import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Button from '@components/UI/Button';
import Loading from '@components/UI/Loading';
import { toast } from 'react-toastify';
import useUsers from '@hooks/useUsers';
import { User } from '@/domain/types/user.types';

const UsersList: React.FC = () => {
  const { users, isLoading, error, getAllUsers, deleteUser } = useUsers();
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const loadUsers = async (retryCount = 0) => {
    try {
      await getAllUsers();
    } catch (error: any) {
      // Si es un error de autenticación, no hacer reintentos
      if (error.response?.status === 401 ||
        (error.message && (
          error.message.toLowerCase().includes('sesión') ||
          error.message.toLowerCase().includes('token')
        ))) {
        // Limpiar cualquier intervalo existente
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }

        toast.error('Su sesión ha expirado. Por favor, vuelva a iniciar sesión.');
        sessionStorage.setItem('redirectUrl', window.location.pathname);
        window.location.href = '/login';
        return;
      }

      // Solo reintentar errores que no sean de autenticación
      if (retryCount < 2 && error.response?.status !== 401) {
        toast.warning('Reintentando obtener los usuarios...');
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
        return loadUsers(retryCount + 1);
      }

      toast.error(error.message || 'Error al cargar los usuarios');
    }
  };

  useEffect(() => {
    let isSubscribed = true;

    const initializeUsers = async () => {
      try {
        if (isSubscribed) {
          await loadUsers();
          // Solo configurar el intervalo si la primera carga fue exitosa
          intervalRef.current = setInterval(() => {
            if (isSubscribed) {
              loadUsers();
            }
          }, 5 * 60 * 1000);
        }
      } catch (error) {
        console.error('Error en la carga inicial:', error);
      }
    };

    initializeUsers();

    // Cleanup
    return () => {
      isSubscribed = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm('¿Está seguro de que desea eliminar este usuario?')) {
      setDeletingUserId(userId);
      try {
        await deleteUser(userId);
        toast.success('Usuario eliminado correctamente');
      } catch (error: any) {
        toast.error(error.message || 'Error al eliminar el usuario');
      } finally {
        setDeletingUserId(null);
      }
    }
  };

  if (isLoading && users.length === 0) {
    return <Loading center message="Cargando usuarios..." />;
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="mb-2 text-error-600">{error}</p>
        <Button onClick={() => loadUsers()} variant="primary">
          Intentar de nuevo
        </Button>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="mb-2 text-gray-500">No se encontraron usuarios.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left border-b">ID</th>
            <th className="px-4 py-2 text-left border-b">Nombre</th>
            <th className="px-4 py-2 text-left border-b">Email</th>
            <th className="px-4 py-2 text-left border-b">Ciudad</th>
            <th className="px-4 py-2 text-left border-b">Rol</th>
            <th className="px-4 py-2 text-left border-b">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: User) => (
            <tr key={user.id} className="hover:bg-gray-50 animate-fade-in">
              <td className="px-4 py-2 border-b">{user.id}</td>
              <td className="px-4 py-2 border-b">{user.name}</td>
              <td className="px-4 py-2 border-b">{user.email}</td>
              <td className="px-4 py-2 border-b">{user.city || '-'}</td>
              <td className="px-4 py-2 border-b">
                <span className={`px-2 py-1 rounded-full text-xs ${user.role === 'ADMIN'
                  ? 'bg-primary-100 text-primary-800'
                  : 'bg-secondary-100 text-secondary-800'
                  }`}>
                  {user.role}
                </span>
              </td>
              <td className="px-4 py-2 border-b">
                <div className="flex space-x-2">
                  <Link
                    to={`/admin/users/${user.id}`}
                    className="px-2 py-1 text-sm text-white transition-colors rounded bg-secondary-600 hover:bg-secondary-700"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="px-2 py-1 text-sm text-white transition-colors rounded bg-error-600 hover:bg-error-700"
                    disabled={deletingUserId === user.id}
                  >
                    {deletingUserId === user.id ? 'Eliminando...' : 'Eliminar'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersList;