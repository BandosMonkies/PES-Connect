import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await api.post('/api/auth/register', formData);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Registration failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content">
      <div className="container">
        <Card 
          className="form-card"
          title="Create Account"
          subtitle="Join PES Connect and start your journey"
        >
          <form onSubmit={handleSubmit}>
            <Input
              label="Full Name"
              type="text"
              name="name"
              id="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <Input
              label="Email Address"
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              id="password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <Button 
              type="submit" 
              variant="primary" 
              className="w-full"
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>

            {error && (
              <div className="form-message error">
                {error}
              </div>
            )}

            {success && (
              <div className="form-message success">
                {success}
              </div>
            )}

            <div style={{ 
              marginTop: '1.5rem', 
              textAlign: 'center',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--color-light-gray)'
            }}>
              <p style={{ color: 'var(--color-gray)', marginBottom: '0.5rem' }}>
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  style={{ 
                    color: 'var(--color-primary)', 
                    fontWeight: 600,
                    textDecoration: 'none'
                  }}
                >
                  Sign in instead
                </Link>
              </p>
            </div>
          </form>
        </Card>

        {/* Benefits Section */}
        <div style={{ 
          maxWidth: '500px', 
          margin: '2rem auto',
        }}>
          <div style={{ 
            background: 'var(--color-white)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--spacing-lg)',
            boxShadow: 'var(--shadow-md)'
          }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--color-dark)' }}>
              Why Join PES Connect?
            </h3>
            <ul style={{ 
              listStyle: 'none', 
              padding: 0,
              margin: 0
            }}>
              {[
                '✅ Connect with peers across campus',
                '✅ Access exclusive resources and events',
                '✅ Secure and private platform',
                '✅ Free forever, no hidden charges'
              ].map((benefit, index) => (
                <li 
                  key={index}
                  style={{ 
                    padding: '0.5rem 0',
                    color: 'var(--color-dark-gray)',
                    fontSize: '0.95rem'
                  }}
                >
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
