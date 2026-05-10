import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HomeClient from "@/components/HomeClient";
import prisma from "@/lib/prisma";
import Link from "next/link";
import PromoPopup from "@/components/PromoPopup";
import { Zap, ShieldCheck, Heart, ArrowRight, CheckCircle2, TrendingUp, Users } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const projects = await prisma.project.findMany({
    where: { approved: true },
    orderBy: { createdAt: "desc" },
  });

  // Simulation de stats pour l'impact (en production, faire des agrégations Prisma)
  const stats = {
    totalRaised: projects.reduce((acc, p) => acc + p.raised, 0) + 1250000, // + simulation
    activeDonors: projects.reduce((acc, p) => acc + p.donorsCount, 0) + 450,
    projectsCount: projects.length + 12
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />
      <PromoPopup />
      
      <main className="flex-grow">
        <Hero />

        {/* Section Stats Impact - Nouveau */}
        <section className="relative -mt-16 z-20 max-w-5xl mx-auto px-4">
          <div className="bg-white rounded-[32px] shadow-2xl shadow-slate-900/10 border border-slate-100 p-8 sm:p-12 grid grid-cols-1 md:grid-cols-3 gap-8 md:divide-x divide-slate-100">
             <div className="flex flex-col items-center text-center">
                <div className="text-4xl font-black text-slate-900 mb-2 font-serif">
                  {new Intl.NumberFormat('fr-FR').format(stats.totalRaised)} <span className="text-sm">XOF</span>
                </div>
                <div className="text-xs font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                   <TrendingUp className="w-3 h-3" /> Total Collecté
                </div>
             </div>
             <div className="flex flex-col items-center text-center px-4">
                <div className="text-4xl font-black text-slate-900 mb-2 font-serif">{stats.activeDonors}+</div>
                <div className="text-xs font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                   <Users className="w-3 h-3" /> Donateurs Actifs
                </div>
             </div>
             <div className="flex flex-col items-center text-center px-4">
                <div className="text-4xl font-black text-slate-900 mb-2 font-serif">{stats.projectsCount}</div>
                <div className="text-xs font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                   <Zap className="w-3 h-3 fill-emerald-500" /> Projets Réussis
                </div>
             </div>
          </div>
        </section>
        
        {/* Section Projets avec Filtres Interactifs */}
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

        {/* Section: Comment ça marche - Nouveau */}
        <section className="py-32 bg-slate-900 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-amber-500 to-emerald-500"></div>
          <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-500/5 blur-[120px] rounded-full"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-4xl sm:text-6xl font-black text-white mb-6 tracking-tight">
                La solidarité, <span className="text-emerald-400">en 3 étapes</span>
              </h2>
              <p className="text-slate-400 text-lg font-medium max-w-2xl mx-auto">
                Pas de paperasse inutile. Une transparence totale pour un impact immédiat au cœur de nos communautés.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { 
                  step: "01", 
                  title: "Lancez", 
                  desc: "Créez votre cagnotte en 2 minutes avec votre pièce d'identité.",
                  icon: <Zap className="w-8 h-8 text-emerald-400" />
                },
                { 
                  step: "02", 
                  title: "Partagez", 
                  desc: "Diffusez votre lien unique sur WhatsApp, Facebook et TikTok.",
                  icon: <TrendingUp className="w-8 h-8 text-amber-400" />
                },
                { 
                  step: "03", 
                  title: "Récoltez", 
                  desc: "Recevez les fonds directement sur votre compte T-Money ou Moov.",
                  icon: <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                }
              ].map((item, i) => (
                <div key={i} className="relative group">
                  <div className="text-[120px] font-black text-white/5 absolute -top-20 -left-4 pointer-events-none group-hover:text-emerald-500/10 transition-colors">
                    {item.step}
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-10 rounded-[40px] hover:bg-white/10 transition-all hover:-translate-y-2">
                    <div className="mb-6 p-4 bg-slate-800 rounded-2xl w-fit shadow-lg">
                      {item.icon}
                    </div>
                    <h3 className="text-2xl font-black text-white mb-4">{item.title}</h3>
                    <p className="text-slate-400 font-medium leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Espace Influenceurs / Créateurs - Redessiné */}
        <section className="py-32 bg-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-emerald-50 rounded-[50px] p-8 sm:p-20 relative overflow-hidden border border-emerald-100">
              <div className="absolute top-0 right-0 p-12 opacity-10">
                 <ShieldCheck className="w-64 h-64 text-emerald-500" />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-black uppercase tracking-widest mb-8">
                    Opportunité Créateurs
                  </div>
                  <h2 className="text-4xl sm:text-6xl font-black text-slate-900 mb-8 leading-tight tracking-tighter">
                    Vivez de votre <br />
                    <span className="text-emerald-500 italic font-serif">passion</span>
                  </h2>
                  <p className="text-slate-600 text-xl mb-12 leading-relaxed font-medium">
                    HOASSI permet à vos fans de vous soutenir instantanément via Mobile Money. C'est simple, local et sans frais cachés.
                  </p>
                  <Link href="/influencer-signup" className="group inline-flex items-center gap-4 px-10 py-5 bg-slate-900 text-white font-black rounded-full hover:bg-slate-800 transition-all shadow-2xl hover:shadow-emerald-500/20">
                    Démarrer ma page VIP
                    <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-2" />
                  </Link>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                   {[
                    { label: "Paiement", value: "Instant", icon: <Zap className="w-5 h-5" /> },
                    { label: "Sécurité", value: "Vérifiée", icon: <ShieldCheck className="w-5 h-5" /> },
                    { label: "Soutien", value: "Local", icon: <Heart className="w-5 h-5" /> },
                    { label: "Retrait", value: "Libre", icon: <TrendingUp className="w-5 h-5" /> }
                  ].map((stat, i) => (
                    <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-emerald-100 flex flex-col items-center text-center group hover:scale-105 transition-transform">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 mb-4 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                        {stat.icon}
                      </div>
                      <div className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</div>
                      <div className="text-2xl font-black text-slate-900">{stat.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="text-3xl font-black text-emerald-600 tracking-tighter">HOASSI</div>
              <p className="text-slate-400 font-bold max-w-xs text-center md:text-left leading-relaxed">
                Innover pour la solidarité africaine. Propulsé par la technologie, guidé par l'humain.
              </p>
            </div>
            
            <div className="flex flex-col items-center md:items-end gap-6">
              <div className="flex gap-8">
                 <Link href="/support" className="text-sm font-black text-slate-600 hover:text-emerald-500 transition-colors uppercase tracking-widest">Support</Link>
                 <Link href="/login" className="text-sm font-black text-slate-600 hover:text-emerald-500 transition-colors uppercase tracking-widest">Admin</Link>
              </div>
              <div className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">
                © 2026 DIGITALH AGENCY • TOGO
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

