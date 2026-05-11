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

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "https://hoassi.digitalh.net"),
  title: {
    default: "HOASSI | Solidarité & Entraide au Togo 🇹🇬",
    template: "%s | HOASSI"
  },
  description: "La plateforme d'action solidaire au Togo. Soutenez-vous entre vous et donnez avec le cœur pour le développement de projets locaux via T-Money et Moov Money.",
  keywords: ["Solidarité Togo", "Entraide Togo", "Action solidaire", "T-Money", "Moov Money", "Cagnotte solidaire Togo", "Digitalh", "Développement local", "Soutien créateurs Togo", "Financement participatif Afrique"],
  openGraph: {
    type: "website",
    locale: "fr_TG",
    url: "https://hoassi.digitalh.net",
    title: "HOASSI | Solidarité & Entraide au Togo",
    description: "Soutenez-vous entre vous. Donnez avec le cœur pour des actions solidaires de proximité.",
    siteName: "HOASSI",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 800,
        alt: "HOASSI Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HOASSI | Solidarité & Entraide",
    description: "Donnez avec le cœur pour le développement local au Togo.",
    images: ["/logo.png"],
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
