import { useState } from 'react';
import { useAppSelector } from '../../../app/hooks';

const UserProfile = () => {
  const { user, status } = useAppSelector(state => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  
  if (status === 'loading' || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Mi Perfil</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Información Personal</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {isEditing ? 'Cancelar' : 'Editar'}
          </button>
        </div>
        
        {isEditing ? (
          <div className="space-y-4">
            <p className="text-gray-600">La edición de perfil no está implementada aún.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 border rounded-lg">
              <p className="text-gray-600">Nombre</p>
              <p className="font-medium">{user.name}</p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <p className="text-gray-600">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <p className="text-gray-600">Ciudad</p>
              <p className="font-medium">{user.city}</p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <p className="text-gray-600">Rol</p>
              <p className="font-medium">{user.role}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
