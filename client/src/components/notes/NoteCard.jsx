import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../Card';

export default function NoteCard({ note }) {
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
      general: '#9C27B0',
      academics: '#1E88E5',
      exam: '#FF6B35',
      assignment: '#FFA500',
      project: '#28A745',
      resources: '#6C757D',
    };
    return colors[category] || '#6C757D';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      general: '📚',
      academics: '📖',
      exam: '📝',
      assignment: '📄',
      project: '💼',
      resources: '📋',
    };
    return icons[category] || '📚';
  };

  const handleCardClick = () => {
    navigate(`/notes/${note._id || note.id}`);
  };

  const authorName = note.author?.name || note.author || 'Unknown';
  const isOwned = note.isOwned || false;

  return (
    <Card 
      className="note-card"
      style={{ 
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        marginBottom: '1rem'
      }}
      onClick={handleCardClick}
    >
      <div style={{ display: 'flex', gap: '1rem' }}>
        {/* Info Section */}
        <div style={{ flex: 1 }}>
          {/* Category Badge & Sharing Indicators */}
          <div style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.25rem 0.75rem',
                background: `${getCategoryColor(note.category)}20`,
                color: getCategoryColor(note.category),
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'capitalize'
              }}
            >
              {getCategoryIcon(note.category)} {note.category}
            </span>
            
            {note.isPublic && (
              <span style={{
                padding: '0.25rem 0.75rem',
                background: '#1E88E520',
                color: '#1E88E5',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                🌐 Public
              </span>
            )}

            {note.sharedWith && note.sharedWith.length > 0 && (
              <span style={{
                padding: '0.25rem 0.75rem',
                background: '#9C27B020',
                color: '#9C27B0',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                👥 Shared with {note.sharedWith.length}
              </span>
            )}

            {isOwned && (
              <span style={{
                padding: '0.25rem 0.75rem',
                background: '#28A74520',
                color: '#28A745',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 600
              }}>
                ✏️ My Note
              </span>
            )}
          </div>

          {/* Title */}
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: 700,
            marginBottom: '0.5rem',
            color: 'var(--color-dark)',
            lineHeight: 1.4
          }}>
            {note.title}
          </h3>

          {/* Subject */}
          {note.subject && (
            <p style={{
              fontSize: '0.875rem',
              color: 'var(--color-gray)',
              marginBottom: '0.5rem',
              fontWeight: 500
            }}>
              Subject: {note.subject}
            </p>
          )}

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
            {note.content}
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
              {authorName}
            </span>
            <span>•</span>
            <span>{formatTime(note.createdAt)}</span>
            {note.views !== undefined && (
              <>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  👁️ {note.views} views
                </span>
              </>
            )}
            {note.downloads !== undefined && note.downloads > 0 && (
              <>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  ⬇️ {note.downloads} downloads
                </span>
              </>
            )}
            {note.tags && note.tags.length > 0 && (
              <>
                <span>•</span>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {note.tags.slice(0, 3).map((tag, idx) => (
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

