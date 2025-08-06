import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import TechStack from "@/components/TechStack";
import Projects from "@/components/Projects";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <header>
        <HeroSection />
      </header>

      <section id="sobre">
        <AboutSection />
      </section>

      <section id="tecnologias">
        <TechStack />
      </section>

      <section id="projetos">
        <Projects />
      </section>

      <section id="contato">
        <ContactSection />
      </section>

      <Footer />
    </main>
  );
}
