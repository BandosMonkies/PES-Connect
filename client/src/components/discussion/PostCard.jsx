import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../Card';

export default function PostCard({ post }) {
  const navigate = useNavigate();
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'just now';
  };

  const getCategoryColor = (category) => {
    const colors = {
      clubs: '#FF6B35',
      canteen: '#FFA500',
      events: '#1E88E5',
      general: '#9C27B0'
    };
    return colors[category] || '#6C757D';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      clubs: '🎭',
      canteen: '🍽️',
      events: '📅',
      general: '💬'
    };
    return icons[category] || '📋';
  };

  const netScore = post.upvotes - post.downvotes;

  const handleUpvote = (e) => {
    e.stopPropagation();
    // Handle upvote - will be connected to backend
    alert('Upvote feature will be connected to backend');
  };

  const handleDownvote = (e) => {
    e.stopPropagation();
    // Handle downvote - will be connected to backend
    alert('Downvote feature will be connected to backend');
  };

  const handleCardClick = () => {
    navigate(`/discussion/${post.id}`);
  };

  return (
    <Card 
      className="post-card"
      style={{ 
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        marginBottom: '1rem'
      }}
      onClick={handleCardClick}
    >
      <div style={{ display: 'flex', gap: '1rem' }}>
        {/* Voting Section */}
        <div 
          onClick={(e) => e.stopPropagation()}
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            padding: '0.5rem',
            minWidth: '50px'
          }}
        >
          <button
            onClick={handleUpvote}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.5rem',
              padding: '0.25rem',
              color: post.userVote === 'upvote' ? '#FF6B35' : '#6C757D',
              transition: 'all 0.2s',
              borderRadius: 'var(--radius-sm)'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'var(--color-primary-very-light)';
              e.target.style.transform = 'scale(1.2)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'none';
              e.target.style.transform = 'scale(1)';
            }}
          >
            ▲
          </button>
          <span style={{ 
            fontWeight: 700, 
            fontSize: '1.125rem',
            color: netScore >= 0 ? '#28A745' : '#DC3545',
            margin: '0.25rem 0'
          }}>
            {netScore}
          </span>
          <button
            onClick={handleDownvote}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.5rem',
              padding: '0.25rem',
              color: post.userVote === 'downvote' ? '#1E88E5' : '#6C757D',
              transition: 'all 0.2s',
              borderRadius: 'var(--radius-sm)'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'var(--color-secondary-very-light)';
              e.target.style.transform = 'scale(1.2)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'none';
              e.target.style.transform = 'scale(1)';
            }}
          >
            ▼
          </button>
        </div>

        {/* Post Content */}
        <div style={{ flex: 1 }}>
          {/* Category Badge */}
          <div style={{ marginBottom: '0.75rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.25rem 0.75rem',
                background: `${getCategoryColor(post.category)}20`,
                color: getCategoryColor(post.category),
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'capitalize'
              }}
            >
              {getCategoryIcon(post.category)} {post.category}
            </span>
          </div>

          {/* Title */}
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: 700,
            marginBottom: '0.5rem',
            color: 'var(--color-dark)',
            lineHeight: 1.4
          }}>
            {post.title}
          </h3>

          {/* Content Preview */}
          <p style={{ 
            color: 'var(--color-gray)', 
            marginBottom: '1rem',
            lineHeight: 1.6,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {post.content}
          </p>

          {/* Meta Information */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
            fontSize: '0.875rem',
            color: 'var(--color-gray)'
          }}>
            <span style={{ fontWeight: 600, color: 'var(--color-dark)' }}>
              {post.author}
            </span>
            <span>•</span>
            <span>{formatTime(post.createdAt)}</span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              💬 {post.commentCount} comments
            </span>
            {post.tags && post.tags.length > 0 && (
              <>
                <span>•</span>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {post.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      style={{
                        padding: '0.125rem 0.5rem',
                        background: 'var(--color-light-gray)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.75rem'
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

