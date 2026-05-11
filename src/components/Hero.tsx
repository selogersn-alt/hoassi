import Link from "next/link";
import { ArrowRight, Globe, ShieldCheck, Zap } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center px-4 pt-40 pb-24 sm:px-6 lg:px-8 overflow-hidden bg-slate-900 font-sans">
      {/* Premium Background with Image and Patterns */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/hero-bg.png" 
          alt="Lomé, Togo" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900"></div>
        <div className="absolute inset-0 kente-pattern opacity-10"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div className="text-left">
          {/* Animated Premium Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-500 mb-8 border border-amber-500/20 backdrop-blur-sm animate-slide-up">
            <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.8)] animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-500">Le Crowdfunding d'Excellence au Togo</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-8 leading-[1.1] animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Donnez du souffle <br />
            à vos <span className="font-serif italic text-amber-500">ambitions</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-300 mb-12 max-w-xl leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
            HOASSI est la plateforme de confiance pour financer vos projets au Togo. 
            Sécurisé, local et optimisé pour un impact maximal.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Link href="/create-project" className="group w-full sm:w-auto px-8 py-4 rounded-full bg-emerald-500 text-white font-bold text-lg shadow-xl shadow-emerald-500/20 transition-all hover:bg-emerald-400 hover:-translate-y-1 flex items-center justify-center gap-2">
              Lancer mon projet
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <a href="#projets" className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 text-white font-bold text-lg border border-white/10 backdrop-blur-md transition-all hover:bg-white/10 hover:-translate-y-1 text-center">
              Explorer les cagnottes
            </a>
          </div>

          {/* Local Trust Badges */}
          <div className="mt-16 flex items-center gap-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex flex-col gap-1">
              <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Modes de paiement locaux & internationaux</span>
              <div className="flex items-center gap-8 opacity-80 filter brightness-200 mt-2">
                <span className="text-xl font-black text-white tracking-widest">MIXX</span>
                <span className="text-xl font-black text-white tracking-widest">MOOV</span>
                <span className="text-xl font-black text-white tracking-widest">VISA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Impact Visualizer / Floating Cards */}
        <div className="hidden lg:block relative h-[600px] animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]"></div>
          
          {/* Floating Premium Card 1 */}
          <div className="absolute top-20 right-0 p-6 w-72 animate-float backdrop-blur-xl bg-white/95 rounded-[32px] border border-slate-200 shadow-2xl transform hover:scale-105 transition-transform cursor-default z-10">
            <div className="bg-amber-100 p-3 rounded-2xl w-fit mb-4">
              <Zap className="text-amber-500 w-6 h-6" />
            </div>
            <h3 className="text-slate-900 font-extrabold text-xl mb-1 tracking-tight">Impact Direct</h3>
            <p className="text-slate-600 text-sm font-medium">Financement rapide via Mixx by Yas.</p>
          </div>

          {/* Floating Premium Card 2 */}
          <div className="absolute bottom-20 left-0 p-6 w-72 animate-float backdrop-blur-xl bg-white/95 rounded-[32px] border border-slate-200 shadow-2xl transform hover:scale-105 transition-transform cursor-default z-10" style={{ animationDelay: '-3s' }}>
            <div className="bg-emerald-100 p-3 rounded-2xl w-fit mb-4">
              <ShieldCheck className="text-emerald-500 w-6 h-6" />
            </div>
            <h3 className="text-slate-900 font-extrabold text-xl mb-1 tracking-tight">100% Sécurisé</h3>
            <p className="text-slate-600 text-sm font-medium">Transparence totale et vérification KYC rigoureuse.</p>
          </div>

          {/* Centered Stats */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
             <div className="inline-block p-1 rounded-full bg-gradient-to-r from-emerald-500 to-amber-500">
                <div className="bg-slate-900 rounded-full p-8 flex flex-col items-center">
                  <span className="text-5xl font-black text-white mb-2 font-serif">98%</span>
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-widest text-center">Taux d'impact <br/> communautaire</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
