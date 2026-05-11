import Link from "next/link";
import { ArrowRight, Globe, ShieldCheck, Zap } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-[95vh] flex items-center px-4 pt-40 pb-24 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-orange-50 via-white to-pink-50 font-sans">
      {/* Joyful Background Elements */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-20 left-10 text-4xl animate-float" style={{ animationDelay: '0s' }}>❤️</div>
        <div className="absolute top-40 right-20 text-3xl animate-float" style={{ animationDelay: '2s' }}>✨</div>
        <div className="absolute bottom-40 left-1/4 text-4xl animate-float" style={{ animationDelay: '1s' }}>😊</div>
        <div className="absolute top-1/2 right-1/4 text-2xl animate-float" style={{ animationDelay: '3s' }}>💖</div>
        <div className="absolute bottom-20 right-10 text-5xl animate-float" style={{ animationDelay: '1.5s' }}>🌟</div>
        <div className="absolute inset-0 kente-pattern opacity-5"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div className="text-left">
          {/* Animated Happiness Tag */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 text-primary mb-8 border border-primary/20 backdrop-blur-sm animate-slide-up shadow-sm">
            <span className="text-lg animate-bounce">🤝</span>
            <span className="text-xs font-black uppercase tracking-[0.2em]">L'entraide au service du Togo</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight mb-8 leading-[1.1] animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Soutenez-vous <br />
            <span className="text-primary italic font-serif">entre vous</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-600 mb-12 max-w-xl leading-relaxed animate-slide-up font-medium" style={{ animationDelay: '0.2s' }}>
            HOASSI est votre espace d'action solidaire. Donnez avec le cœur et participez ensemble au développement de projets de proximité. ❤️
          </p>

          <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Link href="/create-project" className="group w-full sm:w-auto px-10 py-5 rounded-full bg-gradient-to-r from-primary to-primary-dark text-white font-black text-lg shadow-2xl shadow-primary/30 transition-all hover:-translate-y-1 hover:scale-105 flex items-center justify-center gap-3">
              Lancer ma cagnotte
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <a href="#projets" className="w-full sm:w-auto px-10 py-5 rounded-full bg-white text-slate-700 font-black text-lg border-2 border-slate-100 shadow-xl shadow-slate-200/50 transition-all hover:bg-slate-50 hover:-translate-y-1 text-center flex items-center justify-center gap-2">
              Explorer ✨
            </a>
          </div>

          {/* Social Proof */}
          <div className="mt-16 flex items-center gap-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex -space-x-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-100 overflow-hidden shadow-sm">
                  <img src={`https://i.pravatar.cc/150?u=${i}`} alt="Avatar" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <p className="text-sm font-bold text-slate-500">
              <span className="text-primary font-black">+1,200</span> personnes rayonnantes nous rejoignent !
            </p>
          </div>
        </div>

        {/* Happy Visualizer */}
        <div className="hidden lg:block relative h-[600px] animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-primary/20 rounded-full blur-[100px]"></div>
          
          {/* Floating Happy Card 1 */}
          <div className="absolute top-10 right-0 p-8 w-80 animate-float backdrop-blur-xl bg-white/90 rounded-[40px] border border-white shadow-2xl shadow-primary/10 transform hover:scale-105 transition-transform cursor-default z-10">
            <div className="bg-primary/20 p-4 rounded-2xl w-fit mb-6 animate-bounce">
              <Zap className="text-primary w-8 h-8 fill-primary" />
            </div>
            <h3 className="text-slate-900 font-black text-2xl mb-2 tracking-tight">Vibrance</h3>
            <p className="text-slate-600 text-sm font-bold">Des dons instantanés qui changent des vies. ✨</p>
          </div>

          {/* Floating Happy Card 2 */}
          <div className="absolute bottom-10 left-0 p-8 w-80 animate-float backdrop-blur-xl bg-white/90 rounded-[40px] border border-white shadow-2xl shadow-primary/10 transform hover:scale-105 transition-transform cursor-default z-10" style={{ animationDelay: '-3s' }}>
            <div className="bg-accent/20 p-4 rounded-2xl w-fit mb-6">
              <ShieldCheck className="text-accent w-8 h-8 fill-accent" />
            </div>
            <h3 className="text-slate-900 font-black text-2xl mb-2 tracking-tight">Confiance</h3>
            <p className="text-slate-600 text-sm font-bold">Sécurité totale pour votre tranquillité d'esprit. ❤️</p>
          </div>

          {/* Centered Sun / Heart */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
             <div className="relative p-2 rounded-full bg-gradient-to-r from-primary to-accent animate-pulse">
                <div className="bg-white rounded-full p-10 flex flex-col items-center shadow-inner">
                  <span className="text-6xl mb-2">❤️</span>
                  <span className="text-primary font-black text-xs uppercase tracking-widest">Togo Solidaire</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
