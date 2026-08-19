import { useState } from 'react';
import { FiSend, FiPaperclip, FiSmile } from 'react-icons/fi';

export default function MessageInput({ onSend, replyTo, onCancelReply }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSend(text);
      setText('');
    }
  };

  return (
    <div className="glass-card p-4">
      {/* Reply preview */}
      {replyTo && (
        <div className="flex items-center justify-between mb-3 p-2 bg-primary/10 rounded-lg">
          <div className="flex-1">
            <p className="text-xs text-text/40">Replying to {replyTo.sender?.name}</p>
            <p className="text-sm text-text/70 truncate">{replyTo.text}</p>
          </div>
          <button
            onClick={onCancelReply}
            className="p-1 text-text/40 hover:text-danger"
          >
            ×
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        {/* Attachment button */}
        <button
          type="button"
          className="p-2 rounded-lg text-text/40 hover:text-primary hover:bg-gray-100 transition-colors"
        >
          <FiPaperclip size={20} />
        </button>

        {/* Emoji button */}
        <button
          type="button"
          className="p-2 rounded-lg text-text/40 hover:text-primary hover:bg-gray-100 transition-colors"
        >
          <FiSmile size={20} />
        </button>

        {/* Input */}
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-card/70 backdrop-blur-glass text-text placeholder:text-text/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
        />

        {/* Send button */}
        <button
          type="submit"
          disabled={!text.trim()}
          className="p-2.5 bg-primary text-white rounded-xl hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiSend size={20} />
        </button>
      </form>
    </div>
  );
}
