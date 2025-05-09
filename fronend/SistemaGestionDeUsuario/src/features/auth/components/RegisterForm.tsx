


import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { registerUser, clearAuthError } from "../authSlice";


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
            await dispatch(registerUser(formData)).unwrap();
            toast.success('Registro exitoso. Ahora puedes iniciar sesión.');
            navigate('/login');
        } catch (err: any) {
            toast.error(err || 'Error al registrar usuario');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Crear una cuenta
                    </h2>
                </div>
                
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="name" className="sr-only">Nombre</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Nombre"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="sr-only">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Contraseña</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Contraseña"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="city" className="sr-only">Ciudad</label>
                            <input
                                id="city"
                                name="city"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Ciudad"
                                value={formData.city}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={status === "loading"}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            {status === "loading" ? "Registrando..." : "Registrarse"}
                        </button>
                    </div>
                    
                    <div className="text-sm text-center">
                        <p>
                            ¿Ya tienes una cuenta?{' '}
                            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                                Inicia sesión
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default RegisterForm
