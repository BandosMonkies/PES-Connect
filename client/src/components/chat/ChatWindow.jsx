import React, { useState, useEffect, useRef } from 'react';
import MessageInput from './MessageInput';
import MessageBubble from './MessageBubble';
import { getSocket } from '../../utils/socket';
import api from '../../lib/api';
import './ChatWindow.css';

const ChatWindow = ({ conversation, currentUserId }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const messagesEndRef = useRef(null);
  const socket = getSocket();

  const getConversationName = () => {
    if (!conversation) return '';
    
    if (conversation.isGroup) {
      return conversation.groupName;
    }
    
    const otherUser = conversation.participants.find(p => p._id !== currentUserId);
    return otherUser?.name || 'Unknown User';
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!conversation) return;

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/api/chat/conversations/${conversation._id}/messages`);
        setMessages(data.messages);
        
        // Mark messages as read
        await api.patch(`/api/chat/conversations/${conversation._id}/read`);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [conversation]);

  useEffect(() => {
    if (!socket || !conversation) return;

    // Join conversation room
    socket.emit('conversation:join', conversation._id);

    // Listen for new messages
    const handleNewMessage = (message) => {
      if (message.conversation === conversation._id) {
        setMessages(prev => [...prev, message]);
        scrollToBottom();
        
        // Mark as read if not sent by current user
        if (message.sender._id !== currentUserId) {
          socket.emit('message:read', {
            conversationId: conversation._id,
            messageIds: [message._id]
          });
        }
      }
    };

    // Listen for typing indicators
    const handleTyping = ({ userId, isTyping }) => {
      if (userId !== currentUserId) {
        setTypingUsers(prev => {
          const newSet = new Set(prev);
          if (isTyping) {
            newSet.add(userId);
          } else {
            newSet.delete(userId);
          }
          return newSet;
        });
      }
    };

    socket.on('message:receive', handleNewMessage);
    socket.on('typing:user', handleTyping);

    return () => {
      socket.emit('conversation:leave', conversation._id);
      socket.off('message:receive', handleNewMessage);
      socket.off('typing:user', handleTyping);
    };
  }, [socket, conversation, currentUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (content) => {
    if (!socket || !conversation) return;

    socket.emit('message:send', {
      conversationId: conversation._id,
      content,
      messageType: 'text'
    });
  };

  const handleTyping = (isTyping) => {
    if (!socket || !conversation) return;

    if (isTyping) {
      socket.emit('typing:start', { conversationId: conversation._id });
    } else {
      socket.emit('typing:stop', { conversationId: conversation._id });
    }
  };

  if (!conversation) {
    return (
      <div className="chat-window-empty">
        <div className="chat-window-empty-content">
          <h3>Welcome to PES Connect Chat</h3>
          <p>Select a conversation to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-window">
      <div className="chat-window-header">
        <div className="chat-window-header-avatar">
          {getConversationName().charAt(0).toUpperCase()}
        </div>
        <div className="chat-window-header-info">
          <h3>{getConversationName()}</h3>
          <span className="chat-window-header-status">
            {typingUsers.size > 0 ? 'Typing...' : 'Active'}
          </span>
        </div>
      </div>

      <div className="chat-window-messages">
        {loading ? (
          <div className="chat-window-loading">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="chat-window-no-messages">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <MessageBubble
                key={message._id}
                message={message}
                isOwn={message.sender._id === currentUserId}
                showAvatar={
                  index === 0 ||
                  messages[index - 1].sender._id !== message.sender._id
                }
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <MessageInput
        onSendMessage={handleSendMessage}
        onTyping={handleTyping}
      />
    </div>
  );
};

export default ChatWindow;