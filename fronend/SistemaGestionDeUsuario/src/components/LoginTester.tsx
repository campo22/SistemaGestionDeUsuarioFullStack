import { useState } from 'react';
import axios from 'axios';
import { useAppDispatch } from '../app/hooks';
import { loginSuccess } from '../features/auth/authSlice';

const LoginTester = () => {
  const dispatch = useAppDispatch();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success?: boolean, message?: string, data?: any }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async () => {
    setLoading(true);
    setResult({});

    try {
      // Hacer login directamente con axios para evitar interceptores
      const response = await axios.post('http://localhost:1010/auth/login', credentials);

      // Guardar tokens en localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }

      // Actualizar estado de Redux
      dispatch(loginSuccess({
        token: response.data.token,
        user: response.data.ourUsers
      }));

      setResult({
        success: true,
        message: 'Login exitoso',
        data: response.data
      });

      // Recargar la página para aplicar el nuevo token
      window.location.reload();
    } catch (error: any) {
      setResult({
        success: false,
        message: error.response?.data?.error || error.message,
        data: error.response?.data
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-0 right-0 bg-gray-800 text-white p-4 m-4 rounded-lg opacity-80 max-w-md overflow-auto max-h-96">
      <h3 className="text-lg font-bold mb-2">Login Tester</h3>

      <div className="mb-2">
        <input
          type="email"
          name="email"
          value={credentials.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-2 mb-2 text-black rounded"
        />
        <input
          type="password"
          name="password"
          value={credentials.password}
          onChange={handleChange}
          placeholder="Contraseña"
          className="w-full p-2 mb-2 text-black rounded"
        />
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </div>

      {Object.keys(result).length > 0 && (
        <div className={`mt-4 p-2 rounded ${result.success ? 'bg-green-800' : 'bg-red-800'}`}>
          <p><strong>Estado:</strong> {result.success ? 'Éxito' : 'Error'}</p>
          {result.message && <p><strong>Mensaje:</strong> {result.message}</p>}
          {result.data && <p><strong>Datos:</strong> {JSON.stringify(result.data).substring(0, 100)}...</p>}
        </div>
      )}
    </div>
  );
};

export default LoginTester;