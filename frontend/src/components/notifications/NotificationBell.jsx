import { useState, useEffect } from 'react';
import { FiBell } from 'react-icons/fi';

export default function NotificationBell({ onOpen }) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch('/api/notifications?unreadOnly=true&limit=1', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setUnreadCount(data.data.total);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  return (
    <button
      onClick={onOpen}
      className="relative p-2 rounded-lg hover:bg-gray-100 text-text/60 transition-colors"
    >
      <FiBell size={20} />
      {unreadCount > 0 && (
        <span className="absolute top-1 right-1 w-5 h-5 bg-danger text-white text-xs rounded-full flex items-center justify-center font-medium">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
}
