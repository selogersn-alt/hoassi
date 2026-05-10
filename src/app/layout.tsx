import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import ChatWidget from "@/components/ChatWidget";
import Footer from "@/components/Footer";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "HOASSI | Excellence Crowdfunding Togo - Soutien & Solidarité",
    template: "%s | HOASSI Togo"
  },
  description: "La plateforme de crowdfunding référence au Togo. Soutenez l'éducation, la santé et l'entrepreneuriat local via T-Money et Moov Money. Propulsé par Digitalh.",
  keywords: ["Crowdfunding Togo", "Don Togo", "T-Money", "Moov Money", "Cagnotte solidaire Togo", "Entraide Togo", "Digitalh", "Investissement Togo", "Soutien créateurs Togo", "Financement participatif Afrique"],
  authors: [{ name: "Digitalh", url: "https://digitalh.tg" }],
  creator: "Digitalh",
  publisher: "HOASSI",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "fr_TG",
    url: "https://hoassi.tg",
    title: "HOASSI | Excellence Crowdfunding Togo",
    description: "Financez l'avenir du Togo en toute sécurité. Santé, Éducation, Entrepreneuriat.",
    siteName: "HOASSI",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "HOASSI Crowdfunding Togo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HOASSI | Excellence Crowdfunding Togo",
    description: "Financez l'avenir du Togo en toute sécurité.",
    images: ["/og-image.jpg"],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${outfit.variable} ${playfair.variable} font-sans antialiased`}
      >
        <AuthProvider>
          {children}
          <Footer />
          <ChatWidget />
        </AuthProvider>
      </body>
    </html>
  );
}
