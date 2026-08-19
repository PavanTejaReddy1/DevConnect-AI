import { HiOutlineSparkles, HiOutlineViewColumns, HiOutlineChatBubbleLeftRight } from 'react-icons/hi2';
import { FiFolder, FiUser, FiGithub } from 'react-icons/fi';
import Container from '../common/Container.jsx';
import SectionEyebrow from '../common/SectionEyebrow.jsx';
import Reveal from '../common/Reveal.jsx';

const FEATURES = [
  {
    icon: HiOutlineSparkles,
    title: 'AI Team Matching',
    description: 'Get matched with developers whose skills and availability complement yours, ranked automatically for every project you post.',
    tone: 'from-primary to-accent',
  },
  {
    icon: FiFolder,
    title: 'Project Management',
    description: 'Create, scope, and track projects with required skills, tech stack, and difficulty — all in one clean workspace.',
    tone: 'from-secondary to-primary',
  },
  {
    icon: HiOutlineChatBubbleLeftRight,
    title: 'Real-time Chat',
    description: 'Talk to your team the moment you form one. Typing indicators, online status, and file sharing built in.',
    tone: 'from-accent to-secondary',
  },
  {
    icon: HiOutlineViewColumns,
    title: 'Kanban Tasks',
    description: 'Assign work, set priorities and due dates, and move tasks through Todo, In Progress, Review, and Done.',
    tone: 'from-primary to-secondary',
  },
  {
    icon: FiUser,
    title: 'Developer Profiles',
    description: 'Showcase your skills, experience, and portfolio — so the right teammates and projects find you back.',
    tone: 'from-accent to-primary',
  },
  {
    icon: FiGithub,
    title: 'GitHub Integration',
    description: 'Link repositories to projects and keep contribution activity visible to your whole team.',
    tone: 'from-secondary to-accent',
  },
];

function FeatureCard({ feature }) {
  return (
    <div className="group relative h-full rounded-2xl p-px transition-transform duration-300 hover:-translate-y-1.5">
      {/* Animated gradient border: an inset gradient layer revealed only on hover/focus */}
      <div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.tone} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
        aria-hidden="true"
      />
      <div className="relative h-full rounded-[15px] border border-border bg-card p-7 shadow-card transition-shadow duration-300 group-hover:shadow-glow">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${feature.tone} text-white shadow-card transition-transform duration-300 group-hover:scale-110`}
        >
          <feature.icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <h3 className="mt-5 font-display text-lg font-semibold text-text">{feature.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-text/55">{feature.description}</p>
      </div>
    </div>
  );
}

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 sm:py-28">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>Platform</SectionEyebrow>
          <h2 className="mt-5 text-3xl font-bold text-text sm:text-4xl">
            Everything you need to ship as a team
          </h2>
          <p className="mt-4 text-lg text-text/55">
            DevConnect AI handles the parts of collaboration that usually slow teams down — so you can focus on building.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 0.06}>
              <FeatureCard feature={feature} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
