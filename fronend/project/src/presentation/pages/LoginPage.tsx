import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@components/Layout/Layout';
import LoginForm from '@components/Forms/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-[calc(100vh-160px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Iniciar Sesión</h2>
            <p className="mt-2 text-sm text-gray-600">
              O{' '}
              <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                crear una nueva cuenta
              </Link>
            </p>
          </div>

          <LoginForm />

          <div className="text-center mt-4">
            <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;