import { useState } from 'react';
import api from '../api/interceptors';



const EndpointTester = () => {
  const [results, setResults] = useState<Array<{ endpoint: string, status: string, data?: any, error?: string }>>([]);
  const [loading, setLoading] = useState(false);

  const testEndpoints = async () => {
    setLoading(true);
    setResults([]);

    const endpoints = [
      '/adminuser/get-profile',
      '/auth/adminuser/get-profile',
      '/api/adminuser/get-profile',
      '/user/profile',
      '/profile',
      '/admin/get-all-users' // Este debería funcionar si tienes rol de admin
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await api.get(endpoint);
        setResults(prev => [...prev, {
          endpoint,
          status: 'Éxito',
          data: response.data
        }]);
      } catch (error: any) {
        setResults(prev => [...prev, {
          endpoint,
          status: `Error ${error.response?.status || 'desconocido'}`,
          error: error.response?.data?.error || error.message
        }]);
      }
    }

    setLoading(false);
  };

  return (
    <div className="fixed top-0 left-0 bg-gray-800 text-white p-4 m-4 rounded-lg opacity-80 max-w-md overflow-auto max-h-96">
      <h3 className="text-lg font-bold mb-2">Probador de Endpoints</h3>

      <button
        onClick={testEndpoints}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mb-4"
      >
        {loading ? 'Probando...' : 'Probar Endpoints'}
      </button>

      {results.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Resultados:</h4>
          {results.map((result, index) => (
            <div key={index} className={`mb-2 p-2 rounded ${result.status === 'Éxito' ? 'bg-green-800' : 'bg-red-800'}`}>
              <p><strong>Endpoint:</strong> {result.endpoint}</p>
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

export default EndpointTester;