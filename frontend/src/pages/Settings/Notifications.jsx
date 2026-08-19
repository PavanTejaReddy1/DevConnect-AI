import { useState, useEffect } from 'react';
import { FiGrid } from 'react-icons/fi';
import PreferenceToggle from '../../components/settings/PreferenceToggle.jsx';
import ConnectedAccountCard from '../../components/settings/ConnectedAccountCard.jsx';
import toast from 'react-hot-toast';

export default function NotificationSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setSettings(data.data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationToggle = async (key, value) => {
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          notifications: {
            ...settings.notifications,
            [key]: value,
          },
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSettings(data.data);
        toast.success('Notification preferences updated');
      }
    } catch (error) {
      toast.error('Failed to update preferences');
    }
  };

  if (loading) {
    return <div className="h-96 glass-card animate-pulse" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Notification Preferences</h1>
        <p className="text-text/60">Manage how you receive notifications</p>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <FiGrid size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-text">Notification Channels</h3>
            <p className="text-sm text-text/40">Choose how you want to be notified</p>
          </div>
        </div>

        <div className="space-y-3">
          <PreferenceToggle
            label="Email Notifications"
            checked={settings?.notifications?.email}
            onChange={(checked) => handleNotificationToggle('email', checked)}
            description="Receive notifications via email"
          />
          <PreferenceToggle
            label="Push Notifications"
            checked={settings?.notifications?.push}
            onChange={(checked) => handleNotificationToggle('push', checked)}
            description="Receive push notifications in browser"
          />
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <FiGrid size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-text">Notification Types</h3>
            <p className="text-sm text-text/40">Choose which notifications you want to receive</p>
          </div>
        </div>

        <div className="space-y-3">
          <PreferenceToggle
            label="Project Invitations"
            checked={settings?.notifications?.projectInvitations}
            onChange={(checked) => handleNotificationToggle('projectInvitations', checked)}
          />
          <PreferenceToggle
            label="Team Invitations"
            checked={settings?.notifications?.teamInvitations}
            onChange={(checked) => handleNotificationToggle('teamInvitations', checked)}
          />
          <PreferenceToggle
            label="Task Assignments"
            checked={settings?.notifications?.taskAssignments}
            onChange={(checked) => handleNotificationToggle('taskAssignments', checked)}
          />
          <PreferenceToggle
            label="Comments"
            checked={settings?.notifications?.comments}
            onChange={(checked) => handleNotificationToggle('comments', checked)}
          />
          <PreferenceToggle
            label="Mentions"
            checked={settings?.notifications?.mentions}
            onChange={(checked) => handleNotificationToggle('mentions', checked)}
          />
          <PreferenceToggle
            label="Chat Messages"
            checked={settings?.notifications?.chatMessages}
            onChange={(checked) => handleNotificationToggle('chatMessages', checked)}
          />
        </div>
      </div>
    </div>
  );
}
