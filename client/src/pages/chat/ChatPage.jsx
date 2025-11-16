import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import Card from '../../components/Card';
import Button from '../../components/Button';
import ConversationPreview from '../../components/chat/ConversationPreview';
import MessageBubble from '../../components/chat/MessageBubble';
import { getAuth } from '../../utils/auth';
import api from '../../lib/api';

const getId = (entity) => entity?._id || entity?.id || entity;

const getSocketUrl = () => {
  if (import.meta.env.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL;
  }
  return api.defaults.baseURL || 'http://localhost:8001';
};

export default function ChatPage() {
  const navigate = useNavigate();
  const { token, user } = getAuth();
  const currentUserId = user?.id;

  const [conversations, setConversations] = useState([]);
  const [conversationsLoading, setConversationsLoading] = useState(true);
  const [conversationsError, setConversationsError] = useState('');

  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const selectedConversationRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState('');

  const [composerValue, setComposerValue] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

  const [typingUsers, setTypingUsers] = useState({});
  const typingTimeoutRef = useRef({});

  const [onlineUsers, setOnlineUsers] = useState({});

  const [socketError, setSocketError] = useState('');
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const currentUserIdRef = useRef(currentUserId);
  useEffect(() => {
    currentUserIdRef.current = currentUserId;
  }, [currentUserId]);

  useEffect(() => {
    selectedConversationRef.current = selectedConversationId;
  }, [selectedConversationId]);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    let cancelled = false;

    const fetchConversations = async () => {
      setConversationsLoading(true);
      setConversationsError('');
      try {
        const response = await api.get('/api/chat/conversations');
        if (!cancelled) {
          const data = response.data || [];
          setConversations(
            data.sort(
              (a, b) =>
                new Date(b.lastMessageAt || b.updatedAt || 0) -
                new Date(a.lastMessageAt || a.updatedAt || 0)
            )
          );
          if (data.length > 0 && !selectedConversationId) {
            setSelectedConversationId(getId(data[0]));
          }
        }
      } catch (error) {
        console.error('Failed to load conversations', error);
        if (!cancelled) {
          setConversationsError(
            error.response?.data?.message || 'Failed to load conversations. Please try again.'
          );
        }
      } finally {
        if (!cancelled) {
          setConversationsLoading(false);
        }
      }
    };

    fetchConversations();

    return () => {
      cancelled = true;
    };
  }, [navigate, selectedConversationId, token]);

  const selectedConversation = useMemo(
    () =>
      conversations.find(
        (conversation) => getId(conversation)?.toString() === selectedConversationId?.toString()
      ) || null,
    [conversations, selectedConversationId]
  );

  const scrollMessagesToEnd = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, []);

  useEffect(() => {
    scrollMessagesToEnd();
  }, [messages, scrollMessagesToEnd]);

  const loadMessages = useCallback(
    async (conversationId) => {
      if (!conversationId) return;
      setMessagesLoading(true);
      setMessagesError('');
      try {
        const response = await api.get(`/api/chat/conversations/${conversationId}/messages`);
        const messageList = response.data?.messages || [];
        setMessages(messageList);

        // Mark messages as read
        if (messageList.length > 0) {
          const unreadMessageIds = messageList
            .filter(
              (message) =>
                getId(message.sender)?.toString() !== currentUserIdRef.current?.toString() &&
                !(message.readBy || []).some(
                  (entry) => getId(entry.user)?.toString() === currentUserIdRef.current?.toString()
                )
            )
            .map((message) => getId(message));

          if (unreadMessageIds.length > 0) {
            try {
              await api.patch(`/api/chat/conversations/${conversationId}/read`);
              if (socketRef.current?.connected) {
                socketRef.current.emit('message:read', {
                  conversationId,
                  messageIds: unreadMessageIds,
                });
              }
            } catch (error) {
              console.error('Failed to mark messages as read', error);
            }
          }
        }

        setConversations((prev) =>
          prev.map((conversation) =>
            getId(conversation)?.toString() === conversationId?.toString()
              ? { ...conversation, unreadCount: 0 }
              : conversation
          )
        );
      } catch (error) {
        console.error('Failed to load messages', error);
        setMessagesError('Failed to load messages. Please try again.');
      } finally {
        setMessagesLoading(false);
      }
    },
    []
  );

  const handleSelectConversation = useCallback(
    (conversation) => {
      const conversationId = getId(conversation);
      if (!conversationId) return;

      if (conversationId === selectedConversationRef.current) return;

      if (socketRef.current && selectedConversationRef.current) {
        socketRef.current.emit('conversation:leave', selectedConversationRef.current);
      }

      setSelectedConversationId(conversationId);
      loadMessages(conversationId);

      if (socketRef.current?.connected) {
        socketRef.current.emit('conversation:join', conversationId);
      } else if (socketRef.current) {
        socketRef.current.once('connect', () => {
          socketRef.current?.emit('conversation:join', conversationId);
        });
      }
    },
    [loadMessages]
  );

  useEffect(() => {
    if (!token) return;

    const socket = io(getSocketUrl(), {
      auth: { token },
      transports: ['websocket'],
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setSocketError('');
      if (selectedConversationRef.current) {
        socket.emit('conversation:join', selectedConversationRef.current);
      }
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error', error);
      setSocketError(error?.message || 'Failed to connect to chat server.');
    });

    socket.on('message:error', ({ error }) => {
      setSocketError(error || 'Failed to send message.');
    });

    socket.on('message:receive', (message) => {
      const conversationId = getId(message.conversation)?.toString();

      setConversations((prev) => {
        const existingIndex = prev.findIndex(
          (conversation) => getId(conversation)?.toString() === conversationId
        );

        if (existingIndex === -1) {
          return prev;
        }

        const updatedConversation = {
          ...prev[existingIndex],
          lastMessage: message,
          lastMessageAt: message.createdAt || new Date().toISOString(),
        };

        if (selectedConversationRef.current?.toString() !== conversationId) {
          updatedConversation.unreadCount = (updatedConversation.unreadCount || 0) + 1;
        } else {
          updatedConversation.unreadCount = 0;
        }

        const newConversations = [...prev];
        newConversations.splice(existingIndex, 1);
        newConversations.unshift(updatedConversation);
        return newConversations;
      });

      if (selectedConversationRef.current?.toString() === conversationId) {
        setMessages((prev) => {
          if (prev.some((existing) => getId(existing) === getId(message))) {
            return prev;
          }
          return [...prev, message];
        });

        if (socketRef.current?.connected) {
          socketRef.current.emit('message:read', {
            conversationId,
            messageIds: [getId(message)],
          });
        }
      }
    });

    socket.on('typing:user', ({ userId, isTyping, conversationId }) => {
      if (!conversationId) return;
      setTypingUsers((prev) => {
        if (conversationId !== selectedConversationRef.current?.toString()) {
          return prev;
        }

        const updated = { ...prev };
        if (isTyping) {
          updated[userId] = true;
          if (typingTimeoutRef.current[userId]) {
            clearTimeout(typingTimeoutRef.current[userId]);
          }
          typingTimeoutRef.current[userId] = setTimeout(() => {
            setTypingUsers((innerPrev) => {
              const innerUpdated = { ...innerPrev };
              delete innerUpdated[userId];
              return innerUpdated;
            });
          }, 2500);
        } else {
          delete updated[userId];
        }
        return { ...updated };
      });
    });

    socket.on('user:online', ({ userId }) => {
      setOnlineUsers((prev) => ({ ...prev, [userId]: true }));
    });

    socket.on('user:offline', ({ userId }) => {
      setOnlineUsers((prev) => ({ ...prev, [userId]: false }));
    });

    return () => {
      Object.values(typingTimeoutRef.current).forEach((timeoutId) => clearTimeout(timeoutId));
      typingTimeoutRef.current = {};
      socket.off('connect');
      socket.off('connect_error');
      socket.off('message:error');
      socket.off('message:receive');
      socket.off('typing:user');
      socket.off('user:online');
      socket.off('user:offline');
      socket.disconnect();
    };
  }, [token]);

  useEffect(() => {
    if (!searchTerm || searchTerm.trim().length < 2) {
      setSearchResults([]);
      setSearchLoading(false);
      setSearchError('');
      return;
    }

    let active = true;
    setSearchLoading(true);
    setSearchError('');

    const timer = setTimeout(async () => {
      try {
        const response = await api.get('/api/chat/users/search', {
          params: { query: searchTerm.trim() },
        });
        if (active) {
          setSearchResults(response.data || []);
        }
      } catch (error) {
        console.error('Failed to search users', error);
        if (active) {
          setSearchError('Failed to search users.');
        }
      } finally {
        if (active) {
          setSearchLoading(false);
        }
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [searchTerm]);

  const handleCreateConversation = useCallback(
    async (participant) => {
      try {
        const participantId = getId(participant);
        if (!participantId) return;

        const response = await api.post('/api/chat/conversations', {
          participantIds: [participantId],
          isGroup: false,
        });

        const newConversation = response.data;

        setConversations((prev) => {
          const exists = prev.find(
            (conversation) =>
              !conversation.isGroup &&
              conversation.participants?.some(
                (p) => getId(p)?.toString() === participantId?.toString()
              )
          );

          if (exists) {
            return prev;
          }

          return [newConversation, ...prev];
        });

        setSearchTerm('');
        setSearchResults([]);
        handleSelectConversation(newConversation);
      } catch (error) {
        console.error('Failed to create conversation', error);
        setSearchError(error.response?.data?.message || 'Failed to start conversation.');
      }
    },
    [handleSelectConversation]
  );

  const handleSendMessage = async () => {
    if (!composerValue.trim() || !selectedConversation) return;

    const conversationId = getId(selectedConversation);
    if (!conversationId || !socketRef.current?.connected) {
      setSocketError('Unable to send message. Trying to reconnect...');
      return;
    }

    const payload = {
      conversationId,
      content: composerValue.trim(),
      messageType: 'text',
    };

    setComposerValue('');
    setSendingMessage(true);

    socketRef.current.emit('typing:stop', { conversationId });
    socketRef.current.emit('message:send', payload);

    setTimeout(() => setSendingMessage(false), 150);
  };

  const handleComposerKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
      return;
    }

    if (socketRef.current?.connected && selectedConversation) {
      socketRef.current.emit('typing:start', {
        conversationId: getId(selectedConversation),
      });
    }
  };

  useEffect(() => {
    if (!selectedConversationId) return;
    loadMessages(selectedConversationId);
  }, [loadMessages, selectedConversationId]);

  return (
    <div className="main-content">
      <div className="container">
        <div className="chat-header">
          <div>
            <h1 className="chat-title">Chat Hub</h1>
            <p className="chat-subtitle">
              Connect instantly with peers across PES — collaborate, clarify, and celebrate together.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => {
              setSearchTerm('');
              setSearchResults([]);
              setSelectedConversationId(null);
            }}
            style={{ display: 'none' }}
          >
            New Chat
          </Button>
        </div>

        <div className="chat-layout">
          <Card className="chat-sidebar">
            <div className="chat-search">
              <input
                type="text"
                placeholder="Search students by name or email..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
              {searchLoading && <span className="chat-search-status">Searching...</span>}
              {searchError && <span className="chat-search-error">{searchError}</span>}
              {searchResults.length > 0 && (
                <div className="chat-search-results">
                  {searchResults.map((person) => (
                    <button
                      key={getId(person)}
                      type="button"
                      className="chat-search-result"
                      onClick={() => handleCreateConversation(person)}
                    >
                      <div className="avatar-circle small">
                        {person.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <div className="chat-search-name">{person.name}</div>
                        <div className="chat-search-email">{person.email}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="chat-conversations">
              {conversationsLoading ? (
                <p className="chat-placeholder">Loading conversations...</p>
              ) : conversationsError ? (
                <p className="chat-error">{conversationsError}</p>
              ) : conversations.length === 0 ? (
                <p className="chat-placeholder">
                  No conversations yet. Search for a student to start chatting!
                </p>
              ) : (
                conversations.map((conversation) => (
                  <ConversationPreview
                    key={getId(conversation)}
                    conversation={conversation}
                    currentUserId={currentUserId}
                    active={getId(conversation)?.toString() === selectedConversationId?.toString()}
                    onSelect={handleSelectConversation}
                    onlineUsers={onlineUsers}
                  />
                ))
              )}
            </div>
          </Card>

          <Card className="chat-window">
            {socketError && <div className="chat-status-error">{socketError}</div>}
            {selectedConversation ? (
              <>
                <div className="chat-window-header">
                  <div>
                    <h2 className="chat-window-title">
                      {selectedConversation.isGroup
                        ? selectedConversation.groupName
                        : selectedConversation.participants
                            ?.filter(
                              (participant) =>
                                getId(participant)?.toString() !== currentUserId?.toString()
                            )
                            ?.map((participant) => participant.name)
                            ?.join(', ') || 'Conversation'}
                    </h2>
                    {Object.keys(typingUsers).length > 0 ? (
                      <p className="chat-typing-indicator">Someone is typing...</p>
                    ) : (
                      <p className="chat-window-subtitle">
                        {selectedConversation.isGroup
                          ? `${selectedConversation.participants?.length || 0} members`
                          : 'Direct message'}
                      </p>
                    )}
                  </div>
                </div>

                <div className="chat-messages">
                  {messagesLoading ? (
                    <div className="chat-placeholder">Loading messages...</div>
                  ) : messagesError ? (
                    <div className="chat-error">{messagesError}</div>
                  ) : messages.length === 0 ? (
                    <div className="chat-placeholder">
                      Be the first to say hello in this conversation.
                    </div>
                  ) : (
                    messages.map((message) => (
                      <MessageBubble
                        key={getId(message)}
                        message={message}
                        currentUserId={currentUserId}
                      />
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="chat-composer">
                  <textarea
                    value={composerValue}
                    onChange={(event) => setComposerValue(event.target.value)}
                    onKeyDown={handleComposerKeyDown}
                    placeholder="Type your message..."
                    rows={2}
                  />
                  <Button
                    variant="primary"
                    onClick={handleSendMessage}
                    disabled={!composerValue.trim() || sendingMessage || !socketRef.current?.connected}
                  >
                    Send
                  </Button>
                </div>
              </>
            ) : (
              <div className="chat-empty-state">
                <h3>Start a Conversation</h3>
                <p>Select an existing chat or search for a student to begin messaging.</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

