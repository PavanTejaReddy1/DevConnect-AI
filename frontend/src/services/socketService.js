import { io } from 'socket.io-client';

let socket = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

export const connectSocket = (token) => {
  if (socket) {
    return socket;
  }

  const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

  socket = io(socketUrl, {
    auth: { token },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
    transports: ['websocket', 'polling'],
  });

  socket.on('connect', () => {
    reconnectAttempts = 0;
  });

  socket.on('disconnect', (reason) => {
    if (reason === 'io server disconnect') {
      // Server disconnected, need to reconnect manually
      socket.connect();
    }
  });

  socket.on('connect_error', (error) => {
    reconnectAttempts++;
    if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      // Max reconnection attempts reached
    }
  });

  socket.on('reconnect', (attemptNumber) => {
    reconnectAttempts = 0;
  });

  socket.on('reconnect_error', () => {
    // Reconnection error
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    reconnectAttempts = 0;
  }
};

export const getSocket = () => socket;

export const socketEvents = {
  // User events
  USER_ONLINE: 'user:online',
  USER_OFFLINE: 'user:offline',

  // Conversation events
  JOIN_CONVERSATION: 'join:conversation',
  LEAVE_CONVERSATION: 'leave:conversation',

  // Typing events
  TYPING_START: 'typing:start',
  TYPING_STOP: 'typing:stop',

  // Message events
  MESSAGE_SEND: 'message:send',
  MESSAGE_NEW: 'message:new',
  MESSAGE_READ: 'message:read',
  MESSAGE_REACTION: 'message:reaction',

  // Notification events
  NOTIFICATION_NEW: 'notification:new',

  // Error event
  ERROR: 'error',
};

export const useSocket = () => {
  const sendMessage = (data) => {
    if (socket) {
      socket.emit(socketEvents.MESSAGE_SEND, data);
    }
  };

  const startTyping = (conversationId) => {
    if (socket) {
      socket.emit(socketEvents.TYPING_START, { conversationId });
    }
  };

  const stopTyping = (conversationId) => {
    if (socket) {
      socket.emit(socketEvents.TYPING_STOP, { conversationId });
    }
  };

  const markAsRead = (conversationId) => {
    if (socket) {
      socket.emit(socketEvents.MESSAGE_READ, { conversationId });
    }
  };

  const addReaction = (messageId, emoji) => {
    if (socket) {
      socket.emit(socketEvents.MESSAGE_REACTION, { messageId, emoji });
    }
  };

  const joinConversation = (conversationId) => {
    if (socket) {
      socket.emit(socketEvents.JOIN_CONVERSATION, conversationId);
    }
  };

  const leaveConversation = (conversationId) => {
    if (socket) {
      socket.emit(socketEvents.LEAVE_CONVERSATION, conversationId);
    }
  };

  return {
    socket,
    sendMessage,
    startTyping,
    stopTyping,
    markAsRead,
    addReaction,
    joinConversation,
    leaveConversation,
  };
};
