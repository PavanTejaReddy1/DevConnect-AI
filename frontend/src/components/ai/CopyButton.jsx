import { useState } from 'react';
import { FiCopy, FiCheck } from 'react-icons/fi';

export default function CopyButton({ text, className = '' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${className}`}
      title={copied ? 'Copied!' : 'Copy'}
    >
      {copied ? <FiCheck size={16} className="text-success" /> : <FiCopy size={16} />}
    </button>
  );
}
