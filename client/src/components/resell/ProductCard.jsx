import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../Card';

export default function ProductCard({ product }) {
  const formatPrice = (price) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const getCategoryColor = (category) => {
    const colors = {
      electronics: '#1E88E5',
      books: '#FF6B35',
      sports: '#28A745',
      accessories: '#9C27B0',
      other: '#6C757D'
    };
    return colors[category] || colors.other;
  };

  return (
    <Link 
      to={`/resell/${product.id}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <Card 
        className="product-card"
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          padding: 0,
          overflow: 'hidden'
        }}
      >
        {/* Product Image */}
        <div 
          style={{
            width: '100%',
            height: '250px',
            background: `linear-gradient(135deg, ${getCategoryColor(product.category)}20 0%, ${getCategoryColor(product.category)}10 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          ) : (
            <div style={{
              fontSize: '4rem',
              opacity: 0.3
            }}>
              {product.icon || '📦'}
            </div>
          )}
          {/* Category Badge */}
          <div 
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: getCategoryColor(product.category),
              color: 'white',
              padding: '0.25rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'capitalize'
            }}
          >
            {product.category}
          </div>
        </div>

        {/* Product Info */}
        <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h3 
            style={{ 
              fontSize: '1.25rem',
              fontWeight: 700,
              marginBottom: '0.5rem',
              color: 'var(--color-dark)',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {product.title}
          </h3>
          
          <p 
            style={{ 
              color: 'var(--color-gray)',
              fontSize: '0.9rem',
              marginBottom: '1rem',
              flex: 1,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {product.description}
          </p>

          {/* Price and Seller Info */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 'auto',
            paddingTop: '1rem',
            borderTop: '1px solid var(--color-light-gray)'
          }}>
            <div>
              <div style={{ 
                fontSize: '1.5rem',
                fontWeight: 700,
                color: 'var(--color-primary)'
              }}>
                {formatPrice(product.price)}
              </div>
              {product.originalPrice && (
                <div style={{ 
                  fontSize: '0.75rem',
                  color: 'var(--color-gray)',
                  textDecoration: 'line-through'
                }}>
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </div>
              )}
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ 
                fontSize: '0.75rem',
                color: 'var(--color-gray)',
                marginBottom: '0.25rem'
              }}>
                Seller
              </div>
              <div style={{ 
                fontSize: '0.9rem',
                fontWeight: 600,
                color: 'var(--color-dark-gray)'
              }}>
                {product.seller}
              </div>
            </div>
          </div>

          {/* Condition Badge */}
          {product.condition && (
            <div style={{ 
              marginTop: '0.75rem',
              display: 'inline-block',
              padding: '0.25rem 0.75rem',
              background: product.condition === 'new' ? '#E3F2FD' : '#FFF3E0',
              color: product.condition === 'new' ? '#1565C0' : '#E65100',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'capitalize',
              width: 'fit-content'
            }}>
              {product.condition}
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}

