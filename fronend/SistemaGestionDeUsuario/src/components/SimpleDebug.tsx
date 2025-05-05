import React, { useState } from 'react';
import axios from 'axios';

const SimpleDebug = () => {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testLogin = async () => {
    setLoading(true);
    setResult('Intentando login...');

    try {
      // Hacer login directamente con axios
      const loginResponse = await axios.post('http://localhost:1010/auth/login', {
        email: 'diver1@example.com',
        password: '12345'
      });

      setResult(`Login exitoso: ${JSON.stringify(loginResponse.data)}`);

      // Guardar token
      if (loginResponse.data.token) {
        localStorage.setItem('token', loginResponse.data.token);

        // Intentar obtener perfil
        try {
          const profileResponse = await axios.get(`http://localhost:1010/adminuser/get-profile?token=${loginResponse.data.token}`);
          setResult(prev => `${prev}\n\nPerfil obtenido: ${JSON.stringify(profileResponse.data)}`);
        } catch (profileError: any) {
          setResult(prev => `${prev}\n\nError al obtener perfil: ${profileError.message}`);
        }
      }
    } catch (error: any) {
      setResult(`Error en login: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testDirectProfile = async () => {
    setLoading(true);
    setResult('Intentando obtener perfil directamente...');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setResult('No hay token en localStorage');
        setLoading(false);
        return;
      }

      const response = await axios.get(`http://localhost:1010/adminuser/get-profile?token=${token}`);
      setResult(`Perfil obtenido: ${JSON.stringify(response.data)}`);
    } catch (error: any) {
      setResult(`Error al obtener perfil: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 bg-white p-4 m-4 rounded-lg shadow-lg max-w-md overflow-auto max-h-screen z-50">
      <h3 className="text-lg font-bold mb-2">Depuración Simple</h3>

      <div className="mb-4 flex space-x-2">
        <button
          onClick={testLogin}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {loading ? 'Probando...' : 'Probar Login'}
        </button>

        <button
          onClick={testDirectProfile}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          {loading ? 'Probando...' : 'Probar Perfil'}
        </button>
      </div>

      {result && (
        <div className="mt-4 p-2 bg-gray-100 rounded">
          <pre className="whitespace-pre-wrap text-xs">{result}</pre>
        </div>
      )}
    </div>
  );
};

export default SimpleDebug;