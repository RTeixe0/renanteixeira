"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { projects } from "@/lib/projects";
import { Github, ExternalLink } from "lucide-react";
import { gtagEvent } from "@/lib/gtag";
import { clarityEvent } from "@/lib/clarity";

function slugify(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^\w-]/g, "");
}

export default function Projects() {
  const track = (
    label: string,
    clarityName: string,
    action = "project_link_click",
    category = "Projetos"
  ) => {
    gtagEvent({ action, category, label });
    clarityEvent(clarityName);
  };

  const openProject = (url: string) => {
    // Abre em nova aba para não perder a sessão/scroll da LP
    window.open(url, "_blank", "noopener,noreferrer");
  };

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
        {projects.map((proj, i) => {
          const slug = slugify(proj.nome);
          const primaryUrl = proj.site || proj.github; // destino principal do card
          const destLabel = proj.site ? "Site" : "GitHub";

          return (
            <motion.div
              key={proj.nome}
              className="bg-darker/60 rounded-2xl overflow-hidden shadow-md backdrop-blur-sm border border-highlight/10 cursor-pointer focus:outline-none focus:ring-2 focus:ring-highlight/60"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              role={primaryUrl ? "link" : undefined}
              tabIndex={primaryUrl ? 0 : -1}
              data-track={`projeto_${slug}_card`} // Tracker (Supabase)
              onClick={() => {
                if (!primaryUrl) return;
                // Tracking: clique no CARD
                gtagEvent({
                  action: "project_card_click",
                  category: "Projetos",
                  label: `${proj.nome} - Card (${destLabel})`,
                });
                clarityEvent(`projeto_${slug}_card`);
                openProject(primaryUrl);
              }}
              onKeyDown={(e) => {
                if (!primaryUrl) return;
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  gtagEvent({
                    action: "project_card_click",
                    category: "Projetos",
                    label: `${proj.nome} - Card (${destLabel})`,
                  });
                  clarityEvent(`projeto_${slug}_card`);
                  openProject(primaryUrl);
                }
              }}
            >
              <Image
                src={proj.imagem}
                alt={proj.nome}
                width={800}
                height={450}
                className="w-full h-52 object-cover"
              />

              <div className="p-5 flex flex-col gap-3">
                <h3 className="text-xl font-semibold text-light">
                  {proj.nome}
                </h3>
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
                      aria-label={`Abrir repositório GitHub do projeto ${proj.nome}`}
                      data-track={`projeto_${slug}_github`} // Tracker
                      onClick={(e) => {
                        e.stopPropagation(); // evita disparar clique do card
                        track(
                          `${proj.nome} - GitHub`,
                          `projeto_${slug}_github`
                        );
                      }}
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
                      aria-label={`Visitar site do projeto ${proj.nome}`}
                      data-track={`projeto_${slug}_site`} // Tracker
                      onClick={(e) => {
                        e.stopPropagation(); // evita disparar clique do card
                        track(`${proj.nome} - Site`, `projeto_${slug}_site`);
                      }}
                      className="text-highlight hover:underline inline-flex items-center gap-1"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Ver site
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
