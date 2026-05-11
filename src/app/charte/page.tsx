import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShieldAlert, Ban, Gavel, Scale } from "lucide-react";

export default function ChartePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Charte d'Utilisation Éthique</h1>
          </div>
          
          <p className="text-lg text-slate-500 font-bold mb-12 leading-relaxed">
            HOASSI est une plateforme dédiée au développement social, à l'entrepreneuriat et à la solidarité au Togo. Pour préserver l'intégrité de notre communauté, tout utilisateur s'engage à respecter les règles suivantes.
          </p>

          <div className="space-y-12">
            <section className="relative pl-8 border-l-4 border-red-500">
              <div className="flex items-center gap-3 mb-4 text-red-600">
                <Ban className="w-5 h-5 font-black" />
                <h2 className="text-xl font-black uppercase tracking-wider">Interdictions Formelles</h2>
              </div>
              <ul className="space-y-4 text-slate-600 font-medium">
                <li><span className="text-red-600 font-black">• Politique :</span> Aucune cagnotte à visée politique, électorale ou de propagande ne sera acceptée.</li>
                <li><span className="text-red-600 font-black">• Blanchiment :</span> L'utilisation de la plateforme pour le blanchiment de capitaux est strictement interdite.</li>
                <li><span className="text-red-600 font-black">• Haine :</span> Interdiction de financer des projets incitant à la haine, à la violence ou à la discrimination.</li>
                <li><span className="text-red-600 font-black">• Crimes :</span> Les fonds issus d'activités illicites ou destinés à financer des activités criminelles sont prohibés.</li>
              </ul>
            </section>

            <section className="relative pl-8 border-l-4 border-primary">
              <div className="flex items-center gap-3 mb-4 text-primary">
                <Scale className="w-5 h-5 font-black" />
                <h2 className="text-xl font-black uppercase tracking-wider">Transparence & Vérité</h2>
              </div>
              <p className="text-slate-600 font-medium leading-relaxed">
                Le porteur de projet s'engage à fournir des informations véridiques sur son identité et sur l'utilisation réelle des fonds. Tout détournement de fonds par rapport à l'objectif initial de la cagnotte entraînera la suspension immédiate du compte et des poursuites judiciaires.
              </p>
            </section>

            <section className="relative pl-8 border-l-4 border-slate-900">
              <div className="flex items-center gap-3 mb-4 text-slate-900">
                <Gavel className="w-5 h-5 font-black" />
                <h2 className="text-xl font-black uppercase tracking-wider">Sanctions</h2>
              </div>
              <p className="text-slate-600 font-medium leading-relaxed">
                HOASSI se réserve le droit de geler les fonds et de signaler aux autorités compétentes (CENTIF, Parquet de Lomé) toute transaction suspecte. Le non-respect de cette charte entraîne la clôture définitive du compte sans préavis.
              </p>
            </section>
          </div>

          <div className="mt-16 p-6 bg-slate-50 rounded-2xl border border-slate-100 italic text-slate-500 text-sm">
            Dernière mise à jour : 11 Mai 2026. En utilisant HOASSI, vous acceptez sans réserve cette charte d'éthique.
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
