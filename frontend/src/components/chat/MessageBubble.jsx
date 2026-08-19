import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiEdit2, FiMoreVertical, FiCornerUpLeft } from 'react-icons/fi';
import Avatar from '../ui/Avatar.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function MessageBubble({ message, isOwn, onEdit, onDelete, onReply }) {
  const { user } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isRead = message.readBy?.includes(user._id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}
    >
      <Avatar
        name={message.sender?.name}
        src={message.sender?.avatarUrl}
        size="sm"
      />
      <div className={`flex-1 ${isOwn ? 'flex flex-col items-end' : ''}`}>
        {/* Reply preview */}
        {message.replyTo && (
          <div className={`text-xs text-text/40 mb-1 flex items-center gap-1 ${isOwn ? 'flex-row-reverse' : ''}`}>
            <FiCornerUpLeft size={12} />
            <span>Replying to {message.replyTo.sender?.name}</span>
          </div>
        )}

        {/* Message bubble */}
        <div
          className={`glass-card p-3 max-w-md ${
            isOwn
              ? 'bg-primary/10 border-primary/20'
              : 'bg-card/70'
          }`}
        >
          {/* Sender name for group chats */}
          {!isOwn && (
            <p className="text-xs font-medium text-text/60 mb-1">
              {message.sender?.name}
            </p>
          )}

          {/* Message text */}
          <p className="text-text">{message.text}</p>

          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 space-y-2">
              {message.attachments.map((attachment, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg"
                >
                  <span className="text-sm text-text/70">{attachment.name}</span>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className={`flex items-center gap-2 mt-1 text-xs text-text/40 ${isOwn ? 'justify-end' : ''}`}>
            <span>{formatTime(message.createdAt)}</span>
            {message.edited && <span>(edited)</span>}
            {isOwn && (
              <div className="flex items-center gap-1">
                {isRead ? (
                  <FiCheck size={14} className="text-primary" />
                ) : (
                  <FiCheck size={14} />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <div className={`flex gap-1 mt-1 ${isOwn ? 'flex-row-reverse' : ''}`}>
            {message.reactions.map((reaction, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-gray-100 rounded-full text-xs"
              >
                {reaction.emoji} {reaction.users.length}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
