import { FiTrash2, FiUsers } from 'react-icons/fi';

export default function TeamTable({ teams, onDelete }) {
  return (
    <div className="glass-card overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-text/60 uppercase tracking-wider">Team</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-text/60 uppercase tracking-wider">Owner</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-text/60 uppercase tracking-wider">Members</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-text/60 uppercase tracking-wider">Created</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-text/60 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {teams.map((team) => (
            <tr key={team._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-medium text-text">{team.name}</div>
                <div className="text-sm text-text/40 truncate max-w-xs">{team.description}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-text/60">{team.owner?.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <FiUsers size={16} className="text-text/40" />
                  <span className="text-sm text-text/60">{team.members?.length || 0}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-text/60">
                {new Date(team.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                <button
                  onClick={() => onDelete(team)}
                  className="p-2 rounded-lg hover:bg-red-100 text-danger"
                >
                  <FiTrash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
