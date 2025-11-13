import React, { useState, useRef, useEffect } from 'react';
import './MessageInput.css';

const MessageInput = ({ onSendMessage, onTyping }) => {
  const [message, setMessage] = useState('');
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);

  const handleChange = (e) => {
    setMessage(e.target.value);

    // Handle typing indicator
    if (!isTypingRef.current && e.target.value.length > 0) {
      onTyping?.(true);
      isTypingRef.current = true;
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      if (isTypingRef.current) {
        onTyping?.(false);
        isTypingRef.current = false;
      }
    }, 1000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    onSendMessage(trimmedMessage);
    setMessage('');

    // Stop typing indicator
    if (isTypingRef.current) {
      onTyping?.(false);
      isTypingRef.current = false;
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <input
        type="text"
        className="message-input-field"
        placeholder="Type a message..."
        value={message}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
      />
      <button
        type="submit"
        className="message-input-button"
        disabled={!message.trim()}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
        </svg>
      </button>
    </form>
  );
};

export default MessageInput;