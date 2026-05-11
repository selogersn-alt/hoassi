"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, PlusCircle, LogIn } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? "bg-white/80 backdrop-blur-xl border-b border-slate-200 py-3 shadow-sm" 
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-3">
              <img src="/logo.png" alt="HOASSI Logo" className="w-9 h-9 object-contain" />
              <span className={`text-2xl font-black tracking-tight transition-colors ${
                isScrolled ? "text-primary" : "text-slate-900"
              }`}>
                HOASSI ❤️
              </span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-8 text-sm font-bold text-slate-600">
              <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
              <Link href="/influencer-signup" className="hover:text-primary transition-colors">Créateurs</Link>
              <Link 
                href="/login" 
                className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all active:scale-95"
              >
                <LogIn className="w-4 h-4" />
                Se connecter
              </Link>
            </div>
            
            <Link 
              href="/create-project" 
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary hover:bg-primary-dark text-white text-sm font-black shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              Créer ma cagnotte
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-slate-600 hover:text-primary transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div className={`md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 transition-all duration-300 origin-top ${
        isMobileMenuOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 pointer-events-none"
      }`}>
        <div className="px-6 py-8 flex flex-col gap-6">
          <Link href="/" className="text-lg font-bold text-slate-900" onClick={() => setIsMobileMenuOpen(false)}>Accueil</Link>
          <Link href="/influencer-signup" className="text-lg font-bold text-slate-900" onClick={() => setIsMobileMenuOpen(false)}>Créateurs</Link>
          <Link href="/login" className="text-lg font-bold text-slate-900" onClick={() => setIsMobileMenuOpen(false)}>Se connecter</Link>
          <Link 
            href="/create-project" 
            className="w-full text-center px-6 py-4 rounded-2xl bg-primary text-white text-lg font-black"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Créer ma cagnotte
          </Link>
        </div>
      </div>
    </nav>
  );
}
