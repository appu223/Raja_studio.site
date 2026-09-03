import { useEffect } from 'react';
import LandingNavbar from '../components/landing/LandingNavbar';
import Hero from '../components/landing/Hero';
import Marquee from '../components/landing/Marquee';
import IntroSection from '../components/landing/IntroSection';
import ServicesSection from '../components/landing/ServicesSection';
import PortfolioSection from '../components/landing/PortfolioSection';
import ProcessSection from '../components/landing/ProcessSection';
import CTASection from '../components/landing/CTASection';
import LandingFooter from '../components/landing/LandingFooter';
import CustomCursor from '../components/common/CustomCursor';
import PageLoader from '../components/common/PageLoader';
import '../assets/css/landing.css';

export default function Home() {
  useEffect(() => {
    document.title = 'Raja Studio | Photography & Visual Stories';
  }, []);

  return (
    <div className="cinematic-body">
      <PageLoader />
      <CustomCursor />
      <LandingNavbar />
      <main>
        <Hero />
        <Marquee />
        <IntroSection />
        <ServicesSection />
        <PortfolioSection />
        <ProcessSection />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  );
}