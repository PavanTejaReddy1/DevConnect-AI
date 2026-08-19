import { useState, useEffect } from 'react';
import { FiMonitor } from 'react-icons/fi';
import ThemeSelector from '../../components/settings/ThemeSelector.jsx';
import toast from 'react-hot-toast';

export default function AppearanceSettings() {
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

  const handleThemeChange = async (theme) => {
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ theme }),
      });

      const data = await response.json();
      if (data.success) {
        setSettings(data.data);
        toast.success('Theme updated');
      }
    } catch (error) {
      toast.error('Failed to update theme');
    }
  };

  if (loading) {
    return <div className="h-96 glass-card animate-pulse" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Appearance</h1>
        <p className="text-text/60">Customize your experience</p>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <FiMonitor size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-text">Theme</h3>
            <p className="text-sm text-text/40">Choose your preferred theme</p>
          </div>
        </div>

        <ThemeSelector
          theme={settings?.theme || 'system'}
          onChange={handleThemeChange}
        />
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <FiMonitor size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-text">Accent Color</h3>
            <p className="text-sm text-text/40">Choose your accent color</p>
          </div>
        </div>

        <div className="flex gap-2">
          {['indigo', 'blue', 'green', 'purple', 'pink', 'orange'].map((color) => (
            <button
              key={color}
              onClick={() => handleUpdate('accentColor', color)}
              className={`w-10 h-10 rounded-full bg-${color}-500 hover:opacity-80 transition-opacity ${
                settings?.accentColor === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
              }`}
              title={color}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
