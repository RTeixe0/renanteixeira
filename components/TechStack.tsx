"use client";

import { motion } from "framer-motion";
import { techs } from "@/lib/techs";
import { techIconMap } from "@/lib/icons";

export default function TechStack() {
  return (
    <section id="tech" className="py-24 px-4 max-w-5xl mx-auto">
      <motion.h2
        className="text-3xl md:text-4xl font-title text-highlight mb-16 text-center"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        Tech Stack
      </motion.h2>

      <div className="grid md:grid-cols-3 gap-14">
        {techs.map((categoria, i) => (
          <motion.div
            key={categoria.categoria}
            className="bg-darker/60 p-6 rounded-2xl shadow-[0_0_20px_rgba(249,115,22,0.05)] backdrop-blur-sm h-full"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold text-highlight mb-6">
              {categoria.categoria}
            </h3>
            <ul className="flex flex-wrap gap-x-4 gap-y-4">
              {categoria.itens.map((tech) => (
                <li
                  key={tech}
                  className="px-4 py-2 rounded-full text-base inline-flex items-center gap-2 bg-dark border border-highlight/40 hover:bg-highlight/10 transition"
                >
                  {techIconMap[tech.toLowerCase()] ?? null}
                  {tech}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
