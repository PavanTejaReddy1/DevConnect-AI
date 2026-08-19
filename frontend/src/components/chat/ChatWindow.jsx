import { useState, useEffect, useRef } from 'react';
import { FiArrowLeft, FiMoreVertical, FiSearch } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext.jsx';
import MessageBubble from './MessageBubble.jsx';
import MessageInput from './MessageInput.jsx';
import TypingIndicator from './TypingIndicator.jsx';

export default function ChatWindow({ conversation, onBack, typingUsers }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [replyTo, setReplyTo] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (conversation) {
      fetchMessages();
    }
  }, [conversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/conversations/${conversation._id}/messages`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setMessages(data.data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (text) => {
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          conversation: conversation._id,
          text,
          replyTo: replyTo?._id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessages([...messages, data.data]);
        setReplyTo(null);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleReply = (message) => {
    setReplyTo(message);
  };

  const displayName = conversation?.type === 'private'
    ? conversation?.participants?.find(p => p._id !== user._id)?.name
    : conversation?.name;

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-text/40">Select a conversation to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border/50 flex items-center gap-3">
        <button onClick={onBack} className="p-2 rounded-lg hover:bg-gray-100 lg:hidden">
          <FiArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h3 className="font-semibold text-text">{displayName}</h3>
          <p className="text-sm text-text/40">
            {conversation.type === 'private' ? 'Direct message' : 'Group chat'}
          </p>
        </div>
        <button className="p-2 rounded-lg hover:bg-gray-100">
          <FiSearch size={18} />
        </button>
        <button className="p-2 rounded-lg hover:bg-gray-100">
          <FiMoreVertical size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-text/40">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message._id}
              message={message}
              isOwn={message.sender._id === user._id}
              onReply={handleReply}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing indicator */}
      {typingUsers.has(conversation._id) && (
        <div className="px-4">
          <TypingIndicator users={Array.from(typingUsers.get(conversation._id))} />
        </div>
      )}

      {/* Input */}
      <div className="p-4">
        <MessageInput
          onSend={handleSendMessage}
          replyTo={replyTo}
          onCancelReply={() => setReplyTo(null)}
        />
      </div>
    </div>
  );
}
