"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function PromoPopup() {
  const [ad, setAd] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 1. Récupérer les publicités de type POPUP
    fetch("/api/admin/ads?location=POPUP")
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          const activeAd = data.find((a: any) => a.active);
          if (activeAd) {
             // Vérifier si déjà affiché dans cette session
             const sessionShown = sessionStorage.getItem(`popup_${activeAd.id}`);
             if (!sessionShown) {
                setAd(activeAd);
                // Apparition après le délai configuré (ou 5s par défaut)
                setTimeout(() => {
                   setIsVisible(true);
                   sessionStorage.setItem(`popup_${activeAd.id}`, "true");
                }, activeAd.delayMs || 5000);
             }
          }
        }
      });
  }, []);

  if (!ad || !isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm transition-all animate-in fade-in duration-500">
      <div className="relative max-w-lg w-full bg-white rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 z-10 p-2 bg-slate-900/50 hover:bg-slate-900 text-white rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {ad.type === "IMAGE" ? (
          <div className="flex flex-col">
            <a href={ad.link || "#"} target={ad.link ? "_blank" : "_self"} className="block">
              <img 
                src={ad.content} 
                alt="Promotion" 
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
              />
            </a>
            <div className="p-6 text-center">
               <button 
                onClick={() => setIsVisible(false)}
                className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-900"
               >
                 Fermer
               </button>
            </div>
          </div>
        ) : (
          <div className="p-8" dangerouslySetInnerHTML={{ __html: ad.content }}></div>
        )}
      </div>
    </div>
  );
}
