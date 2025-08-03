import type { Metadata } from "next";
import "./globals.css";
import { Inter, Orbitron, JetBrains_Mono } from "next/font/google";
import ScrollToTopButton from "@/components/ScrollToTopButton";

// Fontes com suporte a variável CSS
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-title",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Renan Teixeira — Full Stack Developer",
  description:
    "Portfólio pessoal de Renan Teixeira com projetos, habilidades e contato.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${orbitron.variable} ${jetbrains.variable}`}
    >
      <body className="bg-[#0d0d0d] text-[#f2f2f2] antialiased">
        {children}
        <ScrollToTopButton />
      </body>
    </html>
  );
}
