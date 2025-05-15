import React, { useState, useEffect } from 'react';
import Button from '@components/UI/Button';
import Input from '@components/UI/Input';
import { toast } from 'react-toastify';
import { User, UserUpdate } from '@/domain/types/user.types';
import { updateOwnProfile } from '@services/user.service';

interface ProfileFormProps {
  user: User | null;
  onProfileUpdated: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ user, onProfileUpdated }) => {
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<UserUpdate>({
    name: '',
    email: '',
    city: '',
    password: '',

  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    city: '',
    password: '',
    confirmPassword: ''
  });

  // Set initial form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        city: user.city || '',
        password: '',

      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    // Only validate password if it's being changed
    if (formData.password) {
      if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
        valid = false;
      }


    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Remove confirmPassword and empty fields before sending to API
      const updateData: UserUpdate = {};

      if (formData.name && formData.name !== user?.name) updateData.name = formData.name;
      if (formData.email && formData.email !== user?.email) updateData.email = formData.email;

      // Only include city if it's changed, even if empty (user wants to remove it)
      if (formData.city !== user?.city) updateData.city = formData.city;

      // Only include password if it's not empty
      if (formData.password) updateData.password = formData.password;

      const response = await updateOwnProfile(updateData);

      if (response.status === 200) {
        toast.success('Profile updated successfully');
        // Clear password fields
        setFormData({
          ...formData,
          password: '',

        });
        onProfileUpdated();
      } else {
        toast.error(response.error || 'Failed to update profile');
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while updating profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
      <Input
        type="text"
        id="name"
        name="name"
        label="Full Name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        required
      />

      <Input
        type="email"
        id="email"
        name="email"
        label="Email Address"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        required
      />

      <Input
        type="text"
        id="city"
        name="city"
        label="City (Optional)"
        value={formData.city}
        onChange={handleChange}
        error={errors.city}
      />

      <div className="pt-4 mt-4 border-t">
        <h3 className="mb-2 font-medium text-md">Change Password</h3>
        <p className="mb-4 text-sm text-gray-500">Leave blank to keep your current password</p>

        <Input
          type="password"
          id="password"
          name="password"
          label="New Password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="••••••••"
        />

        <Input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm New Password"

          onChange={handleChange}

          placeholder="••••••••"
        />
      </div>

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
        >
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;