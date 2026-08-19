import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar.jsx';
import AdminTopbar from './AdminTopbar.jsx';
import AmbientBackground from '../common/AmbientBackground.jsx';

export default function AdminLayout() {
  return (
    <div className="page-shell flex min-h-screen">
      <AmbientBackground />
      <AdminSidebar />
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden lg:ml-64">
        <AdminTopbar />
        <main className="flex-1 overflow-y-auto p-6 pt-24 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
