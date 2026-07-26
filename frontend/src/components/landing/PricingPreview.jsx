import { FiCheck } from 'react-icons/fi';
import Container from '../common/Container.jsx';
import SectionEyebrow from '../common/SectionEyebrow.jsx';
import Reveal from '../common/Reveal.jsx';

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'For individual developers exploring projects and teams.',
    features: ['Up to 2 active projects', 'Basic AI team matching', 'Community chat access', 'Public developer profile'],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$14',
    period: 'per month',
    description: 'For developers actively building and shipping with a team.',
    features: [
      'Unlimited projects',
      'Advanced AI team matching',
      'Real-time chat & file sharing',
      'Kanban task management',
      'GitHub integration',
    ],
    cta: 'Start Free Trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'billed annually',
    description: 'For organizations running multiple teams at scale.',
    features: ['Everything in Pro', 'Admin analytics dashboard', 'Role-based access control', 'Priority support'],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

export default function PricingPreview() {
  return (
    <section id="pricing" className="py-24 sm:py-28">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>Pricing</SectionEyebrow>
          <h2 className="mt-5 text-3xl font-bold text-text sm:text-4xl">Simple pricing, room to grow</h2>
          <p className="mt-4 text-lg text-text/55">Start free. Upgrade when your team needs more.</p>
        </Reveal>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {PLANS.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 0.08}>
              <div
                className={`flex h-full flex-col rounded-2xl border p-8 ${
                  plan.highlighted
                    ? 'relative border-primary bg-gradient-to-b from-primary/[0.04] to-transparent shadow-glow'
                    : 'border-border bg-card shadow-card'
                }`}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-white">
                    Most Popular
                  </span>
                )}
                <h3 className="font-display text-lg font-semibold text-text">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1.5">
                  <span className="font-display text-4xl font-bold text-text">{plan.price}</span>
                  <span className="text-sm text-text/45">/ {plan.period}</span>
                </div>
                <p className="mt-3 text-sm text-text/55">{plan.description}</p>

                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-text/70">
                      <FiCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <a
                  href="/signup"
                  className={`mt-8 w-full text-center ${plan.highlighted ? 'btn-primary' : 'btn-secondary'}`}
                >
                  {plan.cta}
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
