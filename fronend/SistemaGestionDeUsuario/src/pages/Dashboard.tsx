import { Link } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';

export const Dashboard = () => {
    const { user, status } = useAppSelector((state) => state.auth);

    if (status === 'loading' || !user) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">
                Bienvenido al Dashboard, {user.name}
            </h1>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Información de tu cuenta</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Tarjeta para todos los usuarios */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-3">Mi Perfil</h3>
                    <p className="text-gray-600 mb-4">
                        Visualiza y edita tu información personal
                    </p>
                    <Link
                        to="/profile"
                        className="block text-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Ver Perfil
                    </Link>
                </div>

                {/* Tarjeta solo para administradores */}
                {user.role === 'ADMIN' && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold mb-3">Gestión de Usuarios</h3>
                        <p className="text-gray-600 mb-4">
                            Administra los usuarios del sistema
                        </p>
                        <Link
                            to="/users"
                            className="block text-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            Administrar Usuarios
                        </Link>
                    </div>
                )}

            </div>

            {/* Nota sobre el modo de desarrollo */}
            {status === 'failed' && (
                <div className="mt-8 p-4 bg-yellow-100 rounded-lg text-center">
                    <p className="text-yellow-800">
                        <strong>Nota:</strong> Estás viendo datos de usuario simulados debido a limitaciones en la API.
                    </p>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
