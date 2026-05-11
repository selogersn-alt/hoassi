"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Users, 
  Megaphone, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  FileText, 
  CreditCard,
  Ban,
  Monitor,
  LogOut,
  Wallet
} from "lucide-react";
import { signOut } from "next-auth/react";

export default function AdminDashboardClient({ initialData }: { initialData: any }) {
  const [activeTab, setActiveTab] = useState("projects");
  const [projects, setProjects] = useState(initialData.pendingProjects);
  const [influencers, setInfluencers] = useState<any[]>(initialData.influencers || []);
  const [donations, setDonations] = useState<any[]>([]);
  const [ads, setAds] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Load influencers/donations/ads when switching tabs
  useEffect(() => {
    if (activeTab === "influencers") fetchInfluencers();
    if (activeTab === "donations") fetchDonations();
    if (activeTab === "ads") fetchAds();
    if (activeTab === "withdrawals") fetchWithdrawals();
  }, [activeTab]);

  const fetchInfluencers = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/influencers");
    if (res.ok) setInfluencers(await res.json());
    setLoading(false);
  };

  const fetchDonations = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/donations");
    if (res.ok) {
      const { donations, influencerDonations } = await res.json();
      setDonations([...donations, ...influencerDonations].sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
    }
    setLoading(false);
  };

  const fetchAds = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/ads");
    if (res.ok) setAds(await res.json());
    setLoading(false);
  };

  const fetchWithdrawals = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/withdrawals");
    if (res.ok) setWithdrawals(await res.json());
    setLoading(false);
  };

  const handleAction = async (endpoint: string, method: string, body: any) => {
    if (confirm("Confirmer cette action ?")) {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        if (activeTab === "projects") window.location.reload();
        if (activeTab === "influencers") fetchInfluencers();
        if (activeTab === "donations") fetchDonations();
        if (activeTab === "ads") fetchAds();
        if (activeTab === "withdrawals") fetchWithdrawals();
      } else {
        alert("Erreur lors de l'action");
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar Navigation */}
      <aside className="lg:w-64 flex flex-col gap-2">
        <button 
          onClick={() => setActiveTab("analytics")}
          className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === "analytics" ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-white text-slate-600 hover:bg-slate-100"}`}
        >
          <Monitor className="w-5 h-5" /> Analytiques
        </button>
        <button 
          onClick={() => setActiveTab("projects")}
          className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === "projects" ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-white text-slate-600 hover:bg-slate-100"}`}
        >
          <FileText className="w-5 h-5" /> Cagnottes
        </button>
        <button 
          onClick={() => setActiveTab("influencers")}
          className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === "influencers" ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-white text-slate-600 hover:bg-slate-100"}`}
        >
          <Users className="w-5 h-5" /> Influenceurs
        </button>
        <button 
          onClick={() => setActiveTab("donations")}
          className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === "donations" ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-white text-slate-600 hover:bg-slate-100"}`}
        >
          <CreditCard className="w-5 h-5" /> Transactions
        </button>
        <button 
          onClick={() => setActiveTab("ads")}
          className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === "ads" ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-white text-slate-600 hover:bg-slate-100"}`}
        >
          <Megaphone className="w-5 h-5" /> Publicité
        </button>
        <button 
          onClick={() => setActiveTab("withdrawals")}
          className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === "withdrawals" ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-white text-slate-600 hover:bg-slate-100"}`}
        >
          <Wallet className="w-5 h-5" /> Retraits
        </button>

        <div className="mt-8 pt-6 border-t border-slate-200">
           <button 
            onClick={() => { if(confirm("Voulez-vous vous déconnecter ?")) signOut({ callbackUrl: "/login" }); }}
            className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5" /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1">
        {activeTab === "analytics" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="bg-white p-8 rounded-[30px] border border-slate-200 shadow-sm">
                 <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Total Collecté (Brut)</div>
                 <div className="text-4xl font-black text-primary tracking-tighter">
                   {formatCurrency(
                     projects.reduce((acc: number, p: any) => acc + p.raised, 0) + 
                     influencers.reduce((acc: number, i: any) => acc + i.raised, 0)
                   )}
                 </div>
               </div>
               <div className="bg-white p-8 rounded-[30px] border border-slate-200 shadow-sm">
                 <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Donateurs Uniques</div>
                 <div className="text-4xl font-black text-slate-900 tracking-tighter">
                   {projects.reduce((acc: number, p: any) => acc + p.donorsCount, 0) + 
                    influencers.reduce((acc: number, i: any) => acc + i.donorsCount, 0)}
                 </div>
               </div>
               <div className="bg-white p-8 rounded-[30px] border border-slate-200 shadow-sm">
                 <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Cagnottes & Profils Actifs</div>
                 <div className="text-4xl font-black text-blue-600 tracking-tighter">
                   {projects.filter((p: any) => p.approved && !p.suspended).length +
                    influencers.filter((i: any) => i.approved && !i.suspended).length}
                 </div>
               </div>
            </div>
            
            <div className="bg-white rounded-[30px] border border-slate-200 p-8">
               <h3 className="text-xl font-bold mb-6">Performance des Catégories</h3>
               <div className="space-y-4">
                  {["Santé", "Éducation", "Social", "Entrepreneuriat"].map(cat => {
                    const total = projects.filter((p: any) => p.category === cat).reduce((acc: number, p: any) => acc + p.raised, 0);
                    return (
                      <div key={cat} className="flex items-center gap-4">
                         <div className="w-32 text-sm font-bold text-slate-600">{cat}</div>
                         <div className="flex-grow h-3 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${Math.min(100, (total / 1000000) * 100)}%` }}></div>
                         </div>
                         <div className="text-sm font-black text-slate-900">{formatCurrency(total)}</div>
                      </div>
                    );
                  })}
               </div>
            </div>
          </div>
        )}
        {activeTab === "projects" && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-900">Modération & KYC</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                  <tr>
                    <th className="px-6 py-4">Projet / KYC</th>
                    <th className="px-6 py-4">Statut</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {projects.map((p: any) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-6">
                        <div className="font-bold text-slate-900">{p.title}</div>
                        <div className="text-xs text-slate-500 mb-2">{p.fullname} - {p.phone}</div>
                        <div className="flex gap-2">
                           {p.cniFront && (
                             <a href={p.cniFront} target="_blank" className="text-[10px] font-black text-blue-500 bg-blue-50 px-2 py-1 rounded-lg hover:underline">Recto CNI</a>
                           )}
                           {p.cniBack && (
                             <a href={p.cniBack} target="_blank" className="text-[10px] font-black text-blue-500 bg-blue-50 px-2 py-1 rounded-lg hover:underline">Verso CNI</a>
                           )}
                        </div>
                      </td>
                      <td className="px-6 py-6 text-sm">
                        <div className="flex flex-col gap-1">
                          {p.suspended ? (
                            <span className="w-fit px-3 py-1 bg-red-100 text-red-700 rounded-full text-[10px] font-black uppercase">Suspendu</span>
                          ) : p.approved ? (
                            <span className="w-fit px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase">Actif</span>
                          ) : (
                            <span className="w-fit px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-black uppercase">En attente</span>
                          )}
                          {p.isVerified && (
                            <span className="w-fit px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> Identité Vérifiée
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex gap-2">
                          {!p.isVerified && p.cniFront && (
                            <button onClick={() => handleAction(`/api/admin/projects/${p.id}`, "PATCH", { isVerified: true })} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Vérifier l'identité"><CheckCircle className="w-5 h-5" /></button>
                          )}
                          {!p.approved && (
                            <button onClick={() => handleAction(`/api/admin/projects/${p.id}`, "PATCH", { approved: true })} className="p-2 text-primary hover:bg-primary/10 rounded-lg" title="Approuver"><CheckCircle className="w-5 h-5" /></button>
                          )}
                          <button onClick={() => handleAction(`/api/admin/projects/${p.id}`, "PATCH", { suspended: !p.suspended })} className={`p-2 ${p.suspended ? "text-primary hover:bg-primary/10" : "text-amber-600 hover:bg-amber-50"} rounded-lg`}>
                            {p.suspended ? <CheckCircle className="w-5 h-5" /> : <Ban className="w-5 h-5" />}
                          </button>
                          <button onClick={() => handleAction(`/api/admin/projects/${p.id}`, "DELETE", {})} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><XCircle className="w-5 h-5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "influencers" && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-900">Modération Influenceurs</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                  <tr>
                    <th className="px-6 py-4">Influenceur / KYC</th>
                    <th className="px-6 py-4">Collecté</th>
                    <th className="px-6 py-4">Statut</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {influencers.map((i: any) => (
                    <tr key={i.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-6">
                        <div className="font-bold text-slate-900">{i.fullname}</div>
                        <div className="text-xs text-slate-500 mb-2">@{i.username} - {i.phone}</div>
                        <div className="flex gap-2">
                           {i.cniFront && (
                             <a href={i.cniFront} target="_blank" className="text-[10px] font-black text-blue-500 bg-blue-50 px-2 py-1 rounded-lg hover:underline">Recto CNI</a>
                           )}
                           {i.cniBack && (
                             <a href={i.cniBack} target="_blank" className="text-[10px] font-black text-blue-500 bg-blue-50 px-2 py-1 rounded-lg hover:underline">Verso CNI</a>
                           )}
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="font-black text-primary">{formatCurrency(i.raised)}</div>
                        <div className="text-[10px] text-slate-400 font-bold">{i.donorsCount} donateurs</div>
                      </td>
                      <td className="px-6 py-6 text-sm">
                        <div className="flex flex-col gap-1">
                          {i.suspended ? (
                            <span className="w-fit px-3 py-1 bg-red-100 text-red-700 rounded-full text-[10px] font-black uppercase">Suspendu</span>
                          ) : i.approved ? (
                            <span className="w-fit px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase">Approuvé</span>
                          ) : (
                            <span className="w-fit px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-black uppercase">En attente</span>
                          )}
                          {i.isVerified && (
                            <span className="w-fit px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> Certifié
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex gap-2">
                          {!i.isVerified && i.cniFront && (
                            <button onClick={() => handleAction("/api/admin/influencers", "PATCH", { id: i.id, isVerified: true })} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Vérifier l'identité"><CheckCircle className="w-5 h-5" /></button>
                          )}
                          {!i.approved && (
                            <button onClick={() => handleAction("/api/admin/influencers", "PATCH", { id: i.id, approved: true })} className="p-2 text-primary hover:bg-primary/10 rounded-lg" title="Approuver"><CheckCircle className="w-5 h-5" /></button>
                          )}
                          <button onClick={() => handleAction("/api/admin/influencers", "PATCH", { id: i.id, suspended: !i.suspended })} className={`p-2 ${i.suspended ? "text-primary hover:bg-primary/10" : "text-amber-600 hover:bg-amber-50"} rounded-lg`}>
                            {i.suspended ? <CheckCircle className="w-5 h-5" /> : <Ban className="w-5 h-5" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {loading && <div className="p-12 text-center text-slate-500">Chargement...</div>}

        {activeTab === "donations" && !loading && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
             <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-900">Historique des Transactions</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                  <tr>
                    <th className="px-6 py-4">Montant</th>
                    <th className="px-6 py-4">Réseau / ID</th>
                    <th className="px-6 py-4">Statut</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {donations.map((d: any) => (
                    <tr key={d.id} className="text-sm">
                      <td className="px-6 py-4 font-bold text-slate-900">{formatCurrency(d.amount)}</td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-700">{d.network}</div>
                        <div className="text-xs text-slate-400">{d.transactionId}</div>
                      </td>
                      <td className="px-6 py-4">
                         <span className={`px-2 py-1 rounded text-xs font-bold ${d.status === "COMPLETED" ? "bg-primary/10 text-primary" : d.status === "CONTESTED" ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-600"}`}>
                           {d.status}
                         </span>
                      </td>
                      <td className="px-6 py-4">
                        <select 
                          className="text-xs border rounded p-1"
                          onChange={(e) => handleAction("/api/admin/donations", "PATCH", { id: d.id, type: d.projectId ? 'project' : 'influencer', status: e.target.value })}
                          value={d.status}
                        >
                          <option value="COMPLETED">Complété</option>
                          <option value="CONTESTED">Contesté</option>
                          <option value="REFUNDED">Remboursé</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "ads" && !loading && (
           <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
              <h2 className="text-2xl font-black text-slate-900 mb-6">Gestion Publicitaire</h2>
              <p className="text-slate-500 mb-8">Insérez des bannières ou du code (AdSense, etc.) directement sur le site.</p>
              
              <form className="grid gap-4 mb-12 bg-slate-50 p-6 rounded-2xl" onSubmit={(e: any) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                handleAction("/api/admin/ads", "POST", {
                  location: formData.get("location"),
                  type: formData.get("type"),
                  content: formData.get("content"),
                  link: formData.get("link"),
                });
              }}>
                <div className="grid grid-cols-2 gap-4">
                  <select name="location" className="p-3 rounded-xl border">
                    <option value="HERO">Hero Home</option>
                    <option value="PROJECT_CARD">Projets Cards</option>
                    <option value="FOOTER">Pied de page</option>
                    <option value="POPUP">Fenêtre Pop-Up</option>
                  </select>
                  <select name="type" className="p-3 rounded-xl border">
                    <option value="IMAGE">Image/Bannière</option>
                    <option value="CODE">Script/Code HTML</option>
                  </select>
                </div>
                <textarea name="content" placeholder="URL de l'image ou Code Script" className="p-3 rounded-xl border h-32"></textarea>
                <input name="link" placeholder="Lien de redirection (optionnel)" className="p-3 rounded-xl border" />
                <button type="submit" className="bg-primary text-white font-bold py-3 rounded-xl">Ajouter l'emplacement pub</button>
              </form>
 
              <div className="space-y-4">
                 {ads.map((ad: any) => (
                    <div key={ad.id} className="flex items-center justify-between p-4 border rounded-2xl">
                      <div>
                        <span className="text-xs font-bold text-primary uppercase">{ad.location}</span>
                        <div className="text-sm font-medium truncate max-w-xs">{ad.type === "IMAGE" ? ad.link : "Script Code"}</div>
                      </div>
                      <button onClick={() => handleAction(`/api/admin/ads/${ad.id}`, "DELETE", {})} className="text-red-500 font-bold text-sm">Supprimer</button>
                   </div>
                 ))}
              </div>
           </div>
        )}
        {activeTab === "withdrawals" && !loading && (
           <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-900">Demandes de Retraits</h2>
                <div className="text-xs font-black bg-blue-100 text-blue-600 px-3 py-1 rounded-full uppercase">Gestion des Fonds</div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                    <tr>
                      <th className="px-6 py-4">Bénéficiaire</th>
                      <th className="px-6 py-4">Brut</th>
                      <th className="px-6 py-4">Frais (Hoassi/Tech)</th>
                      <th className="px-6 py-4">Net à Payer</th>
                      <th className="px-6 py-4">Statut</th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {withdrawals.length === 0 ? (
                      <tr><td colSpan={6} className="p-12 text-center text-slate-400">Aucune demande en attente</td></tr>
                    ) : (
                      withdrawals.map((w: any) => (
                        <tr key={w.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-6">
                            <div className="font-bold text-slate-900">{w.requesterName}</div>
                            <div className="text-[9px] text-slate-400 font-black">{w.method} - {w.destination}</div>
                          </td>
                          <td className="px-6 py-6 text-xs font-bold text-slate-500">{formatCurrency(w.grossAmount)}</td>
                          <td className="px-6 py-6 text-xs text-red-500 font-medium">
                            <div>-{formatCurrency(w.platformFee)}</div>
                            <div>-{formatCurrency(w.techFee)}</div>
                          </td>
                          <td className="px-6 py-6 font-black text-primary">{formatCurrency(w.amount)}</td>
                          <td className="px-6 py-6">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                              w.status === 'COMPLETED' ? 'bg-primary/10 text-primary' :
                              w.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>
                              {w.status === 'PENDING' ? 'En attente' : w.status === 'COMPLETED' ? 'Payé' : 'Refusé'}
                            </span>
                          </td>
                          <td className="px-6 py-6">
                            <div className="flex gap-2">
                              {w.status === "PENDING" && (
                                <>
                                  <button onClick={() => handleAction("/api/admin/withdrawals", "PATCH", { id: w.id, status: "COMPLETED" })} className="p-2 text-primary hover:bg-primary/10 rounded-lg" title="Marquer comme payé"><CheckCircle className="w-5 h-5" /></button>
                                  <button onClick={() => handleAction("/api/admin/withdrawals", "PATCH", { id: w.id, status: "REJECTED" })} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Refuser"><XCircle className="w-5 h-5" /></button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
           </div>
        )}
      </div>
    </div>
  );
}
