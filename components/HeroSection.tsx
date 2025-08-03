'use client'

import { motion } from 'framer-motion'

export default function HeroSection() {
  return (
    <motion.section
      initial={{ opacity: 0, filter: 'blur(4px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.8 }}
      className="min-h-screen flex flex-col justify-center items-center text-center px-4"
    >
      <motion.h1
        className="text-4xl md:text-6xl font-title text-transparent bg-gradient-to-r from-highlight to-yellow-400 bg-clip-text mb-2"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Renan Teixeira
      </motion.h1>

      <motion.h2
        className="text-xl md:text-2xl text-light font-semibold mb-2 drop-shadow-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        Desenvolvedor Full Stack
      </motion.h2>

      <motion.p
        className="text-base md:text-lg text-light/80 mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        Criando soluções inteligentes com tecnologia.
      </motion.p>

      <motion.div
        className="flex gap-4 flex-wrap justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <a
          href="#projetos"
          className="px-6 py-3 rounded-xl bg-highlight text-dark font-semibold hover:scale-105 transition"
        >
          Ver projetos
        </a>

        <a
          href="https://github.com/RTeixe0"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 rounded-xl border border-highlight text-highlight hover:bg-highlight hover:text-dark transition inline-flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M12 0C5.372 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.11.82-.26.82-.577
              0-.285-.01-1.04-.015-2.04-3.338.727-4.042-1.61-4.042-1.61-.546-1.386-1.333-1.756-1.333-1.756-1.09-.745.082-.73.082-.73
              1.205.085 1.84 1.238 1.84 1.238 1.07 1.836 2.807 1.306 3.492.998.108-.775.418-1.306.762-1.606-2.665-.304-5.466-1.334-5.466-5.933
              0-1.31.467-2.38 1.236-3.22-.123-.303-.535-1.524.117-3.176
              0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 3.003-.404c1.02.005 2.047.138 3.004.404
              2.29-1.552 3.295-1.23 3.295-1.23.653 1.652.24 2.873.118 3.176
              .77.84 1.235 1.91 1.235 3.22 0 4.61-2.804 5.625-5.475 5.922
              .43.37.814 1.102.814 2.222 0 1.604-.014 2.896-.014 3.29
              0 .32.217.694.825.576C20.565 21.796 24 17.3 24 12
              c0-6.627-5.373-12-12-12z"
              clipRule="evenodd"
            />
          </svg>
          GitHub
        </a>

        <a
          href="https://www.linkedin.com/in/renaneteixeira/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 rounded-xl border border-highlight text-highlight hover:bg-highlight hover:text-dark transition inline-flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            className="w-5 h-5"
          >
            <path
              d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 
              2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11
              19h-3v-10h3v10zm-1.5-11.271c-.966 0-1.75-.784-1.75-1.75s.784-1.75
              1.75-1.75c.965 0 1.75.784 1.75 1.75s-.785 1.75-1.75
              1.75zm13.5 11.271h-3v-5.604c0-1.337-.027-3.059-1.865-3.059-1.867
              0-2.153 1.459-2.153 2.967v5.696h-3v-10h2.881v1.367h.041c.401-.761
              1.379-1.562 2.837-1.562 3.034 0 3.595 1.997 3.595 4.593v5.602z"
            />
          </svg>
          LinkedIn
        </a>
      </motion.div>
    </motion.section>
  )
}
