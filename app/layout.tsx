import type { Metadata } from "next";
import { Bebas_Neue, Inter, Space_Mono } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "El Brisa — Donde el mar se convierte en fiesta",
    template: "%s | El Brisa",
  },
  description:
    "Chiringuito de playa con los mejores eventos en directo de la costa. Música en vivo, DJ sets y ambiente único frente al mar.",
  keywords: ["chiringuito", "eventos", "música en vivo", "playa", "Vigo", "Galicia"],
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "El Brisa",
    title: "El Brisa — Donde el mar se convierte en fiesta",
    description: "Chiringuito de playa con los mejores eventos en directo de la costa.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200",
        width: 1200,
        height: 630,
        alt: "El Brisa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "El Brisa — Donde el mar se convierte en fiesta",
    description: "Chiringuito de playa con los mejores eventos en directo de la costa.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${bebasNeue.variable} ${inter.variable} ${spaceMono.variable}`}
    >
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
