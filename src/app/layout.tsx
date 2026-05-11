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
    default: "HOASSI | Crowdfunding & Solidarité au Togo 🇹🇬",
    template: "%s | HOASSI"
  },
  description: "La plateforme de crowdfunding n°1 au Togo. Soutenez des projets locaux, financez l'éducation et la santé via T-Money et Moov Money en toute sécurité.",
  keywords: ["Crowdfunding Togo", "Don Togo", "T-Money", "Moov Money", "Cagnotte solidaire Togo", "Entraide Togo", "Digitalh", "Investissement Togo", "Soutien créateurs Togo", "Financement participatif Afrique"],
  openGraph: {
    type: "website",
    locale: "fr_TG",
    url: "https://hoassi.digitalh.net",
    title: "HOASSI | Excellence Crowdfunding Togo",
    description: "Financez l'avenir du Togo. Soutenez des projets et créateurs locaux en quelques clics.",
    siteName: "HOASSI",
    images: [
      {
        url: "/logo.png", // Next.js utilisera metadataBase pour en faire une URL absolue
        width: 800,
        height: 800,
        alt: "HOASSI Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HOASSI | Crowdfunding Togo",
    description: "Soutenez l'innovation et la solidarité au Togo.",
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
