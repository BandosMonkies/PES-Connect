import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from '../../utils/auth';
import { api } from '../../lib/api';
import Card from '../../components/Card';
import Button from '../../components/Button';

const categories = [
  { id: 'general', name: 'General', icon: '📚' },
  { id: 'academics', name: 'Academics', icon: '📖' },
  { id: 'exam', name: 'Exam Notes', icon: '📝' },
  { id: 'assignment', name: 'Assignments', icon: '📄' },
  { id: 'project', name: 'Projects', icon: '💼' },
  { id: 'resources', name: 'Resources', icon: '📋' },
];

export default function CreateNote() {
  const navigate = useNavigate();
  const { token, user } = getAuth();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    subject: '',
    tags: '',
    fileUrl: '',
    fileName: '',
    isPublic: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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

    try {
      // Process tags
      const tags = formData.tags
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        : [];

      const noteData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        category: formData.category,
        subject: formData.subject.trim(),
        tags,
        isPublic: formData.isPublic,
      };

      // Add file info if provided
      if (formData.fileUrl) {
        noteData.fileUrl = formData.fileUrl.trim();
        noteData.fileName = formData.fileName.trim() || 'Attachment';
      }

      const response = await api.post('/api/notes', noteData);
      
      // Navigate to the created note
      navigate(`/notes/${response.data._id}`);
    } catch (error) {
      console.error('Error creating note:', error);
      // Show more detailed error message
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to create note. Please check your connection and try again.';
      setError(errorMessage);
      setLoading(false);
      
      // Log full error for debugging
      if (error.response) {
        console.error('Response error:', error.response.data);
      }
    }
  };

  if (!token) return null;

  return (
    <div className="main-content">
      <div className="container" style={{ maxWidth: '800px' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Create New Note</h1>
          <p style={{ color: 'var(--color-gray)', fontSize: '1.125rem' }}>
            Share your study materials and notes with the PES community
          </p>
        </div>

        {/* Form */}
        <Card style={{ padding: '2rem' }}>
          <form onSubmit={handleSubmit}>
            {/* Error Message */}
            {error && (
              <div style={{
                padding: '1rem',
                background: '#FFE5E5',
                color: '#DC3545',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.5rem'
              }}>
                {error}
              </div>
            )}

            {/* Title */}
            <div className="form-field" style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="title">Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter note title..."
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
                style={{ width: '100%' }}
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div className="form-field" style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g., Data Structures, Mathematics..."
                style={{ width: '100%' }}
              />
            </div>

            {/* Content */}
            <div className="form-field" style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="content">Content *</label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Write your note content here..."
                rows="10"
                required
                style={{ 
                  width: '100%',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            {/* Tags */}
            <div className="form-field" style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="tags">Tags</label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="Enter tags separated by commas (e.g., algorithms, data-structures)"
                style={{ width: '100%' }}
              />
              <small style={{ color: 'var(--color-gray)', fontSize: '0.875rem' }}>
                Separate multiple tags with commas
              </small>
            </div>

            {/* File URL */}
            <div className="form-field" style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="fileUrl">File URL (Optional)</label>
              <input
                type="url"
                id="fileUrl"
                name="fileUrl"
                value={formData.fileUrl}
                onChange={handleChange}
                placeholder="https://example.com/file.pdf"
                style={{ width: '100%' }}
              />
            </div>

            {/* File Name */}
            {formData.fileUrl && (
              <div className="form-field" style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="fileName">File Name</label>
                <input
                  type="text"
                  id="fileName"
                  name="fileName"
                  value={formData.fileName}
                  onChange={handleChange}
                  placeholder="e.g., Lecture Notes.pdf"
                  style={{ width: '100%' }}
                />
              </div>
            )}

            {/* Public Toggle */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={handleChange}
                />
                <span>Make this note public (visible to all users)</span>
              </label>
            </div>

            {/* Form Actions */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                style={{ flex: 1 }}
              >
                {loading ? 'Creating...' : 'Create Note'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/notes')}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>

        {/* Help Text */}
        <Card style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--color-primary-very-light)' }}>
          <h3 style={{ marginBottom: '0.5rem', fontSize: '1.125rem' }}>💡 Tips</h3>
          <ul style={{ margin: 0, paddingLeft: '1.5rem', color: 'var(--color-dark-gray)' }}>
            <li>Use clear and descriptive titles</li>
            <li>Organize content with proper formatting</li>
            <li>Add relevant tags to make your note easily discoverable</li>
            <li>You can share your note with specific users after creating it</li>
            <li>Public notes are visible to all users in the community</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

