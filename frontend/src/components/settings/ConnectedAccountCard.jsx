import { FiGithub, FiLinkedin, FiGlobe } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ConnectedAccountCard({ settings, onUpdate }) {
  const providers = [
    { id: 'github', icon: FiGithub, label: 'GitHub', color: 'text-gray-800' },
    { id: 'google', icon: FiGlobe, label: 'Google', color: 'text-red-500' },
    { id: 'linkedin', icon: FiLinkedin, label: 'LinkedIn', color: 'text-blue-600' },
  ];

  const handleConnect = async (provider) => {
    // TODO: Implement OAuth flow
    toast.info(`${provider} connection coming soon`);
  };

  const handleDisconnect = async (provider) => {
    try {
      const response = await fetch(`/api/settings/connect-account/${provider}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        toast.success(`${provider} disconnected`);
        onUpdate(data.data);
      }
    } catch (error) {
      toast.error('Failed to disconnect account');
    }
  };

  return (
    <div className="glass-card p-6">
      <h3 className="font-semibold text-text mb-6">Connected Accounts</h3>
      <div className="space-y-4">
        {providers.map((provider) => {
          const Icon = provider.icon;
          const isConnected = settings?.connectedAccounts?.[provider.id];

          return (
            <div
              key={provider.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <Icon size={24} className={provider.color} />
                <div>
                  <p className="font-medium text-text">{provider.label}</p>
                  <p className="text-sm text-text/40">
                    {isConnected ? 'Connected' : 'Not connected'}
                  </p>
                </div>
              </div>
              {isConnected ? (
                <button
                  onClick={() => handleDisconnect(provider.label)}
                  className="px-4 py-2 text-sm text-danger hover:bg-danger/10 rounded-lg transition-colors"
                >
                  Disconnect
                </button>
              ) : (
                <button
                  onClick={() => handleConnect(provider.label)}
                  className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
                >
                  Connect
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
