"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function AboutSection() {
  return (
    <section
      id="sobre"
      className="py-24 px-4 max-w-5xl mx-auto bg-gradient-to-b from-dark via-[#0d0d0d] to-darker"
    >
      <motion.h2
        className="text-3xl md:text-4xl font-title text-highlight mb-8 text-center"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        Sobre mim
      </motion.h2>

      <motion.div
        className="flex flex-col md:flex-row gap-6 md:gap-12 items-center md:items-start"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        viewport={{ once: true }}
      >
        {/* Avatar */}
        <motion.div
          className="w-40 h-40 relative rounded-full overflow-hidden border-2 border-highlight shadow-[0_0_20px_rgba(249,115,22,0.3)] shrink-0 mx-auto md:mx-0"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <Image
            src="/avatar.jpg"
            alt="Foto de Renan Teixeira"
            fill
            style={{ objectFit: "cover" }}
            sizes="160px"
            priority
          />
        </motion.div>

        {/* Texto */}
        <div className="text-light/90 text-lg leading-[1.8] max-w-3xl">
          <p className="mb-4">
            Em 2023, comecei o curso de Desenvolvimento de Software
            Multiplataforma na FATEC Itapira e logo me apaixonei pela área.
            Desde então, venho me preparando para atuar como desenvolvedor,
            sempre com foco em prática, organização e aprendizado constante.
          </p>

          <p className="mb-4">
            Já desenvolvi projetos com IoT, APIs e landing pages modernas — como
            um site completo para aluguel de apartamentos em Ubatuba, com
            domínio próprio e SEO. Também participei da criação de um app para
            eventos na faculdade.
          </p>

          <p>
            Tenho interesse especial por back-end e automações, mas me destaco
            pela versatilidade e adaptação rápida. Meu objetivo é trabalhar como
            dev full stack e conquistar uma vida com mais liberdade através da
            tecnologia.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
