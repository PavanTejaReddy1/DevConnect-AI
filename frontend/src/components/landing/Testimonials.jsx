import { FiStar } from 'react-icons/fi';
import { HiOutlineChatBubbleBottomCenterText } from 'react-icons/hi2';
import Container from '../common/Container.jsx';
import SectionEyebrow from '../common/SectionEyebrow.jsx';
import Reveal from '../common/Reveal.jsx';

const TESTIMONIALS = [
  {
    name: 'Sofia Reyes',
    role: 'Full Stack Developer',
    company: 'Freelance, ex-Northwind Labs',
    initials: 'SR',
    tone: 'from-primary to-accent',
    rating: 5,
    quote:
      'I found a two-person team within a day of posting my skills. The AI matching actually understood what "backend-heavy React project" meant — not just keyword overlap.',
  },
  {
    name: 'Daniel Kim',
    role: 'Mobile Engineer',
    company: 'Vertex Systems',
    initials: 'DK',
    tone: 'from-secondary to-primary',
    rating: 5,
    quote:
      'The Kanban board and chat living in the same place as team-finding removed so much tool-switching. We went from matched strangers to a shipped MVP in three weeks.',
  },
  {
    name: 'Amara Okafor',
    role: 'ML Engineer',
    company: 'Independent',
    initials: 'AO',
    tone: 'from-accent to-secondary',
    rating: 4,
    quote:
      "As someone who mostly works solo, DevConnect made it easy to plug into a project with people who actually needed my skill set instead of cold-messaging strangers.",
  },
];

function TestimonialCard({ t }) {
  return (
    <figure className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-glow">
      <HiOutlineChatBubbleBottomCenterText
        className="absolute -right-3 -top-3 h-20 w-20 text-primary/[0.06]"
        aria-hidden="true"
      />

      <div className="relative flex gap-1" aria-label={`${t.rating} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, idx) => (
          <FiStar
            key={idx}
            className={`h-4 w-4 ${idx < t.rating ? 'fill-warning text-warning' : 'text-border'}`}
            aria-hidden="true"
          />
        ))}
      </div>

      <blockquote className="relative mt-4 flex-1 text-sm leading-relaxed text-text/65">
        "{t.quote}"
      </blockquote>

      <figcaption className="relative mt-6 flex items-center gap-3">
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br ${t.tone} p-[2px] text-xs font-semibold text-white ring-2 ring-white`}
        >
          <span className="flex h-full w-full items-center justify-center rounded-full">{t.initials}</span>
        </span>
        <div>
          <p className="text-sm font-semibold text-text">{t.name}</p>
          <p className="text-xs text-text/50">{t.role} · {t.company}</p>
        </div>
      </figcaption>
    </figure>
  );
}

export default function Testimonials() {
  return (
    <section className="bg-white/50 py-24 sm:py-28">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>Testimonials</SectionEyebrow>
          <h2 className="mt-5 text-3xl font-bold text-text sm:text-4xl">Loved by developers who build together</h2>
        </Reveal>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <TestimonialCard t={t} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
