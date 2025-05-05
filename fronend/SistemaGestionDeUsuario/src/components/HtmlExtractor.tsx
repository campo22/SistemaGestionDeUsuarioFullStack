import React, { useState } from 'react';
import axios from 'axios';

const HtmlExtractor = () => {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);

  const login = async () => {
    try {
      setResult('Intentando login...');

      const loginResponse = await axios.post('http://localhost:1010/auth/login', {
        email: 'diver1@example.com',
        password: '12345'
      });

      setResult(`Login exitoso: ${JSON.stringify(loginResponse.data)}`);

      // Guardar token
      if (loginResponse.data.token) {
        localStorage.setItem('token', loginResponse.data.token);
        if (loginResponse.data.refreshToken) {
          localStorage.setItem('refreshToken', loginResponse.data.refreshToken);
        }
        return loginResponse.data.token;
      }

      return null;
    } catch (error: any) {
      setResult(`Error en login: ${error.message}`);
      return null;
    }
  };

  const extractFromHtml = async () => {
    setLoading(true);
    setResult('Iniciando proceso...');

    try {
      // Verificar si hay token
      let token = localStorage.getItem('token');

      // Si no hay token, intentar login
      if (!token) {
        setResult('No hay token, intentando login...');
        token = await login();

        if (!token) {
          setResult('No se pudo obtener token');
          setLoading(false);
          return;
        }
      }

      setResult(prev => `${prev}\nObteniendo datos con token: ${token.substring(0, 10)}...`);

      try {
        // Intentar obtener datos directamente como JSON
        const response = await axios.get(`http://localhost:1010/adminuser/get-profile?token=${token}`, {
          headers: {
            'Accept': 'application/json'
          }
        });

        // Si la respuesta es JSON
        if (response.data && response.data.ourUsers) {
          setExtractedData(response.data.ourUsers);
          setResult(prev => `${prev}\nDatos obtenidos correctamente como JSON`);
        } else {
          setResult(prev => `${prev}\nLa respuesta no contiene datos de usuario`);
        }
      } catch (error: any) {
        // Si hay error 401, intentar login y volver a intentar
        if (error.response && error.response.status === 401) {
          setResult(`Error 401 (No autorizado), intentando login...`);

          const newToken = await login();
          if (newToken) {
            setResult(prev => `${prev}\nNuevo token obtenido, reintentando...`);

            try {
              // Reintentar con el nuevo token
              const response = await axios.get(`http://localhost:1010/adminuser/get-profile?token=${newToken}`, {
                headers: {
                  'Accept': 'application/json'
                }
              });

              // Si la respuesta es JSON
              if (response.data && response.data.ourUsers) {
                setExtractedData(response.data.ourUsers);
                setResult(prev => `${prev}\nDatos obtenidos correctamente como JSON en segundo intento`);
              } else {
                setResult(prev => `${prev}\nLa respuesta no contiene datos de usuario en segundo intento`);
              }
            } catch (retryError: any) {
              setResult(prev => `${prev}\nError en segundo intento: ${retryError.message}`);
            }
          }
        } else {
          setResult(`Error al obtener datos: ${error.message}`);

          // Mostrar más detalles del error
          if (error.response) {
            setResult(prev => `${prev}\nStatus: ${error.response.status}`);
            setResult(prev => `${prev}\nData: ${JSON.stringify(error.response.data)}`);
          }
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const saveUserToRedux = () => {
    if (!extractedData) {
      setResult(prev => `${prev}\nNo hay datos para guardar en Redux`);
      return;
    }

    try {
      // Aquí simularemos guardar en Redux
      // En una aplicación real, usarías dispatch
      localStorage.setItem('currentUser', JSON.stringify(extractedData));
      setResult(prev => `${prev}\nDatos guardados en localStorage (simulando Redux)`);
    } catch (error: any) {
      setResult(prev => `${prev}\nError al guardar datos: ${error.message}`);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 bg-white p-4 m-4 rounded-lg shadow-lg max-w-md overflow-auto max-h-screen z-50">
      <h3 className="text-lg font-bold mb-2">Extractor de Datos</h3>

      <div className="mb-4 flex space-x-2">
        <button
          onClick={extractFromHtml}
          disabled={loading}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 flex-1"
        >
          {loading ? 'Extrayendo...' : 'Extraer Datos'}
        </button>

        <button
          onClick={saveUserToRedux}
          disabled={!extractedData || loading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex-1"
        >
          Guardar Datos
        </button>
      </div>

      {extractedData && (
        <div className="mb-4 p-2 bg-green-100 rounded">
          <h4 className="font-bold mb-1">Datos Extraídos:</h4>
          <pre className="whitespace-pre-wrap text-xs">{JSON.stringify(extractedData, null, 2)}</pre>
        </div>
      )}

      {result && (
        <div className="mt-4 p-2 bg-gray-100 rounded">
          <h4 className="font-bold mb-1">Resultado:</h4>
          <pre className="whitespace-pre-wrap text-xs">{result}</pre>
        </div>
      )}
    </div>
  );
};

export default HtmlExtractor;