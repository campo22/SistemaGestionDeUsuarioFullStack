import React from 'react';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  center?: boolean;
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({
  size = 'medium',
  center = false,
  message = 'Cargando...'
}) => {
  const sizeClasses = {
    small: 'w-5 h-5',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  const wrapperClasses = center ? 'flex flex-col items-center justify-center min-h-[200px]' : '';

  return (
    <div className={wrapperClasses}>
      <div className="flex items-center justify-center">
        <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-200 border-t-primary-600`}></div>
      </div>
      {message && <p className="mt-2 text-sm text-gray-500">{message}</p>}
    </div>
  );
};

export default Loading;