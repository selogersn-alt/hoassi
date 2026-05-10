"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, User, ShieldCheck, Zap } from "lucide-react";

export default function UnifiedLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER"); // USER, ADMIN, INFLUENCER
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError("Email ou mot de passe incorrect");
      } else {
        // Redirection basée sur le rôle (ou laisser NextAuth gérer si le rôle est dans le token)
        if (role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/");
        }
        router.refresh();
      }
    } catch (err) {
      setError("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 font-sans">
      {/* Background patterns */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="text-4xl font-black text-white tracking-tighter mb-4 inline-block hover:scale-105 transition-transform">
            HOA<span className="text-emerald-500">SSI</span>
          </Link>
          <div className="h-1 w-12 bg-gradient-to-r from-emerald-500 to-amber-500 mx-auto rounded-full mb-6"></div>
          <h1 className="text-xl font-bold text-white uppercase tracking-widest">Espace Connexion</h1>
        </div>

        <div className="bg-slate-900/80 p-8 rounded-[32px] border border-white/10 shadow-3xl backdrop-blur-xl">
          
          {/* Role Selector Tabs */}
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
            <button 
              onClick={() => setRole("ADMIN")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${role === "ADMIN" ? "bg-slate-700 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`}
            >
              <ShieldCheck className="w-4 h-4" /> Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-[10px] font-black text-center uppercase tracking-widest animate-pulse">
                {error}
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Adresse Email</label>
              <input 
                required
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-4 text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium placeholder:text-slate-700"
                placeholder="nom@exemple.com"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Mot de passe</label>
              <div className="relative">
                <input 
                  required
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-4 text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium placeholder:text-slate-700"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-emerald-500 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button 
              disabled={loading}
              type="submit" 
              className="w-full group mt-4 relative py-4 bg-white text-slate-950 font-black rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-50 overflow-hidden"
            >
              <span className="relative z-10 uppercase tracking-widest text-xs">
                {loading ? "Chargement..." : "Se connecter"}
              </span>
              <div className={`absolute inset-0 opacity-20 translate-x-full group-hover:translate-x-0 transition-transform duration-700 ${role === "ADMIN" ? "bg-slate-700" : role === "INFLUENCER" ? "bg-amber-500" : "bg-emerald-500"}`}></div>
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-slate-500">
            <Link href="/signup" className="text-[10px] font-black text-emerald-500 uppercase tracking-widest hover:text-amber-500 transition-colors">
              Créer un compte porteur de projet
            </Link>
          </div>
        </div>
        
        <div className="mt-12 text-center text-slate-700 text-[9px] font-black uppercase tracking-[0.4em]">
          Digitalh Network © 2026 • HOASSI Security
        </div>
      </div>
    </div>
  );
}
