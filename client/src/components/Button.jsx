import React from 'react';

/**
 * Reusable Button Component
 * @param {string} variant - 'primary' | 'secondary' | 'outline'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {boolean} disabled
 * @param {boolean} loading
 * @param {string} type - button type (button, submit, reset)
 * @param {function} onClick - click handler
 * @param {ReactNode} children - button content
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
  className = '',
  children,
  ...props
}) {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`;
  
  const sizeStyles = {
    sm: { padding: '0.5rem 1rem', fontSize: '0.875rem' },
    md: { padding: '0.75rem 1.5rem', fontSize: '1rem' },
    lg: { padding: '1rem 2rem', fontSize: '1.125rem' },
  };

  return (
    <button
      type={type}
      className={`${baseClass} ${variantClass} ${className}`}
      style={sizeStyles[size]}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && <span className="loading-spinner"></span>}
      {children}
    </button>
  );
}
