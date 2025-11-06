import React, { useState } from 'react'
import api from '../lib/api';
import { setAuth } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

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
    <div className="container">
      <div className="card form-card">
        <h2>Login</h2>
        <p className="text-muted mt-2">Welcome back! Please enter your credentials.</p>
        <form className="mt-4" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button className="w-full" type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
          {error && <p className="mt-2" style={{ color: 'crimson' }}>{error}</p>}
        </form>
      </div>
    </div>
  )
}
