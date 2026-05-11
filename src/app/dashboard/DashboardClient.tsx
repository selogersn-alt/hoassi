"use client";

import { useState } from "react";
import { CheckCircle, AlertTriangle, Clock, CreditCard, ExternalLink, MoreVertical } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function DashboardClient({ user, projects, withdrawals }: { user: any, projects: any[], withdrawals: any[] }) {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("my-projects");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    method: "TMONEY",
    destination: "",
    referenceId: projects[0]?.id || ""
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(amount);
  };

  const handleWithdrawalRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch("/api/withdrawals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          amount: Number(formData.amount),
          type: "PROJECT" 
        })
      });

      if (res.ok) {
        alert("Demande de retrait envoyée avec succès !");
        window.location.reload();
      } else {
        const data = await res.json();
        alert(data.error || "Erreur lors de la demande");
      }
    } catch (error) {
      alert("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[40px] shadow-sm border border-slate-200 overflow-hidden">
      <div className="flex border-b border-slate-100 p-2 sm:p-4 bg-slate-50/50">
        <button 
          onClick={() => setActiveTab("my-projects")}
          className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === "my-projects" ? "bg-primary text-white shadow-xl shadow-primary/20" : "text-slate-500 hover:text-slate-900"}`}
        >
          Mes cagnottes
        </button>
        <button 
          onClick={() => setActiveTab("payouts")}
          className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === "payouts" ? "bg-primary text-white shadow-xl shadow-primary/20" : "text-slate-500 hover:text-slate-900"}`}
        >
          Retraits
        </button>
      </div>

      <div className="p-4 sm:p-8">
        {activeTab === "my-projects" && (
          <div className="space-y-6">
            {projects.length === 0 ? (
              <div className="text-center py-20 px-4 bg-slate-50 rounded-[32px] border border-dashed border-slate-300">
                <h3 className="text-xl font-bold text-slate-800 mb-4 tracking-tight">Vous n'avez pas encore de cagnotte active</h3>
                <Link href="/create-project" className="inline-block px-8 py-4 bg-primary text-white rounded-full font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:-translate-y-1 transition-transform">Lancer ma première cagnotte</Link>
              </div>
            ) : (
              <div className="grid gap-6">
                {projects.map((project: any) => (
                  <div key={project.id} className="group p-6 sm:p-8 bg-slate-50 rounded-[32px] border border-slate-200 hover:border-primary/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-md flex-shrink-0 group-hover:scale-105 transition-transform">
                        <img src={project.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-black text-slate-900 tracking-tight">{project.title}</h3>
                          {project.approved ? (
                            <span className="flex items-center gap-1 text-[10px] font-black text-primary uppercase tracking-widest"><CheckCircle className="w-3 h-3" /> Actif</span>
                          ) : (
                            <span className="flex items-center gap-1 text-[10px] font-black text-amber-600 uppercase tracking-widest"><Clock className="w-3 h-3" /> Modération</span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                           <span className="text-primary">{formatCurrency(project.raised)}</span>
                           <span className="text-slate-200">/</span>
                           <span>Objectif: {formatCurrency(project.goal)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Link href={`/project/${project.id}`} className="px-5 py-3 bg-white text-slate-900 font-black text-[10px] uppercase tracking-widest rounded-xl border border-slate-200 hover:bg-slate-50 shadow-sm flex items-center gap-2">
                         <ExternalLink className="w-4 h-4" /> Voir le lien
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "payouts" && (
           <div className="max-w-4xl mx-auto py-8">
              {!showForm ? (
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary/10 text-primary rounded-[24px] flex items-center justify-center mx-auto mb-6">
                    <CreditCard className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Centre de Retraits</h3>
                  <p className="text-slate-500 font-medium mb-10 leading-relaxed">Les fonds sont disponibles pour un retrait dès que votre cagnotte a reçu des dons.</p>
                  
                  <div className="p-8 bg-slate-900 rounded-[32px] text-left border border-white/5 shadow-2xl relative overflow-hidden mb-12">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full -mr-24 -mt-24 blur-3xl"></div>
                    <div className="relative z-10">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Solde Net Global (Estimé)</p>
                      <h4 className="text-4xl font-black text-white mb-8 tracking-tighter">
                        {formatCurrency(projects.reduce((acc, p) => acc + p.raised, 0) * 0.95)}
                      </h4>
                      <button 
                        onClick={() => setShowForm(true)}
                        className="w-full py-5 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:-translate-y-1 transition-transform uppercase tracking-widest text-[11px]"
                      >
                        Initier une demande de retrait
                      </button>
                    </div>
                  </div>

                  <div className="text-left">
                    <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Historique de vos retraits</h5>
                    <div className="space-y-3">
                      {withdrawals.length === 0 ? (
                        <p className="text-sm text-slate-400 italic">Aucun retrait effectué pour le moment.</p>
                      ) : (
                        withdrawals.map((w: any) => (
                          <div key={w.id} className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                            <div>
                              <div className="font-bold text-slate-900">{formatCurrency(w.amount)}</div>
                              <div className="text-[10px] text-slate-400 font-bold uppercase">{w.method} - {w.destination}</div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                              w.status === 'COMPLETED' ? 'bg-primary/10 text-primary' :
                              w.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>
                              {w.status === 'PENDING' ? 'En attente' : w.status === 'COMPLETED' ? 'Payé' : 'Refusé'}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 p-8 sm:p-12 rounded-[40px] border border-slate-200">
                   <button onClick={() => setShowForm(false)} className="text-xs font-black text-slate-400 uppercase mb-8 flex items-center gap-2 hover:text-slate-900 transition-colors">
                     ← Retour au solde
                   </button>
                   <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-8">Nouvelle demande</h3>
                   
                   <form onSubmit={handleWithdrawalRequest} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Cagnotte concernée</label>
                          <select 
                            className="w-full p-4 rounded-2xl border border-slate-200 bg-white font-bold text-sm outline-none focus:ring-2 focus:ring-primary"
                            value={formData.referenceId}
                            onChange={(e) => setFormData({...formData, referenceId: e.target.value})}
                          >
                            {projects.map((p: any) => (
                              <option key={p.id} value={p.id}>{p.title} ({formatCurrency(p.raised)})</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Montant Brut (XOF)</label>
                          <input 
                            required
                            type="number" 
                            placeholder="Ex: 10000"
                            className="w-full p-4 rounded-2xl border border-slate-200 bg-white font-bold text-sm outline-none focus:ring-2 focus:ring-primary"
                            value={formData.amount}
                            onChange={(e) => setFormData({...formData, amount: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Méthode de retrait</label>
                          <select 
                            className="w-full p-4 rounded-2xl border border-slate-200 bg-white font-bold text-sm outline-none focus:ring-2 focus:ring-primary"
                            value={formData.method}
                            onChange={(e) => setFormData({...formData, method: e.target.value})}
                          >
                            <option value="TMONEY">T-Money (Togo)</option>
                            <option value="MOOV">Moov Money (Togo/Bénin)</option>
                            <option value="BANK">Virement Bancaire</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Numéro ou RIB de destination</label>
                          <input 
                            required
                            type="text" 
                            placeholder="+228..."
                            className="w-full p-4 rounded-2xl border border-slate-200 bg-white font-bold text-sm outline-none focus:ring-2 focus:ring-primary"
                            value={formData.destination}
                            onChange={(e) => setFormData({...formData, destination: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="p-6 bg-white border border-orange-100 rounded-3xl space-y-2 shadow-sm">
                        <div className="flex justify-between text-xs font-bold text-slate-500">
                          <span>Montant Brut :</span>
                          <span>{formatCurrency(Number(formData.amount) || 0)}</span>
                        </div>
                        <div className="flex justify-between text-xs font-bold text-red-500">
                          <span>Frais Plateforme (5%) :</span>
                          <span>-{formatCurrency((Number(formData.amount) || 0) * 0.05)}</span>
                        </div>
                        <div className="flex justify-between text-xs font-bold text-red-500">
                          <span>Frais Techniques (2%) :</span>
                          <span>-{formatCurrency((Number(formData.amount) || 0) * 0.02)}</span>
                        </div>
                        <div className="pt-2 border-t border-slate-100 flex justify-between text-sm font-black text-primary">
                          <span>Net à recevoir :</span>
                          <span>{formatCurrency((Number(formData.amount) || 0) * 0.93)}</span>
                        </div>
                      </div>

                      <button 
                        disabled={loading}
                        type="submit" 
                        className="w-full py-5 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:opacity-90 transition-all uppercase tracking-widest text-[11px] disabled:opacity-50"
                      >
                        {loading ? "Traitement..." : "Confirmer la demande"}
                      </button>
                   </form>
                </div>
              )}
           </div>
        )}

        {/* Referral System */}
        <div className="mt-12 bg-primary rounded-[40px] p-8 sm:p-12 text-white overflow-hidden relative shadow-2xl shadow-primary/20">
          <div className="relative z-10">
            <h3 className="text-2xl font-black mb-4">✨ Invitez vos amis</h3>
            <p className="text-white/80 text-sm font-medium mb-8 max-w-md">
              Partagez HOASSI avec vos proches. Pour chaque nouveau créateur parrainé, vous renforcez la solidarité au Togo. ❤️
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-grow bg-white/20 backdrop-blur-md rounded-2xl p-4 font-mono text-sm border border-white/20 select-all">
                {typeof window !== 'undefined' ? `${window.location.origin}/signup?ref=${session?.user?.referralCode}` : 'Lien de parrainage'}
              </div>
              <button className="px-8 py-4 bg-white text-primary font-black rounded-2xl transition-all shadow-xl hover:-translate-y-1">
                Copier le lien
              </button>
            </div>
          </div>
          <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
}
