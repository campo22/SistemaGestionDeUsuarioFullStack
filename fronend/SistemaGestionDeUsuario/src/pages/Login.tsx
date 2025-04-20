import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../features/auth/authSlice";

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({});

    const dispatch = useAppDispatch();
    const { status, error } = useAppSelector((state) => state.auth);
    const navigate = useNavigate();

    const validate = () => {
        const errors: typeof formErrors = {};
        if (!email) {
            errors.email = "El email es requerido.";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = "Formato de email inválido.";
        }
        if (!password) {
            errors.password = "La contraseña es requerida.";
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        const resultAction = await dispatch(loginUser({ email, password }));

        if (loginUser.fulfilled.match(resultAction)) {
            if (!resultAction.payload.data.error) {
                navigate("/dashboard");
            }
        }

        setPassword(""); // por seguridad, siempre limpiar contraseña
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-800 rounded">
                    {error === 'Unauthorized'
                        ? 'Credenciales incorrectas. Verifica tu email y contraseña.'
                        : error}
                </div>
            )}

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
