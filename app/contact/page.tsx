"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import CallToAction from "@/app/certification-iso/components/CallToAction";
import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, Instagram, Facebook } from "lucide-react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ContactPage() {
  const [phones, setPhones] = useState<string[]>([]);
  const [email, setEmail] = useState("cacegdz@yahoo.fr");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const docRef = doc(db, "settings", "contact");

    const unsubscribe = onSnapshot(
      docRef,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data() || {};
          setPhones(data.phones || []);
          setEmail(data.email || "cacegdz@yahoo.fr");
        }
        setLoading(false);
      },
      (err) => {
        console.error("Erreur onSnapshot contact:", err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="relative h-[70vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <Image
          src="/contact.jpg"
          alt="Contact CACEG Formation"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
        <div className="relative z-10 text-center text-white px-6 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-black mb-8 drop-shadow-2xl">
            Contactez-nous
          </h1>
          <p className="text-2xl md:text-3xl drop-shadow-lg">
            Nous sommes à votre écoute pour toutes vos questions
          </p>
        </div>
      </section>

      {/* Section contact */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">
              Une question ? Un projet de formation ?
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              L'équipe CACEG est à votre disposition pour répondre à toutes vos
              demandes...
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start mb-20">
            {/* Left: Phones + Email */}
            <div className="space-y-12">
              {/* Téléphone – now shows all phones */}
              <div className="block bg-white rounded-3xl shadow-2xl p-10 text-center hover:shadow-3xl hover:scale-105 transition-all duration-300">
                <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Phone size={36} className="text-blue-900" />
                </div>
                <h3 className="text-2xl font-bold text-blue-900 mb-4">
                  Téléphone
                </h3>

                {loading ? (
                  <p className="text-lg text-gray-700">Chargement...</p>
                ) : phones.length > 0 ? (
                  <div className="space-y-2">
                    {phones.map((phone, index) => (
                      <p key={index} className="text-lg text-gray-700">
                        {phone}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-lg text-gray-700">
                    Aucun numéro disponible
                  </p>
                )}
              </div>

              {/* Email */}
              <a
                href={`mailto:${email}`}
                className="block bg-white rounded-3xl shadow-2xl p-10 text-center hover:shadow-3xl hover:scale-105 transition-all duration-300"
              >
                <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail size={36} className="text-blue-900" />
                </div>
                <h3 className="text-2xl font-bold text-blue-900 mb-4">Email</h3>
                {loading ? (
                  <p className="text-lg text-blue-900 font-medium">
                    Chargement...
                  </p>
                ) : (
                  <p className="text-lg text-blue-900 font-medium">{email}</p>
                )}
              </a>
            </div>

            {/* Droite : Google Maps */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden h-96 lg:h-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1279.811975106305!2d0.08729965573730469!3d35.930499998352!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1283b1f8a5e5e5e5%3A0x5e5e5e5e5e5e5e5!2sW3JQ%2BRW%20Mostaganem%2C%20Alg%C3%A9rie!5e0!3m2!1sfr!2sdz!4v1700000000000!5m2!1sfr!2sdz"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localisation CACEG Mostaganem"
              ></iframe>
            </div>
          </div>

          {/* Réseaux sociaux */}
          <div className="text-center">
            <h2 className="text-4xl font-bold text-blue-900 mb-10">
              Suivez-nous sur les réseaux sociaux
            </h2>
            <div className="grid md:grid-cols-3 gap-12 max-w-4xl mx-auto">
              <Link
                href="https://instagram.com/caceg_formation"
                target="_blank"
                className="group"
              >
                <div className="w-28 h-28 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl hover:scale-110 transition mx-auto">
                  <Instagram
                    size={52}
                    className="text-white group-hover:drop-shadow-lg"
                  />
                </div>
                <p className="mt-6 text-xl font-medium text-gray-700">
                  @caceg_formation
                </p>
              </Link>

              <Link
                href="https://facebook.com/CACEG Formation"
                target="_blank"
                className="group"
              >
                <div className="w-28 h-28 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl hover:scale-110 transition mx-auto">
                  <Facebook size={52} className="text-white" />
                </div>
                <p className="mt-6 text-xl font-medium text-gray-700">
                  CACEG Formation
                </p>
              </Link>

              <Link
                href="https://tiktok.com/@cacegformation"
                target="_blank"
                className="group"
              >
                <div className="w-28 h-28 bg-transparent rounded-3xl flex items-center justify-center shadow-2xl hover:scale-110 transition mx-auto">
                  <Image
                    src="/tiktok.png"
                    alt="TikTok CACEG"
                    width={100}
                    height={100}
                    className="object-contain"
                  />
                </div>
                <p className="mt-6 text-xl font-medium text-gray-700">
                  @cacegformation
                </p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CallToAction />

      <Footer />
    </>
  );
}
