


import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { registerUser } from "../authSlice";


const RegisterForm = () => {

    const dispatch = useAppDispatch();
    const { status, error } = useAppSelector((state) => state.auth);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        city: "",
    });
    /**
     * Funcion que se encarga de actualizar el estado local del formulario
     * al cambiar un input.
     * 
     * @param e - El evento de cambio del input
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            // el estado anterior se mantiene y solo se actualiza el campo que cambia
            ...formData,
            // el nombre del campo es el mismo que el name del input 
            // y el valor es el valor del input
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await dispatch(registerUser(formData));
            if (registerUser.fulfilled.match(result)) {
                toast.success('Registro exitoso');
                navigate('/login');
            } else {
                const errorMsg =
                    typeof result.payload === 'string' && result.payload.trim() !== ''
                        ? result.payload
                        : 'Error de registro';
                toast.error(errorMsg);
            }
        } catch (err) {
            toast.error('Ocurrio un error inesperado');
            console.error('Error inesperado:', err);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-md p-6 mx-auto mt-10 border rounded-lg shadow-lg"
        >
            <h2 className="mb-4 text-2xl font-bold text-center">Registro</h2>

            <input
                type="text"
                name="name"
                placeholder="Nombre"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-2 mb-4 border rounded"
            />

            <input
                type="email"
                name="email"
                placeholder="Correo electrónico"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-2 mb-4 border rounded"
            />

            <input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full p-2 mb-4 border rounded"
            />
            <input
                type="text"
                name="city"
                placeholder="Ciudad"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full p-2 mb-4 border rounded"
            />
            {error && (
                <div className="mb-4 text-sm text-red-600">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={status === "loading"}
                className="w-full p-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
                {status === "loading" ? "Registrando..." : "Registrarse"}
            </button>

        </form>
    )
}

export default RegisterForm
