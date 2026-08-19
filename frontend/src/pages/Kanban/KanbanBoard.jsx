import { useState, useEffect } from 'react';
import { FiPlus, FiZap } from 'react-icons/fi';
import { useSearchParams } from 'react-router-dom';
import KanbanBoard from '../../components/task/KanbanBoard.jsx';
import TaskFilters from '../../components/task/TaskFilters.jsx';
import TaskDetailsDrawer from '../../components/task/TaskDetailsDrawer.jsx';
import CreateTaskModal from '../../components/task/CreateTaskModal.jsx';
import EditTaskModal from '../../components/task/EditTaskModal.jsx';
import AIGeneratorCard from '../../components/ai/AIGeneratorCard.jsx';
import Button from '../../components/ui/Button.jsx';
import toast from 'react-hot-toast';

export default function KanbanBoardPage() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('project');
  const teamId = searchParams.get('team');
  
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsDrawer, setShowDetailsDrawer] = useState(false);
  const [showAICard, setShowAICard] = useState(false);
  const [filters, setFilters] = useState({ search: '', status: '', priority: '' });

  useEffect(() => {
    fetchTasks();
  }, [projectId, teamId, filters]);

  const fetchTasks = async () => {
    try {
      const params = new URLSearchParams();
      if (projectId) params.append('project', projectId);
      if (teamId) params.append('team', teamId);
      if (filters.search) params.append('search', filters.search);
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);

      const response = await fetch(`/api/tasks?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setTasks(data.data);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowDetailsDrawer(true);
  };

  const handleDragDrop = async (task, newStatus) => {
    try {
      const response = await fetch(`/api/tasks/${task._id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (data.success) {
        setTasks(tasks.map(t => t._id === task._id ? data.data : t));
        toast.success('Task moved successfully');
      }
    } catch (error) {
      toast.error('Failed to move task');
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(taskData),
      });

      const data = await response.json();

      if (data.success) {
        setTasks([...tasks, data.data]);
        toast.success('Task created successfully');
      } else {
        throw new Error(data.message || 'Failed to create task');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to create task');
      throw error;
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      const response = await fetch(`/api/tasks/${selectedTask._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(taskData),
      });

      const data = await response.json();

      if (data.success) {
        setTasks(tasks.map(t => t._id === selectedTask._id ? data.data : t));
        setSelectedTask(data.data);
        toast.success('Task updated successfully');
      } else {
        throw new Error(data.message || 'Failed to update task');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update task');
      throw error;
    }
  };

  const handleDeleteTask = async () => {
    try {
      const response = await fetch(`/api/tasks/${selectedTask._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setTasks(tasks.filter(t => t._id !== selectedTask._id));
        toast.success('Task deleted successfully');
      } else {
        throw new Error(data.message || 'Failed to delete task');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to delete task');
      throw error;
    }
  };

  const handleDuplicateTask = async () => {
    try {
      const response = await fetch(`/api/tasks/${selectedTask._id}/duplicate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setTasks([...tasks, data.data]);
        toast.success('Task duplicated successfully');
      } else {
        throw new Error(data.message || 'Failed to duplicate task');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to duplicate task');
      throw error;
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleClearFilters = () => {
    setFilters({ search: '', status: '', priority: '' });
  };

  const handleAITaskBreakdown = async (result) => {
    try {
      const breakdown = JSON.parse(result);
      // Create tasks from breakdown
      for (const milestone of breakdown.milestones || []) {
        for (const task of milestone.tasks || []) {
          await fetch('/api/tasks', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
              title: task.title,
              description: task.subtasks?.join('\n') || '',
              status: 'backlog',
              priority: task.priority || 'medium',
              project: projectId || null,
              team: teamId || null,
            }),
          });
        }
      }
      fetchTasks();
      toast.success('Tasks created successfully');
    } catch (error) {
      toast.error('Failed to create tasks from breakdown');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-20 glass-card animate-pulse" />
        <div className="flex gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-80 h-96 glass-card animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Kanban Board</h1>
          <p className="text-text/60">Manage your tasks with drag and drop</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setShowAICard(true)} variant="secondary" className="flex items-center gap-2">
            <FiZap size={18} />
            AI Task Breakdown
          </Button>
          <Button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2">
            <FiPlus size={18} />
            Create Task
          </Button>
        </div>
      </div>

      {/* Filters */}
      <TaskFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClear={handleClearFilters}
      />

      {/* Kanban Board */}
      <KanbanBoard
        tasks={tasks}
        onTaskClick={handleTaskClick}
        onDragDrop={handleDragDrop}
        onCreateTask={(status) => {
          setSelectedTask(null);
          setShowCreateModal(true);
        }}
      />

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateTask}
        projectId={projectId}
        teamId={teamId}
      />

      {/* Edit Task Modal */}
      <EditTaskModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        task={selectedTask}
        onUpdate={handleUpdateTask}
      />

      {/* AI Task Breakdown Card */}
      {showAICard && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <AIGeneratorCard
            title="AI Task Breakdown"
            endpoint="task-breakdown"
            fields={[
              { name: 'projectIdea', label: 'Project Idea', type: 'textarea', placeholder: 'e.g., Build an e-commerce website', rows: 3 },
            ]}
            onApply={handleAITaskBreakdown}
            onClose={() => setShowAICard(false)}
          />
        </div>
      )}

      {/* Task Details Drawer */}
      <TaskDetailsDrawer
        isOpen={showDetailsDrawer}
        onClose={() => setShowDetailsDrawer(false)}
        task={selectedTask}
        onUpdate={handleUpdateTask}
        onDelete={handleDeleteTask}
        onDuplicate={handleDuplicateTask}
      />
    </div>
  );
}
