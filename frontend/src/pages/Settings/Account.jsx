import { useState, useEffect } from 'react';
import { FiUser, FiMail, FiMapPin, FiGlobe } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext.jsx';
import toast from 'react-hot-toast';

export default function AccountSettings() {
  const { user } = useAuth();
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

  const handleUpdate = async (field, value) => {
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ [field]: value }),
      });

      const data = await response.json();
      if (data.success) {
        setSettings(data.data);
        toast.success('Settings updated');
      }
    } catch (error) {
      toast.error('Failed to update settings');
    }
  };

  if (loading) {
    return <div className="h-96 glass-card animate-pulse" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Account Settings</h1>
        <p className="text-text/60">Manage your account preferences</p>
      </div>

      {/* Profile Info */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-primary">{user?.name?.charAt(0)}</span>
          </div>
          <div>
            <h3 className="font-semibold text-text text-lg">{user?.name}</h3>
            <p className="text-text/40">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Language */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <FiGlobe size={20} className="text-primary" />
          <div>
            <h3 className="font-semibold text-text">Language</h3>
            <p className="text-sm text-text/40">Select your preferred language</p>
          </div>
        </div>
        <select
          value={settings?.language || 'en'}
          onChange={(e) => handleUpdate('language', e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-card/70 text-text text-sm"
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="ja">Japanese</option>
        </select>
      </div>

      {/* Timezone */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <FiMapPin size={20} className="text-primary" />
          <div>
            <h3 className="font-semibold text-text">Timezone</h3>
            <p className="text-sm text-text/40">Select your timezone</p>
          </div>
        </div>
        <select
          value={settings?.timezone || 'UTC'}
          onChange={(e) => handleUpdate('timezone', e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-card/70 text-text text-sm"
        >
          <option value="UTC">UTC</option>
          <option value="America/New_York">Eastern Time</option>
          <option value="America/Los_Angeles">Pacific Time</option>
          <option value="Europe/London">London</option>
          <option value="Asia/Tokyo">Tokyo</option>
        </select>
      </div>
    </div>
  );
}
