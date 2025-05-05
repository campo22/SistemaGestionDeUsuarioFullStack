import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { getUserProfile } from './features/auth/authSlice';

// Componentes de depuración (temporales)
import AuthDebug from './components/AuthDebug';
import HtmlExtractor from './components/HtmlExtractor';

// Componentes
import { Login } from './features/auth/components/Login';
import RegisterForm from './features/auth/components/RegisterForm';
import { Dashboard } from './pages/Dashboard';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Unauthorized from './pages/Unauthorized';
import UserProfile from './features/users/components/UserProfile';

function App() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, status, error } = useAppSelector(state => state.auth);

  // Intentar cargar el perfil del usuario si hay token
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getUserProfile())
        .unwrap()
        .catch(error => {
          toast.error(error.message || 'Error al cargar perfil');
        });
    }
  }, [dispatch, isAuthenticated]);

  // Mostrar errores como notificaciones
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <Router>
      <Navbar />

      {/* Componentes de depuración (temporales) */}
      <div className="container mx-auto mt-4">
        <AuthDebug />
        <HtmlExtractor />
      </div>

      <div className="min-h-screen bg-gray-50 pt-16">
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/" element={!isAuthenticated ? <RegisterForm /> : <Navigate to="/dashboard" />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Rutas protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<UserProfile />} />
            {/* Otras rutas protegidas */}
          </Route>

          {/* Ruta por defecto */}
          <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </Router>
  );
}

export default App;
