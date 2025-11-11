import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAuth } from '../../utils/auth';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';

export default function AddProduct() {
  const navigate = useNavigate();
  const { token, user } = getAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    originalPrice: '',
    category: 'electronics',
    condition: 'used',
    location: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    // Validation
    if (!formData.title || !formData.description || !formData.price) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      setError('Please enter a valid price');
      setLoading(false);
      return;
    }

    try {
      // In a real app, this would make an API call
      // For now, we'll just simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/resell');
      }, 2000);
    } catch (err) {
      setError('Failed to add product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) return null;

  return (
    <div className="main-content">
      <div className="container">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <Link to="/resell" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: '1rem' }}>
              <Button variant="outline" style={{ color: 'var(--color-dark)', borderColor: 'var(--color-light-gray)' }}>
                ← Back to Marketplace
              </Button>
            </Link>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Sell Your Item</h1>
            <p style={{ color: 'var(--color-gray)', fontSize: '1.125rem' }}>
              List your item for sale in the PES Connect marketplace
            </p>
          </div>

          <Card>
            <form onSubmit={handleSubmit}>
              {/* Title */}
              <div className="form-field">
                <Input
                  label="Product Title *"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Scientific Calculator TI-84 Plus"
                  required
                />
              </div>

              {/* Description */}
              <div className="form-field">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your item in detail..."
                  required
                  rows="5"
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    border: '2px solid var(--color-light-gray)',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--color-white)',
                    color: 'var(--color-dark)',
                    fontSize: '1rem',
                    fontFamily: 'Inter, sans-serif',
                    transition: 'all var(--transition-fast)',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Price Fields */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem'
              }}>
                <div className="form-field">
                  <Input
                    label="Selling Price (₹) *"
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="form-field">
                  <Input
                    label="Original Price (₹)"
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleChange}
                    placeholder="Optional"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Category and Condition */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem'
              }}>
                <div className="form-field">
                  <label htmlFor="category">Category *</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem',
                      border: '2px solid var(--color-light-gray)',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--color-white)',
                      color: 'var(--color-dark)',
                      fontSize: '1rem',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    <option value="electronics">Electronics</option>
                    <option value="books">Books</option>
                    <option value="sports">Sports</option>
                    <option value="accessories">Accessories</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-field">
                  <label htmlFor="condition">Condition *</label>
                  <select
                    id="condition"
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem',
                      border: '2px solid var(--color-light-gray)',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--color-white)',
                      color: 'var(--color-dark)',
                      fontSize: '1rem',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    <option value="new">New</option>
                    <option value="like-new">Like New</option>
                    <option value="used">Used - Good</option>
                    <option value="fair">Used - Fair</option>
                  </select>
                </div>
              </div>

              {/* Location */}
              <div className="form-field">
                <Input
                  label="Location (Optional)"
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., PES University, RR Campus"
                />
              </div>

              {/* Image Upload Note */}
              <Card 
                variant="default"
                style={{ 
                  background: 'var(--color-secondary-very-light)',
                  padding: '1rem',
                  marginBottom: '1.5rem'
                }}
              >
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-dark-gray)' }}>
                  <strong>📸 Image Upload:</strong> Image upload functionality will be available after backend integration. 
                  For now, you can add images later by placing them in <code style={{ 
                    background: 'var(--color-white)',
                    padding: '0.25rem 0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem'
                  }}>public/assets/images/resell/</code>
                </p>
              </Card>

              {/* Error Message */}
              {error && (
                <div className="form-message error" style={{ marginBottom: '1rem' }}>
                  {error}
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="form-message success" style={{ marginBottom: '1rem' }}>
                  ✅ Product added successfully! Redirecting to marketplace...
                </div>
              )}

              {/* Submit Button */}
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <Link to="/resell">
                  <Button variant="outline" type="button" disabled={loading}>
                    Cancel
                  </Button>
                </Link>
                <Button 
                  type="submit" 
                  variant="primary" 
                  loading={loading}
                  disabled={loading || success}
                >
                  {loading ? 'Adding Product...' : 'List Item for Sale'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}

