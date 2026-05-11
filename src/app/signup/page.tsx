"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { User, Zap, UserPlus, Mail, Lock } from "lucide-react";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refCode = searchParams.get("ref");
  
  const [role, setRole] = useState("USER"); // USER ou INFLUENCER
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role, referralBy: refCode }),
      });

      if (res.ok) {
        router.push("/login");
      } else {
        const data = await res.json();
        setError(data.error || "Erreur lors de l'inscription");
      }
    } catch (err) {
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 font-sans">
      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="text-4xl font-black text-white tracking-tighter mb-4 inline-block">
            HOA<span className="text-emerald-500">SSI</span>
          </Link>
          <h1 className="text-xl font-bold text-white uppercase tracking-widest mt-2">Créer un compte</h1>
        </div>

        <div className="bg-slate-900/80 p-8 rounded-[32px] border border-white/10 shadow-3xl backdrop-blur-xl">
          
          <div className="flex p-1 bg-slate-950 rounded-2xl mb-8 border border-white/5">
            <button 
              onClick={() => setRole("USER")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${role === "USER" ? "bg-emerald-500 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`}
            >
              <User className="w-4 h-4" /> Porteur
            </button>
            <button 
              onClick={() => setRole("INFLUENCER")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${role === "INFLUENCER" ? "bg-amber-500 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`}
            >
              <Zap className="w-4 h-4" /> Influenceur
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-[10px] font-black text-center uppercase tracking-widest">
                {error}
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Nom complet</label>
              <div className="relative">
                <UserPlus className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input 
                  required
                  name="name"
                  type="text" 
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-slate-950/50 border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium placeholder:text-slate-700"
                  placeholder="Jean Dupont"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Adresse Email</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input 
                  required
                  name="email"
                  type="email" 
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-slate-950/50 border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium placeholder:text-slate-700"
                  placeholder="nom@exemple.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input 
                  required
                  name="password"
                  type="password" 
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-slate-950/50 border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium placeholder:text-slate-700"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              disabled={loading}
              type="submit" 
              className="w-full mt-4 py-4 bg-white text-slate-950 font-black rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-50"
            >
              {loading ? "CRÉATION..." : "S'INSCRIRE"}
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-slate-500">
            Déjà inscrit ? <Link href="/login" className="text-emerald-500 font-bold hover:underline">Se connecter</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <SignupForm />
    </Suspense>
  );
}
