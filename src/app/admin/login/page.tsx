"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        router.push("/admin");
        router.refresh();
      }
    } catch (err) {
      setError("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="max-w-md w-full animate-float">
        <div className="text-center mb-12">
          <Link href="/" className="text-5xl font-black text-white tracking-tighter mb-4 inline-block group font-sans">
            HOA<span className="text-emerald-500">SSI</span>
          </Link>
          <div className="h-0.5 w-12 bg-emerald-500 mx-auto mb-6"></div>
          <h1 className="text-2xl font-black text-white uppercase tracking-[0.3em] font-sans">Command Center</h1>
          <p className="text-slate-500 mt-2 font-bold text-[10px] uppercase tracking-widest font-sans">Protocol Elite Access Only</p>
        </div>

        <div className="bg-slate-800/50 p-10 rounded-[40px] border border-white/10 shadow-3xl relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50"></div>
          
          <form onSubmit={handleSubmit} className="space-y-8 font-sans">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-xs font-bold text-center uppercase tracking-widest animate-pulse">
                {error}
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Identifiant Admin</label>
              <input 
                required
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-700 font-medium"
                placeholder="admin@digitalh.tg"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Clé de Sécurité</label>
              <div className="relative">
                <input 
                  required
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-700 font-medium"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 hover:text-emerald-500 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button 
              disabled={loading}
              type="submit" 
              className="w-full group relative py-5 bg-white text-slate-900 font-black rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-2xl disabled:opacity-50 overflow-hidden"
            >
              <span className="relative z-10 uppercase tracking-widest text-sm">
                {loading ? "AUTHENTIFICATION..." : "INITIALISER L'ACCÈS"}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-amber-500/20 translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
            </button>
          </form>
        </div>
        
        <div className="mt-12 text-center text-slate-600 text-[10px] font-black uppercase tracking-[0.4em] font-sans">
          Digitalh Security Hub © 2026
        </div>
      </div>
    </div>
  );
}
