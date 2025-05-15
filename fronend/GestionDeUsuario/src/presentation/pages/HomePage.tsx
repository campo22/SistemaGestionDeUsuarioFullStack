import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@components/Layout/Layout';
import useAuth from '@hooks/useAuth';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Layout>
      <div className="bg-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl font-bold mb-4 animate-fade-in">
            Sistema de Gestión de Usuarios
          </h1>
          <p className="text-xl max-w-3xl mx-auto mb-8 animate-fade-in">
            Un sistema seguro y escalable para la gestión de usuarios con control de acceso basado en roles
          </p>

          {!isAuthenticated ? (
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in">
              <Link
                to="/login"
                className="btn bg-white text-primary-700 hover:bg-gray-100"
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/register"
                className="btn bg-primary-600 border border-white hover:bg-primary-800"
              >
                Crear Cuenta
              </Link>
            </div>
          ) : (
            <Link
              to="/dashboard"
              className="btn bg-white text-primary-700 hover:bg-gray-100 animate-fade-in"
            >
              Ir al Panel de Control
            </Link>
          )}
        </div>
      </div>

      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Características Principales
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Nuestro sistema proporciona todo lo que necesitas para gestionar tus usuarios de manera efectiva
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Autenticación Segura</h3>
              <p className="text-gray-600">
                Autenticación basada en JWT con tokens de actualización para mayor seguridad
              </p>
            </div>

            <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Control de Acceso por Roles</h3>
              <p className="text-gray-600">
                Diferentes permisos para administradores y usuarios regulares
              </p>
            </div>

            <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Gestión de Usuarios</h3>
              <p className="text-gray-600">
                Operaciones CRUD completas para cuentas de usuario con gestión de perfiles
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;