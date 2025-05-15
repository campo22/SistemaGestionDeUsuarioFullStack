import React, { useEffect } from 'react';
import Layout from '@components/Layout/Layout';
import Loading from '@components/UI/Loading';
import useAuth from '@hooks/useAuth';
import { toast } from 'react-toastify';

const DashboardPage: React.FC = () => {
  const { user, isLoading, fetchUserProfile, isAdmin } = useAuth();

  useEffect(() => {
    // Fetch user profile on component mount
    const loadProfile = async () => {
      if (!user) { // Solo cargar si no hay usuario
        try {
          await fetchUserProfile();
        } catch (error: any) {
          toast.error(error.message || 'Error al cargar los usuarios');
        }
      }
    };

    loadProfile();
  }, [user, fetchUserProfile]);

  if (isLoading) {
    return (
      <Layout>
        <div className="page-container min-h-[calc(100vh-160px)] flex items-center justify-center">
          <Loading message="Cargando el panel de control..." />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-container">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Control</h1>
          <p className="text-gray-600">Bienvenido de nuevo, {user?.name}</p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Profile Card */}
          <div className="card">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold">Tu Perfil</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Administra tu información personal y configuración de cuenta
            </p>
            <a href="/profile" className="text-primary-600 hover:text-primary-800 font-medium">
              Ver Perfil →
            </a>
          </div>

          {/* Admin-only card */}
          {isAdmin && (
            <div className="card">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center text-secondary-600 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold">Gestión de Usuarios</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Administra usuarios, asigna roles y asegura el acceso adecuado al sistema
              </p>
              <a href="/admin/users" className="text-secondary-600 hover:text-secondary-800 font-medium">
                Gestionar Usuarios →
              </a>
            </div>
          )}

          {/* Shared card for both roles */}
          <div className="card">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-success-100 flex items-center justify-center text-success-600 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold">Configuración de la Cuenta</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Actualiza tu contraseña, preferencias de notificación y configuración de seguridad
            </p>
            <a href="/profile" className="text-success-600 hover:text-success-800 font-medium">
              Administrar Configuración →
            </a>
          </div>
        </div>

        {/* Role-specific welcome message */}
        <div className="mt-10 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-3">
            {isAdmin ? 'Acceso al Panel de Administración' : 'Acceso al Panel de Usuario'}
          </h2>
          <p className="text-gray-600">
            {isAdmin
              ? 'Como administrador, tienes acceso completo para gestionar usuarios, ver estadísticas del sistema y configurar la aplicación.'
              : 'Como usuario, puedes gestionar tu perfil, actualizar la configuración de tu cuenta y acceder a las funciones autorizadas.'}
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;