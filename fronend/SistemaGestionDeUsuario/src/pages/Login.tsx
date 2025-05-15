import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../features/auth/authSlice";

export const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useAppDispatch();
    const { status, error } = useAppSelector((state) => state.auth);
    const navigate = useNavigate();

    const handleSudmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const resultAction = await dispatch(loginUser({ email, password }));
        if (loginUser.fulfilled.match(resultAction)) {
            navigate("dashboard");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
            {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
            <form onSubmit={handleSudmit} className="space-y-4">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Password"
                    required
                />
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




