'use client';

import Navbar from '@/components/NavBar';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Footer from '@/components/Footer';


interface Domaine {
  id: string;
  title: string;
  description?: string;
  image?: string;
  order?: number;
}

export default function ConsultingPage() {
  const [domaines, setDomaines] = useState<Domaine[]>([]);
  const [globalImageUrl, setGlobalImageUrl] = useState<string>("");

  // Charger les domaines
  useEffect(() => {
    const q = query(
      collection(db, "domaines"),
      orderBy("order", "asc")
    );

    const unsubDomaines = onSnapshot(q, (snap) => {
      const data = snap.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Domaine)
      );
      setDomaines(data);
    });

    // Charger l'image fixe à droite
    const unsubImage = onSnapshot(
      doc(db, "global-settings", "consulting-banner"),
      (snap) => {
        if (snap.exists()) {
          setGlobalImageUrl(snap.data()?.url || "");
        } else {
          setGlobalImageUrl("");
        }
      }
    );

    return () => {
      unsubDomaines();
      unsubImage();
    };
  }, []);

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="h-16 lg:h-20"></div> {/* Spacer pour navbar */}

      {/* Hero */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center bg-gradient-to-r from-blue-900 to-blue-800 text-white">
        <Image
          src="/IA.png"
          alt="Consulting CACEG"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-center px-6">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Consulting & Accompagnement
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            {"Votre partenaire stratégique pour l'excellence opérationnelle et la performance durable"}
          </p>
        </div>
      </section>

      {/* Introduction CACEG Consulting */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-blue-900 text-center mb-12">
            CACEG Consulting
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg text-gray-700 mb-6">
                {"Notre mission est d'accompagner les entreprises et les organisations dans leurs démarches d'amélioration continue et de recherche de la performance."}
              </p>
              <p className="text-lg text-gray-700 mb-6">
                {"À travers l'accès à une certification ISO, le déploiement de l'Excellence Opérationnelle, une gestion efficace des projets et un management des domaines variés, CACEG Consulting dispose de compétences permettant d'intervenir dans tous les domaines."}
              </p>
              <Link
                href="/contact"
                className="inline-block bg-yellow-500 text-blue-900 font-bold px-8 py-4 rounded-lg hover:bg-yellow-400 transition"
              >
                En savoir plus
              </Link>
            </div>
            <div className="flex justify-center">
              <Image
                src="/IA-consulting.png"
                alt="Équipe CACEG Consulting"
                width={600}
                height={400}
                className="rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Domaines de compétence – liste simple avec check jaune + image à droite */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-blue-900 text-center mb-12">
            Domaines de compétence
          </h2>

          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Colonne gauche : liste des domaines */}
            <div>
              {domaines.length === 0 ? (
                <p className="text-center text-gray-600 py-8">
                  Aucun domaine disponible pour le moment.
                </p>
              ) : (
                <ul className="space-y-5 text-lg md:text-xl text-gray-800">
                  {domaines.map((domaine) => (
                    <li 
                      key={domaine.id} 
                      className="flex items-center gap-4"
                    >
                      <span className="text-yellow-500 text-2xl font-black flex-shrink-0">✔</span>
                      <span className="leading-relaxed font-bold">{domaine.title}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Colonne droite : image fixe */}
            <div className="flex justify-center md:justify-end lg:pl-8">
              {globalImageUrl ? (
                <div className="w-full max-w-[480px] lg:max-w-[520px]">
                  <Image
                    src={globalImageUrl}
                    alt="Domaines de compétence CACEG Consulting"
                    width={520}
                    height={520}
                    className="rounded-2xl shadow-2xl object-cover w-full h-auto"
                    priority
                  />
                </div>
              ) : (
                <div className="w-full max-w-md aspect-square bg-gray-100 rounded-2xl flex items-center justify-center text-gray-500 text-center p-8">
                  Image illustrative des domaines de compétence
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Certification ISO */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-blue-900 mb-8">
            Accompagnement certification ISO
          </h2>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto mb-12">
            {"Engagez votre organisation dans une démarche de certification ISO. "}
{"CACEG Consulting vous accompagne jusqu'à la certification de votre "}
            {"système, vous proposant l'externalisation de la gestion de votre "}
            {"système une fois la certification acquise."}
          </p>
          <div className="flex justify-center mb-12">
            <Image
              src="/iso.jpeg"
              alt="ISO Certification CACEG"
              width={400}
              height={400}
              className="rounded-full"
            />
          </div>
          <Link
            href="/certification-iso"
            className="inline-block bg-yellow-500 text-blue-900 font-bold px-10 py-5 rounded-lg text-xl hover:bg-yellow-400 transition"
          >
            En savoir plus
          </Link>
        </div>
      </section>

      {/* Gestion de projet */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-blue-900 mb-6">
              Gestion de projet
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              {"Sécurisez votre projet depuis son démarrage jusqu'à sa livraison. CACEG Consulting se positionne comme un réel partenaire en vous accompagnant tout au long des phases de votre projet."}
            </p>
            <Link
              href="/contact"
              className="inline-block bg-yellow-500 text-blue-900 font-bold px-8 py-4 rounded-lg hover:bg-yellow-400 transition"
            >
              En savoir plus
            </Link>
          </div>
          <Image
            src="/gestion-projet.jpg"
            alt="Gestion de projet CACEG"
            width={600}
            height={400}
            className="rounded-xl shadow-2xl"
          />
        </div>
      </section>
 <Footer/>
    
    </main>
  );
}