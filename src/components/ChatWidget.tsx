"use client";

import { useState, useEffect } from "react";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showBadge, setShowBadge] = useState(true);

  const quickActions = [
    { label: "Besoin d'aide KYC", action: "Je souhaite de l'aide pour ma pièce d'identité", whatsapp: true },
    { label: "Problème avec T-Money", action: "J'ai un souci de paiement T-Money", whatsapp: true },
    { label: "Comment retirer l'argent ?", action: "Comment se passent les retraits ?", whatsapp: true },
    { label: "Devenir Influenceur", action: "Comment activer mon profil Influenceur ?", link: "/influencer-signup" },
  ];

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setShowBadge(false);
  };

  const handleWhatsApp = (message: string) => {
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/22890000000?text=${encodedMessage}`, "_blank"); // Replace with real Togolese number
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[350px] bg-white rounded-[24px] shadow-3xl border border-slate-100 overflow-hidden animate-slide-up">
          <div className="bg-slate-900 p-6 text-white relative">
            <div className="absolute top-4 right-4 cursor-pointer hover:opacity-70 transition-opacity" onClick={toggleChat}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            
            <div className="flex items-center gap-3 mb-2">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center font-black text-xl">D</div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900"></div>
              </div>
              <div>
                <h3 className="font-bold text-lg">Support HOASSI</h3>
                <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Équipe Digitalh • En ligne</p>
              </div>
            </div>
            <p className="text-slate-300 text-sm font-medium mt-4">
              Bienvenue sur HOASSI ! Une question sur votre cagnotte ou vos dons au Togo ?
            </p>
          </div>

          <div className="p-6 bg-slate-50/50">
            <div className="space-y-4 mb-6">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Actions Rapides</p>
              {quickActions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => action.whatsapp ? handleWhatsApp(action.action) : (window.location.href = action.link || "#")}
                  className="w-full flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl text-left hover:border-primary hover:shadow-md transition-all group scale-100 active:scale-95"
                >
                  <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900">{action.label}</span>
                  <div className="text-slate-300 group-hover:text-primary transition-colors">
                    {action.whatsapp ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <button 
              onClick={() => handleWhatsApp("Bonjour, j'ai une question générale sur HOASSI")}
              className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.031 2c-5.508 0-9.969 4.461-9.969 9.969 0 1.761.462 3.414 1.268 4.852l-1.33 4.852 4.969-1.303c1.405.766 3.012 1.204 4.719 1.204 5.508 0 9.969-4.461 9.969-9.969s-4.461-9.969-9.969-9.969z" />
              </svg>
              Chat direct via WhatsApp
            </button>
            <p className="text-[10px] text-slate-400 mt-4 text-center font-bold uppercase tracking-wider">Temps de réponse moyen : ~5 min</p>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button 
        onClick={toggleChat}
        className={`w-16 h-16 rounded-3xl bg-primary text-white flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-90 relative ${!isOpen ? "pulse-primary" : "rotate-90"}`}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            {showBadge && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-primary animate-bounce"></span>
            )}
          </div>
        )}
      </button>
    </div>
  );
}
