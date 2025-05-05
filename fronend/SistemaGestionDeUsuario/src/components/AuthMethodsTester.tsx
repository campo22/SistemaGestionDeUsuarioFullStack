import { useState } from 'react';
import axios from 'axios';

const AuthMethodsTester = () => {
  const [results, setResults] = useState<Array<{ method: string, status: string, data?: any, error?: string }>>([]);
  const [loading, setLoading] = useState(false);

  const testAuthMethods = async () => {
    setLoading(true);
    setResults([]);

    const token = localStorage.getItem('token');
    if (!token) {
      setResults([{
        method: 'Sin token',
        status: 'Error',
        error: 'No hay token disponible'
      }]);
      setLoading(false);
      return;
    }

    // Endpoint a probar
    const endpoint = '/adminuser/get-profile';

    // Diferentes métodos de autenticación
    const methods = [
      {
        name: 'Bearer en Authorization',
        config: {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      },
      {
        name: 'Token en Authorization',
        config: {
          headers: {
            'Authorization': token
          }
        }
      },
      {
        name: 'x-access-token',
        config: {
          headers: {
            'x-access-token': token
          }
        }
      },
      {
        name: 'Token en query param',
        url: `${endpoint}?token=${token}`,
        config: {}
      }
    ];

    for (const method of methods) {
      try {
        const url = method.url || `http://localhost:1010${endpoint}`;
        const response = await axios.get(url, method.config);
        setResults(prev => [...prev, {
          method: method.name,
          status: 'Éxito',
          data: response.data
        }]);
      } catch (error: any) {
        setResults(prev => [...prev, {
          method: method.name,
          status: `Error ${error.response?.status || 'desconocido'}`,
          error: error.response?.data?.error || error.message
        }]);
      }
    }

    setLoading(false);
  };

  return (
    <div className="fixed bottom-0 left-0 bg-gray-800 text-white p-4 m-4 rounded-lg opacity-80 max-w-md overflow-auto max-h-96">
      <h3 className="text-lg font-bold mb-2">Probador de Métodos de Autenticación</h3>

      <button
        onClick={testAuthMethods}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mb-4"
      >
        {loading ? 'Probando...' : 'Probar Métodos'}
      </button>

      {results.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Resultados:</h4>
          {results.map((result, index) => (
            <div key={index} className={`mb-2 p-2 rounded ${result.status === 'Éxito' ? 'bg-green-800' : 'bg-red-800'}`}>
              <p><strong>Método:</strong> {result.method}</p>
              <p><strong>Estado:</strong> {result.status}</p>
              {result.error && <p><strong>Error:</strong> {result.error}</p>}
              {result.data && <p><strong>Datos:</strong> {JSON.stringify(result.data).substring(0, 100)}...</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AuthMethodsTester;