import { useState, useEffect } from 'react';
import { useSocket } from '../../hooks/useSocket.js';
import ConversationList from '../../components/chat/ConversationList.jsx';
import ChatWindow from '../../components/chat/ChatWindow.jsx';

export default function ChatPage() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const { socket, joinRoom, leaveRoom, typingUsers } = useSocket();

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('receive:message', (message) => {
        if (selectedConversation?._id === message.conversation) {
          setConversations(prev => prev.map(conv => {
            if (conv._id === message.conversation) {
              return { ...conv, lastMessage: message };
            }
            return conv;
          }));
        }
      });
    }

    return () => {
      if (socket) {
        socket.off('receive:message');
      }
    };
  }, [socket, selectedConversation]);

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/conversations', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setConversations(data.data);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectConversation = (conversation) => {
    // Leave previous room
    if (selectedConversation) {
      leaveRoom(selectedConversation._id);
    }
    
    setSelectedConversation(conversation);
    
    // Join new room
    joinRoom(conversation._id);

    // Mark as read
    fetch(`/api/conversations/${conversation._id}/read`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  };

  const handleCreateConversation = () => {
    // TODO: Open modal to create new conversation
    console.log('Create conversation');
  };

  if (loading) {
    return (
      <div className="flex h-full">
        <div className="w-80 border-r border-border/50 animate-pulse" />
        <div className="flex-1 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Conversation List */}
      <div className="w-80 border-r border-border/50">
        <ConversationList
          conversations={conversations}
          selectedId={selectedConversation?._id}
          onSelect={handleSelectConversation}
          onCreate={handleCreateConversation}
        />
      </div>

      {/* Chat Window */}
      <div className="flex-1">
        <ChatWindow
          conversation={selectedConversation}
          onBack={() => setSelectedConversation(null)}
          typingUsers={typingUsers}
        />
      </div>
    </div>
  );
}
