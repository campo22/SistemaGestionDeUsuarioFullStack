import React, { useState, useEffect } from 'react';
import Button from '@components/UI/Button';
import Input from '@components/UI/Input';
import { toast } from 'react-toastify';
import { User, UserUpdate } from '@/domain/types/user.types';
import useUsers from '@hooks/useUsers';

interface UserEditFormProps {
  userId: number;
  onUserUpdated: () => void;
}

const UserEditForm: React.FC<UserEditFormProps> = ({ userId, onUserUpdated }) => {
  const { selectedUser, isLoading, getUserById, updateUser } = useUsers();

  const [formData, setFormData] = useState<UserUpdate & { confirmPassword?: string }>({
    name: '',
    email: '',
    city: '',
    role: 'USER',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    city: '',
    role: '',
    password: '',
    confirmPassword: ''
  });

  const [updating, setUpdating] = useState(false);

  // Load user data when component mounts
  useEffect(() => {
    if (userId) {
      loadUser();
    }
  }, [userId]);

  // Update form when selected user changes
  useEffect(() => {
    if (selectedUser) {
      setFormData({
        name: selectedUser.name || '',
        email: selectedUser.email || '',
        city: selectedUser.city || '',
        role: selectedUser.role || 'USER',
        password: '',
        confirmPassword: ''
      });
    }
  }, [selectedUser]);

  const loadUser = async () => {
    try {
      await getUserById(userId);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load user');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear field error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = (): boolean => {
    let valid = true;
    const newErrors = { ...errors };

    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }

    if (!formData.role) {
      newErrors.role = 'Role is required';
      valid = false;
    }

    // Only validate password if it's being changed
    if (formData.password) {
      if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
        valid = false;
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setUpdating(true);

    try {
      const updateData: UserUpdate = {};

      if (formData.name) updateData.name = formData.name;
      if (formData.email) updateData.email = formData.email;
      if (formData.role) updateData.role = formData.role as 'ADMIN' | 'USER';
      if (formData.city !== undefined) updateData.city = formData.city;
      if (formData.password) updateData.password = formData.password;

      await updateUser(userId, updateData);
      toast.success('Usuario actualizado correctamente');

      setFormData({
        ...formData,
        password: '',
        confirmPassword: ''
      });

      onUserUpdated();
    } catch (error: any) {
      toast.error(error.message || 'Error al actualizar el usuario');
    } finally {
      setUpdating(false);
    }
  };

  if (isLoading && !selectedUser) {
    return <div className="text-center p-4">Cargando datos del usuario...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
      <Input
        type="text"
        id="name"
        name="name"
        label="Nombre Completo"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        required
      />

      <Input
        type="email"
        id="email"
        name="email"
        label="Correo Electrónico"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        required
      />

      <Input
        type="text"
        id="city"
        name="city"
        label="Ciudad (Opcional)"
        value={formData.city}
        onChange={handleChange}
        error={errors.city}
      />

      <div className="mb-4">
        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
          Rol
        </label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          required
        >
          <option value="USER">Usuario</option>
          <option value="ADMIN">Administrador</option>
        </select>
        {errors.role && <p className="mt-1 text-sm text-error-600">{errors.role}</p>}
      </div>

      <div className="border-t pt-4 mt-4">
        <h3 className="text-md font-medium mb-2">Cambiar Contraseña</h3>
        <p className="text-sm text-gray-500 mb-4">Dejar en blanco para mantener la contraseña actual</p>

        <Input
          type="password"
          id="password"
          name="password"
          label="Nueva Contraseña"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="••••••••"
        />

        <Input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          label="Confirmar Nueva Contraseña"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          placeholder="••••••••"
        />
      </div>

      <div className="pt-2 flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={onUserUpdated}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={updating}
        >
          Guardar Cambios
        </Button>
      </div>
    </form>
  );
};

export default UserEditForm;