import React from 'react';
import './MessageBubble.css';

const MessageBubble = ({ message, isOwn, showAvatar }) => {
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`message-bubble-wrapper ${isOwn ? 'own' : 'other'}`}>
      {!isOwn && showAvatar && (
        <div className="message-bubble-avatar">
          {message.sender?.name?.charAt(0).toUpperCase() || '?'}
        </div>
      )}
      {!isOwn && !showAvatar && <div className="message-bubble-avatar-spacer" />}
      
      <div className="message-bubble-content">
        {!isOwn && showAvatar && (
          <div className="message-bubble-sender">{message.sender?.name}</div>
        )}
        <div className={`message-bubble ${isOwn ? 'own' : 'other'}`}>
          <div className="message-bubble-text">
            {message.deleted ? (
              <em className="message-deleted">This message was deleted</em>
            ) : (
              message.content
            )}
          </div>
          <div className="message-bubble-time">
            {formatTime(message.createdAt)}
            {isOwn && (
              <span className="message-bubble-read-indicator">
                {message.readBy?.length > 1 ? '✓✓' : '✓'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;