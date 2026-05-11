import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";
import Breadcrumbs from "@/components/Breadcrumbs";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect("/login");
  }

  // Récupérer l'utilisateur
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      projects: {
        include: {
          donations: true
        },
        orderBy: { createdAt: "desc" }
      },
      influencer: {
        include: {
          donations: true
        }
      }
    }
  });

  if (!user) {
    redirect("/login");
  }

  // Récupérer l'historique des retraits pour cet utilisateur
  // On récupère les retraits dont le referenceId est l'un des projets ou l'influenceur de l'utilisateur
  const projectIds = user.projects.map(p => p.id);
  const influencerId = user.influencer?.id;
  
  const withdrawals = await prisma.withdrawal.findMany({
    where: {
      OR: [
        { referenceId: { in: projectIds } },
        { referenceId: influencerId || "none" }
      ]
    },
    orderBy: { createdAt: "desc" }
  });

  // Calculer les statistiques globales
  const totalRaised = user.projects.reduce((acc, p) => acc + p.raised, 0);
  const totalDonors = user.projects.reduce((acc, p) => acc + p.donorsCount, 0);

  return (
    <main className="min-h-screen bg-slate-50 pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Breadcrumbs />
        <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Tableau de bord</h1>
            <p className="text-slate-500 font-medium mt-1">Bienvenue, {user.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 uppercase tracking-widest">Compte {user.role}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Collecté (Brut)</p>
            <h3 className="text-3xl font-black text-slate-900">{new Intl.NumberFormat('fr-FR').format(totalRaised)} XOF</h3>
          </div>
          <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm relative overflow-hidden group border-primary/10 bg-gradient-to-br from-white to-orange-50/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>
            <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Net à Percevoir (Estimé)</p>
            <h3 className="text-3xl font-black text-primary">{new Intl.NumberFormat('fr-FR').format(totalRaised * 0.95)} XOF</h3>
          </div>
          <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Nombre de Soutiens</p>
            <h3 className="text-3xl font-black text-slate-900">{totalDonors}</h3>
          </div>
        </div>

        <DashboardClient user={user} projects={user.projects} withdrawals={withdrawals} />
      </div>
    </main>
  );
}
