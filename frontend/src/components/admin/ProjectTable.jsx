import { FiTrash2, FiArchive } from 'react-icons/fi';

export default function ProjectTable({ projects, onDelete, onArchive }) {
  return (
    <div className="glass-card overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-text/60 uppercase tracking-wider">Project</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-text/60 uppercase tracking-wider">Owner</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-text/60 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-text/60 uppercase tracking-wider">Created</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-text/60 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {projects.map((project) => (
            <tr key={project._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-medium text-text">{project.name}</div>
                <div className="text-sm text-text/40 truncate max-w-xs">{project.description}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-text/60">{project.owner?.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  project.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {project.isActive ? 'Active' : 'Archived'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-text/60">
                {new Date(project.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onArchive(project)}
                    className="p-2 rounded-lg hover:bg-gray-100 text-text/60"
                    title={project.isActive ? 'Archive' : 'Activate'}
                  >
                    <FiArchive size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(project)}
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
