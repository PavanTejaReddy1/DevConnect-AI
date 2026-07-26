export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border px-6 py-14 text-center dark:border-white/10">
      {Icon && (
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      )}
      <h3 className="mt-4 font-display text-base font-semibold text-text dark:text-slate-100">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-text/55 dark:text-slate-400">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
