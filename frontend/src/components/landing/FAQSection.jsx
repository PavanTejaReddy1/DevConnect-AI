import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiPlus } from 'react-icons/fi';
import Container from '../common/Container.jsx';
import SectionEyebrow from '../common/SectionEyebrow.jsx';
import Reveal from '../common/Reveal.jsx';

const FAQS = [
  {
    question: 'How does AI team matching work?',
    answer:
      'When you post a project or update your profile, DevConnect AI compares required skills, tech stack, and availability against the developer pool and ranks the closest matches for you to review — you always choose who joins.',
  },
  {
    question: 'Is DevConnect AI free to use?',
    answer:
      'Yes. The Free plan supports up to two active projects with core team-matching and chat features. You can upgrade to Pro whenever your team needs unlimited projects or GitHub integration.',
  },
  {
    question: 'Can I use DevConnect AI for a solo project?',
    answer:
      'Absolutely — you can manage tasks and a Kanban board solo, and open the project to teammates whenever you\'re ready to bring others in.',
  },
  {
    question: 'Does it integrate with GitHub?',
    answer:
      'Pro and Enterprise plans let you link a repository to any project, so contribution activity stays visible to the whole team without leaving the dashboard.',
  },
  {
    question: 'What happens to my data if I cancel?',
    answer:
      'Your profile and past projects remain accessible on the Free plan. You can export project and task data at any time from Settings before or after downgrading.',
  },
];

function FaqItem({ faq, isOpen, onToggle }) {
  return (
    <div className="border-b border-border">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="group flex w-full items-center justify-between gap-4 py-5 text-left transition-colors"
      >
        <span
          className={`font-display text-base font-semibold transition-colors sm:text-lg ${
            isOpen ? 'text-primary' : 'text-text group-hover:text-primary'
          }`}
        >
          {faq.question}
        </span>
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-text/60 transition-all duration-300 ${
            isOpen ? 'rotate-45 border-primary bg-primary/5 text-primary' : 'group-hover:border-primary/40'
          }`}
        >
          <FiPlus className="h-4 w-4" aria-hidden="true" />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="overflow-hidden"
          >
            <p className="pb-5 pr-12 text-sm leading-relaxed text-text/60 sm:text-[15px]">{faq.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="bg-white/50 py-24 sm:py-28">
      <Container>
        <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <Reveal>
            <SectionEyebrow>FAQ</SectionEyebrow>
            <h2 className="mt-5 text-3xl font-bold text-text sm:text-4xl">Frequently asked questions</h2>
            <p className="mt-4 text-text/55">
              Can't find what you're looking for? Reach out and our team will get back to you.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div>
              {FAQS.map((faq, index) => (
                <FaqItem
                  key={faq.question}
                  faq={faq}
                  isOpen={openIndex === index}
                  onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
                />
              ))}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
