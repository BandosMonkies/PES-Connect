import React from 'react';

/**
 * Reusable Input Component with Label
 * @param {string} label - Input label
 * @param {string} type - input type
 * @param {string} name - input name
 * @param {string} id - input id
 * @param {string} value - input value
 * @param {string} placeholder - placeholder text
 * @param {boolean} required
 * @param {function} onChange - change handler
 * @param {string} error - error message
 */
export default function Input({
  label,
  type = 'text',
  name,
  id,
  value,
  placeholder,
  required = false,
  onChange,
  error,
  className = '',
  ...props
}) {
  return (
    <div className="form-field">
      {label && (
        <label htmlFor={id || name}>
          {label}
          {required && <span style={{ color: 'var(--color-error)' }}> *</span>}
        </label>
      )}
      <input
        type={type}
        id={id || name}
        name={name}
        value={value}
        placeholder={placeholder}
        required={required}
        onChange={onChange}
        className={className}
        {...props}
      />
      {error && (
        <p className="form-message error" style={{ marginTop: '0.5rem', padding: '0.5rem', fontSize: '0.875rem' }}>
          {error}
        </p>
      )}
    </div>
  );
}
