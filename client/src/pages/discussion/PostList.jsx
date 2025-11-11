import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAuth } from '../../utils/auth';
import Card from '../../components/Card';
import Button from '../../components/Button';
import PostCard from '../../components/discussion/PostCard';
import { demoPosts, categories, sortOptions } from '../../data/demoPosts.js';

export default function PostList() {
  const { token } = getAuth();
  const [posts] = useState(demoPosts);
  const [filteredPosts, setFilteredPosts] = useState(demoPosts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Redirect if not authenticated
  useEffect(() => {
    if (!token) {
      window.location.href = '/login';
    }
  }, [token]);

  // Filter and search posts
  useEffect(() => {
    let filtered = [...posts];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.tags && p.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }

    // Sort posts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'popular':
          const scoreA = a.upvotes - a.downvotes;
          const scoreB = b.upvotes - b.downvotes;
          return scoreB - scoreA;
        case 'comments':
          return b.commentCount - a.commentCount;
        default:
          return 0;
      }
    });

    setFilteredPosts(filtered);
  }, [posts, searchTerm, selectedCategory, sortBy]);

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
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Discussion Forum</h1>
            <p style={{ color: 'var(--color-gray)', fontSize: '1.125rem' }}>
              Join discussions, ask questions, and share knowledge with the PES community
            </p>
          </div>
          <Link to="/discussion/create">
            <Button variant="primary" size="lg">
              ➕ Create Post
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
                placeholder="Search posts..."
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

          {/* Results count */}
          <p style={{ 
            color: 'var(--color-gray)', 
            fontSize: '0.9rem',
            marginTop: '0.5rem',
            marginBottom: 0
          }}>
            Showing {filteredPosts.length} of {posts.length} posts
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
            📋 All Posts
          </button>
        </div>

        {/* Posts List */}
        {filteredPosts.length > 0 ? (
          <div className="posts-list">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <Card style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
            <h3 style={{ marginBottom: '0.5rem' }}>No posts found</h3>
            <p style={{ color: 'var(--color-gray)', marginBottom: '1.5rem' }}>
              Try adjusting your search or filters
            </p>
            <Button 
              variant="primary" 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
            >
              Clear Filters
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}

