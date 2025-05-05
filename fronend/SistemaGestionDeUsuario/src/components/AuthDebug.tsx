import { useAppSelector } from '../app/hooks';

const AuthDebug = () => {
  const { token, status: authStatus, error: authError } = useAppSelector((state) => state.auth);
  const { currentUser, status: userStatus, error: userError } = useAppSelector((state) => state.users);

  // Solo mostrar en desarrollo - usando import.meta.env para Vite
  if (import.meta.env.MODE !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-0 right-0 bg-gray-800 text-white p-4 m-4 rounded-lg opacity-80 max-w-md overflow-auto max-h-96">
      <h3 className="text-lg font-bold mb-2">Auth Debug</h3>

      <div className="mb-2">
        <p><strong>Token:</strong> {token ? '✅ Presente' : '❌ No hay token'}</p>
        <p><strong>Auth Status:</strong> {authStatus}</p>
        {authError && <p className="text-red-400"><strong>Auth Error:</strong> {authError}</p>}
      </div>

      <div className="mb-2">
        <p><strong>User:</strong> {currentUser ? `✅ ${currentUser.name} (${currentUser.role})` : '❌ No hay usuario'}</p>
        <p><strong>User Status:</strong> {userStatus}</p>
        {userError && <p className="text-red-400"><strong>User Error:</strong> {userError}</p>}
      </div>

      <div className="text-xs mt-2">
        <p>localStorage tokens:</p>
        <p>token: {localStorage.getItem('token') ? '✅' : '❌'}</p>
        <p>refreshToken: {localStorage.getItem('refreshToken') ? '✅' : '❌'}</p>
      </div>
    </div>
  );
};

export default AuthDebug;
