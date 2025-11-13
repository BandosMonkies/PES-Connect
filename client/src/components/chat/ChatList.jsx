import React from 'react';
import './ChatList.css';

const ChatList = ({ conversations, selectedConversation, onSelectConversation, currentUserId }) => {
  const getConversationName = (conversation) => {
    if (conversation.isGroup) {
      return conversation.groupName;
    }
    
    const otherUser = conversation.participants.find(p => p._id !== currentUserId);
    return otherUser?.name || 'Unknown User';
  };

  const getLastMessagePreview = (conversation) => {
    if (!conversation.lastMessage) return 'No messages yet';
    
    const content = conversation.lastMessage.content;
    return content.length > 50 ? content.substring(0, 50) + '...' : content;
  };

  const formatTime = (date) => {
    if (!date) return '';
    
    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return messageDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return messageDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="chat-list">
      <div className="chat-list-header">
        <h2>Messages</h2>
      </div>
      <div className="chat-list-items">
        {conversations.length === 0 ? (
          <div className="chat-list-empty">
            <p>No conversations yet</p>
            <p className="chat-list-empty-subtitle">Start a new chat to connect with others</p>
          </div>
        ) : (
          conversations.map((conversation) => (
            <div
              key={conversation._id}
              className={`chat-list-item ${selectedConversation?._id === conversation._id ? 'active' : ''}`}
              onClick={() => onSelectConversation(conversation)}
            >
              <div className="chat-list-item-avatar">
                {getConversationName(conversation).charAt(0).toUpperCase()}
              </div>
              <div className="chat-list-item-content">
                <div className="chat-list-item-header">
                  <span className="chat-list-item-name">
                    {getConversationName(conversation)}
                  </span>
                  <span className="chat-list-item-time">
                    {formatTime(conversation.lastMessageAt)}
                  </span>
                </div>
                <div className="chat-list-item-message">
                  <span className="chat-list-item-preview">
                    {getLastMessagePreview(conversation)}
                  </span>
                  {conversation.unreadCount > 0 && (
                    <span className="chat-list-item-badge">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatList;