"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function InfluencerDonationForm({ influencerId, username }: { influencerId: string, username: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: "500",
    network: "TMONEY", // TMONEY, MOOV, ou CARD
    donorPhone: "",
    publicName: "",
    message: ""
  });
  
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const setAmount = (val: string) => {
    setFormData({ ...formData, amount: val });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/influencers/${username}/donate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        router.refresh();
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
      <div className="glass p-8 rounded-3xl text-center border border-primary/20 bg-primary/5 animate-pulse-glow">
        <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-black text-2xl text-white mb-4 tracking-tighter uppercase">MISSION ACCOMPLIE !</h3>
        <p className="text-slate-400 font-medium leading-relaxed">Le transfert de {formData.amount} XOF a été validé. Votre soutien propulse directement la créativité de l'élite.</p>
        <button 
          onClick={() => setSuccess(false)}
          className="mt-8 py-4 px-10 glass hover:bg-white text-white hover:text-midnight rounded-2xl font-black transition-smooth uppercase tracking-widest text-xs"
        >
          Relancer un signal
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      
      <div>
        <label htmlFor="amount" className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 ml-1">Volume du Soutien (XOF) <span className="text-primary">*</span></label>
        
        {/* Chips de montant rapide Futuristes */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {["500", "1500", "3000", "5000"].map((val) => (
            <button 
              key={val} 
              type="button"
              onClick={() => setAmount(val)}
              className={`py-3 rounded-xl text-xs font-black transition-smooth border ${formData.amount === val ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105' : 'glass text-slate-400 border-white/5 hover:border-white/20 hover:text-white'}`}
            >
              {val}
            </button>
          ))}
        </div>
        
        <div className="relative group">
          <input required type="number" id="amount" value={formData.amount} onChange={handleChange} min="100" className="w-full glass rounded-2xl border-white/5 px-6 py-5 text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-smooth pl-16 font-black text-2xl bg-transparent" />
          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 font-black text-sm">XOF</span>
          <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-smooth -z-10 pointer-events-none"></div>
        </div>
      </div>
      
      <div className="w-full h-px bg-white/5"></div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="network" className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">Passerelle de Paiement <span className="text-primary">*</span></label>
          <select required id="network" value={formData.network} onChange={handleChange} className="w-full glass rounded-2xl border-white/5 px-6 py-4 text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-smooth bg-midnight font-bold">
            <option value="TMONEY">T-Money</option>
            <option value="MOOV">Moov Money</option>
            <option value="CARD">Visa / Mastercard</option>
          </select>
        </div>
        <div>
          <label htmlFor="donorPhone" className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">
            {formData.network === 'CARD' ? "Canal International" : "Identifiant Mobile"} <span className="text-primary">*</span>
          </label>
          <input required type="tel" id="donorPhone" value={formData.donorPhone} onChange={handleChange} placeholder={formData.network === 'CARD' ? "+33... / +228..." : "+228..."} className="w-full glass rounded-2xl border-white/5 px-6 py-4 text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-smooth font-bold bg-transparent" />
        </div>
      </div>

      <div>
        <label htmlFor="publicName" className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">Alias du Donateur (Optionnel)</label>
        <input type="text" id="publicName" value={formData.publicName} onChange={handleChange} placeholder="Affiché dans le flux" className="w-full glass rounded-2xl border-white/5 px-6 py-4 text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-smooth placeholder:text-slate-700 bg-transparent font-medium" />
      </div>

      <div>
        <label htmlFor="message" className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">Message de Support (Optionnel)</label>
        <textarea id="message" value={formData.message} onChange={handleChange} rows={3} placeholder="Laissez une trace de votre soutien..." className="w-full glass rounded-2xl border-white/5 px-6 py-4 text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-smooth resize-none placeholder:text-slate-700 bg-transparent font-medium"></textarea>
      </div>

      <button disabled={loading} type="submit" className="mt-6 w-full group relative py-6 rounded-3xl bg-white text-midnight text-lg font-black hover:scale-[1.02] active:scale-95 transition-smooth shadow-2xl disabled:opacity-50 flex justify-center items-center overflow-hidden">
        <span className="relative z-10 flex items-center gap-3 uppercase tracking-widest text-sm">
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-midnight" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Traitement Sécurisé...
            </>
          ) : (
            <>
              Déployer le Soutien
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </>
          )}
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
      </button>
      
      <div className="flex items-center justify-center gap-3 mt-8 opacity-60 grayscale hover:grayscale-0 transition-all">
        <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center text-[8px] text-white font-black">PG</div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protected by PayGate Global</span>
      </div>
    </form>
  );
}
