// src/components/TestRefresh.tsx

import { useState } from "react";

import {
    loginUser,
    refreshTokenThunk,
    logout,
} from "../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";

export default function TestRefresh() {
    const dispatch = useAppDispatch();
    const { token, refreshToken, status, error } = useAppSelector(
        (state) => state.auth
    );
    const [logs, setLogs] = useState<string[]>([]);

    /**
     * Añade un nuevo mensaje a la cola de logs, y lo muestra en la interfaz.
     * @param msg Mensaje a mostrar en la cola de logs.
     */
    const appendLog = (msg: string) =>
        setLogs((prev) => [msg, ...prev]);

    const handleLogin = async () => {
        try {
            const creds = { email: "miguelcampodiaz@gmail.com", password: "12345" };
            appendLog("👉 Dispatching loginUser…");
            await dispatch(loginUser(creds)).unwrap();
            appendLog("✅ Login OK");
            appendLog(`token: ${localStorage.getItem("token")}`);
            appendLog(
                `refreshToken: ${localStorage.getItem("refreshToken")}`
            );
        } catch (err: any) {
            appendLog("❌ Login failed: " + err);
        }
    };

    const handleExpire = () => {
        appendLog("⚠️ Simulando expiración (token inválido)...");
        localStorage.setItem("token", "invalid.token.here");
        appendLog(`token NOW: ${localStorage.getItem("token")}`);
    };

    const handleRefresh = async () => {
        try {
            appendLog("🔄 Dispatching refreshTokenThunk…");
            const storedRefreshToken = localStorage.getItem("refreshToken");

            if (!storedRefreshToken) {
                throw new Error("No refresh token found in localStorage");
            }

            await dispatch(refreshTokenThunk(storedRefreshToken)).unwrap();

            appendLog("✅ Refresh OK");
            appendLog(`NEW token: ${localStorage.getItem("token")}`);
            appendLog(`NEW refreshToken: ${localStorage.getItem("refreshToken")}`);
        } catch (err: any) {
            appendLog("❌ Refresh failed: " + err.message || err);
        }
    };


    const handleLogout = () => {
        dispatch(logout());
        appendLog("🚪 Logged out");
    };

    return (
        <div className="p-4 space-y-2 border rounded max-w-md mx-auto">
            <h3 className="font-bold text-lg">🔧 Prueba de Refresh Token</h3>
            <div className="space-x-2">
                <button
                    onClick={handleLogin}
                    className="px-3 py-1 bg-green-500 text-white rounded"
                >
                    Login
                </button>
                <button
                    onClick={handleExpire}
                    className="px-3 py-1 bg-yellow-500 text-white rounded"
                >
                    Simular Expiración
                </button>
                <button
                    onClick={handleRefresh}
                    className="px-3 py-1 bg-blue-500 text-white rounded"
                >
                    Refresh Token
                </button>
                <button
                    onClick={handleLogout}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                >
                    Logout
                </button>
            </div>

            <div className="mt-4 text-sm">
                <strong>Estado Redux:</strong>
                <pre>{JSON.stringify({ token, refreshToken, status, error }, null, 2)}</pre>
            </div>

            <div className="mt-4">
                <strong>Logs:</strong>
                <ul className="list-disc list-inside max-h-40 overflow-y-auto">
                    {logs.map((l, i) => (
                        <li key={i}>{l}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
