import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@components/UI/Button';
import Input from '@components/UI/Input';
import useAuth from '@hooks/useAuth';
import { toast } from 'react-toastify';

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading, clearError } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    city: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    city: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear field error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: '' });
    }

    // Clear global error
    clearError();
  };

  const validateForm = (): boolean => {
    let valid = true;
    const newErrors = { ...errors };

    if (!formData.name?.trim()) {
      newErrors.name = 'El nombre es requerido';
      valid = false;
    }

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
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      valid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Por favor confirma la contraseña';
      valid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Remove confirmPassword from the data sent to the API
    const { confirmPassword, ...registerData } = formData;

    try {
      await register(registerData);
      toast.success('¡Registro exitoso! Por favor, inicia sesión.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error);
    }
  };

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
        placeholder="Juan Pérez"
        autoComplete="name"
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
        placeholder="tu@email.com"
        autoComplete="email"
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
        placeholder="Tu ciudad"
        autoComplete="address-level2"
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
        autoComplete="new-password"
        required
      />

      <Input
        type="password"
        id="confirmPassword"
        name="confirmPassword"
        label="Confirmar Contraseña"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
        placeholder="••••••••"
        autoComplete="new-password"
        required
      />

      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isLoading}
        >
          Registrarse
        </Button>
      </div>
    </form>
  );
};

export default RegisterForm;