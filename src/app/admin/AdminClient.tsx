"use client";

import { useRouter } from "next/navigation";

export default function AdminActions({ projectId }: { projectId: string }) {
  const router = useRouter();

  const handleApprove = async () => {
    if (confirm("Voulez-vous vraiment approuver ce projet ? Il sera visible publiquement.")) {
      try {
        const res = await fetch(`/api/admin/projects/${projectId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ approved: true })
        });
        if (res.ok) {
          router.refresh();
        } else {
          alert("Erreur lors de l'approbation");
        }
      } catch (error) {
        alert("Erreur de connexion");
      }
    }
  };

  const handleDelete = async () => {
    if (confirm("Supprimer définitivement ce projet ? Cette action est irréversible.")) {
      try {
        const res = await fetch(`/api/admin/projects/${projectId}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          router.refresh();
        } else {
          alert("Erreur lors de la suppression");
        }
      } catch (error) {
        alert("Erreur de connexion");
      }
    }
  };

  return (
    <div className="flex gap-2 justify-end">
      <button 
        onClick={handleApprove}
        className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all"
      >
        Approuver
      </button>
      <button 
        onClick={handleDelete}
        className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-xl text-sm font-bold transition-all"
      >
        Supprimer
      </button>
    </div>
  );
}
