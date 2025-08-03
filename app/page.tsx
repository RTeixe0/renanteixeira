import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import TechStack from "@/components/TechStack";
import Projects from "@/components/Projects";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";


export default function Home() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <TechStack />
      <Projects />
      <ContactSection />
      <Footer />
    </main>
  );
}
