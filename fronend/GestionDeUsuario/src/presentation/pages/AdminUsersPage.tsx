import React from 'react';
import Layout from '@components/Layout/Layout';
import UsersList from '@components/Users/UsersList';

const AdminUsersPage: React.FC = () => {
  return (
    <Layout>
      <div className="page-container">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p className="text-gray-600">Administra los usuarios registrados, asigna roles y controla el acceso al sistema</p>
        </header>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <UsersList />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminUsersPage;