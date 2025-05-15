import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = true, className = '', ...props }, ref) => {
    const inputClasses = `block px-3 py-2 bg-white border ${
      error 
        ? 'border-error-500 focus:ring-error-500 focus:border-error-500' 
        : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
    } rounded-md shadow-sm focus:outline-none sm:text-sm ${fullWidth ? 'w-full' : ''}`;

    return (
      <div className={`mb-4 ${fullWidth ? 'w-full' : ''} ${className}`}>
        {label && (
          <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={inputClasses}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-error-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;