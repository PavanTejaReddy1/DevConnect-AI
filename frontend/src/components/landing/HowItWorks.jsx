import { FiUserPlus, FiUsers, FiCode } from 'react-icons/fi';
import { HiOutlineRocketLaunch } from 'react-icons/hi2';
import Container from '../common/Container.jsx';
import SectionEyebrow from '../common/SectionEyebrow.jsx';
import Reveal from '../common/Reveal.jsx';

const STEPS = [
  { icon: FiUserPlus, title: 'Create Profile', description: 'Add your skills, experience, and availability so the right projects can find you.' },
  { icon: FiUsers, title: 'Find Team', description: 'Browse open projects or let AI recommend teammates who complement your skill set.' },
  { icon: FiCode, title: 'Build Together', description: 'Coordinate through tasks, real-time chat, and a shared Kanban board as you build.' },
  { icon: HiOutlineRocketLaunch, title: 'Launch Product', description: 'Ship it, showcase it on your profile, and carry the team forward to the next project.' },
];

export default function HowItWorks() {
  return (
    <section className="bg-white/50 py-24 sm:py-28">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>Process</SectionEyebrow>
          <h2 className="mt-5 text-3xl font-bold text-text sm:text-4xl">From idea to launch, in four steps</h2>
        </Reveal>

        <div className="relative mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {/* Connecting line — desktop only, sits behind the step nodes */}
          <div className="pointer-events-none absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent lg:block" aria-hidden="true" />

          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.1} className="relative">
              <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white shadow-glow">
                  <step.icon className="h-6 w-6" aria-hidden="true" />
                  <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-accent text-[11px] font-bold text-white">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-text">{step.title}</h3>
                <p className="mt-2 max-w-[15rem] text-sm leading-relaxed text-text/55">{step.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
