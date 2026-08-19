import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiZap, FiX } from 'react-icons/fi';
import LoadingAnimation from './LoadingAnimation.jsx';
import MarkdownViewer from './MarkdownViewer.jsx';
import toast from 'react-hot-toast';

export default function AIGeneratorCard({ title, endpoint, fields, onApply, onClose }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState({});

  const handleGenerate = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`/api/ai/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
      } else {
        throw new Error(data.message || 'Failed to generate');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to generate AI response');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (onApply) {
      onApply(result);
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FiSparkles size={20} className="text-primary" />
          <h3 className="font-semibold text-text">{title}</h3>
        </div>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100">
          <FiX size={18} />
        </button>
      </div>

      {/* Input Fields */}
      <div className="space-y-3 mb-4">
        {fields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-text mb-1">{field.label}</label>
            {field.type === 'textarea' ? (
              <textarea
                value={formData[field.name] || ''}
                onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                placeholder={field.placeholder}
                rows={field.rows || 3}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-card/70 backdrop-blur-glass text-text placeholder:text-text/40 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            ) : (
              <input
                type={field.type || 'text'}
                value={formData[field.name] || ''}
                onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                placeholder={field.placeholder}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-card/70 backdrop-blur-glass text-text placeholder:text-text/40 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            )}
          </div>
        ))}
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={loading || Object.values(formData).some(v => !v)}
        className="w-full py-2.5 bg-primary text-white rounded-xl hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <LoadingAnimation />
            Generating...
          </>
        ) : (
          <>
            <FiZap size={18} />
            Generate with AI
          </>
        )}
      </button>

      {/* Result */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          <div className="p-4 bg-gray-50 rounded-xl">
            <MarkdownViewer content={result} />
          </div>
          {onApply && (
            <button
              onClick={handleApply}
              className="w-full mt-3 py-2.5 bg-success text-white rounded-xl hover:opacity-90 transition-opacity"
            >
              Apply
            </button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
