import Container from '../common/Container.jsx';
import Reveal from '../common/Reveal.jsx';

// Invented placeholder company names — deliberately not real brands/logos.
const COMPANIES = ['Northwind Labs', 'Vertex Systems', 'Orbital Software', 'Caldera Works', 'Fieldstone Co.', 'Rivergate Tech'];

export default function TrustedCompanies() {
  return (
    <section className="border-y border-border bg-white/50 py-12">
      <Container>
        <Reveal>
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-text/40">
            Trusted by developer teams at
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
            {COMPANIES.map((name) => (
              <span
                key={name}
                className="font-display text-lg font-semibold text-text/25 transition-colors hover:text-text/50"
              >
                {name}
              </span>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
