import { useState } from 'react';
import toast from 'react-hot-toast';

export default function SettingsForm({ settings, onSave }) {
  const [formData, setFormData] = useState(settings || {
    platformName: 'DevConnect AI',
    maintenanceMode: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Settings saved successfully');
        onSave(data.data);
      }
    } catch (error) {
      toast.error('Failed to save settings');
    }
  };

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold text-text mb-6">Platform Settings</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-text mb-2">Platform Name</label>
          <input
            type="text"
            value={formData.platformName}
            onChange={(e) => setFormData({ ...formData, platformName: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-card/70 backdrop-blur-glass text-text placeholder:text-text/40 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div>
            <h4 className="font-medium text-text">Maintenance Mode</h4>
            <p className="text-sm text-text/40">Disable platform for maintenance</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.maintenanceMode}
              onChange={(e) => setFormData({ ...formData, maintenanceMode: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
          </label>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 bg-primary text-white rounded-xl hover:bg-secondary transition-colors"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
}
