import { useState, useEffect } from 'react';
import SettingsForm from '../../components/admin/SettingsForm.jsx';

export default function AdminSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/admin/settings', {
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

  if (loading) {
    return <div className="h-96 glass-card animate-pulse" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Platform Settings</h1>
        <p className="text-text/60">Configure platform-wide settings</p>
      </div>

      <SettingsForm
        settings={settings}
        onSave={setSettings}
      />
    </div>
  );
}
