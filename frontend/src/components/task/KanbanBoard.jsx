import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus } from 'react-icons/fi';
import TaskCard from './TaskCard.jsx';
import StatusBadge from './StatusBadge.jsx';

const COLUMNS = [
  { id: 'backlog', label: 'Backlog', color: 'gray' },
  { id: 'todo', label: 'To Do', color: 'primary' },
  { id: 'in-progress', label: 'In Progress', color: 'accent' },
  { id: 'review', label: 'Review', color: 'warning' },
  { id: 'done', label: 'Done', color: 'success' },
];

export default function KanbanBoard({ tasks, onTaskClick, onDragStart, onDrop, onCreateTask }) {
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    if (onDragStart) onDragStart(e, task);
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = async (e, columnId) => {
    e.preventDefault();
    setDragOverColumn(null);

    if (draggedTask && draggedTask.status !== columnId) {
      await onDrop(draggedTask, columnId);
    }
    setDraggedTask(null);
  };

  const getTasksForColumn = (columnId) => {
    return tasks.filter(task => task.status === columnId);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {COLUMNS.map((column) => {
        const columnTasks = getTasksForColumn(column.id);
        const isDragOver = dragOverColumn === column.id;

        return (
          <div
            key={column.id}
            className="flex-shrink-0 w-80"
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {/* Column Header */}
            <div className="glass-card p-4 mb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StatusBadge status={column.id} />
                  <span className="font-semibold text-text">{column.label}</span>
                  <span className="text-sm text-text/40">({columnTasks.length})</span>
                </div>
                <button
                  onClick={() => onCreateTask(column.id)}
                  className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  <FiPlus size={16} />
                </button>
              </div>
            </div>

            {/* Column Content */}
            <div
              className={`min-h-[400px] p-2 rounded-xl transition-all duration-200 ${
                isDragOver ? 'bg-primary/5 border-2 border-dashed border-primary' : 'bg-transparent'
              }`}
            >
              {columnTasks.length === 0 ? (
                <div className="glass-card p-6 text-center">
                  <p className="text-text/40 text-sm">No tasks</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {columnTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onClick={() => onTaskClick(task)}
                      onDragStart={handleDragStart}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
