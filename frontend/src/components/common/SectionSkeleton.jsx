/**
 * Generic pulse skeleton shown as a Suspense fallback for lazy-loaded,
 * below-the-fold landing sections. `lines` roughly matches the visual weight
 * of the section it's standing in for, so layout shift on load-in is minimal.
 */
export default function SectionSkeleton({ height = 'h-[28rem]' }) {
  return (
    <div className={`mx-auto w-full max-w-7xl px-6 py-16 lg:px-8 ${height}`}>
      <div className="h-full w-full animate-pulse rounded-2xl bg-text/5" />
    </div>
  );
}
