'use client';

import Navbar from '@/components/NavBar';
import Image from 'next/image';
import Footer from '@/components/Footer';

export default function MotDuDirecteur() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="h-16 lg:h-20"></div>

      

      {/* Contenu mot du directeur - style old-school */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
            {/* Photo directeur grande */}
            <div className="mb-12">
              <Image
                src="/directeur.jpg" // Mets la photo ici (demande-la au client si besoin)
                alt="M. MEKHOUKH Ameur - Directeur CACEG"
                width={400}
                height={400}
                className="rounded-full mx-auto object-cover border-8 border-yellow-500 shadow-xl"
              />
            </div>

            <h2 className="text-4xl font-bold text-blue-900 mb-6">
              M. MEKHOUKH Ameur
            </h2>
            <p className="text-2xl text-gray-700 mb-8">
              Directeur / Formateur
            </p>

            <div className="text-lg text-gray-800 leading-relaxed max-w-4xl mx-auto space-y-6">
              <p>
                Agrément d'État n°1031 du 27 juillet 2011
              </p>
              <p>
                Le Collège Algérien de Comptabilité et d’Études en Gestion (CACEG CONSULTING) est né de la conviction que la formation professionnelle et l’accompagnement des entreprises constituent le socle de tout développement économique durable.
              </p>
              <p>
                Depuis janvier 2011, nous accompagnons les entreprises algériennes dans leur montée en compétences à travers des formations certifiantes, des études conseils et une assistance technique de qualité.
              </p>
              <p>
                Avec un effectif permanent de 6 personnes et plus de 50 consultants/formateurs experts, nous mettons notre savoir-faire au service de la réussite de nos clients, dans le respect des valeurs d’excellence, de rigueur et de proximité.
              </p>
              <p className="font-semibold text-xl mt-12 italic">
                "La qualité de la formation et du conseil est la clé de la performance de l’entreprise."
              </p>
              <div className="text-right mt-16">
                <p className="text-blue-900 font-bold text-2xl">
                  M. MEKHOUKH Ameur
                </p>
                <p className="text-gray-700 italic">
                  Directeur Général
                </p>
                {/* Signature si tu as une image de signature */}
                {/* <Image src="/images/signature.png" alt="Signature" width={200} height={80} className="ml-auto mt-4" /> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}