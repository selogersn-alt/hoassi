"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Smartphone, CreditCard, ShieldCheck } from "lucide-react";

export default function DonationForm({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: "1000",
    network: "TMONEY", // TMONEY, MOOV, ou CARD
    donorPhone: "",
    publicName: "",
    message: ""
  });
  
  const [success, setSuccess] = useState(false);

  const quickAmounts = ["1000", "2000", "5000", "10000"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleNetworkSelect = (network: string) => {
    setFormData({ ...formData, network });
  };

  const handleAmountSelect = (amount: string) => {
    setFormData({ ...formData, amount });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/projects/${projectId}/donate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.paymentUrl) {
          window.location.href = data.paymentUrl;
        } else {
          setSuccess(true);
          router.refresh();
        }
      } else {
        const data = await response.json();
        alert(data.error || "Une erreur est survenue lors du paiement");
      }
    } catch (error) {
      console.error(error);
      alert("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-8 rounded-[2rem] text-center animate-slide-up">
        <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
          <CheckCircle className="h-10 w-10 text-white" />
        </div>
        <h3 className="font-black text-2xl mb-2 text-slate-900">Merci !</h3>
        <p className="text-slate-600 font-medium leading-relaxed">
          Votre soutien est précieux et va permettre de faire avancer ce projet.
        </p>
        <button 
          onClick={() => setSuccess(false)}
          className="mt-8 w-full py-4 bg-white text-emerald-700 border border-emerald-200 rounded-2xl font-bold hover:bg-emerald-50 transition-all shadow-sm"
        >
          Faire un autre don
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Montant */}
      <div>
        <label htmlFor="amount" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Montant du don (XOF)</label>
        <div className="grid grid-cols-4 gap-2 mb-3">
          {quickAmounts.map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => handleAmountSelect(amt)}
              className={`py-2 rounded-xl text-sm font-bold border transition-all ${formData.amount === amt ? "bg-primary text-white border-primary shadow-md" : "bg-white text-slate-600 border-slate-200 hover:border-primary"}`}
            >
              {parseInt(amt).toLocaleString()}
            </button>
          ))}
        </div>
        <div className="relative">
          <input 
            required 
            type="number" 
            id="amount" 
            value={formData.amount} 
            onChange={handleChange} 
            min="100" 
            className="w-full rounded-2xl border-slate-200 border px-6 py-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-black text-xl text-slate-900" 
          />
          <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold">FCFA</span>
        </div>
      </div>
      
      {/* Réseau */}
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Réseau de paiement</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: "TMONEY", label: "T-Money", icon: <Smartphone className="w-4 h-4" />, color: "bg-amber-500" },
            { id: "MOOV", label: "Moov", icon: <Smartphone className="w-4 h-4" />, color: "bg-blue-600" },
            { id: "CARD", label: "Carte", icon: <CreditCard className="w-4 h-4" />, color: "bg-slate-800" }
          ].map((net) => (
            <button
              key={net.id}
              type="button"
              onClick={() => handleNetworkSelect(net.id)}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all gap-1 ${formData.network === net.id ? "border-primary bg-emerald-50 ring-2 ring-primary/10" : "border-slate-200 bg-white hover:border-slate-300"}`}
            >
              <div className={`w-8 h-8 rounded-lg ${net.color} flex items-center justify-center text-white mb-1`}>
                {net.icon}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-tighter ${formData.network === net.id ? "text-primary" : "text-slate-500"}`}>
                {net.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Téléphone */}
      <div>
        <label htmlFor="donorPhone" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
          {formData.network === 'CARD' ? "Numéro pour le reçu" : "Numéro Mobile Money"}
        </label>
        <div className="relative">
          <input 
            required 
            type="tel" 
            id="donorPhone" 
            value={formData.donorPhone} 
            onChange={handleChange} 
            placeholder="+228 XX XX XX XX" 
            className="w-full rounded-2xl border-slate-200 border px-6 py-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-slate-900" 
          />
        </div>
      </div>

      {/* Résumé Frais */}
      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 border-dashed">
         <div className="flex justify-between items-center text-sm mb-1">
            <span className="text-slate-500 font-medium italic">Net pour la cagnotte</span>
            <span className="text-slate-900 font-black text-lg">
               {new Intl.NumberFormat('fr-FR').format(Math.floor(Number(formData.amount) * 0.95))} XOF
            </span>
         </div>
         <p className="text-[10px] text-slate-400 font-medium">
            * 5% de frais de service inclus.
         </p>
      </div>

      {/* Infos Optionnelles */}
      <div className="grid grid-cols-1 gap-4 pt-2">
        <div>
          <label htmlFor="publicName" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Nom (laisser vide pour anonyme)</label>
          <input type="text" id="publicName" value={formData.publicName} onChange={handleChange} className="w-full rounded-xl border-slate-200 border px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium" />
        </div>

        <div>
          <label htmlFor="message" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Petit mot de soutien</label>
          <textarea id="message" value={formData.message} onChange={handleChange} rows={2} className="w-full rounded-xl border-slate-200 border px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none text-sm font-medium"></textarea>
        </div>
      </div>

      <button disabled={loading} type="submit" className="w-full py-5 rounded-2xl bg-slate-900 text-white font-black text-lg hover:bg-slate-800 shadow-xl hover:shadow-primary/20 transition-all disabled:opacity-70 flex justify-center items-center gap-3">
        {loading ? (
          <span className="flex items-center gap-3">
            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
            Sécurisation...
          </span>
        ) : (
          <>
            <ShieldCheck className="w-6 h-6 text-primary" />
            Soutenir maintenant
          </>
        )}
      </button>
      
      <div className="flex items-center justify-center gap-2 pt-2 opacity-60 grayscale hover:grayscale-0 transition-all">
        <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-[10px] text-white font-black">PG</div>
        <span className="text-[12px] font-black text-slate-600 uppercase tracking-tighter">Powered by PayGate Global</span>
      </div>
      <p className="text-center text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-4">Paiements 100% Sécurisés & Instantanés</p>
    </form>
  );
}
