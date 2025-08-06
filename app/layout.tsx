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
    "Portfólio de Renan Teixeira, desenvolvedor full stack com experiência em web, automações e IoT.",
  keywords: [
    "Renan Teixeira",
    "portfólio desenvolvedor",
    "desenvolvedor full stack",
    "programador Next.js",
    "Tailwind CSS",
    "IoT",
    "React",
    "dev remoto",
  ],
  authors: [{ name: "Renan Teixeira", url: "https://renanteixeira.dev" }],
  metadataBase: new URL("https://renanteixeira.dev"),
  openGraph: {
    title: "Renan Teixeira — Desenvolvedor Full Stack",
    description:
      "Conheça o portfólio de Renan Teixeira, com projetos reais em web, automações e IoT.",
    url: "https://renanteixeira.dev",
    siteName: "Renan Teixeira",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Renan Teixeira — Desenvolvedor Full Stack",
      },
    ],
  },
  icons: {
    icon: "/favicon.ico",
  },
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
