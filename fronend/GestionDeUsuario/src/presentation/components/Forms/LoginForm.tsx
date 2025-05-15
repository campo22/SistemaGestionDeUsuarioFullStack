import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@components/UI/Button';
import Input from '@components/UI/Input';
import useAuth from '@hooks/useAuth';
import { toast } from 'react-toastify';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, clearError } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear field error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: '' });
    }

    // Clear global error when user types
    clearError();
  };

  const validateForm = (): boolean => {
    let valid = true;
    const newErrors = { ...errors };

    if (!formData.email) {
      newErrors.email = 'El correo electrónico es requerido';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El correo electrónico no es válido';
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await login(formData);
      toast.success('Login successful!');

      // Verificar si hay una URL guardada para redireccionar
      const redirectUrl = sessionStorage.getItem('redirectUrl');
      if (redirectUrl) {
        sessionStorage.removeItem('redirectUrl'); // Limpiamos la URL guardada
        navigate(redirectUrl);
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
      <Input
        type="email"
        id="email"
        name="email"
        label="Correo Electrónico"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        placeholder="tu@email.com"
        autoComplete="email"
        required
      />

      <Input
        type="password"
        id="password"
        name="password"
        label="Contraseña"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        placeholder="••••••••"
        autoComplete="current-password"
        required
      />

      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isLoading}
        >
          Iniciar Sesión
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;