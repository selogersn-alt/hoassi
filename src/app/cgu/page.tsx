import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CGUPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100">
          <h1 className="text-4xl font-black text-slate-900 mb-8 tracking-tight">Conditions Générales d'Utilisation (CGU)</h1>
          
          <div className="prose prose-slate max-w-none space-y-8 text-slate-600 font-medium leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">1. Objet</h2>
              <p>
                Les présentes Conditions Générales d'Utilisation ont pour objet de définir les modalités de mise à disposition des services de la plateforme HOASSI, ci-après nommée « le Service » et les conditions d'utilisation du Service par l'Utilisateur.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">2. Mentions Légales</h2>
              <p>
                La plateforme HOASSI est éditée par DIGITALH, agence technologique basée au Togo. La plateforme permet la mise en relation de porteurs de projets et de contributeurs.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">3. Accès au Service</h2>
              <p>
                Le Service est accessible gratuitement à tout Utilisateur disposant d'un accès à internet. Tous les coûts afférents à l'accès au Service sont exclusivement à la charge de l'Utilisateur.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">4. Collecte de données</h2>
              <p>
                HOASSI collecte des informations nécessaires au bon fonctionnement des cagnottes et à la sécurité des transactions. Conformément à la législation en vigueur au Togo sur la protection des données à caractère personnel, l'utilisateur dispose d'un droit d'accès, de rectification et de suppression de ses données.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">5. Responsabilités</h2>
              <p>
                HOASSI agit en tant qu'intermédiaire technique. Le porteur de projet est seul responsable de l'exécution de son projet et de la véracité des informations fournies. HOASSI ne peut être tenu responsable du succès ou de l'échec d'une collecte, ni de l'utilisation finale des fonds par le porteur.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">6. Frais de service</h2>
              <p>
                HOASSI prélève une commission sur les fonds collectés pour couvrir les frais de fonctionnement, de maintenance et les frais de transaction des opérateurs de paiement (PayGate, T-Money, Moov Money). Le détail des frais est communiqué lors de la création du projet.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">7. Droit applicable</h2>
              <p>
                Les présentes CGU sont soumises au droit togolais. En cas de litige, les tribunaux de Lomé seront seuls compétents.
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
