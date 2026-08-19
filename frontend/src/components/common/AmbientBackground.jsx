/**
 * Ambient backdrop used behind the Hero and CTA sections: a slowly drifting
 * gradient mesh, glowing blobs, and a faint dot grid. Pure CSS animation
 * (no JS), kept behind pointer-events-none so it never blocks interaction.
 *
 * `variant="light"` (default) is tuned for the light page background.
 * `variant="dark"` is tuned for use on top of the primary/secondary gradient
 * banner in CTASection.
 */
export default function AmbientBackground({ variant = 'light' }) {
  const isDark = variant === 'dark';

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* Drifting gradient mesh */}
      <div
        className={`absolute -top-40 left-1/2 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full blur-3xl motion-safe:animate-[drift_18s_ease-in-out_infinite] ${
          isDark ? 'bg-white/10' : 'bg-primary/10'
        }`}
      />
      <div
        className={`absolute right-[-6rem] top-24 h-80 w-80 rounded-full blur-3xl motion-safe:animate-[drift_14s_ease-in-out_infinite_reverse] ${
          isDark ? 'bg-accent/25' : 'bg-accent/20'
        }`}
      />
      <div
        className={`absolute -left-24 bottom-0 h-72 w-72 rounded-full blur-3xl motion-safe:animate-[drift_20s_ease-in-out_infinite] ${
          isDark ? 'bg-primary/20' : 'bg-secondary/10'
        }`}
      />

      {/* Dot grid, faded via a radial mask so it vignettes toward the edges */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, ${isDark ? '#ffffff33' : '#94a3b833'} 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse 60% 50% at 50% 40%, black 40%, transparent 90%)',
          WebkitMaskImage: 'radial-gradient(ellipse 60% 50% at 50% 40%, black 40%, transparent 90%)',
        }}
      />
    </div>
  );
}
