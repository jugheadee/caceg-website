'use client';

import Navbar from '@/components/NavBar';
import Image from 'next/image';
import Footer from '@/components/Footer';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function MotDuDirecteur() {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    formations: false,
    experience: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="h-16 lg:h-20"></div>

      {/* Section principale */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            {/* Header avec gradient */}
            <div className="relative bg-gradient-to-r from-blue-900 to-blue-800 text-white py-20 px-8 md:px-16">
              {/* Photo et rond DESCENDUS */}
              <div className="absolute -bottom-38 left-1/2 -translate-x-1/2 z-10">
                <div className="relative">
                  <Image
                    src="/directeur.jpg"
                    alt="M. MEKHOUKH Ameur - Directeur CACEG"
                    width={300}
                    height={300}
                    className="rounded-full border-4 border-white shadow-2xl object-cover object-top"
                    priority
                  />
                  {/* Bord jaune subtil (optionnel, tu peux commenter si tu veux le virer) */}
                  <div className="absolute inset-0 rounded-full border-4 border-yellow-400 opacity-20 pointer-events-none"></div>
                </div>
              </div>
            </div>

            {/* Contenu – padding-top augmenté pour dégager la photo */}
            <div className="pt-48 pb-16 px-8 md:px-16 text-center relative z-0">
              <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
                M. MEKHOUKH Ameur
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 font-medium mb-10">
                Directeur Général – Expert Consultant Formateur
              </p>

              <div className="max-w-4xl mx-auto text-left text-lg md:text-xl text-gray-800 leading-relaxed space-y-8">
                <p className="text-center italic text-blue-900 font-semibold text-xl mb-12">
                  « La qualité de la formation et du conseil est la clé de la performance durable de l’entreprise. »
                </p>

                

                {/* Texte intro */}
                <p>
                  Le Collège Algérien de Comptabilité et d’Études en Gestion (CACEG CONSULTING) est né de la conviction que la formation professionnelle et l’accompagnement des entreprises constituent le socle de tout développement économique durable.
                </p>
                <p>
                  Depuis janvier 2011, nous accompagnons les entreprises algériennes dans leur montée en compétences à travers des formations certifiantes, des études conseils et une assistance technique de qualité.
                </p>
                <p>
                  Avec un effectif permanent de 6 personnes et plus de 50 consultants/formateurs experts, nous mettons notre savoir-faire au service de la réussite de nos clients, dans le respect des valeurs d’excellence, de rigueur et de proximité.
                </p>

                {/* Accordéon biographie */}
                <div className="mt-16 space-y-5">
                  {/* Formations */}
                  <div className="border border-gray-200 rounded-xl overflow-hidden transition-all duration-300">
                    <button
                      onClick={() => toggleSection('formations')}
                      className="w-full flex justify-between items-center px-8 py-5 text-left bg-gray-50 hover:bg-gray-100 transition"
                    >
                      <span className="text-xl font-bold text-blue-900">
                        Formations universitaires et professionnelles
                      </span>
                      {openSections.formations ? (
                        <ChevronUp className="text-blue-900" size={24} />
                      ) : (
                        <ChevronDown className="text-blue-900" size={24} />
                      )}
                    </button>

                    {openSections.formations && (
                      <div className="px-8 py-6 bg-white border-t border-gray-200">
                        <ul className="space-y-4 text-gray-800">
                          <li>• Diplôme de l'E.N.A (Économie financière) – Juin 1982 – École Nationale d'Administration, Alger, Algérie</li>
                          <li>• Diplôme 3ème cycle Magistère (option Banque) – Décembre 1990 – I.F.I.D, Tunis, Tunisie</li>
                          <li>• Formation sur la gestion des contrats internationaux / procédures Banque Mondiale – Juin 1996</li>
                          <li>• Formation sur l’Audit comptable et financier – Cabinet Ernst & Young, France – Janvier 1995</li>
                          <li>• Formation sur l’audit des comptes publics (I.I.A.P) – Paris, France – Juin 1995</li>
                          <li>• Formation Audit comptable et financier – Cabinet Andersen, France – 2002</li>
                          <li>• Diplôme d’expert consultant en diagnostic stratégique global de Mise à niveau des Entreprises – 2009</li>
                          <li>• Auditeur Principal ISO 9001:2008 SMQ – QMI Canada – 2010</li>
                          <li>• Diplôme d’Expert consultant en diagnostic de l’innovation des entreprises et GRH</li>
                          <li>• Conseiller à l’Export – Programme AFD/OPTIMEXPORT/ALGEX/UBIFRANCE – 2009/2010</li>
                          <li>• Commissaire aux comptes agréé par le Ministère des Finances – 2003-2010</li>
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Expérience professionnelle */}
                  <div className="border border-gray-200 rounded-xl overflow-hidden transition-all duration-300">
                    <button
                      onClick={() => toggleSection('experience')}
                      className="w-full flex justify-between items-center px-8 py-5 text-left bg-gray-50 hover:bg-gray-100 transition"
                    >
                      <span className="text-xl font-bold text-blue-900">
                        Expérience professionnelle
                      </span>
                      {openSections.experience ? (
                        <ChevronUp className="text-blue-900" size={24} />
                      ) : (
                        <ChevronDown className="text-blue-900" size={24} />
                      )}
                    </button>

                    {openSections.experience && (
                      <div className="px-8 py-6 bg-white border-t border-gray-200">
                        <ul className="space-y-4 text-gray-800">
                          <li>• Administrateur au Ministère des Transports, chargé de la gestion de la circulation routière – 1982/1984</li>
                          <li>• Inspecteur Général des Finances – I.G.F – Ministère des Finances – 1984/2003</li>
                          <li>• Expert formateur depuis 1993 – Universités et établissements publics et privés (E.N.A Alger, Universités de Mostaganem et Mascara, I.N.T Alger, INSIM Oran, IDRH Oran, CACEG)</li>
                          <li>• Consultant auprès de divers organismes internationaux (projets Union Européenne) et nationaux – 2002-2024</li>
                          <li>• Directeur du cabinet d’études, conseil et collèges de formation professionnelle agréés EFSAC et CACEG</li>
                          <li>• Commissaire aux comptes agréé et assermenté – Expert judiciaire assermenté – 2003-2010</li>
                          <li>• Expert consultant sur le projet Modernisation des systèmes budgétaires – Ministère des Finances – UE – 2006</li>
                          <li>• Expert court terme projet proximité rurale (Ministère de l’Agriculture) – Cabinet Agréé – 2009 – Union Européenne</li>
                          <li>• Expert consultant en mise à niveau des PME – Programme MEDA 2005/2007 et ANDPME – Ministère de l’Industrie et de la PME – 2008/2015</li>
                          <li>• Mission de formation et coaching sur la gestion financière et comptable des associations – Ministère de l’Emploi et du Travail – Programme PAJE – Cabinet SOFECO – 2014-2015</li>
                          <li>• Expert court terme élaboration du référentiel de formation de la licence Budget de l’État – Cabinet CCM – Ministère de l’Enseignement supérieur – Programme PAPS – Union Européenne – 2014/2015</li>
                          <li>• Expert permanent chargé de la formation professionnelle et accompagnement des Personnes vulnérables à la création d’Activités génératrices de revenus (AGR) – Cabinet DT Global – Espagne – Ministère de la Solidarité Nationale – Union Européenne – 2018-2020</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Signature finale */}
                <div className="text-right mt-16">
                  <p className="text-blue-900 font-bold text-2xl">
                    M. MEKHOUKH Ameur
                  </p>
                  <p className="text-gray-700 italic mt-1">
                    Directeur Général – CACEG Consulting
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}