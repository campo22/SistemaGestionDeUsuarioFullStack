import React, { useState } from 'react';
import axios from 'axios';

const TokenTester = () => {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('diver1@example.com');
  const [password, setPassword] = useState('12345');

  const testLogin = async () => {
    setLoading(true);
    setResult('Intentando login...');

    try {
      const loginResponse = await axios.post('http://localhost:1010/auth/login', {
        email,
        password
      }, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      setResult(`Login exitoso:\n${JSON.stringify(loginResponse.data, null, 2)}`);

      // Guardar tokens
      if (loginResponse.data.token) {
        localStorage.setItem('token', loginResponse.data.token);
        if (loginResponse.data.refreshToken) {
          localStorage.setItem('refreshToken', loginResponse.data.refreshToken);
        }
      }
    } catch (error: any) {
      setResult(`Error en login: ${error.message}\n${JSON.stringify(error.response?.data, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  const testProfile = async () => {
    setLoading(true);
    setResult('Intentando obtener perfil...');

    const token = localStorage.getItem('token');
    if (!token) {
      setResult('No hay token en localStorage');
      setLoading(false);
      return;
    }

    try {
      const profileResponse = await axios.get(`http://localhost:1010/adminuser/get-profile?token=${token}`, {
        headers: {
          'Accept': 'application/json'
        }
      });

      setResult(`Perfil obtenido:\n${JSON.stringify(profileResponse.data, null, 2)}`);
    } catch (error: any) {
      setResult(`Error al obtener perfil: ${error.message}\n${JSON.stringify(error.response?.data, null, 2)}`);

      // Si es error 401 o 403, intentar con otro endpoint
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        try {
          setResult(prev => `${prev}\n\nIntentando con endpoint alternativo...`);

          const alternativeResponse = await axios.get(`http://localhost:1010/user/profile?token=${token}`, {
            headers: {
              'Accept': 'application/json'
            }
          });

          setResult(prev => `${prev}\n\nPerfil obtenido desde endpoint alternativo:\n${JSON.stringify(alternativeResponse.data, null, 2)}`);
        } catch (alternativeError: any) {
          setResult(prev => `${prev}\n\nError con endpoint alternativo: ${alternativeError.message}\n${JSON.stringify(alternativeError.response?.data, null, 2)}`);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const clearTokens = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setResult('Tokens eliminados de localStorage');
  };

  return (
    <div className="fixed top-0 right-0 bg-white p-4 m-4 rounded-lg shadow-lg max-w-md overflow-auto max-h-screen z-50">
      <h3 className="text-lg font-bold mb-2">Probador de Token</h3>

      <div className="mb-4">
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="mb-4 flex space-x-2">
        <button
          onClick={testLogin}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex-1"
        >
          {loading ? 'Probando...' : 'Login'}
        </button>

        <button
          onClick={testProfile}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex-1"
        >
          {loading ? 'Probando...' : 'Perfil'}
        </button>

        <button
          onClick={clearTokens}
          disabled={loading}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex-1"
        >
          Limpiar
        </button>
      </div>

      {result && (
        <div className="mt-4 p-2 bg-gray-100 rounded">
          <pre className="whitespace-pre-wrap text-xs overflow-auto max-h-96">{result}</pre>
        </div>
      )}
    </div>
  );
};

export default TokenTester;