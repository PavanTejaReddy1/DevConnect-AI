import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiPlus, FiTrash2, FiZap } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import Button from '../ui/Button.jsx';
import Input from '../ui/Input.jsx';
import Card from '../ui/Card.jsx';
import { projectService } from '../../services/projectService.js';
import { aiService } from '../../services/aiService.js';

export default function ProjectFormModal({ isOpen, onClose, project = null, onSuccess }) {
  const isEditing = Boolean(project);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState('');
  const [stack, setStack] = useState(project?.stack || []);
  const [tags, setTags] = useState(project?.tags || []);
  const [stackInput, setStackInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    defaultValues: project || {
      title: '',
      description: '',
      repository: '',
      demo: '',
      maxMembers: 10,
      isPublic: true,
    },
  });

  const title = watch('title');

  const handleGenerateDescription = async () => {
    if (!title.trim()) {
      setError('Please enter a project title first');
      return;
    }

    try {
      setAiLoading(true);
      setError('');
      const response = await aiService.generateProjectDescription({
        projectName: title,
        projectType: stack.length > 0 ? stack.join(', ') : 'Web Application',
        context: tags.length > 0 ? tags.join(', ') : '',
      });
      setValue('description', response.result);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate description');
    } finally {
      setAiLoading(false);
    }
  };

  const addStack = () => {
    if (stackInput.trim() && !stack.includes(stackInput.trim())) {
      setStack([...stack, stackInput.trim()]);
      setStackInput('');
    }
  };

  const removeStack = (item) => {
    setStack(stack.filter(s => s !== item));
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (item) => {
    setTags(tags.filter(t => t !== item));
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError('');

      const projectData = {
        ...data,
        stack,
        tags,
        maxMembers: parseInt(data.maxMembers),
      };

      if (isEditing) {
        await projectService.updateProject(project._id, projectData);
      } else {
        await projectService.createProject(projectData);
      }

      reset();
      setStack([]);
      setTags([]);
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setStack(project?.stack || []);
    setTags(project?.tags || []);
    setError('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl"
            >
              <Card className="p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-text dark:text-slate-100">
                    {isEditing ? 'Edit Project' : 'Create New Project'}
                  </h2>
                  <button
                    onClick={handleClose}
                    className="rounded-lg p-2 text-text/60 transition-colors hover:bg-text/5 hover:text-text dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>

                {error && (
                  <div className="mb-4 rounded-lg bg-danger/10 p-3 text-sm text-danger">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <Input
                    label="Project Title"
                    {...register('title', { required: 'Title is required' })}
                    error={errors.title?.message}
                    placeholder="e.g., AI Recipe Planner"
                  />

                  <div>
                    <div className="mb-1.5 flex items-center justify-between">
                      <label className="block text-sm font-medium text-text dark:text-slate-200">
                        Description
                      </label>
                      <Button
                        type="button"
                        size="xs"
                        variant="secondary"
                        onClick={handleGenerateDescription}
                        loading={aiLoading}
                        disabled={!title.trim()}
                      >
                        <FiZap className="h-3 w-3" />
                        AI Generate
                      </Button>
                    </div>
                    <textarea
                      {...register('description', { required: 'Description is required' })}
                      placeholder="Describe your project..."
                      rows={4}
                      className={`input-field min-h-[100px] resize-none ${errors.description ? '!border-danger focus:!ring-danger/20' : ''}`}
                    />
                    {errors.description && (
                      <p className="mt-1.5 text-xs font-medium text-danger">{errors.description.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-text dark:text-slate-200">
                      Tech Stack
                    </label>
                    <div className="flex gap-2">
                      <Input
                        value={stackInput}
                        onChange={(e) => setStackInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addStack())}
                        placeholder="Add technology (e.g., React)"
                        className="flex-1"
                      />
                      <Button type="button" variant="secondary" onClick={addStack}>
                        <FiPlus className="h-4 w-4" />
                      </Button>
                    </div>
                    {stack.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {stack.map((item) => (
                          <span
                            key={item}
                            className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                          >
                            {item}
                            <button
                              type="button"
                              onClick={() => removeStack(item)}
                              className="hover:text-primary/80"
                            >
                              <FiX className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Repository URL"
                      {...register('repository')}
                      placeholder="https://github.com/..."
                    />
                    <Input
                      label="Demo URL"
                      {...register('demo')}
                      placeholder="https://..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Max Members"
                      type="number"
                      min="1"
                      max="50"
                      {...register('maxMembers')}
                    />
                    <div className="flex items-center gap-3 pt-6">
                      <input
                        type="checkbox"
                        id="isPublic"
                        {...register('isPublic')}
                        className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
                      />
                      <label htmlFor="isPublic" className="text-sm text-text dark:text-slate-300">
                        Public Project
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-text dark:text-slate-200">
                      Tags
                    </label>
                    <div className="flex gap-2">
                      <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        placeholder="Add tag (e.g., web, mobile)"
                        className="flex-1"
                      />
                      <Button type="button" variant="secondary" onClick={addTag}>
                        <FiPlus className="h-4 w-4" />
                      </Button>
                    </div>
                    {tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {tags.map((item) => (
                          <span
                            key={item}
                            className="flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent"
                          >
                            {item}
                            <button
                              type="button"
                              onClick={() => removeTag(item)}
                              className="hover:text-accent/80"
                            >
                              <FiX className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="ghost" onClick={handleClose}>
                      Cancel
                    </Button>
                    <Button type="submit" loading={loading}>
                      {isEditing ? 'Update Project' : 'Create Project'}
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
