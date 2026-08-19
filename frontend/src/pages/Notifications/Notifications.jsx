import { useState, useEffect } from 'react';
import { FiFilter, FiCheck } from 'react-icons/fi';
import NotificationCard from '../../components/notifications/NotificationCard.jsx';
import toast from 'react-hot-toast';
import api from '../../services/api.js';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') params.append('type', filter);

      const response = await api.get(`/notifications?${params.toString()}`);
      if (response.data.success) {
        setNotifications(response.data.data.notifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(notifications.filter(n => n._id !== id));
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-20 glass-card animate-pulse" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-24 glass-card animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Notifications</h1>
          <p className="text-text/60">Stay updated with your activities</p>
        </div>
        <button
          onClick={handleMarkAllAsRead}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-secondary transition-colors"
        >
          <FiCheck size={18} />
          Mark All as Read
        </button>
      </div>

      {/* Filter */}
      <div className="glass-card p-4 flex items-center gap-4">
        <FiFilter size={18} className="text-text/40" />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-border bg-card/70 text-text text-sm"
        >
          <option value="all">All Notifications</option>
          <option value="project_invitation">Project Invitations</option>
          <option value="team_invitation">Team Invitations</option>
          <option value="task_assigned">Task Assignments</option>
          <option value="task_completed">Task Completed</option>
          <option value="comment">Comments</option>
          <option value="mention">Mentions</option>
          <option value="chat_message">Chat Messages</option>
          <option value="system">System</option>
          <option value="ai_report">AI Reports</option>
        </select>
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {notifications.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <p className="text-text/40">No notifications found</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationCard
              key={notification._id}
              notification={notification}
              onRead={handleMarkAsRead}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
