import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HomeClient from "@/components/HomeClient";
import prisma from "@/lib/prisma";
import PromoPopup from "@/components/PromoPopup";
import { Zap, ShieldCheck, Heart, ArrowRight, CheckCircle2, TrendingUp, Users } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const projects = await prisma.project.findMany({
    where: { approved: true },
    orderBy: { createdAt: "desc" },
  });

  // Simulation de stats pour l'impact
  const stats = {
    totalRaised: projects.reduce((acc, p) => acc + p.raised, 0) + 1250000, 
    activeDonors: projects.reduce((acc, p) => acc + p.donorsCount, 0) + 450,
    projectsCount: projects.length + 12
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <Navbar />
      <PromoPopup />
      
      <main className="flex-grow">
        <Hero />

        {/* Section Stats Impact */}
        <section className="relative -mt-16 z-20 max-w-5xl mx-auto px-4">
          <div className="bg-white rounded-[40px] shadow-2xl shadow-primary/10 border border-orange-100 p-8 sm:p-12 grid grid-cols-1 md:grid-cols-3 gap-8 md:divide-x divide-orange-100">
             <div className="flex flex-col items-center text-center">
                <div className="text-4xl font-black text-slate-900 mb-2 font-serif">
                  {new Intl.NumberFormat('fr-FR').format(stats.totalRaised)} <span className="text-sm">XOF</span>
                </div>
                <div className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-2">
                   <TrendingUp className="w-4 h-4" /> Amour Partagé
                </div>
             </div>
             <div className="flex flex-col items-center text-center px-4">
                <div className="text-4xl font-black text-slate-900 mb-2 font-serif">{stats.activeDonors}+</div>
                <div className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-2">
                   <Users className="w-4 h-4" /> Cœurs Solidaires
                </div>
             </div>
             <div className="flex flex-col items-center text-center px-4">
                <div className="text-4xl font-black text-slate-900 mb-2 font-serif">{stats.projectsCount}</div>
                <div className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-2">
                   <Zap className="w-4 h-4 fill-primary" /> Rêves Réalisés
                </div>
             </div>
          </div>
        </section>
        
        {/* Section Projets */}
        <HomeClient initialProjects={projects.map(p => ({
          ...p,
          id: p.id,
          title: p.title,
          category: p.category,
          goal: p.goal,
          raised: p.raised,
          image: p.image,
          fullname: p.fullname,
          donorsCount: p.donorsCount,
          daysLeft: p.daysLeft
        }))} />

        {/* Section: Comment ça marche */}
        <section className="py-32 bg-gradient-to-b from-white to-orange-50/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-4xl sm:text-6xl font-black text-slate-900 mb-6 tracking-tight">
                La solidarité, <span className="text-primary">en 3 étapes joyeuses</span> ❤️
              </h2>
              <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">
                Parce que donner doit être un plaisir, nous avons simplifié chaque étape pour vous.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { 
                  step: "01", 
                  title: "Lancez", 
                  desc: "Créez votre cagnotte avec le sourire en seulement 2 minutes.",
                  icon: <Zap className="w-8 h-8 text-primary" />
                },
                { 
                  step: "02", 
                  title: "Partagez", 
                  desc: "Diffusez votre lien unique et récoltez des ondes positives.",
                  icon: <TrendingUp className="w-8 h-8 text-accent" />
                },
                { 
                  step: "03", 
                  title: "Récoltez", 
                  desc: "Recevez vos fonds et réalisez ce qui vous tient à cœur.",
                  icon: <CheckCircle2 className="w-8 h-8 text-primary" />
                }
              ].map((item, i) => (
                <div key={i} className="relative group">
                  <div className="text-[120px] font-black text-primary/5 absolute -top-20 -left-4 pointer-events-none group-hover:text-primary/10 transition-colors">
                    {item.step}
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm border border-orange-100 p-10 rounded-[40px] hover:bg-white transition-all hover:-translate-y-2 shadow-sm hover:shadow-xl hover:shadow-primary/5">
                    <div className="mb-6 p-4 bg-orange-50 rounded-2xl w-fit shadow-sm">
                      {item.icon}
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-4">{item.title}</h3>
                    <p className="text-slate-500 font-medium leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Espace Influenceurs */}
        <section className="py-32 bg-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-[60px] p-8 sm:p-20 relative overflow-hidden border border-primary/10">
              <div className="absolute top-0 right-0 p-12 opacity-5">
                 <Heart className="w-64 h-64 text-primary" />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-8">
                    ✨ Communauté Créative
                  </div>
                  <h2 className="text-4xl sm:text-6xl font-black text-slate-900 mb-8 leading-tight tracking-tighter">
                    Vivez de votre <br />
                    <span className="text-primary italic font-serif">passion lumineuse</span>
                  </h2>
                  <p className="text-slate-600 text-xl mb-12 leading-relaxed font-medium">
                    HOASSI permet à vos fans de vous soutenir avec amour via Mobile Money. C'est simple, local et surtout, c'est du pur bonheur ! 🌟
                  </p>
                  <Link href="/influencer-signup" className="group inline-flex items-center gap-4 px-10 py-5 bg-primary text-white font-black rounded-full hover:bg-primary-dark transition-all shadow-2xl shadow-primary/20 hover:-translate-y-1">
                    Démarrer ma page VIP
                    <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-2" />
                  </Link>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                   {[
                    { label: "Paiement", value: "Rapide", icon: <Zap className="w-5 h-5" /> },
                    { label: "Sécurité", value: "Sereine", icon: <ShieldCheck className="w-5 h-5" /> },
                    { label: "Soutien", value: "Chaleureux", icon: <Heart className="w-5 h-5" /> },
                    { label: "Retrait", value: "Libre", icon: <TrendingUp className="w-5 h-5" /> }
                  ].map((stat, i) => (
                    <div key={i} className="bg-white p-8 rounded-[32px] shadow-sm border border-primary/5 flex flex-col items-center text-center group hover:scale-105 transition-transform">
                      <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                        {stat.icon}
                      </div>
                      <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</div>
                      <div className="text-2xl font-black text-slate-900">{stat.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

