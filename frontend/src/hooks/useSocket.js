import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext.jsx';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export function useSocket() {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [typingUsers, setTypingUsers] = useState(new Map()); // conversationId -> Set of userIds
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user?._id) return;

    const newSocket = io(SOCKET_URL, {
      auth: { userId: user._id },
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
      newSocket.emit('user:join', user._id);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    newSocket.on('user:online', ({ userId }) => {
      setOnlineUsers(prev => new Set([...prev, userId]));
    });

    newSocket.on('user:offline', ({ userId }) => {
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    });

    newSocket.on('user:typing', ({ userId, conversationId }) => {
      setTypingUsers(prev => {
        const newMap = new Map(prev);
        if (!newMap.has(conversationId)) {
          newMap.set(conversationId, new Set());
        }
        newMap.get(conversationId).add(userId);
        return newMap;
      });
    });

    newSocket.on('user:stop:typing', ({ userId, conversationId }) => {
      setTypingUsers(prev => {
        const newMap = new Map(prev);
        if (newMap.has(conversationId)) {
          newMap.get(conversationId).delete(userId);
          if (newMap.get(conversationId).size === 0) {
            newMap.delete(conversationId);
          }
        }
        return newMap;
      });
    });

    setSocket(newSocket);
    socketRef.current = newSocket;

    return () => {
      newSocket.disconnect();
    };
  }, [user?._id]);

  const joinRoom = (conversationId) => {
    if (socketRef.current) {
      socketRef.current.emit('join:room', conversationId);
    }
  };

  const leaveRoom = (conversationId) => {
    if (socketRef.current) {
      socketRef.current.emit('leave:room', conversationId);
    }
  };

  const sendMessage = (data) => {
    if (socketRef.current) {
      socketRef.current.emit('send:message', data);
    }
  };

  const sendTyping = (conversationId) => {
    if (socketRef.current) {
      socketRef.current.emit('typing', { conversationId });
    }
  };

  const stopTyping = (conversationId) => {
    if (socketRef.current) {
      socketRef.current.emit('stop:typing', { conversationId });
    }
  };

  const markAsRead = (conversationId, messageId) => {
    if (socketRef.current) {
      socketRef.current.emit('message:read', { conversationId, messageId });
    }
  };

  return {
    socket,
    isConnected,
    onlineUsers,
    typingUsers,
    joinRoom,
    leaveRoom,
    sendMessage,
    sendTyping,
    stopTyping,
    markAsRead,
  };
}
