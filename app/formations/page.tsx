'use client';

import Navbar from '@/components/NavBar';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Footer from '@/components/Footer';
import { Search, Download } from "lucide-react";

interface Formation {
  id: string;
  title: string;
  instructor: string;
  description: string;
  price: string;
  image: string;
  slug: string;
}

const ITEMS_PER_PAGE = 6;

export default function FormationsPage() {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [filteredFormations, setFilteredFormations] = useState<Formation[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Chargement des formations depuis Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "formations"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Formation));
      setFormations(data);
      setFilteredFormations(data);
      setLoading(false);
    }, (error) => {
      console.error("Erreur chargement formations:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filtre par recherche
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredFormations(formations);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredFormations(
        formations.filter((f) =>
          f.title.toLowerCase().includes(query) ||
          f.description.toLowerCase().includes(query)
        )
      );
    }
    setCurrentPage(1); // reset page quand on recherche
  }, [searchQuery, formations]);

  const totalPages = Math.ceil(filteredFormations.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentFormations = filteredFormations.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="h-16 lg:h-20"></div>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-2xl text-blue-900">Chargement des formations...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="h-16 lg:h-20"></div>

      {/* Hero – inchangé */}
      <section className="relative h-[70vh] min-h-[600px] flex items-center justify-center text-center text-white overflow-hidden">
        <Image
          src="/formation-hero.jpg"
          alt="Formations professionnelles CACEG"
          fill
          className="object-cover brightness-75"
          priority
        />
        <div className="relative z-10 px-6 max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-2xl">
            Toutes Nos Formations
          </h1>
          <p className="text-xl md:text-3xl drop-shadow-lg max-w-3xl mx-auto">
            Découvrez notre catalogue complet de formations professionnelles adaptées à vos besoins en management, RH, finance et plus.
          </p>
        </div>
      </section>

      {/* NOUVEAU : Bouton Télécharger le catalogue – simple, classe, moderne */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <a
            href="/catalogue/catalogues-formations.pdf"
            download="catalogues-formations.pdf"
            className="inline-flex items-center gap-4 bg-yellow-500 text-blue-700 font-bold text-xl md:text-2xl px-10 py-6 rounded-2xl shadow-xl hover:bg-yellow-400 hover:shadow-2xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-300"
          >
            <Download className="w-8 h-8 md:w-10 md:h-10 " />
            Télécharger  le catalogue des formations
          </a>
          <p className="mt-4 text-gray-600 text-lg">
            (Janvier 2026 – Catalogue complet CACEG)
          </p>
        </div>
      </section>

      {/* Barre de recherche – inchangée */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-900" size={24} />
              <input
                type="text"
                placeholder="Rechercher une formation par titre ou description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-16 pr-8 py-5 text-lg border-2 border-blue-900 rounded-2xl focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200 transition bg-white shadow-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Liste des formations – inchangée */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          {filteredFormations.length === 0 ? (
            <p className="text-center text-2xl text-gray-600 py-20">
              {searchQuery ? "Aucune formation ne correspond à votre recherche." : "Aucune formation disponible pour le moment."}
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {currentFormations.map((f) => (
                <Link href={`/formations/${f.slug}`} key={f.id} className="block">
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 overflow-hidden">
                    <div className="relative h-56">
                      <Image 
                        src={f.image || "/placeholder-formation.jpg"}  // ← Remplace placeholder par une image locale pour fixer l’erreur DNS
                        alt={f.title} 
                        fill 
                        className="object-cover" 
                      />
                      <span
                        className={`absolute top-4 right-4 px-4 py-2 rounded-full font-bold text-sm ${
                          f.price === "Gratuit" ? 'bg-yellow-500 text-blue-900' : 'bg-green-600 text-white'
                        }`}
                      >
                        {f.price}
                      </span>
                    </div>
                    <div className="p-8">
                      <h3 className="text-xl font-bold text-blue-900 mb-3 line-clamp-2">{f.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">Par {f.instructor || "CACEG"}</p>
                      <p className="text-gray-700 line-clamp-3 mb-6">{f.description}</p>
                      <span className="text-blue-900 font-semibold hover:underline flex items-center gap-2">
                        En savoir plus <span className="text-yellow-500">→</span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination – inchangée */}
          {totalPages > 1 && (
            <div className="mt-16 flex items-center justify-center gap-4 flex-wrap">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="bg-blue-900 text-white px-8 py-4 rounded-lg hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                ← Précédent
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-6 py-4 rounded-lg font-bold transition ${
                    currentPage === i + 1
                      ? 'bg-yellow-500 text-blue-900'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="bg-blue-900 text-white px-8 py-4 rounded-lg hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Suivant →
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer/>
    </main>
  );
}