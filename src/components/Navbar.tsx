import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full px-4 pt-6 transition-smooth">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl py-3 px-6 shadow-sm border border-slate-200">
        <div className="flex justify-between items-center h-12">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-3">
              <img src="/logo.png" alt="HOASSI Logo" className="w-8 h-8 object-contain" />
              <span className="text-2xl font-black text-primary tracking-tight">HOASSI</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-8 mr-4 text-sm font-bold text-slate-600">
              <Link href="/" className="hover:text-primary transition-smooth">Accueil</Link>
              <Link href="/influencer-signup" className="hover:text-primary transition-smooth">Créateurs</Link>
              <Link href="/login" className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-smooth">Se connecter</Link>
            </div>
            
            <Link 
              href="/create-project" 
              className="px-6 py-3 rounded-full bg-primary hover:bg-primary-dark text-white text-sm font-bold shadow-md shadow-primary/20 transition-smooth hover:-translate-y-0.5"
            >
              Créer ma cagnotte
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
