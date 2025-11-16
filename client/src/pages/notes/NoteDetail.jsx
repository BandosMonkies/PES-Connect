import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getAuth } from '../../utils/auth';
import { api } from '../../lib/api';
import Card from '../../components/Card';
import Button from '../../components/Button';

export default function NoteDetail() {
  const params = useParams();
  const id = params.id || params.token; // Support both /notes/:id and /notes/shared/:token
  const navigate = useNavigate();
  const { token, user } = getAuth();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareUsers, setShareUsers] = useState([]);
  const [searchUsers, setSearchUsers] = useState('');
  const [userSearchResults, setUserSearchResults] = useState([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [sharePermission, setSharePermission] = useState('view');
  const [shareLink, setShareLink] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const isSharedTokenRoute = params.token !== undefined;
    
    // Only require auth if not a shared token route
    if (!isSharedTokenRoute && !token) {
      navigate('/login');
      return;
    }
    fetchNote();
  }, [params, token, navigate]);

  const fetchNote = async () => {
    try {
      setLoading(true);
      // Check if this is a shared token route
      const isSharedTokenRoute = params.token !== undefined;
      const endpoint = isSharedTokenRoute ? `/api/notes/shared/${params.token}` : `/api/notes/${params.id || id}`;
      
      const response = await api.get(endpoint);
      setNote(response.data);
      
      // Check if share link exists
      if (response.data.shareToken) {
        const shareUrl = `${window.location.origin}/notes/shared/${response.data.shareToken}`;
        setShareLink(shareUrl);
      }
    } catch (error) {
      console.error('Error fetching note:', error);
      if (error.response?.status === 404) {
        setNote(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearchUsers = async (query) => {
    setSearchUsers(query);
    if (query.length < 2) {
      setUserSearchResults([]);
      return;
    }

    try {
      const response = await api.get(`/api/notes/users/search?query=${query}`);
      setUserSearchResults(response.data);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const handleToggleUser = (userId) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      }
      return [...prev, userId];
    });
  };

  const handleShareNote = async () => {
    if (selectedUsers.length === 0) return;

    try {
      await api.post(`/api/notes/${id}/share`, {
        userIds: selectedUsers,
        permission: sharePermission,
      });
      await fetchNote();
      setShowShareModal(false);
      setSelectedUsers([]);
      setSearchUsers('');
      setUserSearchResults([]);
      alert('Note shared successfully!');
    } catch (error) {
      console.error('Error sharing note:', error);
      alert('Failed to share note. Please try again.');
    }
  };

  const handleGenerateShareLink = async () => {
    try {
      const response = await api.post(`/api/notes/${id}/share-link`);
      const shareUrl = `${window.location.origin}/notes/shared/${response.data.shareToken}`;
      setShareLink(shareUrl);
    } catch (error) {
      console.error('Error generating share link:', error);
      alert('Failed to generate share link.');
    }
  };

  const handleRemoveShareLink = async () => {
    try {
      await api.delete(`/api/notes/${id}/share-link`);
      setShareLink(null);
    } catch (error) {
      console.error('Error removing share link:', error);
      alert('Failed to remove share link.');
    }
  };

  const handleCopyLink = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRemoveShare = async (userId) => {
    try {
      await api.delete(`/api/notes/${id}/share/${userId}`);
      await fetchNote();
    } catch (error) {
      console.error('Error removing share:', error);
      alert('Failed to remove share.');
    }
  };

  const handleDownload = async () => {
    try {
      await api.get(`/api/notes/${id}/download`);
      if (note.fileUrl) {
        window.open(note.fileUrl, '_blank');
      }
    } catch (error) {
      console.error('Error downloading:', error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return;
    }

    try {
      await api.delete(`/api/notes/${id}`);
      navigate('/notes');
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Failed to delete note.');
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
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

  if (!token) return null;

  if (loading) {
    return (
      <div className="main-content">
        <div className="container">
          <Card style={{ textAlign: 'center', padding: '3rem' }}>
            <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
            <p style={{ marginTop: '1rem', color: 'var(--color-gray)' }}>Loading note...</p>
          </Card>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="main-content">
        <div className="container">
          <Card style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>❌</div>
            <h3 style={{ marginBottom: '0.5rem' }}>Note Not Found</h3>
            <p style={{ color: 'var(--color-gray)', marginBottom: '1.5rem' }}>
              The note you're looking for doesn't exist or you don't have access to it.
            </p>
            <Link to="/notes">
              <Button variant="primary">Back to Notes</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  const isSharedToken = params.token !== undefined;
  const isOwner = user && (note.author?._id === user?.id || note.author === user?.id);
  const authorName = note.author?.name || note.author || 'Unknown';

  return (
    <div className="main-content">
      <div className="container" style={{ maxWidth: '900px' }}>
        {/* Back Button */}
        <Link to="/notes" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: '1.5rem' }}>
          <Button variant="outline" style={{ color: 'var(--color-dark)', borderColor: 'var(--color-light-gray)' }}>
            ← Back to Notes
          </Button>
        </Link>

        {/* Note Content */}
        <Card style={{ marginBottom: '2rem', padding: '2rem' }}>
          {/* Category Badge */}
          <div style={{ marginBottom: '1rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                background: `${getCategoryColor(note.category)}20`,
                color: getCategoryColor(note.category),
                borderRadius: 'var(--radius-full)',
                fontSize: '0.875rem',
                fontWeight: 600,
                textTransform: 'capitalize'
              }}
            >
              {getCategoryIcon(note.category)} {note.category}
            </span>
          </div>

          {/* Title */}
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 700,
            marginBottom: '1rem',
            color: 'var(--color-dark)',
            lineHeight: 1.3
          }}>
            {note.title}
          </h1>

          {/* Subject */}
          {note.subject && (
            <p style={{
              fontSize: '1rem',
              color: 'var(--color-gray)',
              marginBottom: '1rem',
              fontWeight: 500
            }}>
              <strong>Subject:</strong> {note.subject}
            </p>
          )}

          {/* Meta Information */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
            marginBottom: '1.5rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid var(--color-light-gray)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'var(--bg-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.25rem',
                fontWeight: 700
              }}>
                {authorName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--color-dark)' }}>
                  {authorName}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-gray)' }}>
                  {formatTime(note.createdAt)}
                </div>
              </div>
            </div>
            <span style={{ color: 'var(--color-gray)' }}>•</span>
            <span style={{ color: 'var(--color-gray)', fontSize: '0.875rem' }}>
              👁️ {note.views || 0} views
            </span>
            {note.downloads > 0 && (
              <>
                <span style={{ color: 'var(--color-gray)' }}>•</span>
                <span style={{ color: 'var(--color-gray)', fontSize: '0.875rem' }}>
                  ⬇️ {note.downloads} downloads
                </span>
              </>
            )}
          </div>

          {/* Note Content */}
          <div style={{ 
            fontSize: '1.125rem',
            lineHeight: 1.8,
            color: 'var(--color-dark-gray)',
            marginBottom: '1.5rem',
            whiteSpace: 'pre-wrap'
          }}>
            {note.content}
          </div>

          {/* Tags */}
          {note.tags && note.tags.length > 0 && (
            <div style={{ 
              display: 'flex', 
              gap: '0.5rem', 
              flexWrap: 'wrap',
              marginTop: '1.5rem',
              paddingTop: '1rem',
              borderTop: '1px solid var(--color-light-gray)'
            }}>
              {note.tags.map((tag, idx) => (
                <span
                  key={idx}
                  style={{
                    padding: '0.25rem 0.75rem',
                    background: 'var(--color-light-gray)',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.875rem',
                    color: 'var(--color-dark-gray)'
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* File Download */}
          {note.fileUrl && (
            <div style={{
              marginTop: '1.5rem',
              paddingTop: '1rem',
              borderTop: '1px solid var(--color-light-gray)'
            }}>
              <Button
                variant="primary"
                onClick={handleDownload}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                ⬇️ Download File: {note.fileName || 'Attachment'}
              </Button>
            </div>
          )}
        </Card>

        {/* Sharing Section - Only for owners and not shared token routes */}
        {isOwner && !isSharedToken && (
          <Card style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Sharing Options</h3>
            
            {/* Public/Private Toggle */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={note.isPublic}
                  onChange={async (e) => {
                    try {
                      await api.put(`/api/notes/${id}`, { isPublic: e.target.checked });
                      await fetchNote();
                    } catch (error) {
                      console.error('Error updating note:', error);
                    }
                  }}
                />
                <span>Make this note public (visible to all users)</span>
              </label>
            </div>

            {/* Share Link */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>Share Link</h4>
              {shareLink ? (
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={shareLink}
                    readOnly
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      border: '1px solid var(--color-light-gray)',
                      borderRadius: 'var(--radius-sm)'
                    }}
                  />
                  <Button variant="secondary" onClick={handleCopyLink}>
                    {copied ? '✓ Copied' : 'Copy'}
                  </Button>
                  <Button variant="outline" onClick={handleRemoveShareLink}>
                    Remove
                  </Button>
                </div>
              ) : (
                <Button variant="primary" onClick={handleGenerateShareLink}>
                  Generate Share Link
                </Button>
              )}
            </div>

            {/* Share with Users */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h4 style={{ fontSize: '1rem' }}>Share with Users</h4>
                <Button variant="primary" size="sm" onClick={() => setShowShareModal(true)}>
                  ➕ Add Users
                </Button>
              </div>
              
              {note.sharedWith && note.sharedWith.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {note.sharedWith.map((share, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.75rem',
                        background: 'var(--color-primary-very-light)',
                        borderRadius: 'var(--radius-sm)'
                      }}
                    >
                      <div>
                        <span style={{ fontWeight: 600 }}>{share.user?.name || share.user}</span>
                        <span style={{ color: 'var(--color-gray)', fontSize: '0.875rem', marginLeft: '0.5rem' }}>
                          ({share.permission})
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveShare(share.user?._id || share.user)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--color-gray)', fontSize: '0.875rem' }}>
                  No users shared with yet
                </p>
              )}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link to={`/notes/edit/${id}`} style={{ flex: 1 }}>
                <Button variant="primary" className="w-full">✏️ Edit Note</Button>
              </Link>
              <Button variant="outline" onClick={handleDelete} style={{ color: '#DC3545', borderColor: '#DC3545' }}>
                🗑️ Delete
              </Button>
            </div>
          </Card>
        )}

        {/* Share Modal */}
        {showShareModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <Card style={{ maxWidth: '500px', width: '90%', padding: '2rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Share Note with Users</h3>
              
              {/* User Search */}
              <div className="form-field" style={{ marginBottom: '1rem' }}>
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchUsers}
                  onChange={(e) => handleSearchUsers(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              {/* Search Results */}
              {userSearchResults.length > 0 && (
                <div style={{
                  maxHeight: '200px',
                  overflowY: 'auto',
                  marginBottom: '1rem',
                  border: '1px solid var(--color-light-gray)',
                  borderRadius: 'var(--radius-sm)'
                }}>
                  {userSearchResults.map((user) => (
                    <div
                      key={user._id || user.id}
                      style={{
                        padding: '0.75rem',
                        cursor: 'pointer',
                        background: selectedUsers.includes(user._id || user.id)
                          ? 'var(--color-primary-very-light)'
                          : 'transparent',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                      onClick={() => handleToggleUser(user._id || user.id)}
                    >
                      <div>
                        <div style={{ fontWeight: 600 }}>{user.name}</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--color-gray)' }}>{user.email}</div>
                      </div>
                      {selectedUsers.includes(user._id || user.id) && (
                        <span>✓</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Permission Selection */}
              <div className="form-field" style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Permission</label>
                <select
                  value={sharePermission}
                  onChange={(e) => setSharePermission(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="view">View Only</option>
                  <option value="edit">View & Edit</option>
                </select>
              </div>

              {/* Selected Users */}
              {selectedUsers.length > 0 && (
                <div style={{ marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--color-gray)' }}>
                  {selectedUsers.length} user(s) selected
                </div>
              )}

              {/* Modal Actions */}
              <div style={{ display: 'flex', gap: '1rem' }}>
                <Button
                  variant="primary"
                  onClick={handleShareNote}
                  disabled={selectedUsers.length === 0}
                  style={{ flex: 1 }}
                >
                  Share
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowShareModal(false);
                    setSelectedUsers([]);
                    setSearchUsers('');
                    setUserSearchResults([]);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

