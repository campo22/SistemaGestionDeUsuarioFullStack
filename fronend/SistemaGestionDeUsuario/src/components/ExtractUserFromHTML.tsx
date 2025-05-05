import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppDispatch } from '../app/hooks';
import { setFakeUser } from '../features/users/usersSlice';
import { loginSuccess } from '../features/auth/authSlice';

const ExtractUserFromHTML = () => {
    const [status, setStatus] = useState('idle');
    const dispatch = useAppDispatch();

    useEffect(() => {
        const extractUserFromHTML = async () => {
            try {
                setStatus('loading');
                const token = localStorage.getItem('token');

                if (!token) {
                    setStatus('failed');
                    return;
                }

                // Intentar diferentes endpoints y métodos
                const endpoints = [
                    // Intentar con query param
                    { url: `http://localhost:1010/adminuser/get-profile?token=${token}`, method: 'query' },
                    // Intentar con header Authorization
                    { url: `http://localhost:1010/adminuser/get-profile`, method: 'header' },
                    // Intentar con otro endpoint
                    { url: `http://localhost:1010/admin/get-profile?token=${token}`, method: 'query' }
                ];

                let userData = null;

                for (const endpoint of endpoints) {
                    try {
                        console.log(`Intentando con ${endpoint.url} (método: ${endpoint.method})`);

                        const config = {
                            headers: {
                                'Accept': 'application/json'
                            }
                        };

                        if (endpoint.method === 'header') {
                            config.headers['Authorization'] = `Bearer ${token}`;
                        }

                        const response = await axios.get(endpoint.url, config);

                        // Si la respuesta es JSON y contiene datos de usuario
                        if (response.data && response.data.ourUsers) {
                            console.log('Respuesta JSON detectada:', response.data);
                            userData = response.data.ourUsers;
                            break;
                        }

                        // Si la respuesta es HTML, intentar extraer datos
                        if (typeof response.data === 'string' && response.data.includes('<!doctype html>')) {
                            console.log('Respuesta HTML detectada, intentando extraer datos');

                            // Intentar extraer datos del HTML (esto es un ejemplo, ajusta según el HTML real)
                            const htmlData = response.data;

                            // Buscar patrones en el HTML que puedan contener datos del usuario
                            // Por ejemplo, buscar un objeto JSON en un script
                            const scriptMatch = htmlData.match(/<script[^>]*>var\s+user\s*=\s*({.*?});<\/script>/);
                            if (scriptMatch && scriptMatch[1]) {
                                try {
                                    userData = JSON.parse(scriptMatch[1]);
                                    console.log('Datos extraídos del HTML:', userData);
                                    break;
                                } catch (e) {
                                    console.error('Error al parsear JSON del HTML:', e);
                                }
                            }

                            // Si no se pudo extraer, intentar con el siguiente endpoint
                        }
                    } catch (endpointError) {
                        console.error(`Error con ${endpoint.url}:`, endpointError);
                        // Continuar con el siguiente endpoint
                    }
                }

                // Si se encontraron datos de usuario
                if (userData) {
                    console.log('Usando datos de usuario encontrados:', userData);
                    dispatch(loginSuccess({ token }));
                    dispatch({
                        type: 'users/setCurrentUser',
                        payload: userData
                    });
                    setStatus('succeeded');
                } else {
                    // Si no se encontraron datos, hacer una petición directa al backend
                    try {
                        console.log('Intentando petición directa al backend');

                        // Esta es una petición directa que podría funcionar si el backend está configurado correctamente
                        const directResponse = await fetch(`http://localhost:1010/adminuser/get-profile?token=${token}`, {
                            headers: {
                                'Accept': 'application/json'
                            }
                        });

                        // Intentar obtener JSON
                        const contentType = directResponse.headers.get('content-type');
                        if (contentType && contentType.includes('application/json')) {
                            const jsonData = await directResponse.json();
                            if (jsonData.ourUsers) {
                                console.log('Datos JSON obtenidos directamente:', jsonData);
                                dispatch(loginSuccess({ token }));
                                dispatch({
                                    type: 'users/setCurrentUser',
                                    payload: jsonData.ourUsers
                                });
                                setStatus('succeeded');
                                return;
                            }
                        }

                        // Si no es JSON, podría ser HTML
                        const textData = await directResponse.text();
                        console.log('Respuesta de texto obtenida:', textData.substring(0, 200) + '...');

                        // Aquí podrías intentar extraer datos del HTML si es necesario

                        // Si todo falla, crear un usuario ficticio
                        console.log('No se pudieron extraer datos, creando usuario ficticio');
                        dispatch(setFakeUser());
                        setStatus('succeeded');
                    } catch (directError) {
                        console.error('Error en petición directa:', directError);
                        dispatch(setFakeUser());
                        setStatus('failed');
                    }
                }
            } catch (error) {
                console.error('Error general:', error);
                dispatch(setFakeUser());
                setStatus('failed');
            }
        };

        extractUserFromHTML();
    }, [dispatch]);

    return (
        <div className="fixed top-0 right-0 bg-gray-800 text-white p-4 m-4 rounded-lg opacity-80">
            <h3 className="text-lg font-bold mb-2">Extractor de Usuario</h3>
            <p>Estado: {status}</p>
        </div>
    );
};

export default ExtractUserFromHTML;