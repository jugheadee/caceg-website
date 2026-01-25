'use client';

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Navbar from '@/components/NavBar';
import Image from 'next/image';
import Link from "next/link";
import Footer from '@/components/Footer';
import { Calendar, MapPin, ChevronLeft, ChevronRight } from "lucide-react";

interface Evenement {
  id: string;
  titre: string;
  slug: string;
  date: string;
  lieu: string;
  categorie: string;
  description: string;
  imageUrl?: string;
  photos?: string[];
  statut: string;
  createdAt?: any;
}

export default function EvenementsPage() {
  const [evenements, setEvenements] = useState<Evenement[]>([]);
  const [filteredEvenements, setFilteredEvenements] = useState<Evenement[]>([]);
  const [activeFilter, setActiveFilter] = useState("Tous");
  const [expandedDescriptions, setExpandedDescriptions] = useState<{ [key: string]: boolean }>({});

  const [activePhotoIndices, setActivePhotoIndices] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const q = query(
      collection(db, "evenements"),
      where("statut", "==", "Publié"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Evenement[];
      setEvenements(data);

      const initialIndices: { [key: string]: number } = {};
      data.forEach((evt) => {
        if (evt.photos && evt.photos.length > 0) {
          initialIndices[evt.id] = 0;
        }
      });
      setActivePhotoIndices(initialIndices);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (activeFilter === "Tous") {
      setFilteredEvenements(evenements);
    } else {
      setFilteredEvenements(
        evenements.filter((evt) => evt.categorie === activeFilter)
      );
    }
  }, [evenements, activeFilter]);

  const nextPhoto = (eventId: string, totalPhotos: number) => {
    setActivePhotoIndices((prev) => ({
      ...prev,
      [eventId]: (prev[eventId] + 1) % totalPhotos,
    }));
  };

  const prevPhoto = (eventId: string, totalPhotos: number) => {
    setActivePhotoIndices((prev) => ({
      ...prev,
      [eventId]: (prev[eventId] - 1 + totalPhotos) % totalPhotos,
    }));
  };

  const goToPhoto = (eventId: string, index: number) => {
    setActivePhotoIndices((prev) => ({
      ...prev,
      [eventId]: index,
    }));
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      <div className="h-16 lg:h-20"></div>

      {/* Hero – Image qui prend toute la largeur sans trop couper */}
      <section className="relative h-[55vh] min-h-[600px] flex items-center justify-center text-center text-white overflow-hidden">
        <div className="absolute inset-0  to-transparent z-10"></div>
        <Image
          src="/event.jpg"
          alt="Événements CACEG"
          fill
          className="object-cover object-center brightness-75" // object-cover pour remplir toute la largeur, object-center pour centrer (moins de coupe haut/bas)
          priority
        />
        <div className="relative z-20 px-6 max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-2xl">
            Actualités CACEG
          </h1>
          <p className="text-xl md:text-2xl drop-shadow-xl">
            Formations, événements et réussites clients
          </p>
        </div>
      </section>

      {/* Filtres */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-lg border-b border-gray-200 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-3">
          {["Tous", "Formation", "Événement entreprise", "Conférence", "Actualité"].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-7 py-2.5 font-medium rounded-full transition-all duration-300 shadow-sm ${
                activeFilter === filter
                  ? "bg-blue-900 text-white shadow-md scale-105"
                  : "bg-white text-gray-700 hover:bg-yellow-50 hover:text-yellow-800 hover:shadow-md"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Liste des événements */}
      <section className="py-10 lg:py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 space-y-8">
          {filteredEvenements.length === 0 ? (
            <div className="text-center py-20 text-gray-500 text-xl bg-white rounded-2xl shadow">
              Aucun événement pour le moment...
            </div>
          ) : (
            filteredEvenements.map((evt) => {
              const photos = [evt.imageUrl, ...(evt.photos || [])].filter(Boolean) as string[];
              const currentIndex = activePhotoIndices[evt.id] || 0;
              const hasMultiplePhotos = photos.length > 1;

              return (
                <article
                  key={evt.id}
                  className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  {/* Slider photos compact */}
                  {photos.length > 0 && (
                    <div className="relative">
                      <div className="overflow-hidden rounded-t-2xl">
                        <div
                          className="flex transition-transform duration-600 ease-out"
                          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                        >
                          {photos.map((photo, index) => (
                            <div key={index} className="min-w-full">
                              <Image
                                src={photo}
                                alt={`${evt.titre} - photo ${index + 1}`}
                                width={1200}
                                height={300}
                                className="w-full h-48 lg:h-64 object-cover"
                                priority={index === 0}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {hasMultiplePhotos && (
                        <>
                          <button
                            onClick={() => prevPhoto(evt.id, photos.length)}
                            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2.5 rounded-full hover:bg-black/70 transition z-10"
                          >
                            <ChevronLeft size={22} />
                          </button>
                          <button
                            onClick={() => nextPhoto(evt.id, photos.length)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2.5 rounded-full hover:bg-black/70 transition z-10"
                          >
                            <ChevronRight size={22} />
                          </button>

                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2.5 z-10">
                            {photos.map((_, idx) => (
                              <button
                                key={idx}
                                onClick={() => goToPhoto(evt.id, idx)}
                                className={`w-2.5 h-2.5 rounded-full transition-all ${
                                  idx === currentIndex ? "bg-yellow-400 scale-125" : "bg-white/70 hover:bg-white"
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}

                      <div className="absolute top-4 left-4 bg-yellow-400 text-blue-950 px-4 py-1.5 rounded-full text-sm font-bold shadow z-10">
                        {evt.categorie}
                      </div>
                    </div>
                  )}

                  {/* Contenu texte compact */}
                  <div className="p-6 lg:p-8">
                    <h3 className="text-xl lg:text-2xl font-bold text-blue-950 mb-4 leading-tight">
                      {evt.titre}
                    </h3>

                    <div className="flex flex-wrap gap-5 text-gray-600 mb-4 text-sm lg:text-base">
                      <div className="flex items-center gap-2">
                        <Calendar size={18} />
                        {evt.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={18} />
                        {evt.lieu}
                      </div>
                    </div>

                    <p
                      className={`text-gray-700 text-base lg:text-lg leading-relaxed ${
                        expandedDescriptions[evt.id] ? "" : "line-clamp-5"
                      }`}
                    >
                      {evt.description}
                    </p>

                    {evt.description && evt.description.length > 200 && (
                      <button
                        onClick={() =>
                          setExpandedDescriptions((prev) => ({
                            ...prev,
                            [evt.id]: !prev[evt.id],
                          }))
                        }
                        className="
                          mt-4 inline-flex items-center gap-2
                          text-sm font-semibold
                          text-blue-900
                          bg-blue-50
                          px-4 py-2
                          rounded-full
                          hover:bg-blue-100
                          transition-all duration-300
                          group
                        "
                      >
                        <span>
                          {expandedDescriptions[evt.id] ? "Réduire" : "Lire la suite"}
                        </span>
                        <span className="transform transition-transform duration-300 group-hover:translate-x-1">
                          {expandedDescriptions[evt.id] ? "↑" : "→"}
                        </span>
                      </button>
                    )}
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}