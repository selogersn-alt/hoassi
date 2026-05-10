import prisma from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminDashboardClient from "./AdminDashboardClient";

export const metadata: Metadata = {
  title: "Administration | HOASSI",
};

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "ADMIN" && (session.user as any).role !== "SUPERADMIN") {
    redirect("/admin/login");
  }

  // Initial load projects (all, not just pending for the new dashboard)
  const allProjects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" }
  });

  const totalRaised = await prisma.project.aggregate({
    _sum: { raised: true }
  });

  const allInfluencers = await prisma.influencer.findMany({
    orderBy: { createdAt: "desc" }
  });

  const influencersCount = allInfluencers.length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(amount);
  };

  const initialData = {
    pendingProjects: allProjects,
    influencers: allInfluencers,
    totalRaised: totalRaised._sum.raised || 0,
    influencersCount
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Panneau d'Administration</h1>
            <p className="text-slate-500 font-medium mt-1">Gérez les inscriptions, cagnottes et publicités.</p>
          </div>
          <div className="flex gap-4">
             <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-200">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Total Collecté</span>
                <span className="text-xl font-black text-emerald-600">{formatCurrency(initialData.totalRaised)}</span>
             </div>
          </div>
        </div>

        <AdminDashboardClient initialData={initialData} />
      </main>
    </div>
  );
}
