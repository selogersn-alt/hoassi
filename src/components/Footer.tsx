import Link from "next/link";
import { ShieldCheck, AlertTriangle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-20 px-4 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img src="/logo.png" alt="HOASSI" className="w-8 h-8 object-contain brightness-0 invert" />
              <span className="text-2xl font-black text-white tracking-tight">HOASSI</span>
            </div>
            <p className="text-slate-500 font-medium leading-relaxed max-w-sm mb-8">
              La plateforme de crowdfunding référence au Togo. Unissons nos forces pour bâtir un avenir solidaire.
            </p>
            <div className="flex items-center gap-4 text-emerald-500">
               <ShieldCheck className="w-6 h-6" />
               <span className="text-xs font-black uppercase tracking-[0.2em]">100% Sécurisé par Digitalh</span>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-6">Plateforme</h4>
            <ul className="space-y-4 font-bold text-sm">
              <li><Link href="/" className="hover:text-emerald-500 transition-colors">Accueil</Link></li>
              <li><Link href="/create-project" className="hover:text-emerald-500 transition-colors">Créer une cagnotte</Link></li>
              <li><Link href="/influencer-signup" className="hover:text-emerald-500 transition-colors">Espace Créateurs</Link></li>
              <li><Link href="/login" className="hover:text-emerald-500 transition-colors">Se connecter</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-6">Légal & Éthique</h4>
            <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5">
               <div className="flex items-center gap-2 text-amber-500 mb-2">
                 <AlertTriangle className="w-4 h-4" />
                 <span className="text-[10px] font-black uppercase">Charte d'Utilisation</span>
               </div>
               <p className="text-[10px] leading-relaxed text-slate-500">
                 Interdiction stricte des cagnottes à des fins <span className="text-slate-300">politiques, électorales, blanchiment d'argent</span> ou issues de crimes. Tout abus sera signalé.
               </p>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
            © 2026 HOASSI - Propulsé par Digitalh. Tous droits réservés.
          </p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest">
             <Link href="#" className="hover:text-white">Confidentialité</Link>
             <Link href="#" className="hover:text-white">CGU</Link>
             <Link href="#" className="hover:text-white">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
