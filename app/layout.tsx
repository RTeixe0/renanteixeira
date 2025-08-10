// app/layout.tsx
import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Inter, Orbitron, JetBrains_Mono } from "next/font/google";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import Tracker from "@/components/Tracker";
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
      {/* GA4 */}
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
          gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
        `}
      </Script>

      {/* Microsoft Clarity */}
      <Script id="clarity" strategy="afterInteractive">
        {`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_ID}");
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
        {/* 👇 Envolva qualquer componente que use useSearchParams/usePathname */}
        <Suspense fallback={null}>
          <Tracker />
        </Suspense>
        {children}
        <ScrollToTopButton />
      </body>
    </html>
  );
}
