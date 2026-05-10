"use client";

import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AlertTriangle } from "lucide-react";

export default function CreateProject() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "Santé / Médical",
    goal: "",
    description: "",
    image: "",
    socialLink: "",
    fullname: "",
    email: "",
    phone: "",
    cni: "",
    cniFront: "",
    cniBack: ""
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/create-project");
    }
    if (session?.user?.email && !formData.email) {
      setFormData(prev => ({ ...prev, email: session.user.email || "" }));
    }
  }, [status, session, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    setLoading(true);

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/dashboard');
        router.refresh();
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

  if (status === "loading") return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  if (!session) return null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="bg-white rounded-[30px] shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-8 py-12 sm:p-14">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4 text-center">
              Démarrer une <span className="text-emerald-500">cagnotte</span>
            </h1>
            <p className="text-slate-600 text-lg mb-12 font-medium text-center max-w-2xl mx-auto">
              Partagez votre histoire et commencez à recevoir du soutien dès aujourd'hui.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-12">
              {/* Section: Détails du projet */}
              <div className="space-y-8">
                <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 font-bold text-lg">1</span>
                   <h2 className="text-2xl font-bold text-slate-900">Détails de la cagnotte</h2>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-bold text-slate-700 mb-2">Titre de la cagnotte</label>
                    <input required type="text" id="title" value={formData.title} onChange={handleChange} placeholder="Que souhaitez-vous financer ?" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-400 font-medium" />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="category" className="block text-sm font-bold text-slate-700 mb-2">Catégorie</label>
                      <select required id="category" value={formData.category} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium">
                        <option value="Santé">Santé / Médical</option>
                        <option value="Éducation">Éducation</option>
                        <option value="Social">Social & Solidarité</option>
                        <option value="Entrepreneuriat">Entrepreneuriat</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="goal" className="block text-sm font-bold text-slate-700 mb-2">Objectif (Mixx / Moov - XOF)</label>
                      <input required type="number" id="goal" value={formData.goal} onChange={handleChange} placeholder="Ex: 500000" min="1000" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-bold text-slate-700 mb-2">Pourquoi avez-vous besoin de ces fonds ?</label>
                    <textarea required id="description" value={formData.description} onChange={handleChange} rows={6} placeholder="Décrivez votre situation avec transparence..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none font-medium"></textarea>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Image d'illustration <span className="text-red-500">*</span>
                      </label>
                      <div className="relative group h-48">
                        <input 
                          required={!formData.image}
                          type="file" 
                          id="image-upload" 
                          accept="image/*"
                          onChange={async (e) => {
                             const file = e.target.files?.[0];
                             if (file) {
                               if (file.size > 2 * 1024 * 1024) { alert("2MB Max"); return; }
                               setUploading(true);
                               const uploadData = new FormData();
                               uploadData.append("file", file);
                               const res = await fetch("/api/upload", { method: "POST", body: uploadData });
                               const data = await res.json();
                               if (data.url) setFormData({ ...formData, image: data.url });
                               setUploading(false);
                             }
                          }} 
                          className="hidden" 
                        />
                        <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-full bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl hover:border-emerald-500 cursor-pointer overflow-hidden transition-all">
                          {formData.image ? (
                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-sm font-bold text-slate-400">{uploading ? "Upload..." : "Preuve / Illustration"}</span>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full h-px bg-slate-100"></div>

              {/* Section: KYC */}
              <div className="space-y-8">
                <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 font-bold text-lg">2</span>
                  <h2 className="text-2xl font-bold text-slate-900">Coordoonnées de retrait</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                   <div>
                    <label htmlFor="fullname" className="block text-sm font-bold text-slate-700 mb-2">Nom complet (Pièce d'identité)</label>
                    <input required type="text" id="fullname" value={formData.fullname} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 font-medium" />
                  </div>
                   <div>
                    <label htmlFor="phone" className="block text-sm font-bold text-slate-700 mb-2">Numéro Mixx / Moov</label>
                    <input required type="tel" id="phone" value={formData.phone} onChange={handleChange} placeholder="+228" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 font-medium" />
                  </div>
                </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">CNI Recto (Devant)</label>
                      <input 
                        type="file" accept="image/*" className="hidden" id="cni-front"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const uploadData = new FormData();
                            uploadData.append("file", file);
                            const res = await fetch("/api/upload", { method: "POST", body: uploadData });
                            const data = await res.json();
                            if (data.url) setFormData({ ...formData, cniFront: data.url });
                          }
                        }}
                      />
                      <label htmlFor="cni-front" className="flex items-center justify-center h-32 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-emerald-500 overflow-hidden">
                        {formData.cniFront ? <img src={formData.cniFront} className="h-full w-full object-cover" /> : <span className="text-xs font-bold text-slate-400">Choisir CNI Recto</span>}
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">CNI Verso (Dos)</label>
                      <input 
                        type="file" accept="image/*" className="hidden" id="cni-back"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const uploadData = new FormData();
                            uploadData.append("file", file);
                            const res = await fetch("/api/upload", { method: "POST", body: uploadData });
                            const data = await res.json();
                            if (data.url) setFormData({ ...formData, cniBack: data.url });
                          }
                        }}
                      />
                      <label htmlFor="cni-back" className="flex items-center justify-center h-32 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-emerald-500 overflow-hidden">
                        {formData.cniBack ? <img src={formData.cniBack} className="h-full w-full object-cover" /> : <span className="text-xs font-bold text-slate-400">Choisir CNI Verso</span>}
                      </label>
                    </div>
                  </div>
                 <div>
                    <label htmlFor="cni" className="block text-sm font-bold text-slate-700 mb-2">Numéro CNI / Passeport</label>
                    <input required type="text" id="cni" value={formData.cni} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 font-medium" />
                  </div>
              </div>

              {/* Charte de Sécurité */}
              <div className="bg-amber-50 border border-amber-200 p-6 rounded-3xl space-y-3">
                <div className="flex items-center gap-2 text-amber-800 font-bold">
                  <AlertTriangle className="w-5 h-5" /> Charte de Sécurité & Conformité
                </div>
                <p className="text-xs text-amber-700 leading-relaxed font-medium">
                  En soumettant cette cagnotte, vous certifiez qu'elle ne sera pas utilisée pour : 
                  <span className="font-black"> les partis politiques, les campagnes électorales, le blanchiment d'argent, ou toute activité liée à des crimes. </span>
                  HOASSI se réserve le droit de suspendre tout compte et de signaler aux autorités toute activité suspecte ou illicite.
                </p>
              </div>

              <button disabled={loading} type="submit" className="w-full py-5 rounded-full bg-slate-900 text-white text-lg font-black hover:bg-slate-800 transition-all shadow-xl">
                 {loading ? "CRÉATION EN COURS..." : "SOUMETTRE MA CAGNOTTE"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
