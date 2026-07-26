const MESSAGES = [
  { author: 'Priya', initials: 'PN', tone: 'from-primary to-accent', text: 'Pushed the auth middleware — can someone review?', mine: false },
  { author: 'You', initials: 'ME', tone: 'from-secondary to-primary', text: 'On it — looks clean so far 👍', mine: true },
  { author: 'Marcus', initials: 'MT', tone: 'from-accent to-secondary', text: "I'll wire up the Kanban drag events after lunch", mine: false },
];

/** Chat preview — mirrors the real-time chat module with a live typing indicator. */
export default function ChatPreview() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-white p-4 shadow-sm">
      {MESSAGES.map((msg, i) => (
        <div key={i} className={`flex items-end gap-2 ${msg.mine ? 'flex-row-reverse' : ''}`}>
          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${msg.tone} text-[10px] font-semibold text-white`}
          >
            {msg.initials}
          </span>
          <div
            className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
              msg.mine ? 'rounded-br-sm bg-primary text-white' : 'rounded-bl-sm bg-background text-text/75'
            }`}
          >
            {msg.text}
          </div>
        </div>
      ))}

      {/* Typing indicator */}
      <div className="flex items-center gap-2 pl-9">
        <span className="flex gap-1 rounded-full bg-background px-3 py-2">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-text/30 [animation-delay:-0.3s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-text/30 [animation-delay:-0.15s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-text/30" />
        </span>
        <span className="text-[10px] text-text/35">Amara is typing…</span>
      </div>
    </div>
  );
}
