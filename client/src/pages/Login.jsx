import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { setAuth } from '../utils/auth';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/api/auth/login', formData);
      setAuth({ token: data.token, user: data.user });
      navigate('/');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Login failed';
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
          title="Welcome Back"
          subtitle="Sign in to your PES Connect account"
        >
          <form onSubmit={handleSubmit}>
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
              placeholder="Enter your password"
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
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>

            {error && (
              <div className="form-message error">
                {error}
              </div>
            )}

            <div style={{ 
              marginTop: '1.5rem', 
              textAlign: 'center',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--color-light-gray)'
            }}>
              <p style={{ color: 'var(--color-gray)', marginBottom: '0.5rem' }}>
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  style={{ 
                    color: 'var(--color-primary)', 
                    fontWeight: 600,
                    textDecoration: 'none'
                  }}
                >
                  Create one now
                </Link>
              </p>
            </div>
          </form>
        </Card>

        {/* Info Section */}
        <div style={{ 
          maxWidth: '500px', 
          margin: '2rem auto',
          textAlign: 'center'
        }}>
          <p style={{ color: 'var(--color-gray)', fontSize: '0.95rem' }}>
            🔒 Your data is protected with industry-standard encryption
          </p>
        </div>
      </div>
    </div>
  )
}
