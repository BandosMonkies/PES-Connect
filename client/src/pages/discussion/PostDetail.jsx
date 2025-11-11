import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getAuth } from '../../utils/auth';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { demoPosts } from '../../data/demoPosts.js';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = getAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [commentReplies, setCommentReplies] = useState({});

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    // Find post from demo data
    const foundPost = demoPosts.find(p => p.id === id);
    setPost(foundPost);
    setLoading(false);
  }, [id, token, navigate]);

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

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    // In a real app, this would make an API call
    alert('Comment feature will be connected to backend. Comment: ' + newComment);
    setNewComment('');
  };

  const handleReply = (commentId) => {
    const replyText = commentReplies[commentId];
    if (!replyText || !replyText.trim()) return;
    // In a real app, this would make an API call
    alert(`Reply to comment ${commentId}: ${replyText}`);
    setCommentReplies({ ...commentReplies, [commentId]: '' });
  };

  if (!token) return null;

  if (loading) {
    return (
      <div className="main-content">
        <div className="container">
          <Card style={{ textAlign: 'center', padding: '3rem' }}>
            <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
            <p style={{ marginTop: '1rem', color: 'var(--color-gray)' }}>Loading post...</p>
          </Card>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="main-content">
        <div className="container">
          <Card style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>❌</div>
            <h3 style={{ marginBottom: '0.5rem' }}>Post Not Found</h3>
            <p style={{ color: 'var(--color-gray)', marginBottom: '1.5rem' }}>
              The post you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/discussion">
              <Button variant="primary">Back to Forum</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  const netScore = post.upvotes - post.downvotes;

  return (
    <div className="main-content">
      <div className="container" style={{ maxWidth: '900px' }}>
        {/* Back Button */}
        <Link to="/discussion" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: '1.5rem' }}>
          <Button variant="outline" style={{ color: 'var(--color-dark)', borderColor: 'var(--color-light-gray)' }}>
            ← Back to Forum
          </Button>
        </Link>

        {/* Post Content */}
        <Card style={{ marginBottom: '2rem', padding: '2rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {/* Voting Section */}
            <div 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                padding: '0.5rem',
                minWidth: '60px'
              }}
            >
              <button
                onClick={() => {
                  // Handle upvote
                  alert('Upvote feature will be connected to backend');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '2rem',
                  padding: '0.5rem',
                  color: post.userVote === 'upvote' ? '#FF6B35' : '#6C757D',
                  transition: 'all 0.2s',
                  borderRadius: 'var(--radius-md)'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = 'var(--color-primary-very-light)';
                  e.target.style.transform = 'scale(1.1)';
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
                fontSize: '1.5rem',
                color: netScore >= 0 ? '#28A745' : '#DC3545',
                margin: '0.5rem 0'
              }}>
                {netScore}
              </span>
              <button
                onClick={() => {
                  // Handle downvote
                  alert('Downvote feature will be connected to backend');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '2rem',
                  padding: '0.5rem',
                  color: post.userVote === 'downvote' ? '#1E88E5' : '#6C757D',
                  transition: 'all 0.2s',
                  borderRadius: 'var(--radius-md)'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = 'var(--color-secondary-very-light)';
                  e.target.style.transform = 'scale(1.1)';
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
              <div style={{ marginBottom: '1rem' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    background: `${getCategoryColor(post.category)}20`,
                    color: getCategoryColor(post.category),
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    textTransform: 'capitalize'
                  }}
                >
                  {getCategoryIcon(post.category)} {post.category}
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
                {post.title}
              </h1>

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
                    {post.author.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--color-dark)' }}>
                      {post.author}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-gray)' }}>
                      {formatTime(post.createdAt)}
                    </div>
                  </div>
                </div>
                <span style={{ color: 'var(--color-gray)' }}>•</span>
                <span style={{ color: 'var(--color-gray)', fontSize: '0.875rem' }}>
                  💬 {post.commentCount} comments
                </span>
              </div>

              {/* Post Content */}
              <div style={{ 
                fontSize: '1.125rem',
                lineHeight: 1.8,
                color: 'var(--color-dark-gray)',
                marginBottom: '1.5rem',
                whiteSpace: 'pre-wrap'
              }}>
                {post.content}
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div style={{ 
                  display: 'flex', 
                  gap: '0.5rem', 
                  flexWrap: 'wrap',
                  marginTop: '1.5rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--color-light-gray)'
                }}>
                  {post.tags.map((tag, idx) => (
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
            </div>
          </div>
        </Card>

        {/* Add Comment Section */}
        <Card style={{ marginBottom: '2rem', padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Add a Comment</h3>
          <div className="form-field" style={{ marginBottom: '1rem' }}>
            <textarea
              placeholder="What are your thoughts?"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows="4"
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
          <Button 
            variant="primary" 
            onClick={handleAddComment}
            disabled={!newComment.trim()}
          >
            Post Comment
          </Button>
        </Card>

        {/* Comments Section */}
        <Card style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>
            Comments ({post.comments.length})
          </h3>
          
          {post.comments.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {post.comments.map((comment) => (
                <div key={comment.id} style={{ 
                  paddingBottom: '1.5rem',
                  borderBottom: '1px solid var(--color-light-gray)'
                }}>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    {/* Comment Voting */}
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      minWidth: '40px'
                    }}>
                      <button
                        onClick={() => alert('Upvote comment')}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '1.25rem',
                          color: '#6C757D',
                          padding: '0.25rem'
                        }}
                      >
                        ▲
                      </button>
                      <span style={{ 
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: 'var(--color-gray)',
                        margin: '0.25rem 0'
                      }}>
                        {comment.upvotes - comment.downvotes}
                      </span>
                      <button
                        onClick={() => alert('Downvote comment')}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '1.25rem',
                          color: '#6C757D',
                          padding: '0.25rem'
                        }}
                      >
                        ▼
                      </button>
                    </div>

                    {/* Comment Content */}
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.5rem'
                      }}>
                        <span style={{ fontWeight: 600, color: 'var(--color-dark)' }}>
                          {comment.author}
                        </span>
                        <span style={{ color: 'var(--color-gray)', fontSize: '0.875rem' }}>
                          • {formatTime(comment.createdAt)}
                        </span>
                      </div>
                      <p style={{ 
                        color: 'var(--color-dark-gray)',
                        lineHeight: 1.6,
                        marginBottom: '0.75rem'
                      }}>
                        {comment.content}
                      </p>
                      <button
                        onClick={() => {
                          const replyText = prompt('Enter your reply:');
                          if (replyText) handleReply(comment.id);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--color-secondary)',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          padding: '0.25rem 0'
                        }}
                      >
                        Reply
                      </button>

                      {/* Replies */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div style={{ 
                          marginTop: '1rem',
                          marginLeft: '2rem',
                          paddingLeft: '1rem',
                          borderLeft: '2px solid var(--color-light-gray)'
                        }}>
                          {comment.replies.map((reply) => (
                            <div key={reply.id} style={{ 
                              marginBottom: '1rem',
                              paddingBottom: '1rem',
                              borderBottom: '1px solid var(--color-light-gray)'
                            }}>
                              <div style={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                gap: '0.5rem',
                                marginBottom: '0.5rem'
                              }}>
                                <span style={{ fontWeight: 600, color: 'var(--color-dark)', fontSize: '0.875rem' }}>
                                  {reply.author}
                                </span>
                                <span style={{ color: 'var(--color-gray)', fontSize: '0.75rem' }}>
                                  • {formatTime(reply.createdAt)}
                                </span>
                              </div>
                              <p style={{ 
                                color: 'var(--color-dark-gray)',
                                lineHeight: 1.6,
                                fontSize: '0.9rem'
                              }}>
                                {reply.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-gray)' }}>
              No comments yet. Be the first to comment!
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

