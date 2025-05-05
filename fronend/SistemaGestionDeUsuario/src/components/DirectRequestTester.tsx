import { useState } from 'react';
import axios from 'axios';

const DirectRequestTester = () => {
    const [result, setResult] = useState<{
        status: string;
        data?: any;
        error?: string;
    }>({
        status: ''
    });
    const [loading, setLoading] = useState(false);
    const [endpoint, setEndpoint] = useState('/adminuser/get-profile');

    const testEndpoint = async () => {
        setLoading(true);
        setResult({ status: 'Probando...' });

        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:1010${endpoint}?token=${token}`, {
                headers: {
                    'Accept': 'application/json'
                }
            });

            console.log("Respuesta completa:", response);

            setResult({
                status: 'Éxito',
                data: response.data
            });
        } catch (error: any) {
            console.error("Error completo:", error);
            
            setResult({
                status: `Error ${error.response?.status || 'desconocido'}`,
                error: error.response?.data?.error || error.message
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-0 left-0 bg-gray-800 text-white p-4 m-4 rounded-lg opacity-80 max-w-md overflow-auto max-h-96">
            <h3 className="text-lg font-bold mb-2">Petición Directa (sin interceptores)</h3>

            <div className="mb-4">
                <input
                    type="text"
                    value={endpoint}
                    onChange={(e) => setEndpoint(e.target.value)}
                    className="w-full p-2 mb-2 text-black rounded"
                    placeholder="Endpoint (ej: /adminuser/get-profile)"
                />

                <button
                    onClick={testEndpoint}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    {loading ? 'Probando...' : 'Probar Endpoint'}
                </button>
            </div>

            {result.status && (
                <div className={`mt-4 p-2 rounded ${result.status.includes('Éxito') ? 'bg-green-800' : 'bg-red-800'}`}>
                    <p><strong>Estado:</strong> {result.status}</p>
                    {result.error && <p><strong>Error:</strong> {result.error}</p>}
                    {result.data && (
                        <div>
                            <p><strong>Datos:</strong></p>
                            <pre className="text-xs mt-2 overflow-auto max-h-40">
                                {typeof result.data === 'string'
                                    ? result.data.substring(0, 500) + '...'
                                    : JSON.stringify(result.data, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DirectRequestTester;
