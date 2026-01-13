'use client';

import Navbar from '@/components/NavBar';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import SponsorsCarousel from '@/components/SponsorsCarousel';
import {
  collection,
  query,
  where,
  onSnapshot,
  limit,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ChevronRight } from "lucide-react";
const slides = [
  {
    image: "/hero1.jpeg",
    title: "PARTENAIRE PRIVILÉGIÉ DES PME",
    subtitle: "Des solutions sur mesure de formation, conseil et expertise de votre projet jusqu'à la concrétisation",
  },
  {
    image: "/hero2.jpg",
    title: "EXPERTISE & ACCOMPAGNEMENT",
    subtitle: "Formation professionnelle, consulting et études pour booster votre performance",
  },
  {
    image: "/hero4.jpg",
    title: "FORMATION QUALIFIANTE",
    subtitle: "Des programmes adaptés à vos besoins pour développer vos compétences",
  },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [formations, setFormations] = useState<any[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const q = query(
      collection(db, "formations"),
      where("featured", "==", true),
      orderBy("dateCreation", "desc"),
      limit(4)
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setFormations(data);
    });

    return () => unsub();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Slider */}
      <section className="relative h-[90vh] overflow-hidden">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
              currentSlide === i ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center text-white px-4">
                <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                  {slide.title}
                </h1>
                <p className="text-xl md:text-3xl font-light max-w-4xl mx-auto">
                  {slide.subtitle}
                </p>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Popular Formations – sans prix */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-blue-900 mb-16 text-center">
            Formations Populaires
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {formations.map((f) => (
              <Link
                key={f.id}
                href={`/formations/${f.slug}`}
                className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative h-80">
                  <Image
                    src={f.image || "/placeholder-formation.jpg"}
                    alt={f.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {f.title}
                  </h3>
                  <p className="text-yellow-400 font-medium mb-4">
                    {f.instructor || "Instructeur CACEG"}
                  </p>
                  <div className="flex items-center justify-between text-white text-sm">
                    <span>{f.duration || "Durée variable"}</span>
                    <span>{f.coursesCount || "Multiple modules"}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link
              href="/formations"
              className="inline-flex items-center gap-2 bg-blue-900 text-white font-bold px-8 py-5 rounded-xl hover:bg-blue-800 transition shadow-lg text-xl"
            >
              Voir toutes les formations
              <ChevronRight size={24} />
            </Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-blue-900 mb-16 text-center">
            Nos Services
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition">
              <Image
                src="/formation.jpg"
                alt="Formation Professionnelle"
                width={400}
                height={250}
                className="rounded-2xl mb-6 object-cover"
              />
              <h3 className="text-2xl font-bold text-blue-900 mb-4">
                Formation Professionnelle
              </h3>
              <p className="text-gray-600 mb-6">
                Programmes de formation qualifiants adaptés aux besoins des entreprises et des particuliers.
              </p>
              <Link
                href="/formations"
                className="text-yellow-500 font-bold hover:text-yellow-600 transition flex items-center gap-2"
              >
                Découvrir nos formations <ChevronRight size={20} />
              </Link>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition">
              <Image
                src="/consulting.jpg"
                alt="Consulting"
                width={400}
                height={250}
                className="rounded-2xl mb-6 object-cover"
              />
              <h3 className="text-2xl font-bold text-blue-900 mb-4">
                Consulting
              </h3>
              <p className="text-gray-600 mb-6">
                Accompagnement stratégique pour optimiser vos processus et booster votre performance.
              </p>
              <Link
                href="/services"
                className="text-yellow-500 font-bold hover:text-yellow-600 transition flex items-center gap-2"
              >
                En savoir plus <ChevronRight size={20} />
              </Link>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition">
              <Image
                src="/etudes.jpg"
                alt="Études et Expertises"
                width={400}
                height={250}
                className="rounded-2xl mb-6 object-cover"
              />
              <h3 className="text-2xl font-bold text-blue-900 mb-4">
                Études et Expertises
              </h3>
              <p className="text-gray-600 mb-6">
                Analyses approfondies et expertise technique pour vos projets complexes.
              </p>
              <Link
                href="/services"
                className="text-yellow-500 font-bold hover:text-yellow-600 transition flex items-center gap-2"
              >
                En savoir plus <ChevronRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsors */}
      <SponsorsCarousel />

      {/* CTA */}
      <section className="py-24 bg-blue-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)]" />

        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Prêt à booster votre carrière ?
          </h2>
          <p className="text-xl mb-12 max-w-3xl mx-auto opacity-90">
            Rejoignez CACEG et bénéficiez de formations de qualité adaptées à vos besoins professionnels.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 bg-yellow-500 text-blue-900 font-bold px-10 py-5 rounded-xl hover:bg-yellow-400 transition shadow-lg text-xl"
          >
            Nous contacter
            <ChevronRight size={24} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="flex flex-col gap-6">
              <Image
                src="/logos/caceg-white.png"
                alt="CACEG"
                width={200}
                height={60}
                className="object-contain mb-4"
              />
              <p className="text-gray-300 max-w-md">
                Centre agréé de formation professionnelle, consulting et études.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <h3 className="text-xl font-bold">Liens rapides</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/" className="hover:text-yellow-400 transition">
                    Accueil
                  </Link>
                </li>
                <li>
                  <Link href="/formations" className="hover:text-yellow-400 transition">
                    Formations
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="hover:text-yellow-400 transition">
                    Services
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-yellow-400 transition">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-6">
              <h3 className="text-xl font-bold">Contact</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <span className="text-2xl opacity-80">📍</span>
                  Cité 30 logements LSP Bt D N 13 - Les Andalouses - Oran
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-2xl opacity-80">📞</span>
                  0770 94 83 41
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-2xl opacity-80">✉</span>
                  <a href="mailto:contact@caceg-dz.com" className="hover:text-white transition">
                    contact@caceg-dz.com
                  </a>
                </li>
              </ul>
            </div>

            <div className="flex flex-col items-end justify-start pr-8">
              <p className="text-sm text-gray-400 mb-4 w-full text-right">
                CACEG est agréé par :
              </p>
              <Image
                src="/logos/fede.png"
                alt="FEDE - Fédération Européenne Des Écoles"
                width={180}
                height={80}
                className="object-contain"
              />
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-blue-800 text-center text-sm text-gray-400">
            © {new Date().getFullYear()} CACEG. Tous droits réservés. Designed by sefrone
          </div>
        </div>
      </footer>
    </main>
  );
}