"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { projects } from "@/lib/projects";
import { Github, ExternalLink } from "lucide-react";

export default function Projects() {
  return (
    <section id="projetos" className="py-24 px-4 max-w-5xl mx-auto">
      <motion.h2
        className="text-3xl md:text-4xl font-title text-highlight mb-16 text-center"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        Projetos em Destaque
      </motion.h2>

      <div className="grid md:grid-cols-2 gap-10">
        {projects.map((proj, i) => (
          <motion.div
            key={proj.nome}
            className="bg-darker/60 rounded-2xl overflow-hidden shadow-md backdrop-blur-sm border border-highlight/10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Image
              src={proj.imagem}
              alt={proj.nome}
              width={800}
              height={450}
              className="w-full h-52 object-cover"
            />
            <div className="p-5 flex flex-col gap-3">
              <h3 className="text-xl font-semibold text-light">{proj.nome}</h3>
              <p className="text-light/80 text-sm">{proj.descricao}</p>
              <div className="flex flex-wrap gap-2">
                {proj.tecnologias.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 text-xs rounded bg-dark border border-highlight/30 text-light"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex gap-3 mt-2">
                {proj.github && (
                  <a
                    href={proj.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-highlight hover:underline inline-flex items-center gap-1"
                  >
                    <Github className="w-4 h-4" />
                    GitHub
                  </a>
                )}
                {proj.site && (
                  <a
                    href={proj.site}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-highlight hover:underline inline-flex items-center gap-1"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Ver site
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
