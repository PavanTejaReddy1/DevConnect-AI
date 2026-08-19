import { Outlet } from 'react-router-dom';
import SettingsSidebar from './SettingsSidebar.jsx';
import AmbientBackground from '../common/AmbientBackground.jsx';

export default function SettingsLayout() {
  return (
    <div className="page-shell flex min-h-screen">
      <AmbientBackground />
      <SettingsSidebar />
      <div className="relative z-10 flex-1 overflow-y-auto p-6 lg:ml-64 lg:p-8">
        <Outlet />
      </div>
    </div>
  );
}
