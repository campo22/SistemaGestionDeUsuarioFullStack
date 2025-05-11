import { useAppSelector } from '../app/hooks';

const AuthDebug = () => {
  const { token, status: authStatus, error: authError, user } = useAppSelector((state) => state.auth);


  // Solo mostrar en desarrollo - usando import.meta.env para Vite
  if (import.meta.env.MODE !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-0 right-0 max-w-md p-4 m-4 overflow-auto text-white bg-gray-800 rounded-lg opacity-80 max-h-96">
      <h3 className="mb-2 text-lg font-bold">Auth Debug</h3>

      <div className="mb-2">
        <p><strong>Token:</strong> {token ? '✅ Presente' : '❌ No hay token'}</p>
        <p><strong>Auth Status:</strong> {authStatus}</p>
        {authError && <p className="text-red-400"><strong>Auth Error:</strong> {authError}</p>}
      </div>

      <div className="mb-2">
        <p><strong>User:</strong> {user ? `✅ ${user.name} (${user.role})` : '❌ No hay usuario'}</p>
        <p><strong>User Status:</strong> {authStatus}</p>
        {authError && <p className="text-red-400"><strong>User Error:</strong> {authError}</p>}
      </div>

      <div className="mt-2 text-xs">
        <p>localStorage tokens:</p>
        <p>token: {localStorage.getItem('token') ? '✅' : '❌'}</p>
        <p>refreshToken: {localStorage.getItem('refreshToken') ? '✅' : '❌'}</p>
      </div>
    </div>
  );
};

export default AuthDebug;
