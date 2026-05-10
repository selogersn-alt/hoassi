"use client";

import { useState } from "react";

interface ShareProps {
  title: string;
  id: string;
}

export default function ShareProject({ title, id }: ShareProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/project/${id}`;
  const shareText = `Soutenez le projet "${title}" sur HOASSI Togo. Ensemble, faisons la différence !`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`, "_blank");
  };

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank");
  };

  return (
    <div className="mt-8 pt-8 border-t border-slate-100">
      <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6 text-center">Partager cette cagnotte</h3>
      <div className="grid grid-cols-3 gap-4">
        <button 
          onClick={shareWhatsApp}
          className="flex flex-col items-center gap-2 group"
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.031 2c-5.508 0-9.969 4.461-9.969 9.969 0 1.761.462 3.414 1.268 4.852l-1.33 4.852 4.969-1.303c1.405.766 3.012 1.204 4.719 1.204 5.508 0 9.969-4.461 9.969-9.969s-4.461-9.969-9.969-9.969z" />
            </svg>
          </div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">WhatsApp</span>
        </button>

        <button 
          onClick={shareFacebook}
          className="flex flex-col items-center gap-2 group"
        >
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.249h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Facebook</span>
        </button>

        <button 
          onClick={copyToClipboard}
          className="flex flex-col items-center gap-2 group"
        >
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center group-hover:bg-slate-600 group-hover:text-white transition-all shadow-sm">
            {copied ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
            )}
          </div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{copied ? "Copié !" : "Lien"}</span>
        </button>
      </div>
    </div>
  );
}
