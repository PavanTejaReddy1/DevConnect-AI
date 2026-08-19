import { FiCircle } from 'react-icons/fi';

const COLUMNS = [
  { title: 'Todo', tint: 'bg-text/20', cards: ['Design landing hero', 'Set up CI pipeline'] },
  { title: 'In Progress', tint: 'bg-primary/40', cards: ['Auth API endpoints', 'Kanban drag & drop'] },
  { title: 'Review', tint: 'bg-accent/50', cards: ['Profile page UI'] },
  { title: 'Completed', tint: 'bg-success/40', cards: ['Project schema', 'Repo scaffolding'] },
];

/**
 * Four-column Kanban preview matching the real Task module's states
 * (Todo → In Progress → Review → Completed).
 */
export default function KanbanBoard() {
  return (
    <div className="grid gap-3 overflow-x-auto sm:grid-cols-4">
      {COLUMNS.map((col) => (
        <div key={col.title} className="min-w-[10rem] rounded-xl bg-background p-3">
          <div className="mb-3 flex items-center justify-between px-1">
            <span className="text-xs font-semibold text-text/60">{col.title}</span>
            <span className={`h-2 w-2 rounded-full ${col.tint}`} />
          </div>
          <div className="space-y-2">
            {col.cards.map((card) => (
              <div key={card} className="rounded-lg border border-border bg-white p-3 text-xs font-medium text-text/70 shadow-sm">
                <div className="mb-2 flex items-center gap-1.5 text-text/30">
                  <FiCircle className="h-2.5 w-2.5" aria-hidden="true" />
                  <span className="text-[10px]">TASK</span>
                </div>
                {card}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
