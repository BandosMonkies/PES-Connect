import React, { useState, useEffect } from 'react';
import { ChatList, ChatWindow } from '../components';
import { getAuth } from '../utils/auth';
import { initializeSocket, disconnectSocket } from '../utils/socket';
import api from '../lib/api';
import './Chat.css';

const Chat = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showChatWindow, setShowChatWindow] = useState(false);
  const { user } = getAuth();

  useEffect(() => {
    // Initialize socket connection
    const socket = initializeSocket();

    if (!socket) {
      console.error('Failed to initialize socket');
      return;
    }

    // Listen for online/offline status updates
    socket.on('user:online', ({ userId }) => {
      console.log('User online:', userId);
    });

    socket.on('user:offline', ({ userId }) => {
      console.log('User offline:', userId);
    });

    // Fetch conversations
    fetchConversations();

    return () => {
      disconnectSocket();
    };
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/chat/conversations');
      setConversations(data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    setShowChatWindow(true);
  };

  const handleBackToList = () => {
    setShowChatWindow(false);
    setSelectedConversation(null);
  };

  if (loading) {
    return (
      <div className="chat-loading">
        <div className="chat-loading-spinner"></div>
        <p>Loading chats...</p>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className={`chat-list-panel ${showChatWindow ? 'hidden-mobile' : ''}`}>
        <ChatList
          conversations={conversations}
          selectedConversation={selectedConversation}
          onSelectConversation={handleSelectConversation}
          currentUserId={user?.id}
        />
      </div>
      <div className={`chat-window-panel ${!showChatWindow ? 'hidden-mobile' : ''}`}>
        {showChatWindow && (
          <button className="chat-back-button" onClick={handleBackToList}>
            ← Back
          </button>
        )}
        <ChatWindow
          conversation={selectedConversation}
          currentUserId={user?.id}
        />
      </div>
    </div>
  );
};

export default Chat;