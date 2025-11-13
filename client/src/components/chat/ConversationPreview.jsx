import React from 'react';

const formatTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return date.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
    });
  }

  if (hours > 0) {
    return `${hours}h ago`;
  }

  if (minutes > 0) {
    return `${minutes}m ago`;
  }

  return 'Just now';
};

const getUserId = (user) => user?._id || user?.id || user?.userId;

export default function ConversationPreview({
  conversation,
  active = false,
  onSelect,
  currentUserId,
  onlineUsers = {},
}) {
  const otherParticipants =
    conversation.isGroup && conversation.groupName
      ? conversation.participants
      : conversation.participants?.filter(
          (participant) => getUserId(participant)?.toString() !== currentUserId?.toString()
        );

  const conversationTitle = conversation.isGroup
    ? conversation.groupName || 'Group Chat'
    : otherParticipants?.[0]?.name || 'Conversation';

  const lastMessageContent = conversation.lastMessage?.deleted
    ? 'This message was deleted'
    : conversation.lastMessage?.content || 'Start the conversation';

  const lastMessageSender =
    getUserId(conversation.lastMessage?.sender)?.toString() === currentUserId?.toString()
      ? 'You: '
      : conversation.isGroup && conversation.lastMessage?.sender
      ? `${conversation.lastMessage.sender.name?.split(' ')[0]}: `
      : '';

  const primaryParticipant = conversation.isGroup
    ? null
    : otherParticipants && otherParticipants.length > 0
    ? otherParticipants[0]
    : null;

  const isOnline = primaryParticipant
    ? Boolean(onlineUsers[getUserId(primaryParticipant)?.toString()])
    : conversation.participants?.some((participant) =>
        participant && participant._id !== currentUserId && onlineUsers[getUserId(participant)?.toString()]
      );

  return (
    <button
      onClick={() => onSelect(conversation)}
      className={`conversation-preview ${active ? 'active' : ''}`}
      type="button"
    >
      <div className="conversation-avatar">
        <div className="avatar-circle">
          {conversation.isGroup
            ? conversation.groupName?.charAt(0)?.toUpperCase() || 'G'
            : primaryParticipant?.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <span className={`status-indicator ${isOnline ? 'online' : 'offline'}`} />
      </div>

      <div className="conversation-body">
        <div className="conversation-header">
          <h4 className="conversation-title">{conversationTitle}</h4>
          <span className="conversation-time">{formatTime(conversation.lastMessageAt)}</span>
        </div>
        <div className="conversation-snippet">
          <span className="conversation-snippet-text">
            {lastMessageSender}
            {lastMessageContent}
          </span>
          {conversation.unreadCount > 0 && (
            <span className="badge-unread">{conversation.unreadCount}</span>
          )}
        </div>
      </div>
    </button>
  );
}

