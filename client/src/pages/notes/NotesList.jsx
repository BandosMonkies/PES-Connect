import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAuth } from '../../utils/auth';
import { api } from '../../lib/api';
import Card from '../../components/Card';
import Button from '../../components/Button';
import NoteCard from '../../components/notes/NoteCard';

const categories = [
  { id: 'all', name: 'All Notes', icon: '📚' },
  { id: 'general', name: 'General', icon: '📚' },
  { id: 'academics', name: 'Academics', icon: '📖' },
  { id: 'exam', name: 'Exam Notes', icon: '📝' },
  { id: 'assignment', name: 'Assignments', icon: '📄' },
  { id: 'project', name: 'Projects', icon: '💼' },
  { id: 'resources', name: 'Resources', icon: '📋' },
];

const sortOptions = [
  { id: 'newest', name: 'Newest First' },
  { id: 'oldest', name: 'Oldest First' },
  { id: 'popular', name: 'Most Popular' },
  { id: 'title', name: 'Title A-Z' },
];

export default function NotesList() {
  const { token, user } = getAuth();
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showMyNotes, setShowMyNotes] = useState(false);

  useEffect(() => {
    if (!token) {
      window.location.href = '/login';
      return;
    }
    fetchNotes();
  }, [token, showMyNotes]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const endpoint = showMyNotes ? '/api/notes/my' : '/api/notes';
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      params.append('sortBy', sortBy);

      const response = await api.get(`${endpoint}?${params.toString()}`);
      
      // Mark notes as owned by current user
      const notesWithOwnership = response.data.map(note => ({
        ...note,
        isOwned: note.author?._id === user?.id || note.author === user?.id
      }));
      
      setNotes(notesWithOwnership);
      setFilteredNotes(notesWithOwnership);
    } catch (error) {
      console.error('Error fetching notes:', error);
      setNotes([]);
      setFilteredNotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [selectedCategory, sortBy]);

  useEffect(() => {
    // Client-side filtering for search
    if (!searchTerm) {
      setFilteredNotes(notes);
      return;
    }

    const filtered = notes.filter(note =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (note.subject && note.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (note.tags && note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
    );
    setFilteredNotes(filtered);
  }, [searchTerm, notes]);

  if (!token) return null;

  return (
    <div className="main-content">
      <div className="container">
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Notes Sharing</h1>
            <p style={{ color: 'var(--color-gray)', fontSize: '1.125rem' }}>
              Share and access study materials, notes, and resources with the PES community
            </p>
          </div>
          <Link to="/notes/create">
            <Button variant="primary" size="lg">
              ➕ Create Note
            </Button>
          </Link>
        </div>

        {/* Filters and Search */}
        <Card style={{ marginBottom: '2rem', padding: '1.5rem' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            {/* Search */}
            <div className="form-field" style={{ marginBottom: 0 }}>
              <input
                type="text"
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            {/* Category Filter */}
            <div className="form-field" style={{ marginBottom: 0 }}>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{ width: '100%' }}
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="form-field" style={{ marginBottom: 0 }}>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ width: '100%' }}
              >
                {sortOptions.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Toggle My Notes */}
          <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setShowMyNotes(!showMyNotes)}
              style={{
                padding: '0.5rem 1rem',
                background: showMyNotes ? 'var(--color-primary)' : 'var(--color-white)',
                color: showMyNotes ? 'var(--color-white)' : 'var(--color-dark)',
                border: `2px solid ${showMyNotes ? 'var(--color-primary)' : 'var(--color-light-gray)'}`,
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {showMyNotes ? '📝 My Notes' : '📚 All Notes'}
            </button>
          </div>

          {/* Results count */}
          <p style={{ 
            color: 'var(--color-gray)', 
            fontSize: '0.9rem',
            marginTop: '1rem',
            marginBottom: 0
          }}>
            Showing {filteredNotes.length} of {notes.length} notes
          </p>
        </Card>

        {/* Category Quick Filters */}
        <div style={{ 
          display: 'flex', 
          gap: '0.75rem', 
          marginBottom: '2rem',
          flexWrap: 'wrap'
        }}>
          {categories.filter(cat => cat.id !== 'all').map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              style={{
                padding: '0.5rem 1rem',
                background: selectedCategory === category.id 
                  ? `var(--color-primary)` 
                  : 'var(--color-white)',
                color: selectedCategory === category.id 
                  ? 'var(--color-white)' 
                  : 'var(--color-dark)',
                border: `2px solid ${selectedCategory === category.id 
                  ? 'var(--color-primary)' 
                  : 'var(--color-light-gray)'}`,
                borderRadius: 'var(--radius-full)',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseOver={(e) => {
                if (selectedCategory !== category.id) {
                  e.target.style.background = 'var(--color-primary-very-light)';
                }
              }}
              onMouseOut={(e) => {
                if (selectedCategory !== category.id) {
                  e.target.style.background = 'var(--color-white)';
                }
              }}
            >
              {category.icon} {category.name}
            </button>
          ))}
          <button
            onClick={() => setSelectedCategory('all')}
            style={{
              padding: '0.5rem 1rem',
              background: selectedCategory === 'all' 
                ? `var(--color-primary)` 
                : 'var(--color-white)',
              color: selectedCategory === 'all' 
                ? 'var(--color-white)' 
                : 'var(--color-dark)',
              border: `2px solid ${selectedCategory === 'all'
                ? 'var(--color-primary)' 
                : 'var(--color-light-gray)'}`,
              borderRadius: 'var(--radius-full)',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              if (selectedCategory !== 'all') {
                e.target.style.background = 'var(--color-primary-very-light)';
              }
            }}
            onMouseOut={(e) => {
              if (selectedCategory !== 'all') {
                e.target.style.background = 'var(--color-white)';
              }
            }}
          >
            📋 All Notes
          </button>
        </div>

        {/* Notes List */}
        {loading ? (
          <Card style={{ textAlign: 'center', padding: '3rem' }}>
            <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
            <p style={{ marginTop: '1rem', color: 'var(--color-gray)' }}>Loading notes...</p>
          </Card>
        ) : filteredNotes.length > 0 ? (
          <div className="notes-list">
            {filteredNotes.map((note) => (
              <NoteCard key={note._id || note.id} note={note} />
            ))}
          </div>
        ) : (
          <Card style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
            <h3 style={{ marginBottom: '0.5rem' }}>No notes found</h3>
            <p style={{ color: 'var(--color-gray)', marginBottom: '1.5rem' }}>
              {showMyNotes 
                ? "You haven't created any notes yet. Create your first note!" 
                : "Try adjusting your search or filters"}
            </p>
            {showMyNotes ? (
              <Link to="/notes/create">
                <Button variant="primary">Create Note</Button>
              </Link>
            ) : (
              <Button 
                variant="primary" 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
              >
                Clear Filters
              </Button>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}

