import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@components/Layout/Layout';
import UserEditForm from '@components/Users/UserEditForm';
import Button from '@components/UI/Button';
import Loading from '@components/UI/Loading';
import useUsers from '@hooks/useUsers';
import { toast } from 'react-toastify';

const AdminUserEditPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { selectedUser, isLoading, getUserById, clearUser, error } = useUsers();

  useEffect(() => {
    if (userId) {
      loadUser(parseInt(userId));
    }

    // Cleanup
    return () => {
      clearUser();
    };
  }, [userId]);

  const loadUser = async (id: number) => {
    try {
      await getUserById(id);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load user');
    }
  };

  const handleGoBack = () => {
    navigate('/admin/users');
  };

  const handleUserUpdated = () => {
    navigate('/admin/users');
    toast.success('Usuario actualizado correctamente');
  };

  return (
    <Layout>
      <div className="page-container">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Editar Usuario</h1>
            <Button variant="outline" onClick={handleGoBack}>
              Volver a Usuarios
            </Button>
          </div>

          {isLoading && !selectedUser ? (
            <Loading center message="Cargando datos del usuario..." />
          ) : error ? (
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <p className="text-error-600 mb-4">{error}</p>
              <Button variant="primary" onClick={handleGoBack}>
                Volver a la Lista de Usuarios
              </Button>
            </div>
          ) : selectedUser ? (
            <div className="bg-white shadow rounded-lg overflow-hidden animate-fade-in">
              <div className="p-6 sm:p-8">
                <div className="mb-6 pb-4 border-b">
                  <p className="text-sm text-gray-500">ID de Usuario: {selectedUser.id}</p>
                  <h2 className="text-xl font-semibold mt-2">{selectedUser.name}</h2>
                  <div className="flex items-center mt-1">
                    <span className="text-gray-600 mr-3">{selectedUser.email}</span>
                    <span className="inline-block px-2 py-1 rounded-full text-xs bg-primary-100 text-primary-800">
                      {selectedUser.role}
                    </span>
                  </div>
                </div>

                <UserEditForm
                  userId={parseInt(userId || '0')}
                  onUserUpdated={handleUserUpdated}
                />
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <p className="text-gray-600 mb-4">Usuario no encontrado o no tienes permiso para editar este usuario.</p>
              <Button variant="primary" onClick={handleGoBack}>
                Volver a la Lista de Usuarios
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminUserEditPage;