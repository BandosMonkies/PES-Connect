import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from '../../utils/auth';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { categories } from '../../data/demoPosts.js';

export default function CreatePost() {
  const navigate = useNavigate();
  const { token, user } = getAuth();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    tags: ''
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate form
    if (!formData.title.trim()) {
      setError('Title is required');
      setLoading(false);
      return;
    }

    if (!formData.content.trim()) {
      setError('Content is required');
      setLoading(false);
      return;
    }

    // In a real app, this would make an API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        navigate('/discussion');
      }, 2000);
    }, 1000);
  };

  if (!token) return null;

  return (
    <div className="main-content">
      <div className="container" style={{ maxWidth: '800px' }}>
        {/* Back Button */}
        <button
          onClick={() => navigate('/discussion')}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-secondary)',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 600,
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          ← Back to Forum
        </button>

        {/* Form Card */}
        <Card style={{ padding: '2rem' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Create New Post</h1>
          <p style={{ color: 'var(--color-gray)', marginBottom: '2rem' }}>
            Share your thoughts, ask questions, or start a discussion
          </p>

          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="form-field" style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="title">Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter a descriptive title"
                required
                style={{ width: '100%' }}
              />
            </div>

            {/* Category */}
            <div className="form-field" style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                style={{ width: '100%' }}
              >
                {categories.filter(cat => cat.id !== 'all').map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Content */}
            <div className="form-field" style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="content">Content *</label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Write your post content here..."
                rows="10"
                required
                style={{ 
                  width: '100%',
                  padding: '0.875rem 1rem',
                  border: '2px solid var(--color-light-gray)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '1rem',
                  fontFamily: 'Inter, sans-serif',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Tags */}
            <div className="form-field" style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="tags">Tags (comma-separated)</label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="e.g., tech, coding, competition"
                style={{ width: '100%' }}
              />
              <small style={{ 
                color: 'var(--color-gray)', 
                fontSize: '0.875rem',
                display: 'block',
                marginTop: '0.5rem'
              }}>
                Separate tags with commas
              </small>
            </div>

            {/* Error Message */}
            {error && (
              <div className="form-message error" style={{ marginBottom: '1rem' }}>
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="form-message success" style={{ marginBottom: '1rem' }}>
                Post created successfully! Redirecting...
              </div>
            )}

            {/* Submit Button */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/discussion')}
                disabled={loading}
                style={{ color: 'var(--color-dark)', borderColor: 'var(--color-light-gray)' }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                disabled={loading || success}
              >
                {loading ? 'Creating Post...' : 'Create Post'}
              </Button>
            </div>
          </form>
        </Card>

        {/* Guidelines */}
        <Card style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--color-secondary-very-light)' }}>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Posting Guidelines</h3>
          <ul style={{ 
            color: 'var(--color-dark-gray)',
            lineHeight: 1.8,
            paddingLeft: '1.5rem'
          }}>
            <li>Be respectful and follow community guidelines</li>
            <li>Use descriptive titles that clearly explain your post</li>
            <li>Choose the appropriate category for your post</li>
            <li>Add relevant tags to help others find your post</li>
            <li>Check for similar posts before creating a new one</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

