import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/landing/Hero';
import About from '@/components/landing/About';
import Problem from '@/components/landing/Problem';
import Solution from '@/components/landing/Solution';
import Features from '@/components/landing/Features';
import HowItWorks from '@/components/landing/HowItWorks';
import Technology from '@/components/landing/Technology';
import ImpactStats from '@/components/landing/ImpactStats';
import Contact from '@/components/landing/Contact';
import Chatbot from '@/components/chatbot/Chatbot';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Problem />
        <Solution />
        <Features />
        <HowItWorks />
        <Technology />
        <ImpactStats />
        <Contact />
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}
