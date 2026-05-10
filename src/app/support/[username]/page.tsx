import prisma from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import { notFound } from "next/navigation";
import InfluencerDonationForm from "./InfluencerDonationForm";

export const dynamic = 'force-dynamic';

export default async function InfluencerSupportPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const influencer = await prisma.influencer.findUnique({
    where: { username },
    include: {
      donations: {
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!influencer) {
    notFound();
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="min-h-screen flex flex-col bg-mesh">
      <Navbar />
      
      <main className="flex-grow py-32 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        
        {/* En-tête de profil Futuriste */}
        <div className="glass rounded-[40px] overflow-hidden shadow-2xl border border-white/10 mb-12 relative animate-float">
          <div className="h-48 w-full bg-gradient-to-r from-primary/30 via-secondary/20 to-accent/30"></div>
          
          <div className="px-10 pb-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-24 sm:-mt-20 mb-8 gap-8 relative z-10">
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-primary to-accent rounded-full blur opacity-50 group-hover:opacity-100 transition duration-1000"></div>
                <img src={influencer.image} alt={influencer.fullname} className="relative w-40 h-40 rounded-full border-4 border-midnight object-cover bg-midnight shadow-2xl" />
              </div>
              <div className="text-center sm:text-left flex-grow">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-3">
                  Certified Creator
                </div>
                <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tighter mb-2 uppercase">{influencer.fullname}</h1>
                <p className="text-slate-500 font-bold tracking-widest text-xs uppercase">Protocol ID: <span className="text-slate-300">hoassi.tg/support/{influencer.username}</span></p>
              </div>
              {influencer.socialLink && (
                <a href={influencer.socialLink} target="_blank" rel="noopener noreferrer" className="sm:ml-auto py-4 px-8 glass-dark hover:bg-white text-white hover:text-midnight font-black rounded-2xl transition-smooth text-sm border border-white/10 uppercase tracking-widest">
                  Explore Hub ↗
                </a>
              )}
            </div>
            
            <div className="prose prose-invert text-slate-400 max-w-none whitespace-pre-wrap text-center sm:text-left leading-relaxed text-xl italic font-medium">
              "{influencer.bio}"
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Colonne de gauche: Formulaire de don */}
          <div>
            <div className="glass rounded-[40px] p-8 sm:p-10 shadow-3xl border border-white/10 sticky top-32 overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[60px]"></div>
              <h2 className="text-2xl font-black text-white mb-8 tracking-tighter uppercase">Propulser le contenu</h2>
              <InfluencerDonationForm influencerId={influencer.id} username={influencer.username} />
            </div>
          </div>
          
          {/* Colonne de droite: Stats & Mots de soutien */}
          <div className="space-y-12">
            <div className="glass rounded-[40px] p-10 text-white shadow-2xl border border-white/10 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-smooth"></div>
              <h3 className="text-[10px] font-bold text-slate-500 mb-4 uppercase tracking-[0.3em]">Total Community Support</h3>
              <div className="text-6xl font-black mb-4 tracking-tighter text-gradient">{new Intl.NumberFormat('fr-FR').format(influencer.raised)} <span className="text-xl font-medium text-slate-500">XOF</span></div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Propulsé par {influencer.donorsCount} membres de l'élite</p>
            </div>
          
            <div className="glass rounded-[40px] p-10 shadow-2xl border border-white/10">
              <h2 className="text-2xl font-black text-white mb-10 tracking-tighter flex items-center gap-4 uppercase">
                Inbox de soutien
                <span className="text-xs font-bold bg-white/5 px-3 py-1 rounded-full text-slate-500">
                  {influencer.donations.filter((d: any) => d.message).length}
                </span>
              </h2>
              
              <div className="space-y-8">
                {influencer.donations.filter((d: any) => d.message).length === 0 ? (
                  <div className="py-12 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
                    <p className="text-slate-500 italic text-sm">Prêt pour le premier signal de soutien ?</p>
                  </div>
                ) : (
                  influencer.donations.filter((d: any) => d.message).map((donation: any) => (
                    <div key={donation.id} className="p-6 rounded-3xl hover:bg-white/5 transition-smooth border border-transparent hover:border-white/5">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center font-black text-slate-300 border-white/10">
                          {(donation.publicName || "A").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-black text-white text-lg uppercase tracking-tight">{donation.publicName || "Anonyme"}</p>
                          <p className="text-[10px] text-slate-500 font-bold tracking-widest">
                            +{formatCurrency(donation.amount)} • {new Date(donation.createdAt).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                      </div>
                      <p className="text-slate-400 leading-relaxed italic border-l-2 border-primary/30 pl-6 ml-6">
                        "{donation.message}"
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
