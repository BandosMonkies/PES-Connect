import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getAuth } from '../../utils/auth';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { demoProducts } from '../../data/demoProducts.js';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = getAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    // Find product from demo data
    const foundProduct = demoProducts.find(p => p.id === id);
    setProduct(foundProduct);
    setLoading(false);
  }, [id, token, navigate]);

  if (!token) return null;

  if (loading) {
    return (
      <div className="main-content">
        <div className="container">
          <Card style={{ textAlign: 'center', padding: '3rem' }}>
            <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
            <p style={{ marginTop: '1rem', color: 'var(--color-gray)' }}>Loading product...</p>
          </Card>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="main-content">
        <div className="container">
          <Card style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>❌</div>
            <h3 style={{ marginBottom: '0.5rem' }}>Product Not Found</h3>
            <p style={{ color: 'var(--color-gray)', marginBottom: '1.5rem' }}>
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/resell">
              <Button variant="primary">Back to Marketplace</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

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
    <div className="main-content">
      <div className="container">
        {/* Back Button */}
        <Link to="/resell" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: '1.5rem' }}>
          <Button variant="outline" style={{ color: 'var(--color-dark)', borderColor: 'var(--color-light-gray)' }}>
            ← Back to Marketplace
          </Button>
        </Link>

        <div 
          className="product-detail-grid"
          style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr',
            gap: '2rem',
            marginBottom: '2rem'
          }}
        >
          {/* Product Image */}
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            <div 
              style={{
                width: '100%',
                height: '500px',
                background: `linear-gradient(135deg, ${getCategoryColor(product.category)}20 0%, ${getCategoryColor(product.category)}10 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
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
                  fontSize: '8rem',
                  opacity: 0.3
                }}>
                  {product.icon || '📦'}
                </div>
              )}
            </div>
          </Card>

          {/* Product Details */}
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ 
                display: 'inline-block',
                padding: '0.5rem 1rem',
                background: getCategoryColor(product.category),
                color: 'white',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.875rem',
                fontWeight: 600,
                textTransform: 'capitalize',
                marginBottom: '1rem'
              }}>
                {product.category}
              </div>
              <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{product.title}</h1>
              <p style={{ color: 'var(--color-gray)', fontSize: '1.125rem' }}>
                {product.description}
              </p>
            </div>

            <Card style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ 
                  fontSize: '3rem',
                  fontWeight: 700,
                  color: 'var(--color-primary)',
                  marginBottom: '0.5rem'
                }}>
                  {formatPrice(product.price)}
                </div>
                {product.originalPrice && (
                  <div style={{ 
                    fontSize: '1rem',
                    color: 'var(--color-gray)',
                    textDecoration: 'line-through',
                    marginBottom: '0.5rem'
                  }}>
                    Original Price: ₹{product.originalPrice.toLocaleString('en-IN')}
                  </div>
                )}
                {product.originalPrice && (
                  <div style={{ 
                    fontSize: '0.875rem',
                    color: 'var(--color-success)',
                    fontWeight: 600
                  }}>
                    Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')} ({Math.round((1 - product.price / product.originalPrice) * 100)}% off)
                  </div>
                )}
              </div>

              {product.condition && (
                <div style={{ 
                  display: 'inline-block',
                  padding: '0.5rem 1rem',
                  background: product.condition === 'new' ? '#E3F2FD' : '#FFF3E0',
                  color: product.condition === 'new' ? '#1565C0' : '#E65100',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  marginBottom: '1rem'
                }}>
                  Condition: {product.condition}
                </div>
              )}
            </Card>

            {/* Seller Info */}
            <Card style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Seller Information</h3>
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '0.5rem'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: 'var(--bg-gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.5rem',
                  fontWeight: 700
                }}>
                  {product.seller.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '1.125rem' }}>{product.seller}</div>
                  <div style={{ color: 'var(--color-gray)', fontSize: '0.875rem' }}>
                    PES University Student
                  </div>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Button 
                variant="primary" 
                size="lg"
                style={{ flex: 1 }}
                onClick={() => {
                  // In a real app, this would initiate a chat or contact seller
                  alert('Contact seller feature coming soon! This would open a chat with the seller.');
                }}
              >
                Contact Seller
              </Button>
              <Button 
                variant="secondary" 
                size="lg"
                onClick={() => {
                  // In a real app, this would add to favorites
                  alert('Added to favorites!');
                }}
              >
                ❤️ Save
              </Button>
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <Card style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Product Details</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem'
          }}>
            <div>
              <div style={{ 
                fontSize: '0.875rem',
                color: 'var(--color-gray)',
                marginBottom: '0.5rem'
              }}>
                Listed On
              </div>
              <div style={{ fontWeight: 600 }}>
                {new Date(product.createdAt).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
            <div>
              <div style={{ 
                fontSize: '0.875rem',
                color: 'var(--color-gray)',
                marginBottom: '0.5rem'
              }}>
                Category
              </div>
              <div style={{ fontWeight: 600, textTransform: 'capitalize' }}>
                {product.category}
              </div>
            </div>
            {product.location && (
              <div>
                <div style={{ 
                  fontSize: '0.875rem',
                  color: 'var(--color-gray)',
                  marginBottom: '0.5rem'
                }}>
                  Location
                </div>
                <div style={{ fontWeight: 600 }}>
                  {product.location}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

