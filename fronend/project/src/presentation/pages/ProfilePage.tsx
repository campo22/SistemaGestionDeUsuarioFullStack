import React, { useEffect, useState } from 'react';
import Layout from '@components/Layout/Layout';
import ProfileForm from '@components/Forms/ProfileForm';
import Loading from '@components/UI/Loading';
import useAuth from '@hooks/useAuth';
import { toast } from 'react-toastify';

const ProfilePage: React.FC = () => {
  const { user, isLoading, fetchUserProfile } = useAuth();
  const [loadingProfile, setLoadingProfile] = useState(true);

  const loadProfile = async () => {
    setLoadingProfile(true);
    try {
      await fetchUserProfile();
    } catch (error: any) {
      toast.error(error.message || 'Error al cargar el perfil');
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    if (!user) { // Solo cargar si no hay usuario
      loadProfile();
    } else {
      setLoadingProfile(false);
    }
  }, [user]);

  const handleProfileUpdated = () => {
    loadProfile();
  };

  return (
    <Layout>
      <div className="page-container">
        <div className="max-w-3xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Tu Perfil</h1>
            <p className="text-gray-600">Administra tu información y configuración de cuenta</p>
          </header>

          {isLoading || loadingProfile ? (
            <Loading center message="Cargando perfil..." />
          ) : (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6 sm:p-8">
                <div className="mb-8 pb-4 border-b">
                  <div className="flex items-center">
                    <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-4">
                      <span className="text-2xl font-semibold">
                        {user?.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">{user?.name}</h2>
                      <p className="text-gray-600">{user?.email}</p>
                      <span className="inline-block mt-1 px-3 py-1 rounded-full text-xs bg-primary-100 text-primary-800">
                        {user?.role}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Editar Perfil</h3>
                  <ProfileForm user={user} onProfileUpdated={handleProfileUpdated} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;