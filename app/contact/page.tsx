"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import CallToAction from "@/app/certification-iso/components/CallToAction";
import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, X } from "lucide-react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { format } from "libphonenumber-js";

export default function ContactPage() {
  const [phones, setPhones] = useState<string[]>([]);
  const [email, setEmail] = useState("cacegdz@yahoo.fr");
  const [loading, setLoading] = useState(true);
  const [selectedPhone, setSelectedPhone] = useState<string | null>(null);

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

  const handlePhoneClick = (phone: string) => {
    const clean = phone.replace(/\D/g, "");
    setSelectedPhone(clean);
  };

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
            {/* Phones + Email */}
            <div className="space-y-12">
              {/* Téléphone */}
              <div className="block bg-white rounded-3xl shadow-2xl p-10 text-center hover:shadow-3xl hover:scale-105 transition-all duration-300">
                <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Phone size={36} className="text-blue-900" />
                </div>
                <h3 className="text-2xl font-bold text-blue-900 mb-4">
                  Téléphone
                </h3>

                {loading ? (
                  <p className="text-gray-500">Chargement...</p>
                ) : phones.length > 0 ? (
                  <div className="mt-6 space-y-4 flex flex-col items-center">
                    {phones.map((phone, index) => {
                      const cleanPhone = phone.replace(/\D/g, "");
                      const formatted = format(phone, "INTERNATIONAL") || phone;

                      return (
                        <button
                          key={index}
                          onClick={() => handlePhoneClick(phone)}
                          className="group px-5 text-lg md:text-xl font-medium text-blue-900 hover:text-blue-900 transition-colors duration-200 decoration-blue-400/60 rounded-lg hover:bg-blue-50/40 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2 "
                        >
                          {formatted}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm italic mt-4">
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
                  <p className="text-lg text-blue-900 font-medium break-all">
                    {email}
                  </p>
                )}
              </a>
            </div>

            {/* Google Maps */}
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

          {/* Social icons */}
          <div className="text-center mt-20">
            <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-12">
              Suivez-nous sur les réseaux sociaux
            </h2>

            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20">
              <Link
                href="https://instagram.com/caceg_formation"
                target="_blank"
                className="group"
              >
                <Image
                  src="/icons/instagram2.svg"
                  alt="Instagram"
                  width={95}
                  height={95}
                  className="text-gray-600 group-hover:text-pink-600 transition-colors duration-300"
                />
              </Link>

              <Link
                href="https://www.facebook.com/CacegConsulting"
                target="_blank"
                className="group"
              >
                <Image
                  src="/icons/facebook.svg"
                  alt="Facebook"
                  width={95}
                  height={95}
                  className="text-gray-600 group-hover:text-blue-600 transition-colors duration-300"
                />
              </Link>

              <Link
                href="https://www.tiktok.com/@cacegformation"
                target="_blank"
                className="group"
              >
                <Image
                  src="/icons/tiktok.svg"
                  alt="TikTok"
                  width={95}
                  height={95}
                  className="text-gray-600 group-hover:text-black transition-colors duration-300"
                />
              </Link>

              <Link
                href="https://www.linkedin.com/in/ameur-mekhoukh-66b6aa25/"
                target="_blank"
                className="group"
              >
                <Image
                  src="/icons/linkedin.svg"
                  alt="LinkedIn"
                  width={95}
                  height={95}
                  className="text-gray-600 group-hover:text-[#0a66c2] transition-colors duration-300"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CallToAction />
      <Footer />

      {/* Small centered popup modal */}
      {selectedPhone && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPhone(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-xs w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h4 className="text-lg font-semibold text-blue-900">
                {format(selectedPhone, "INTERNATIONAL")}
              </h4>
              <button
                onClick={() => setSelectedPhone(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 flex flex-col sm:flex-row gap-4">
              {/* Call button */}
              <a
                href={`tel:${selectedPhone}`}
                onClick={() => setSelectedPhone(null)}
                className="
      flex-1 flex items-center justify-center gap-2.5
      bg-blue-50 hover:bg-blue-100 
      text-blue-700 hover:text-blue-800
      py-3.5 px-5 rounded-xl 
      font-medium text-base
      transition-colors duration-200
    "
              >
                <Phone size={20} strokeWidth={2} />
                Appeler
              </a>

              {/* WhatsApp button – using YOUR svg file */}
              <a
                href={`https://wa.me/${selectedPhone}?text=${encodeURIComponent(
                  "Bonjour, je vous contacte depuis le site CACEG Consulting"
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setSelectedPhone(null)}
                className="flex-1 flex items-center justify-center gap-2.5 bg-green-50 hover:bg-green-100 text-green-700 hover:text-green-800 py-3.5 px-5 rounded-xl font-medium text-base transition-colors duration-200"
              >
                <Image
                  src="/icons/whatsapp.svg"
                  alt="WhatsApp"
                  width={24}
                  height={24}
                  className="h-6 w-6" // ← consistent icon size
                  // If your SVG has its own green color → remove these two lines:
                  // style={{ filter: 'brightness(0) saturate(100%) invert(48%) sepia(79%) saturate(2476%) hue-rotate(86deg) brightness(118%) contrast(119%)' }}
                  // If you want it to change color on hover, you can keep a filter or use currentColor if the SVG supports it
                />
                WhatsApp
              </a>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 text-center">
              <button
                onClick={() => setSelectedPhone(null)}
                className="text-gray-600 hover:text-gray-800 text-base font-medium"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
