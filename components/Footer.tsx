// components/Footer.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { format } from "libphonenumber-js";

export default function Footer() {
  const [phones, setPhones] = useState<string[]>([]);
  const [email, setEmail] = useState("ayoub@anis.com");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const docRef = doc(db, "settings", "contact");

    const unsubscribe = onSnapshot(
      docRef,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data() || {};
          setPhones(data.phones || []);
          setEmail(data.email || "ayoub@anis.com");
        }
        setLoading(false);
      },
      (err) => {
        console.error("Erreur chargement footer:", err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const whatsappMain = phones[0] ? phones[0].replace(/\D/g, "") : "";

  return (
    <footer className="bg-blue-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* CACEG */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">CACEG</h3>
            <p className="text-sm leading-relaxed opacity-90">
              Spécialisé en formation professionnelle, consulting en management
              et ressources humaines (RH). Cabinet agréé en Algérie.
            </p>
          </div>

          {/* Liens utiles – sans FAQ */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              Liens utiles
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: "Formations", href: "/formations" },
                { label: "Actualités", href: "/actualites" },
                { label: "À propos", href: "/a-propos/presentation" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:text-white transition-colors flex items-center gap-2 opacity-90 hover:opacity-100"
                  >
                    <span className="text-yellow-500">›</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Coordonnées */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              Coordonnées
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin
                  size={18}
                  className="text-yellow-500 mt-0.5 flex-shrink-0"
                />
                <span>
                  01, Place Ayachi Abderrahmane, <br /> BPS18 RP, Mostaganem,
                  Algérie
                </span>
              </li>

              {loading ? (
                <li className="flex items-center gap-3 opacity-70">
                  <Phone size={18} className="text-yellow-500" />
                  <span>Chargement...</span>
                </li>
              ) : (
                phones.map((phone, idx) => {
                  const clean = phone.replace(/\D/g, "");
                  const formatted = format(phone, "INTERNATIONAL") || phone;
                  return (
                    <li key={idx} className="flex items-center gap-3">
                      <Phone
                        size={18}
                        className="text-yellow-500 flex-shrink-0"
                      />
                      <a
                        href={`tel:${clean}`}
                        className="hover:text-white transition-colors"
                      >
                        {formatted}
                      </a>
                    </li>
                  );
                })
              )}

              <li className="flex items-center gap-3">
                <Mail size={18} className="text-yellow-500 flex-shrink-0" />
                <a
                  href={`mailto:${email}`}
                  className="hover:text-white transition-colors break-all"
                >
                  {loading ? "Chargement..." : email}
                </a>
              </li>

              {whatsappMain && (
                <li className="flex items-center gap-3">
                  <Send size={18} className="text-yellow-500 flex-shrink-0" />
                  <a
                    href={`https://wa.me/${whatsappMain}?text=${encodeURIComponent(
                      "Bonjour, je vous contacte depuis le site CACEG Consulting"
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    WhatsApp
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="flex flex-col items-center">
              <h3 className="text-white font-semibold text-lg mb-4">
                CACEG est agréé par :
              </h3>
              <Image
                src="/logos/fede.png"
                alt="FEDE - Fédération Européenne Des Écoles"
                width={220}
                height={98}
                className="object-contain opacity-90 hover:opacity-100 transition-opacity max-w-[180px]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="border-t border-blue-900/60 bg-blue-950/70">
        <div className="max-w-7xl mx-auto px-6 py-5 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} CACEG. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
