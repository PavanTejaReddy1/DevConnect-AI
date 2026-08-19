import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Container from '../common/Container.jsx';
import SectionEyebrow from '../common/SectionEyebrow.jsx';
import Reveal from '../common/Reveal.jsx';
import ProjectCards from './showcase/ProjectCards.jsx';
import AnalyticsChart from './showcase/AnalyticsChart.jsx';
import KanbanBoard from './showcase/KanbanBoard.jsx';
import TeamMembers from './showcase/TeamMembers.jsx';
import ChatPreview from './showcase/ChatPreview.jsx';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'kanban', label: 'Kanban' },
  { id: 'team', label: 'Team' },
  { id: 'chat', label: 'Chat' },
];

function TabPanel({ tab }) {
  switch (tab) {
    case 'kanban':
      return <KanbanBoard />;
    case 'team':
      return <TeamMembers />;
    case 'chat':
      return <ChatPreview />;
    case 'overview':
    default:
      return (
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <ProjectCards />
          <AnalyticsChart />
        </div>
      );
  }
}

export default function ShowcaseSection() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <section id="showcase" className="py-24 sm:py-28">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>Inside the product</SectionEyebrow>
          <h2 className="mt-5 text-3xl font-bold text-text sm:text-4xl">A workspace built for shipping</h2>
          <p className="mt-4 text-lg text-text/55">
            One board for the whole team — projects, tasks, teammates, and chat, always in view.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-14">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 border-b border-border bg-background px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-danger/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-warning/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-success/60" />
              <span className="ml-3 rounded-md bg-white px-3 py-1 text-xs text-text/40 shadow-sm">
                app.devconnect.ai/projects/ai-recipe-planner
              </span>
            </div>

            {/* Tab bar */}
            <div className="flex gap-1 border-b border-border bg-background/60 px-4 pt-3" role="tablist" aria-label="Product preview tabs">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative px-4 py-2.5 text-xs font-semibold transition-colors ${
                      isActive ? 'text-primary' : 'text-text/45 hover:text-text/70'
                    }`}
                  >
                    {tab.label}
                    {isActive && (
                      <motion.span
                        layoutId="showcase-tab-indicator"
                        className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Panel */}
            <div className="min-h-[16rem] p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                  <TabPanel tab={activeTab} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
