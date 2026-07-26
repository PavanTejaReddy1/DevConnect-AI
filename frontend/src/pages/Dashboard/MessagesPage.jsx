import { useState, useEffect, useRef } from 'react';
import { FiSend, FiMoreVertical, FiPaperclip } from 'react-icons/fi';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import { messageService } from '../../services/messageService.js';
import { connectSocket, disconnectSocket, socketEvents, useSocket } from '../../services/socketService.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function MessagesPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [typingUsers, setTypingUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const { socket, sendMessage, startTyping, stopTyping, markAsRead } = useSocket();

  // Default conversation ID (for demo purposes - in real app, this would be selected from a list)
  const conversationId = 'demo-conversation';

  useEffect(() => {
    // Connect to socket
    const token = localStorage.getItem('dc_token');
    if (token) {
      connectSocket(token);
    }

    // Fetch initial messages
    fetchMessages();

    // Set up socket event listeners
    const socketInstance = connectSocket(token);

    socketInstance.on(socketEvents.MESSAGE_NEW, (newMessage) => {
      setMessages(prev => [...prev, newMessage]);
      scrollToBottom();
    });

    socketInstance.on(socketEvents.TYPING_START, ({ user: typingUser }) => {
      setTypingUsers(prev => {
        if (!prev.find(u => u._id === typingUser._id)) {
          return [...prev, typingUser];
        }
        return prev;
      });
    });

    socketInstance.on(socketEvents.TYPING_STOP, ({ userId }) => {
      setTypingUsers(prev => prev.filter(u => u._id !== userId));
    });

    socketInstance.on(socketEvents.MESSAGE_READ, ({ userId }) => {
      // Update read receipts
      setMessages(prev => prev.map(msg => ({
        ...msg,
        readBy: msg.readBy?.map(rb => 
          rb.user.toString() === userId ? { ...rb, readAt: new Date() } : rb
        ),
      })));
    });

    return () => {
      socketInstance.off(socketEvents.MESSAGE_NEW);
      socketInstance.off(socketEvents.TYPING_START);
      socketInstance.off(socketEvents.TYPING_STOP);
      socketInstance.off(socketEvents.MESSAGE_READ);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      // For demo, we'll use mock data since we don't have a real conversation yet
      setMessages([
        { 
          _id: '1', 
          sender: { _id: 'user1', name: 'Priya', avatarUrl: null }, 
          content: 'Pushed the auth middleware — can someone review?', 
          createdAt: new Date(Date.now() - 3600000),
          readBy: []
        },
        { 
          _id: '2', 
          sender: { _id: user?.id || 'me', name: 'You', avatarUrl: null }, 
          content: 'On it — looks clean so far 👍', 
          createdAt: new Date(Date.now() - 1800000),
          readBy: []
        },
        { 
          _id: '3', 
          sender: { _id: 'user2', name: 'Marcus', avatarUrl: null }, 
          content: "I'll wire up the Kanban drag events after lunch", 
          createdAt: new Date(Date.now() - 600000),
          readBy: []
        },
      ]);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const tempMessage = {
      _id: Date.now().toString(),
      sender: { _id: user?.id || 'me', name: 'You', avatarUrl: null },
      content: inputMessage,
      createdAt: new Date(),
      readBy: []
    };

    setMessages(prev => [...prev, tempMessage]);
    setInputMessage('');
    scrollToBottom();
    stopTyping(conversationId);

    // Send via socket
    if (socket) {
      sendMessage({
        conversationId,
        content: inputMessage,
        messageType: 'text',
      });
    }
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    
    if (!isTyping) {
      setIsTyping(true);
      startTyping(conversationId);
    }

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      stopTyping(conversationId);
    }, 1000);
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '??';
  };

  const isMine = (msg) => {
    return msg.sender._id === user?.id || msg.sender.name === 'You';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Messages" subtitle="Real-time chat with your team." />
        <Card className="mx-auto max-w-2xl p-5 sm:p-6">
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Messages" subtitle="Real-time chat with your team." />
      <Card className="mx-auto max-w-2xl p-5 sm:p-6">
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          {messages.map((msg) => (
            <div key={msg._id} className={`flex items-end gap-2 ${isMine(msg) ? 'flex-row-reverse' : ''}`}>
              <Avatar
                name={msg.sender.name}
                src={msg.sender.avatarUrl}
                size="sm"
                className="shrink-0"
              />
              <div
                className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                  isMine(msg) 
                    ? 'rounded-br-sm bg-primary text-white' 
                    : 'rounded-bl-sm bg-background text-text/75 dark:bg-slate-700 dark:text-slate-300'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {typingUsers.length > 0 && (
            <div className="flex items-center gap-2 pl-9">
              <span className="flex gap-1 rounded-full bg-background px-3 py-2 dark:bg-slate-700">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-text/30 [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-text/30 [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-text/30" />
              </span>
              <span className="text-[10px] text-text/35 dark:text-slate-500">
                {typingUsers[0]?.name} is typing…
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />

          {/* Input */}
          <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-2">
            <button
              type="button"
              className="rounded-lg p-2 text-text/40 transition-colors hover:text-text dark:text-slate-500 dark:hover:text-slate-300"
            >
              <FiPaperclip className="h-4 w-4" />
            </button>
            <input
              type="text"
              value={inputMessage}
              onChange={handleInputChange}
              placeholder="Type a message..."
              className="flex-1 rounded-lg border border-border bg-background px-4 py-2 text-xs text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-700 dark:text-slate-200"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="rounded-lg bg-primary p-2 text-white transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:hover:bg-primary"
            >
              <FiSend className="h-4 w-4" />
            </button>
          </form>
        </div>
      </Card>
    </div>
  );
}
