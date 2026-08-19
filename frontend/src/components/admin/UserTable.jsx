import { FiEdit2, FiTrash2, FiShield, FiUserX } from 'react-icons/fi';

export default function UserTable({ users, onEdit, onDelete, onToggleStatus }) {
  return (
    <div className="glass-card overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-text/60 uppercase tracking-wider">User</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-text/60 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-text/60 uppercase tracking-wider">Role</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-text/60 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-text/60 uppercase tracking-wider">Joined</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-text/60 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-medium">{user.name?.charAt(0)}</span>
                  </div>
                  <div className="ml-4">
                    <div className="font-medium text-text">{user.name}</div>
                    <div className="text-sm text-text/40">@{user.username}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-text/60">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {user.isActive ? 'Active' : 'Suspended'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-text/60">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEdit(user)}
                    className="p-2 rounded-lg hover:bg-gray-100 text-text/60"
                  >
                    <FiEdit2 size={16} />
                  </button>
                  <button
                    onClick={() => onToggleStatus(user)}
                    className="p-2 rounded-lg hover:bg-gray-100 text-text/60"
                    title={user.isActive ? 'Suspend' : 'Activate'}
                  >
                    {user.isActive ? <FiUserX size={16} /> : <FiShield size={16} />}
                  </button>
                  <button
                    onClick={() => onDelete(user)}
                    className="p-2 rounded-lg hover:bg-red-100 text-danger"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
