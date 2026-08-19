import SecurityCard from '../../components/settings/SecurityCard.jsx';

export default function SecuritySettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Security</h1>
        <p className="text-text/60">Manage your account security</p>
      </div>

      <SecurityCard />
    </div>
  );
}
