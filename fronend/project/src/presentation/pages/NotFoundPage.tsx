import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@components/Layout/Layout';
import Button from '@components/UI/Button';

const NotFoundPage: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-[calc(100vh-160px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-primary-600 mb-2">404</h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Página No Encontrada</h2>
          <p className="text-gray-600 max-w-md mx-auto mb-8">
            La página que estás buscando no existe o ha sido movida.
          </p>
          <Link to="/">
            <Button variant="primary">
              Volver al Inicio
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFoundPage;