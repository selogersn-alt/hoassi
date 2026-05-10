"use client";

import Navbar from "@/components/Navbar";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function InfluencerSignup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    fullname: "",
    bio: "",
    image: "",
    socialLink: "",
    cni: "",
    phone: ""
  });
  
  const [privateLink, setPrivateLink] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // Force username to lowercase without spaces
    if (e.target.id === "username") {
      const val = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "");
      setFormData({ ...formData, username: val });
    } else {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/influencers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setPrivateLink(`http://localhost:3000/support/${formData.username}`);
      } else {
        const data = await response.json();
        alert(data.error || "Une erreur est survenue");
      }
    } catch (error) {
      console.error(error);
      alert("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  if (privateLink) {
    return (
      <div className="min-h-screen flex flex-col bg-mesh">
        <Navbar />
        <main className="flex-grow py-32 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto w-full flex flex-col items-center justify-center">
          <div className="glass p-12 rounded-[40px] border border-white/10 text-center w-full shadow-3xl">
            <div className="w-24 h-24 bg-primary/20 text-primary rounded-3xl flex items-center justify-center mx-auto mb-8 pulse-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-12 h-12">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-4xl font-black text-white mb-6 tracking-tighter uppercase">COMPTE ÉLITE ACTIVÉ</h1>
            <p className="text-slate-400 text-lg mb-10 font-medium">Votre protocole de soutien est prêt. Partagez ce lien VIP pour recevoir vos flux de financement :</p>
            
            <div className="glass-dark p-6 border border-white/5 rounded-2xl mb-10 break-all select-all cursor-copy">
              <a href={privateLink} className="text-primary font-black text-xl hover:text-white transition-smooth" target="_blank">{privateLink}</a>
            </div>
            
            <button onClick={() => router.push(`/support/${formData.username}`)} className="py-5 px-10 rounded-2xl bg-white text-midnight font-black hover:scale-105 transition-smooth uppercase tracking-widest text-sm">
              Accéder au Dashboard Public
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-mesh">
      <Navbar />
      
      <main className="flex-grow py-32 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="glass rounded-[40px] shadow-3xl border border-white/10 overflow-hidden">
          <div className="px-8 py-12 sm:p-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-6">
              VIP Influencer Program
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tighter mb-4">ESPACE <span className="text-gradient">CRÉATEUR</span></h1>
            <p className="text-slate-400 text-lg mb-12 font-medium">Propulsez votre carrière digitale avec le protocole de soutien numéro 1 au Togo.</p>
            
            <form onSubmit={handleSubmit} className="space-y-12">
              
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <span className="flex items-center justify-center w-10 h-10 rounded-2xl glass border-white/10 text-primary font-black">1</span>
                  <h2 className="text-2xl font-black text-white tracking-tight uppercase">Config Profil Public</h2>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label htmlFor="username" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Username Identifiant <span className="text-red-500">*</span></label>
                    <div className="flex items-center">
                      <span className="glass border border-r-0 border-white/10 rounded-l-2xl px-5 py-4 text-slate-500 font-bold text-sm">hoassi.tg/support/</span>
                      <input required type="text" id="username" value={formData.username} onChange={handleChange} placeholder="votrepseudo" className="w-full glass rounded-r-2xl border-white/10 px-6 py-4 text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-smooth placeholder:text-slate-600 font-bold" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="fullname" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Nom de Scène / Chaîne <span className="text-red-500">*</span></label>
                      <input required type="text" id="fullname" value={formData.fullname} onChange={handleChange} placeholder="Ex: Master Content Creator" className="w-full glass rounded-2xl border-white/5 px-6 py-4 text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-smooth placeholder:text-slate-600" />
                    </div>
                    <div>
                      <label htmlFor="image" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Avatar Alpha (URL) <span className="text-red-500">*</span></label>
                      <input required type="url" id="image" value={formData.image} onChange={handleChange} placeholder="https://votre-image.com/avatar.jpg" className="w-full glass rounded-2xl border-white/5 px-6 py-4 text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-smooth placeholder:text-slate-600" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="bio" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Manifeste (Bio) <span className="text-red-500">*</span></label>
                    <textarea required id="bio" value={formData.bio} onChange={handleChange} rows={4} placeholder="Votre message exclusif à votre communauté..." className="w-full glass rounded-2xl border-white/5 px-6 py-4 text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-smooth resize-none placeholder:text-slate-600"></textarea>
                  </div>
                  
                  <div>
                    <label htmlFor="socialLink" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Hub Social (Lien Principal)</label>
                    <input type="url" id="socialLink" value={formData.socialLink} onChange={handleChange} placeholder="YouTube, TikTok, Instagram link" className="w-full glass rounded-2xl border-white/5 px-6 py-4 text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-smooth placeholder:text-slate-600" />
                  </div>
                </div>
              </div>

              <div className="w-full h-px bg-white/5"></div>

              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <span className="flex items-center justify-center w-10 h-10 rounded-2xl glass border-white/10 text-primary font-black">2</span>
                  <h2 className="text-2xl font-black text-white tracking-tight uppercase">Protocol de Reception</h2>
                </div>
                
                <div className="space-y-6 glass-dark p-8 rounded-3xl border border-white/5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Mobile Money (T-Money/Moov) <span className="text-red-500">*</span></label>
                      <input required type="tel" id="phone" value={formData.phone} onChange={handleChange} placeholder="+228..." className="w-full glass rounded-2xl border-white/5 px-6 py-4 text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-smooth bg-transparent" />
                    </div>
                    <div>
                      <label htmlFor="cni" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">N° ID Securisé (CNI) <span className="text-red-500">*</span></label>
                      <input required type="text" id="cni" value={formData.cni} onChange={handleChange} placeholder="Document confidentiel" className="w-full glass rounded-2xl border-white/5 px-6 py-4 text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-smooth bg-transparent" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <button disabled={loading} type="submit" className="w-full group relative py-6 px-10 rounded-3xl bg-white text-midnight text-xl font-black hover:scale-[1.02] active:scale-95 transition-smooth shadow-2xl disabled:opacity-50 flex justify-center items-center overflow-hidden">
                  <span className="relative z-10 uppercase tracking-widest">{loading ? "GÉNÉRATION..." : "ACTIVER MON LIEN VIP"}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
