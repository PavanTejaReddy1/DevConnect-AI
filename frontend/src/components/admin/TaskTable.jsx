import { FiTrash2 } from 'react-icons/fi';

export default function TaskTable({ tasks, onDelete }) {
  return (
    <div className="glass-card overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-text/60 uppercase tracking-wider">Task</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-text/60 uppercase tracking-wider">Assignee</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-text/60 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-text/60 uppercase tracking-wider">Priority</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-text/60 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {tasks.map((task) => (
            <tr key={task._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-medium text-text">{task.title}</div>
                <div className="text-sm text-text/40 truncate max-w-xs">{task.description}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-text/60">{task.assignee?.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  task.status === 'completed' ? 'bg-green-100 text-green-700' :
                  task.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                  task.status === 'review' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {task.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  task.priority === 'high' ? 'bg-red-100 text-red-700' :
                  task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {task.priority}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                <button
                  onClick={() => onDelete(task)}
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
