import Hero from '../components/Hero';
import SocialProof from '../components/SocialProof';
import Features from '../components/Features';
import ProductShowcase from '../components/ProductShowcase';
import AppDownload from '../components/AppDownload';
import Benefits from '../components/Benefits';
import Testimonials from '../components/Testimonials';
import Pricing from '../components/Pricing';
import FAQ from '../components/FAQ';
import CTA from '../components/CTA';

export default function Landing() {
  return (
    <>
      <Hero />
      <SocialProof />
      <Features />
      <ProductShowcase />
      <AppDownload />
      <Benefits />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
    </>
  );
}
