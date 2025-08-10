"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail, MessageCircle } from "lucide-react";
import { gtagEvent } from "@/lib/gtag";

export default function ContactSection() {
  const track = (
    label: string,
    action = "outbound_click",
    category = "Contato"
  ) => {
    gtagEvent({ action, category, label });
  };

  return (
    <section id="contato" className="py-24 px-4 max-w-3xl mx-auto text-center">
      <motion.h2
        className="text-3xl md:text-4xl font-title text-highlight mb-6"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        Vamos conversar?
      </motion.h2>

      <motion.p
        className="text-light/80 mb-10 max-w-xl mx-auto text-lg"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        viewport={{ once: true }}
      >
        Aberto a projetos, freelas e colaborações. Me chame em qualquer canal
        abaixo 👇
      </motion.p>

      <motion.div
        className="flex justify-center gap-4 flex-wrap"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        viewport={{ once: true }}
      >
        {/* GitHub */}
        <a
          href="https://github.com/RTeixe0"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Abrir GitHub"
          data-track="contato_github"
          data-clarity-event="contato_github"
          onClick={() => track("GitHub")}
          className="px-5 py-3 bg-dark border border-highlight text-highlight rounded-xl inline-flex items-center gap-2 hover:bg-highlight hover:text-dark transition"
        >
          <Github className="w-5 h-5" />
          GitHub
        </a>

        {/* LinkedIn */}
        <a
          href="https://www.linkedin.com/in/renaneteixeira/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Abrir LinkedIn"
          data-track="contato_linkedin"
          data-clarity-event="contato_linkedin"
          onClick={() => track("LinkedIn")}
          className="px-5 py-3 bg-dark border border-highlight text-highlight rounded-xl inline-flex items-center gap-2 hover:bg-highlight hover:text-dark transition"
        >
          <Linkedin className="w-5 h-5" />
          LinkedIn
        </a>

        {/* E-mail */}
        <a
          href="mailto:renanteixeira338@hotmail.com"
          aria-label="Enviar e-mail"
          data-track="contato_email"
          data-clarity-event="contato_email"
          onClick={() => track("Email", "cta_click")}
          className="px-5 py-3 bg-dark border border-highlight text-highlight rounded-xl inline-flex items-center gap-2 hover:bg-highlight hover:text-dark transition"
        >
          <Mail className="w-5 h-5" />
          Email
        </a>

        {/* WhatsApp */}
        <a
          href="https://wa.me/5519981286656?text=Olá%20Renan%2C%20vi%20seu%20portfólio%20e%20gostaria%20de%20conversar%20sobre%20um%20projeto."
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Abrir WhatsApp"
          data-track="contato_whatsapp"
          data-clarity-event="contato_whatsapp"
          onClick={() => track("WhatsApp")}
          className="px-5 py-3 bg-dark border border-highlight text-highlight rounded-xl inline-flex items-center gap-2 hover:bg-highlight hover:text-dark transition"
        >
          <MessageCircle className="w-5 h-5" />
          WhatsApp
        </a>
      </motion.div>
    </section>
  );
}
