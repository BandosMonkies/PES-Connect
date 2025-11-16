import React, { useState } from 'react';
import '../styles/NoteCard.css';

const NoteCard = ({ note, onDelete, onLike, currentUserId }) => {
  const [isLiked, setIsLiked] = useState(note.likes?.includes(currentUserId) || false);
  const [likeCount, setLikeCount] = useState(note.likes?.length || 0);

  const getFileIcon = (fileType) => {
    const icons = {
      pdf: '📄',
      doc: '📝',
      docx: '📝',
      txt: '📄',
      pptx: '🎯',
      xlsx: '📊',
      image: '🖼️',
    };
    return icons[fileType] || '📎';
  };

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('token');
      const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8001';
      const response = await fetch(`${baseURL}/api/notes/${note._id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIsLiked(data.isLiked);
        setLikeCount(data.likes);
        if (onLike) onLike(note._id, data.likes);
      }
    } catch (error) {
      console.error('Error liking note:', error);
    }
  };

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem('token');
      const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8001';
      const response = await fetch(`${baseURL}/api/notes/${note._id}/download`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to download file');
      }

      // Get the file blob and download
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = note.fileName;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(link.href);
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading note:', error);
      alert('Failed to download file');
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      onDelete(note._id);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="note-card">
      <div className="note-header">
        <div className="note-title-section">
          <span className="file-icon">{getFileIcon(note.fileType)}</span>
          <h3 className="note-title">{note.title}</h3>
        </div>
        <span className="note-subject">{note.subject}</span>
      </div>

      {note.description && (
        <p className="note-description">{note.description}</p>
      )}

      <div className="note-metadata">
        <span className="uploader">by {note.uploaderName}</span>
        <span className="date">{formatDate(note.createdAt)}</span>
      </div>

      <div className="note-tags">
        {note.tags && note.tags.map((tag, index) => (
          <span key={index} className="tag">
            #{tag}
          </span>
        ))}
      </div>

      <div className="note-stats">
        <div className="stat">
          <span className="stat-icon">⬇️</span>
          <span>{note.downloads} downloads</span>
        </div>
        <div className="stat">
          <span className="stat-icon">❤️</span>
          <span>{likeCount} likes</span>
        </div>
      </div>

      <div className="note-actions">
        <button className="btn-primary" onClick={handleDownload}>
          Download
        </button>
        <button
          className={`btn-like ${isLiked ? 'liked' : ''}`}
          onClick={handleLike}
        >
          {isLiked ? '❤️ Liked' : '🤍 Like'}
        </button>
        {currentUserId && (currentUserId === note.uploader?._id || currentUserId === note.uploader) && (
          <button className="btn-delete" onClick={handleDelete}>
            🗑️ Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default NoteCard;
