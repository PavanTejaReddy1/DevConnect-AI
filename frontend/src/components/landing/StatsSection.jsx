import Container from '../common/Container.jsx';
import Reveal from '../common/Reveal.jsx';
import useCountUp from '../../hooks/useCountUp.js';

const STATS = [
  { label: 'Projects Built', value: 4200, suffix: '+' },
  { label: 'Developers', value: 18500, suffix: '+' },
  { label: 'Teams Formed', value: 3100, suffix: '+' },
  { label: 'Tasks Completed', value: 92000, suffix: '+' },
];

function StatItem({ label, value, suffix }) {
  const [ref, count] = useCountUp(value);
  return (
    <div ref={ref} className="text-center">
      <p className="font-display text-3xl font-bold text-text sm:text-4xl">
        {count.toLocaleString()}
        <span className="text-primary">{suffix}</span>
      </p>
      <p className="mt-1.5 text-sm text-text/50">{label}</p>
    </div>
  );
}

export default function StatsSection() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <Reveal>
          <div className="glass-card grid grid-cols-2 gap-8 px-8 py-10 sm:px-12 md:grid-cols-4">
            {STATS.map((stat) => (
              <StatItem key={stat.label} {...stat} />
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
