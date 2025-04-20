import React from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../features/auth/authSlice';
import { toast } from 'react-toastify';
import { useLoginForm } from '../hooks/useLoginForm';

export const Login = () => {
    const { email, setEmail, password, setPassword, formErrors, validate, reset } = useLoginForm();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { status, error } = useAppSelector((state) => state.auth);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            const result = await dispatch(loginUser({ email, password }));
            if (loginUser.fulfilled.match(result)) {
                toast.success('Inicio de sesión exitoso');
                navigate('/dashboard');
            } else {
                const errorMsg =
                    typeof result.payload === 'string' && result.payload.trim() !== ''
                        ? result.payload
                        : 'Error de autenticación';
                toast.error(errorMsg);
                reset();
            }
        } catch (err) {
            toast.error('Ocurrió un error inesperado');
            console.error('Error inesperado:', err);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

            {/* {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-800 rounded">
                    {error === 'Unauthorized'
                        ? 'Credenciales incorrectas. Verifica tu email y contraseña.'
                        : error}
                </div>
            )} */}

            <form onSubmit={handleSubmit} className="space-y-4">
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
