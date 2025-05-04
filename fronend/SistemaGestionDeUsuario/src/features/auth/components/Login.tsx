import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../authSlice';
import { toast } from 'react-toastify';
import { useLoginForm } from '../hooks/useLoginForm';

export const Login = () => {
    const { email, setEmail, password, setPassword, formErrors, validate, reset } = useLoginForm();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { status, error: reduxError } = useAppSelector((state) => state.auth);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            toast.error('Completa los campos correctamente');
            return;
        }

        try {
            // Usar unwrap() para manejar el rechazo del thunk
            await dispatch(loginUser({ email, password })).unwrap();
            toast.success('¡Inicio de sesión exitoso!');
            navigate('/dashboard');
        } catch (error: any) {
            // Mostrar el mensaje de error del backend o uno genérico
            toast.error(error || 'Error de autenticación');
            reset();
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

            {/* Muestra el error del estado de Redux */}
            {reduxError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-800 rounded">
                    {reduxError === 'Unauthorized'
                        ? 'Credenciales incorrectas'
                        : reduxError}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Campos de email y password */}
                <div>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Email"
                    />
                    {formErrors.email && (
                        <p className="text-sm text-red-600 mt-1">{formErrors.email}</p>
                    )}
                </div>

                <div>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Password"
                    />
                    {formErrors.password && (
                        <p className="text-sm text-red-600 mt-1">{formErrors.password}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
                >
                    {status === 'loading' ? 'Iniciando sesión...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

