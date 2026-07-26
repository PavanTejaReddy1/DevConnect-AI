/**
 * Small composable skeleton primitives. Compose these inside a component's
 * own layout to build a loading state that matches its real content shape,
 * rather than one generic gray box.
 */

export function SkeletonLine({ width = 'w-full', className = '' }) {
  return <div className={`h-3 animate-pulse rounded-full bg-text/10 dark:bg-white/10 ${width} ${className}`} />;
}

export function SkeletonCircle({ size = 'h-9 w-9', className = '' }) {
  return <div className={`animate-pulse rounded-full bg-text/10 dark:bg-white/10 ${size} ${className}`} />;
}

export function SkeletonBlock({ className = 'h-24 w-full' }) {
  return <div className={`animate-pulse rounded-xl bg-text/10 dark:bg-white/10 ${className}`} />;
}

/** A ready-made skeleton for a stat card, list row, or table row. */
export function SkeletonStatCard() {
  return (
    <div className="surface-card p-5">
      <SkeletonLine width="w-20" />
      <div className="mt-3">
        <SkeletonLine width="w-16" className="h-6" />
      </div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 p-3">
      <SkeletonCircle />
      <div className="flex-1 space-y-2">
        <SkeletonLine width="w-1/3" />
        <SkeletonLine width="w-1/2" />
      </div>
    </div>
  );
}
