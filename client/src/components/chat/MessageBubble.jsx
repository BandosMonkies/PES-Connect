import React from 'react';

const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';
  return new Date(timestamp).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getUserId = (user) => user?._id || user?.id || user?.userId;

export default function MessageBubble({ message, currentUserId }) {
  const isOwnMessage = getUserId(message.sender)?.toString() === currentUserId?.toString();

  return (
    <div className={`message-row ${isOwnMessage ? 'message-row--own' : ''}`}>
      <div className={`message-bubble ${isOwnMessage ? 'message-bubble--own' : ''}`}>
        {message.messageType === 'text' ? (
          <p className="message-content">{message.content}</p>
        ) : (
          <p className="message-content">Unsupported message type</p>
        )}
        <div className="message-meta">
          {!isOwnMessage && message.sender?.name && (
            <span className="message-sender">{message.sender.name}</span>
          )}
          <span className="message-time">{formatTimestamp(message.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}

