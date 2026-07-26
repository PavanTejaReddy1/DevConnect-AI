import { useState, useEffect } from 'react';
import { FiBell, FiCheck, FiTrash2, FiFilter, FiX } from 'react-icons/fi';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import Button from '../../components/ui/Button.jsx';
import Badge from '../../components/ui/Badge.jsx';
import { notificationService } from '../../services/notificationService.js';

const TYPE_COLORS = {
  'project': 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary',
  'task': 'bg-accent/10 text-accent dark:bg-accent/20 dark:text-accent',
  'chat': 'bg-secondary/10 text-secondary dark:bg-secondary/20 dark:text-secondary',
  'ai': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'admin': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  'team': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'invite': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'mention': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
};

const TYPE_LABELS = {
  'project': 'Project',
  'task': 'Task',
  'chat': 'Chat',
  'ai': 'AI',
  'admin': 'Admin',
  'team': 'Team',
  'invite': 'Invite',
  'mention': 'Mention',
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, [filterType]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterType !== 'all') {
        params.type = filterType;
      }
      const response = await notificationService.getNotifications(params);
      setNotifications(response.notifications);
      setUnreadCount(response.unreadCount);
    } catch (error) {
      // Error fetching notifications
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => 
        prev.map(n => n._id === id ? { ...n, isRead: true, readAt: new Date() } : n)
      );
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (error) {
      // Error marking as read
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead(filterType === 'all' ? null : filterType);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true, readAt: new Date() })));
      setUnreadCount(0);
    } catch (error) {
      // Error marking all as read
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n._id !== id));
      const deleted = notifications.find(n => n._id === id);
      if (deleted && !deleted.isRead) {
        setUnreadCount(Math.max(0, unreadCount - 1));
      }
    } catch (error) {
      // Error deleting notification
    }
  };

  const handleClearRead = async () => {
    try {
      await notificationService.clearReadNotifications();
      setNotifications(prev => prev.filter(n => !n.isRead));
    } catch (error) {
      // Error clearing read notifications
    }
  };

  const filteredNotifications = notifications;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        subtitle="Friend requests, invites, tasks, and messages."
        action={
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <Button size="sm" variant="secondary" onClick={handleMarkAllAsRead}>
                <FiCheck className="h-4 w-4" />
                Mark all read
              </Button>
            )}
            <div className="relative">
              <Button size="sm" variant="ghost" onClick={() => setShowFilterMenu(!showFilterMenu)}>
                <FiFilter className="h-4 w-4" />
                {filterType !== 'all' && <span className="ml-1">{TYPE_LABELS[filterType]}</span>}
              </Button>
              {showFilterMenu && (
                <div className="absolute right-0 z-10 mt-1 w-40 rounded-lg border border-border bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                  <button
                    onClick={() => setFilterType('all')}
                    className={`block w-full px-3 py-2 text-left text-sm ${
                      filterType === 'all' ? 'bg-text/5 text-text' : 'text-text/70 hover:bg-text/5 dark:text-slate-300'
                    }`}
                  >
                    All
                  </button>
                  {Object.entries(TYPE_LABELS).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setFilterType(key)}
                      className={`block w-full px-3 py-2 text-left text-sm ${
                        filterType === key ? 'bg-text/5 text-text' : 'text-text/70 hover:bg-text/5 dark:text-slate-300'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        }
      />
      <Card className="p-5 sm:p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : filteredNotifications.length === 0 ? (
          <EmptyState
            icon={FiBell}
            title="You're all caught up"
            description="New notifications about invites, tasks, and messages will show up here."
          />
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <div
                key={notification._id}
                className={`flex items-start gap-3 rounded-lg border p-4 transition-colors ${
                  notification.isRead
                    ? 'border-border bg-white dark:border-slate-700 dark:bg-slate-800'
                    : 'border-primary/30 bg-primary/5 dark:border-primary/30 dark:bg-primary/5'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge className={TYPE_COLORS[notification.type]}>
                      {TYPE_LABELS[notification.type]}
                    </Badge>
                    {!notification.isRead && (
                      <span className="h-2 w-2 rounded-full bg-primary" />
                    )}
                    <span className="text-xs text-text/40 dark:text-slate-500">
                      {new Date(notification.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <h4 className="mt-2 text-sm font-semibold text-text dark:text-slate-100">
                    {notification.title}
                  </h4>
                  <p className="mt-1 text-sm text-text/70 dark:text-slate-400">
                    {notification.message}
                  </p>
                  {notification.actionUrl && (
                    <a
                      href={notification.actionUrl}
                      className="mt-2 inline-block text-xs text-primary hover:underline dark:text-primary"
                    >
                      View details →
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {!notification.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(notification._id)}
                      className="rounded-lg p-2 text-text/40 transition-colors hover:bg-text/5 hover:text-text dark:text-slate-500 dark:hover:bg-slate-700 dark:hover:text-slate-300"
                      title="Mark as read"
                    >
                      <FiCheck className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notification._id)}
                    className="rounded-lg p-2 text-text/40 transition-colors hover:bg-text/5 hover:text-danger dark:text-slate-500 dark:hover:bg-slate-700 dark:hover:text-danger"
                    title="Delete"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            {notifications.some(n => n.isRead) && (
              <div className="pt-4 text-center">
                <Button size="sm" variant="ghost" onClick={handleClearRead}>
                  Clear read notifications
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
