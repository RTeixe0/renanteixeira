// app/layout.tsx
import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Inter, Orbitron, JetBrains_Mono } from "next/font/google";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import Tracker from "@/components/Tracker";
import GA from "@/components/GA"; // dispara page_view nas mudanças de rota
import ClarityInit from "@/components/ClarityInit"; // 👈 novo: inicializa Clarity via NPM
import { Suspense } from "react";

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
  icons: { icon: "/favicon.ico" },
  manifest: "/site.webmanifest",
};

function AnalyticsScripts() {
  return (
    <>
      {/* GA4 base */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          // Desliga page_view automático; o GA.tsx envia nas mudanças de rota
          gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', { send_page_view: false });
        `}
      </Script>
    </>
  );
}

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
        <AnalyticsScripts />
        {/* Componentes com hooks de navegação ficam em Suspense */}
        <Suspense fallback={null}>
          <GA />
        </Suspense>
        <Suspense fallback={null}>
          <Tracker />
        </Suspense>
        {/* Inicialização do Microsoft Clarity via NPM */}
        <Suspense fallback={null}>
          <ClarityInit />
        </Suspense>
        {children}
        <ScrollToTopButton />
      </body>
    </html>
  );
}
