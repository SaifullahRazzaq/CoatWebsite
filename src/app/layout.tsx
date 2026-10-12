import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/layout/SmoothScroll";
import Preloader from "@/components/layout/Preloader";
import GrainOverlay from "@/components/layout/GrainOverlay";
import Cursor from "@/components/layout/Cursor";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aldermay — Bespoke Tailors, Sackville Street",
  description:
    "A bespoke tailoring house on Sackville Street since 1908. Cut, canvassed and finished by hand, to one body.",
  openGraph: {
    title: "Aldermay — Bespoke Tailors",
    description:
      "Cut, canvassed and finished by hand, to one body. London, since 1908.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#08080a",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <body className="antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[200] focus:bg-champagne focus:px-5 focus:py-3 focus:text-[11px] focus:uppercase focus:tracking-[0.2em] focus:text-ink"
        >
          Skip to content
        </a>

        <SmoothScroll />
        <Preloader />
        <Cursor />
        <Navigation />

        <main id="main">{children}</main>

        <Footer />
        <GrainOverlay />
      </body>
    </html>
  );
}
