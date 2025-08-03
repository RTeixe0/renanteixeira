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
          className="w-40 h-40 relative rounded-full overflow-hidden border-2 border-highlight shadow-[0_0_20px_rgba(249,115,22,0.3)] shrink-0 hidden md:block"
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
            Sempre tive facilidade com tecnologia, mas foi em 2023 que mergulhei
            de vez nesse universo ao iniciar o curso de Desenvolvimento de
            Software Multiplataforma na FATEC de Itapira. Desde então, me
            apaixonei por criar soluções digitais e venho trilhando minha
            transição para a área de forma prática, organizada e determinada.
          </p>

          <p className="mb-4">
            Apesar de ainda estar no último semestre da faculdade, já acumulo
            experiências reais com desenvolvimento web, IoT e automações. Criei
            uma estufa automatizada com ESP32, desenvolvi APIs e landing pages
            modernas — incluindo um site completo para apartamentos em Ubatuba,
            com domínio próprio e foco em SEO. Também participei da criação de
            um app para eventos como projeto interdisciplinar.
          </p>

          <p className="mb-4">
            Meu foco está no back-end e em projetos de automação, mas minha
            maior força é a versatilidade: consigo aprender rápido, me adaptar a
            diferentes demandas e organizar tudo de forma limpa e objetiva.
            Entender os princípios de engenharia de software antes de começar um
            projeto tem sido essencial na minha evolução.
          </p>

          <p>
            Busco oportunidades que me ajudem a expandir minha experiência
            profissional e alcançar meu objetivo: atuar como desenvolvedor full
            stack remoto, explorar o mundo e viver com liberdade através da
            tecnologia.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
