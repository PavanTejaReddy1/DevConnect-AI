import { useState, useEffect } from 'react';
import { FiPlus, FiCircle, FiZap } from 'react-icons/fi';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import { taskService } from '../../services/taskService.js';
import { aiService } from '../../services/aiService.js';

const COLUMNS = [
  { id: 'todo', title: 'Todo', tint: 'bg-text/20' },
  { id: 'in-progress', title: 'In Progress', tint: 'bg-primary/40' },
  { id: 'review', title: 'Review', tint: 'bg-accent/50' },
  { id: 'completed', title: 'Completed', tint: 'bg-success/40' },
];

const PRIORITY_COLORS = {
  'low': 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
  'medium': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'high': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  'urgent': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddingTask, setIsAddingTask] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [autoSaveTimeout, setAutoSaveTimeout] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiProjectDescription, setAiProjectDescription] = useState('');
  const [aiDeadline, setAiDeadline] = useState('');
  const [aiComplexity, setAiComplexity] = useState('medium');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskService.getTasks();
      setTasks(response.tasks);
    } catch (error) {
      // Error fetching tasks
    } finally {
      setLoading(false);
    }
  };

  const autoSaveReorder = async (reorderedTasks) => {
    clearTimeout(autoSaveTimeout);
    const timeout = setTimeout(async () => {
      try {
        const tasksPayload = reorderedTasks.map((task, index) => ({
          id: task._id,
          position: index,
          status: task.status,
        }));
        await taskService.reorderTasks(tasksPayload);
      } catch (error) {
        // Error saving reorder
      }
    }, 1000);
    setAutoSaveTimeout(timeout);
  };

  const handleDragStart = (e, taskId, fromStatus) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.setData('fromStatus', fromStatus);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, toStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const fromStatus = e.dataTransfer.getData('fromStatus');

    if (fromStatus === toStatus) return;

    const task = tasks.find(t => t._id === taskId);
    if (!task) return;

    const updatedTasks = tasks.map(t => {
      if (t._id === taskId) {
        return { ...t, status: toStatus };
      }
      return t;
    });

    setTasks(updatedTasks);
    autoSaveReorder(updatedTasks);

    // Also update the task status via API
    try {
      await taskService.updateTask(taskId, { status: toStatus });
    } catch (error) {
      // Revert on error
      setTasks(tasks);
    }
  };

  const handleAddTask = async (status) => {
    if (!newTaskTitle.trim()) return;

    try {
      const response = await taskService.createTask({
        title: newTaskTitle,
        status,
      });
      setTasks([...tasks, response.task]);
      setNewTaskTitle('');
      setIsAddingTask(null);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Delete this task?')) return;
    try {
      await taskService.deleteTask(taskId);
      setTasks(tasks.filter(t => t._id !== taskId));
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete task');
    }
  };

  const getTasksByStatus = (status) => {
    return tasks.filter(t => t.status === status).sort((a, b) => a.position - b.position);
  };

  const handleAiTaskBreakdown = async () => {
    if (!aiProjectDescription.trim() || !aiDeadline.trim()) {
      alert('Please provide project description and deadline');
      return;
    }

    try {
      setAiLoading(true);
      const response = await aiService.breakdownTasks({
        projectDescription: aiProjectDescription,
        deadline: aiDeadline,
        complexity: aiComplexity,
      });
      
      // Parse the AI response and create tasks
      const breakdown = response.result;
      const taskLines = breakdown.split('\n').filter(line => line.trim());
      
      for (const line of taskLines) {
        if (line.trim()) {
          await taskService.createTask({
            title: line.trim().replace(/^\d+\.\s*/, '').replace(/^-/, '').trim(),
            status: 'todo',
          });
        }
      }
      
      await fetchTasks();
      setShowAiModal(false);
      setAiProjectDescription('');
      setAiDeadline('');
      setAiComplexity('medium');
    } catch (error) {
      alert('Failed to generate task breakdown');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Tasks" 
        subtitle="Todo → In Progress → Review → Completed."
        action={
          <Button size="sm" variant="secondary" onClick={() => setShowAiModal(true)}>
            <FiZap className="h-4 w-4" />
            AI Task Breakdown
          </Button>
        }
      />
      <Card className="p-5 sm:p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <div className="grid gap-4 overflow-x-auto sm:grid-cols-4">
            {COLUMNS.map((col) => (
              <div
                key={col.id}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.id)}
                className="min-w-[16rem] rounded-xl bg-background p-3"
              >
                <div className="mb-3 flex items-center justify-between px-1">
                  <span className="text-xs font-semibold text-text/60">{col.title}</span>
                  <span className={`h-2 w-2 rounded-full ${col.tint}`} />
                </div>
                <div className="space-y-2">
                  {getTasksByStatus(col.id).map((task) => (
                    <div
                      key={task._id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task._id, task.status)}
                      className="cursor-grab rounded-lg border border-border bg-white p-3 shadow-sm hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-text/30">
                          <FiCircle className="h-2.5 w-2.5" aria-hidden="true" />
                          <span className="text-[10px]">TASK</span>
                        </div>
                        <button
                          onClick={() => handleDeleteTask(task._id)}
                          className="text-text/30 hover:text-danger dark:text-slate-500 dark:hover:text-danger"
                        >
                          ×
                        </button>
                      </div>
                      <p className="text-xs font-medium text-text dark:text-slate-200">{task.title}</p>
                      <div className="mt-2 flex items-center gap-2">
                        {task.priority && (
                          <Badge className={`text-[10px] ${PRIORITY_COLORS[task.priority]}`}>
                            {task.priority}
                          </Badge>
                        )}
                        {task.assignedTo?.length > 0 && (
                          <div className="flex -space-x-1">
                            {task.assignedTo.slice(0, 2).map((user) => (
                              <Avatar
                                key={user._id}
                                name={user.name}
                                src={user.avatarUrl}
                                size="xs"
                                className="border-2 border-white dark:border-slate-800"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isAddingTask === col.id ? (
                    <div className="rounded-lg border border-border bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
                      <input
                        type="text"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddTask(col.id)}
                        placeholder="Task title..."
                        className="w-full border-none bg-transparent text-xs text-text focus:outline-none dark:text-slate-200"
                        autoFocus
                      />
                      <div className="mt-2 flex gap-2">
                        <Button size="xs" onClick={() => handleAddTask(col.id)}>
                          Add
                        </Button>
                        <Button size="xs" variant="ghost" onClick={() => setIsAddingTask(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsAddingTask(col.id)}
                      className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-border bg-text/5 p-3 text-xs font-medium text-text/40 transition-colors hover:border-primary hover:text-primary dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-500 dark:hover:border-primary dark:hover:text-primary"
                    >
                      <FiPlus className="h-3 w-3" />
                      Add task
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* AI Task Breakdown Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-lg p-6">
            <h3 className="mb-4 text-lg font-semibold text-text dark:text-slate-100">
              AI Task Breakdown
            </h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text dark:text-slate-200">
                  Project Description
                </label>
                <textarea
                  value={aiProjectDescription}
                  onChange={(e) => setAiProjectDescription(e.target.value)}
                  placeholder="Describe your project..."
                  rows={3}
                  className="input-field min-h-[80px] resize-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text dark:text-slate-200">
                  Deadline
                </label>
                <input
                  type="text"
                  value={aiDeadline}
                  onChange={(e) => setAiDeadline(e.target.value)}
                  placeholder="e.g., 2 weeks, 1 month"
                  className="input-field"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text dark:text-slate-200">
                  Complexity
                </label>
                <select
                  value={aiComplexity}
                  onChange={(e) => setAiComplexity(e.target.value)}
                  className="input-field"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="ghost" onClick={() => setShowAiModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAiTaskBreakdown} loading={aiLoading}>
                  Generate Tasks
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
