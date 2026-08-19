import { FiSearch, FiPlus } from 'react-icons/fi';
import Avatar from '../ui/Avatar.jsx';
import OnlineBadge from './OnlineBadge.jsx';

export default function ConversationList({ conversations, selectedId, onSelect, onCreate }) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-text">Messages</h2>
          <button
            onClick={onCreate}
            className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            <FiPlus size={18} />
          </button>
        </div>
        <div className="relative">
          <FiSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text/40" />
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-card/70 backdrop-blur-glass text-text placeholder:text-text/40 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-text/40">No conversations yet</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {conversations.map((conversation) => {
              const isSelected = conversation._id === selectedId;
              const otherParticipant = conversation.participants.find(
                p => p._id !== conversation.participants[0]?._id
              );
              const displayName = conversation.type === 'private'
                ? otherParticipant?.name
                : conversation.name;

              return (
                <button
                  key={conversation._id}
                  onClick={() => onSelect(conversation)}
                  className={`w-full p-3 rounded-xl transition-all duration-200 flex items-center gap-3 ${
                    isSelected
                      ? 'bg-primary/10 border border-primary/20'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="relative">
                    <Avatar
                      name={displayName}
                      src={otherParticipant?.avatarUrl}
                      size="md"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5">
                      <OnlineBadge isOnline={true} />
                    </div>
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-text truncate">{displayName}</p>
                      {conversation.lastMessage && (
                        <span className="text-xs text-text/40">
                          {new Date(conversation.lastMessage.createdAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-text/60 truncate">
                      {conversation.lastMessage?.text || 'No messages yet'}
                    </p>
                  </div>
                  {conversation.unreadCount > 0 && (
                    <div className="px-2 py-0.5 bg-primary text-white text-xs rounded-full">
                      {conversation.unreadCount}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
