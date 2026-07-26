import { lazy, Suspense } from 'react';
import Navbar from '../../components/layout/Navbar.jsx';
import Footer from '../../components/layout/Footer.jsx';
import HeroSection from '../../components/landing/HeroSection.jsx';
import TrustedCompanies from '../../components/landing/TrustedCompanies.jsx';
import StatsSection from '../../components/landing/StatsSection.jsx';
import FeaturesSection from '../../components/landing/FeaturesSection.jsx';
import ScrollProgressBar from '../../components/common/ScrollProgressBar.jsx';
import BackToTop from '../../components/common/BackToTop.jsx';
import PageLoader from '../../components/common/PageLoader.jsx';
import SectionSkeleton from '../../components/common/SectionSkeleton.jsx';

// Below-the-fold sections are code-split so the initial bundle only pays for
// what's visible on first paint (Hero, trust strip, stats, features).
// Each chunk streams in lazily and is backed by a Suspense skeleton to avoid
// layout jump.
const HowItWorks = lazy(() => import('../../components/landing/HowItWorks.jsx'));
const ShowcaseSection = lazy(() => import('../../components/landing/ShowcaseSection.jsx'));
const Testimonials = lazy(() => import('../../components/landing/Testimonials.jsx'));
const PricingPreview = lazy(() => import('../../components/landing/PricingPreview.jsx'));
const FAQSection = lazy(() => import('../../components/landing/FAQSection.jsx'));
const CTASection = lazy(() => import('../../components/landing/CTASection.jsx'));

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageLoader />
      <ScrollProgressBar />

      <Navbar />
      <main>
        <HeroSection />
        <TrustedCompanies />
        <StatsSection />
        <FeaturesSection />

        <Suspense fallback={<SectionSkeleton height="h-[26rem]" />}>
          <HowItWorks />
        </Suspense>
        <Suspense fallback={<SectionSkeleton height="h-[34rem]" />}>
          <ShowcaseSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton height="h-[26rem]" />}>
          <Testimonials />
        </Suspense>
        <Suspense fallback={<SectionSkeleton height="h-[30rem]" />}>
          <PricingPreview />
        </Suspense>
        <Suspense fallback={<SectionSkeleton height="h-[24rem]" />}>
          <FAQSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton height="h-[18rem]" />}>
          <CTASection />
        </Suspense>
      </main>
      <Footer />

      <BackToTop />
    </div>
  );
}
