import prisma from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Breadcrumbs from "@/components/Breadcrumbs";
import { notFound } from "next/navigation";
import DonationForm from "./DonationForm";
import ShareProject from "./ShareProject";
import { Metadata } from "next";
import { ShieldCheck, Award, Users, Zap, CheckCircle2, Trophy, Clock } from "lucide-react";

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  
  if (!project) return { title: "Projet non trouvé" };

  return {
    title: `${project.title} | HOASSI Togo`,
    description: project.description.substring(0, 160) + "...",
    openGraph: {
      title: project.title,
      description: project.description.substring(0, 160),
      images: [project.image],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description.substring(0, 160),
      images: [project.image],
    }
  };
}

export default async function ProjectDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      donations: {
        where: { status: "COMPLETED" },
        orderBy: { amount: "desc" },
        take: 5
      }
    }
  });

  // Re-fetch all donations for the messages section separately to avoid issues with the Top Donors query
  const allDonations = await prisma.donation.findMany({
    where: { projectId: id, status: "COMPLETED" },
    orderBy: { createdAt: "desc" }
  });

  if (!project) {
    notFound();
  }

  const progress = Math.min(Math.round((project.raised / project.goal) * 100), 100);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <Breadcrumbs />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Colonne Principale: Image, Titre, Description, Commentaires */}
          <div className="lg:col-span-2 space-y-10">
            <div className="bg-white rounded-[40px] overflow-hidden shadow-sm border border-slate-200/60">
              <div className="relative h-[500px] w-full group">
                <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                
                <div className="absolute top-8 left-8 flex flex-wrap gap-3">
                  <span className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-white shadow-xl flex items-center gap-2">
                    <Zap className="w-3 h-3 fill-emerald-500" />
                    {project.category}
                  </span>
                  {project.approved && (
                    <span className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-white bg-emerald-500 shadow-xl shadow-emerald-500/20 flex items-center gap-2 border border-emerald-400">
                      <CheckCircle2 className="w-3 h-3" />
                      Vérifié
                    </span>
                  )}
                </div>
                
                <div className="absolute bottom-8 left-8 right-8">
                   <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-lg">
                      {project.title}
                   </h1>
                </div>
              </div>

              <div className="p-8 sm:p-12">
                <div className="flex flex-wrap items-center gap-6 mb-12">
                   <div className="flex items-center gap-4 p-2 pr-6 rounded-full bg-slate-50 border border-slate-100 shadow-sm">
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center font-black text-white shadow-lg shadow-primary/20 text-xl">
                        {project.fullname.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Organisateur</p>
                        <p className="text-slate-900 font-black">{project.fullname}</p>
                      </div>
                   </div>
                   
                   <div className="flex items-center gap-3 text-emerald-600 font-bold bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
                      <ShieldCheck className="w-5 h-5" />
                      <span className="text-xs uppercase tracking-wider">Fonds Protégés</span>
                   </div>
                </div>
                
                <div className="space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-1.5 bg-primary rounded-full"></div>
                    <h2 className="text-2xl font-black text-slate-900">L'histoire du projet</h2>
                  </div>
                  
                  <div className="prose prose-slate max-w-none whitespace-pre-wrap leading-relaxed text-lg text-slate-600 font-medium font-sans">
                    {project.description}
                  </div>
                </div>
                
                {project.socialLink && (
                  <div className="mt-16 p-8 rounded-[2.5rem] bg-slate-900 text-white relative overflow-hidden group">
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
                    <h3 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-4">Lien de confiance</h3>
                    <a href={project.socialLink} target="_blank" rel="noopener noreferrer" className="text-white hover:text-emerald-300 transition-colors font-black text-xl flex items-center gap-3 break-all">
                       Suivre l'actualité
                       <Zap className="w-5 h-5 fill-emerald-500 text-emerald-500" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Mots de Soutien (Commentaires) */}
            <div className="bg-white rounded-[40px] p-8 sm:p-12 shadow-sm border border-slate-200/60">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                   <div className="h-8 w-1.5 bg-amber-500 rounded-full"></div>
                   <h2 className="text-2xl font-black text-slate-900">Mots de soutien</h2>
                </div>
                <span className="text-sm font-black bg-slate-100 px-4 py-1.5 rounded-full text-slate-600 shadow-sm border border-slate-200">
                  {allDonations.filter((d: any) => d.message).length}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {allDonations.filter((d: any) => d.message).length === 0 ? (
                  <div className="col-span-2 py-16 text-center bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <Users className="w-8 h-8 text-slate-300" />
                    </div>
                    <p className="text-slate-500 italic font-bold">Encouragez l'organisateur avec un message.</p>
                  </div>
                ) : (
                  allDonations.filter((d: any) => d.message).map((donation: any) => (
                    <div key={donation.id} className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all hover:border-emerald-100">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center font-black text-primary text-xl border border-emerald-100">
                          {(donation.publicName || "A").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-black text-slate-900">{donation.publicName || "Donateur Anonyme"}</p>
                          <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">
                            A donné {formatCurrency(donation.amount)}
                          </p>
                        </div>
                      </div>
                      <p className="text-slate-600 leading-relaxed italic text-sm font-medium">
                        "{donation.message}"
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Colonne Latérale: Stats, Bouton Don */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-[40px] p-8 sm:p-10 shadow-xl border border-slate-200/60 sticky top-32 overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                 <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center animate-pulse">
                    <ShieldCheck className="w-6 h-6 text-emerald-500" />
                 </div>
              </div>

              <div className="mb-10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Progression</p>
                <div className="flex items-end gap-2 mb-6">
                  <span className="text-5xl font-black text-slate-900 tracking-tighter">
                    {progress}%
                  </span>
                </div>
                
                <div className="relative w-full bg-slate-100 rounded-full h-3 mb-6 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-primary transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(16,185,129,0.4)]" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                   <div className="flex flex-col">
                      <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Récolté</span>
                      <span className="text-slate-900 font-black">{formatCurrency(project.raised)}</span>
                   </div>
                   <div className="flex flex-col items-end">
                      <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Objectif</span>
                      <span className="text-slate-900 font-black">{formatCurrency(project.goal)}</span>
                   </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100 group hover:bg-white hover:shadow-md transition-all">
                  <Users className="w-5 h-5 text-primary mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Donateurs</p>
                  <p className="text-slate-900 font-black text-2xl">{project.donorsCount}</p>
                </div>
                <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100 group hover:bg-white hover:shadow-md transition-all">
                  <Clock className="w-5 h-5 text-amber-500 mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Restant</p>
                  <p className="text-slate-900 font-black text-2xl">{project.daysLeft}j</p>
                </div>
              </div>

              {/* Formulaire de don (Client Component) */}
              <div className="mb-8">
                 <DonationForm projectId={project.id} />
              </div>
              
              {/* Partage Social */}
              <ShareProject title={project.title} id={project.id} />
            </div>

            {/* Top Donors Section */}
            {project.donations.length > 0 && (
              <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary rounded-full blur-[80px] opacity-20"></div>
                
                <h3 className="text-lg font-black mb-6 flex items-center gap-3">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  Top Bienfaiteurs
                </h3>
                
                <div className="space-y-4">
                  {project.donations.map((d: any, index: number) => (
                    <div key={d.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                         <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black ${index === 0 ? "bg-amber-400 text-slate-900" : "bg-white/10"}`}>
                            #{index + 1}
                         </span>
                         <span className="text-sm font-bold truncate max-w-[100px]">{d.publicName || "Anonyme"}</span>
                      </div>
                      <span className="text-sm font-black text-emerald-400">{formatCurrency(d.amount)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 pt-6 border-t border-white/10 text-center">
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Rejoignez le top 5 en donnant maintenant</p>
                </div>
              </div>
            )}
          </div>
          
        </div>
      </main>
    </div>
  );
}
