'use client';

import Navbar from '@/components/NavBar';
import Image from 'next/image';
import Footer from '@/components/Footer';
import { useState } from 'react';
import { ChevronDown, ChevronUp, Linkedin } from 'lucide-react';

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
            
            {/* Header */}
            <div className="relative bg-gradient-to-r from-blue-900 to-blue-800 text-white py-20 px-8 md:px-16">
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
                  <div className="absolute inset-0 rounded-full border-4 border-yellow-400 opacity-20 pointer-events-none"></div>
                </div>
              </div>
            </div>

            {/* Contenu */}
            <div className="pt-48 pb-16 px-8 md:px-16 text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-3">
                M. MEKHOUKH Ameur
              </h1>

              <p className="text-xl md:text-2xl text-gray-700 font-medium mb-4">
                Directeur Général – Expert Consultant Formateur
              </p>

              {/* LinkedIn */}
              <div className="flex justify-center mb-12">
                <a
                  href="https://www.linkedin.com/in/ameur-mekhoukh-66b6aa25/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-500 hover:text-[#0A66C2] transition-colors group"
                  aria-label="Profil LinkedIn de M. MEKHOUKH Ameur"
                >
                  <div className="w-11 h-11 rounded-full border border-gray-300 flex items-center justify-center group-hover:border-[#0A66C2] transition">
                    <Linkedin size={22} />
                  </div>
                  <span className="text-sm font-medium opacity-80 group-hover:opacity-100">
                    LinkedIn
                  </span>
                </a>
              </div>

              <div className="max-w-4xl mx-auto text-left text-lg md:text-xl text-gray-800 leading-relaxed space-y-8">
                <p className="text-center italic text-blue-900 font-semibold text-xl mb-12">
                  « La qualité de la formation et du conseil est la clé de la performance durable de l’entreprise. »
                </p>

                <p>
                  Le Collège Algérien de Comptabilité et d’Études en Gestion (CACEG CONSULTING)
                  est né de la conviction que la formation professionnelle et l’accompagnement
                  des entreprises constituent le socle de tout développement économique durable.
                </p>

                <p>
                  Depuis janvier 2011, nous accompagnons les entreprises algériennes dans leur montée
                  en compétences à travers des formations certifiantes, des études conseils et une
                  assistance technique de qualité.
                </p>

                <p>
                  Avec un effectif permanent de 6 personnes et plus de 50 consultants/formateurs experts,
                  nous mettons notre savoir-faire au service de la réussite de nos clients.
                </p>

                {/* Accordéon */}
                <div className="mt-16 space-y-5">
                  
                  {/* Formations universitaires et professionnelles */}
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleSection('formations')}
                      className="w-full flex justify-between items-center px-8 py-5 bg-gray-50 hover:bg-gray-100 transition"
                    >
                      <span className="text-xl font-bold text-blue-900">
                        Formations universitaires et professionnelles
                      </span>
                      {openSections.formations ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                    </button>

                    {openSections.formations && (
                      <div className="px-8 py-6 bg-white border-t border-gray-200">
                        <ul className="space-y-4 text-gray-700 text-lg">
                          <li className="flex items-start gap-3">
                            <span className="text-yellow-500 mt-1">•</span>
                            <span>
                              <strong>Diplôme de l’École Nationale d’Administration (Économie financière)</strong> – Juin 1982, Alger, Algérie
                            </span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="text-yellow-500 mt-1">•</span>
                            <span>
                              <strong>Diplôme de 3ème cycle Magistère (option Banque)</strong> – Décembre 1990, IFID, Tunis, Tunisie
                            </span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="text-yellow-500 mt-1">•</span>
                            <span>
                              <strong>Formation sur la gestion des contrats internationaux et procédures Banque Mondiale</strong> – Juin 1996
                            </span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="text-yellow-500 mt-1">•</span>
                            <span>
                              <strong>Formation Audit comptable et financier</strong> – Cabinet Ernest & Young, France – Janvier 1995
                            </span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="text-yellow-500 mt-1">•</span>
                            <span>
                              <strong>Formation Audit des comptes publics</strong> – IIAP, Paris, France – Juin 1995
                            </span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="text-yellow-500 mt-1">•</span>
                            <span>
                              <strong>Formation Audit comptable et financier</strong> – Cabinet Andersen, France – 2002
                            </span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="text-yellow-500 mt-1">•</span>
                            <span>
                              <strong>Diplôme d’Expert consultant en diagnostic stratégique global de mise à niveau des entreprises</strong> – 2009
                            </span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="text-yellow-500 mt-1">•</span>
                            <span>
                              <strong>Auditeur Principal ISO 9001/2008 (SMQ)</strong> – QMI Canada – 2010
                            </span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="text-yellow-500 mt-1">•</span>
                            <span>
                              <strong>Diplôme d’Expert consultant en diagnostic de l’innovation des entreprises et GRH</strong>
                            </span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="text-yellow-500 mt-1">•</span>
                            <span>
                              <strong>Conseiller à l’Export</strong> – Programme AFD/OPTIMEXPORT/ALGEX/UBIFRANCE – 2009/2010
                            </span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="text-yellow-500 mt-1">•</span>
                            <span>
                              <strong>Commissaire aux comptes agréé par le Ministère des Finances</strong> – 2003-2010
                            </span>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Expérience professionnelle */}
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleSection('experience')}
                      className="w-full flex justify-between items-center px-8 py-5 bg-gray-50 hover:bg-gray-100 transition"
                    >
                      <span className="text-xl font-bold text-blue-900">
                        Expérience professionnelle
                      </span>
                      {openSections.experience ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                    </button>

                    {openSections.experience && (
                      <div className="px-8 py-6 bg-white border-t border-gray-200">
                        <ul className="space-y-4 text-gray-700 text-lg">
                          <li className="flex items-start gap-3">
                            <span className="text-yellow-500 mt-1">•</span>
                            <span>
                              <strong>Administrateur au Ministère des Transports</strong>, chargé de la gestion de la circulation routière – 1982/1984
                            </span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="text-yellow-500 mt-1">•</span>
                            <span>
                              <strong>Inspecteur Général des Finances (I.G.F)</strong> – Ministère des Finances – 1984/2003
                            </span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="text-yellow-500 mt-1">•</span>
                            <span>
                              <strong>Expert formateur depuis 1993</strong> (Universités et établissements publics/privés : ENA Alger, Universités de Mostaganem et Mascara, INT Alger, INSIM Oran, IDRH Oran, CACEG, etc.)
                            </span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="text-yellow-500 mt-1">•</span>
                            <span>
                              <strong>Consultant</strong> auprès d’organismes internationaux (projets Union Européenne) et nationaux – 2002-2024
                            </span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="text-yellow-500 mt-1">•</span>
                            <span>
                              <strong>Directeur du cabinet d’études conseil et des collèges de formation professionnelle agréés EFSAC et CACEG</strong>
                            </span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="text-yellow-500 mt-1">•</span>
                            <span>
                              <strong>Commissaire aux comptes agréé et assermenté, Expert judiciaire assermenté</strong> – 2003-2010
                            </span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="text-yellow-500 mt-1">•</span>
                            <span>
                              <strong>Expert consultant</strong> sur le projet Modernisation des systèmes budgétaires – Ministère des Finances / UE – 2006
                            </span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="text-yellow-500 mt-1">•</span>
                            <span>
                              <strong>Expert court terme</strong> projet proximité rurale – Ministère de l’Agriculture / Cabinet Agreer – 2009 (Union Européenne)
                            </span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="text-yellow-500 mt-1">•</span>
                            <span>
                              <strong>Expert consultant en mise à niveau des PME</strong> – Programme MEDA (2005/2007) et ANDPME – Ministère de l’Industrie et de la PME (2008/2015)
                            </span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="text-yellow-500 mt-1">•</span>
                            <span>
                              <strong>Mission de formation et coaching</strong> sur la gestion financière et comptable des associations – Ministère de l’Emploi et du Travail / Union Européenne – Programme PAJE / Cabinet SOFECO – 2014-2015
                            </span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="text-yellow-500 mt-1">•</span>
                            <span>
                              <strong>Expert court terme</strong> élaboration du référentiel de formation de la licence Budget de l’État – Cabinet CCM / Ministère de l’Enseignement Supérieur – Programme PAPS / Union Européenne – 2014/2015
                            </span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="text-yellow-500 mt-1">•</span>
                            <span>
                              <strong>Expert permanent</strong> chargé de la formation professionnelle – Projet de formation et accompagnement des personnes vulnérables à la création d’AGR – Cabinet DT Global (Espagne) / Ministère de la Solidarité Nationale / Union Européenne – 2018-2020
                            </span>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Signature */}
                <div className="text-right mt-16">
                  <p className="text-blue-900 font-bold text-2xl">
                    M. MEKHOUKH Ameur
                  </p>
                  <p className="text-gray-700 italic">
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