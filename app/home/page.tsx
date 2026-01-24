"use client";

import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import SponsorsCarousel from "@/components/SponsorsCarousel";
import {
  collection,
  query,
  where,
  onSnapshot,
  limit,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ChevronRight } from "lucide-react";

const slides = [
  {
    image: "/hero1.jpeg",
    title: "PARTENAIRE PRIVILÉGIÉ DES PME",
    subtitle:
      "Des solutions sur mesure de formation, conseil et expertise de votre projet jusqu'à la concrétisation",
  },
  {
    image: "/hero2.jpg",
    title: "EXPERTISE & ACCOMPAGNEMENT",
    subtitle:
      "Formation professionnelle, consulting et études pour booster votre performance",
  },
  {
    image: "/hero4.jpg",
    title: "DÉVELOPPEZ VOS COMPÉTENCES",
    subtitle: "Formations adaptées à vos besoins et à votre secteur d'activité",
  },
  {
    image: "/consulting.jpg",
    title: "VERS LA RÉUSSITE DE VOS PROJETS",
    subtitle: "Un accompagnement complet pour atteindre vos objectifs",
  },
];

interface Formation {
  id: string;
  title: string;
  instructor: string;
  description: string;
  price: string;
  image: string;
  slug: string;
  featured?: boolean;
}

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [popularFormations, setPopularFormations] = useState<Formation[]>([]);
  const [isLoadingPopular, setIsLoadingPopular] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Fetch popular formations – MODIFIÉ : limit(6) au lieu de 4
  useEffect(() => {
    let unsubscribe: () => void = () => {};

    const loadPopular = async () => {
      console.log("Starting loadPopular...");
      setIsLoadingPopular(true);

      const q = query(
        collection(db, "formations"),
        where("featured", "==", true),
        orderBy("dateCreation", "desc"),
        limit(6)
      );

      try {
        console.log("Attempting getDocs...");
        const snap = await getDocs(q);
        console.log("getDocs succeeded! Count:", snap.size);
        const initial = snap.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as Formation)
        );
        console.log("Initial data:", initial);
        setPopularFormations(initial);
        setIsLoadingPopular(false);

        console.log("Attaching onSnapshot...");
        unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            console.log("onSnapshot fired! Count:", snapshot.size);
            const updated = snapshot.docs.map(
              (doc) =>
                ({
                  id: doc.id,
                  ...doc.data(),
                } as Formation)
            );
            setPopularFormations(updated);
          },
          (error) => {
            console.error("onSnapshot ERROR:", error.code, error.message);
            setIsLoadingPopular(false);
          }
        );
      } catch (err: any) {
        console.error(
          "Firestore query FAILED:",
          err.code || err.message || err
        );
        setIsLoadingPopular(false);
      }
    };

    loadPopular();

    return () => {
      console.log("Cleaning up...");
      unsubscribe();
    };
  }, []);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* HERO SLIDER */}
      <section className="relative h-[80vh] min-h-[600px] overflow-hidden group">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1500 ease-in-out ${
              index === currentSlide
                ? "opacity-100 scale-100"
                : "opacity-0 scale-105"
            }`}
          >
            <Image
              src={slide.image}
              alt={`CACEG Hero ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="relative h-full flex items-center justify-center text-center text-white px-6">
              <div
                className={`max-w-5xl transition-all duration-1000 delay-300 ${
                  index === currentSlide
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 drop-shadow-2xl">
                  {slide.title}
                </h1>
                <p className="text-xl md:text-3xl mb-10 drop-shadow-lg">
                  {slide.subtitle}
                </p>
                <Link
                  href="/contact"
                  className="inline-block bg-yellow-500 text-blue-900 font-bold px-10 py-5 rounded-full text-xl hover:bg-yellow-400 hover:shadow-2xl transition-all duration-500"
                >
                  EN SAVOIR PLUS
                </Link>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={prevSlide}
          className="absolute left-8 top-1/2 -translate-y-1/2 z-20 text-white text-5xl opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-700"
          aria-label="Slide précédent"
        >
          ‹
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-8 top-1/2 -translate-y-1/2 z-20 text-white text-5xl opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-700"
          aria-label="Slide suivant"
        >
          ›
        </button>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-500 ${
                index === currentSlide ? "bg-yellow-500 w-12" : "bg-white/70"
              } hover:bg-yellow-400`}
            />
          ))}
        </div>
      </section>

      {/* Une formation réussie... */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6">
              Une formation réussie, un accès facile à l'emploi
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              CACEG a développé une large gamme de formations pour partager et
              transmettre le savoir et les bonnes pratiques du management aux
              salariés de chaque entreprise.
            </p>
            <p className="text-lg text-gray-700 mb-8">
              Toutes nos formations sont adaptables à vos besoins et contexte
              (durée, programme, niveau de difficulté, nombre de
              participants...). Nous pouvons également concevoir des formations
              totalement sur mesure en tenant votre cahier des charges.
            </p>
            <Link
              href="/formations"
              className="inline-block bg-yellow-500 text-blue-900 font-bold px-8 py-4 rounded-lg hover:bg-yellow-400 transition"
            >
              EN SAVOIR PLUS
            </Link>
          </div>
          <div className="flex justify-center">
            <Image
              src="/formation-image.jpg"
              alt="Formation CACEG"
              width={600}
              height={400}
              className="rounded-xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* CACEG Formations + Consulting */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16">
          <div className="text-center md:text-left">
            <Image
              src="/image7.jpg"
              alt="CACEG Formations"
              width={600}
              height={400}
              className="rounded-xl shadow-xl mb-8 mx-auto md:mx-0"
            />
            <h2 className="text-3xl font-bold text-blue-900 mb-6">
              CACEG Formations
            </h2>
            <p className="text-gray-700 mb-8 text-lg">
              Nous proposons des formations inter-entreprises et des formations
              intra-entreprises. Caceg Formations identifie avec votre
              entreprise vos besoins en formation. Nous établissons ensemble un
              plan de formation en fonction de votre budget et de votre
              calendrier.
            </p>
            <Link
              href="/formations"
              className="inline-block bg-yellow-500 text-blue-900 font-bold px-8 py-4 rounded-lg hover:bg-yellow-400 transition"
            >
              Lire Plus
            </Link>
          </div>

          <div className="text-center md:text-left">
            <Image
              src="/consulting2.jpg"
              alt="CACEG Consulting"
              width={600}
              height={400}
              className="rounded-xl shadow-xl mb-8 mx-auto md:mx-0"
            />
            <h2 className="text-3xl font-bold text-blue-900 mb-6">
              CACEG Conseil et Etude
            </h2>
            <p className="text-gray-700 mb-8 text-lg">
              Nous avons pour mission d'accompagner les entreprises dans leurs
              projets d'évolution et de développement afin de les propulser vers
              la réussite de leurs objectifs de performance.
            </p>
            <Link
              href="/consulting"
              className="inline-block bg-yellow-500 text-blue-900 font-bold px-8 py-4 rounded-lg hover:bg-yellow-400 transition"
            >
              Lire Plus
            </Link>
          </div>
        </div>
      </section>

      {/* Formations Populaires  */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-blue-900 mb-12">
            Nos Formations Populaires
          </h2>

          {isLoadingPopular ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent"></div>
              <p className="mt-4 text-xl text-gray-600">
                Chargement des formations...
              </p>
            </div>
          ) : popularFormations.length === 0 ? (
            <p className="text-center text-2xl text-gray-600 py-20">
              Aucune formation populaire disponible pour le moment.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {popularFormations.map((f) => (
                <Link
                  href={`/formations/${f.slug}`}
                  key={f.id}
                  className="block"
                >
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 overflow-hidden h-full flex flex-col">
                    <div className="relative h-56">
                      <Image
                        src={
                          f.image ||
                          "https://via.placeholder.com/600x400?text=Formation+CACEG"
                        }
                        alt={f.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-8 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold text-blue-900 mb-3 line-clamp-2">
                        {f.title}
                      </h3>

                      <span className="text-blue-900 font-semibold hover:underline flex items-center gap-2 mt-auto">
                        En savoir plus{" "}
                        <span className="text-yellow-500">→</span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      {/* Sponsors */}
      <section className="py-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-blue-900 mb-12">
            Nos Clients
          </h2>
          <SponsorsCarousel />
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
