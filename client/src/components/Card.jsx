import React from 'react';

/**
 * Reusable Card Component
 * @param {string} variant - 'default' | 'gradient' | 'feature'
 * @param {string} title - card title
 * @param {string} subtitle - card subtitle
 * @param {ReactNode} children - card content
 * @param {string} className - additional CSS classes
 */
export default function Card({
  variant = 'default',
  title,
  subtitle,
  icon,
  children,
  className = '',
  ...props
}) {
  const cardClass = variant === 'gradient' ? 'card card-gradient' : 
                    variant === 'feature' ? 'feature-card' : 'card';

  return (
    <div className={`${cardClass} ${className}`} {...props}>
      {(title || subtitle || icon) && (
        <div className="card-header">
          {icon && variant === 'feature' && (
            <div className="feature-icon">{icon}</div>
          )}
          {title && (
            <h2 className={variant === 'feature' ? 'feature-title' : 'card-title'}>
              {title}
            </h2>
          )}
          {subtitle && (
            <p className={variant === 'feature' ? 'feature-description' : 'card-subtitle'}>
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
