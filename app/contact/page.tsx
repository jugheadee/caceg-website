'use client';

import Navbar from '@/components/NavBar';
import Footer from '@/components/Footer';
import CallToAction from "@/app/certification-iso/components/CallToAction";
import Image from 'next/image';
import Link from 'next/link';
import { Mail, Phone, Instagram, Facebook } from "lucide-react";

export default function ContactPage() {
  return (
    <>
      <Navbar />

      {/* Hero avec contact.jpg */}
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
              L'équipe CACEG est à votre disposition pour répondre à toutes vos demandes. 
              Que ce soit pour une inscription, un partenariat, ou simplement un conseil, 
              n'hésitez pas à nous contacter. Nous vous répondrons dans les plus brefs délais.
            </p>
          </div>

          {/* Layout : Téléphone + Email à gauche, Google Maps à droite */}
          <div className="grid lg:grid-cols-2 gap-12 items-start mb-20">
            {/* Gauche : Téléphone et Email l'un en dessous de l'autre */}
            <div className="space-y-12">
             {/* Téléphone – clic ouvre l'app téléphone */}
<a 
  href="tel:+21323588676" 
  className="block bg-white rounded-3xl shadow-2xl p-10 text-center hover:shadow-3xl hover:scale-105 transition-all duration-300"
>
  <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
    <Phone size={36} className="text-blue-900" />
  </div>
  <h3 className="text-2xl font-bold text-blue-900 mb-4">Téléphone</h3>
  <p className="text-lg text-gray-700 mb-2">+213 (0)23 58 86 76</p>
  <p className="text-lg text-gray-700">+213 (0)550 177 84</p>
</a>

{/* Email – clic ouvre l'app mail */}
<a 
  href="mailto:cacegdz@yahoo.fr" 
  className="block bg-white rounded-3xl shadow-2xl p-10 text-center hover:shadow-3xl hover:scale-105 transition-all duration-300"
>
  <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
    <Mail size={36} className="text-blue-900" />
  </div>
  <h3 className="text-2xl font-bold text-blue-900 mb-4">Email</h3>
  <p className="text-lg text-blue-900 font-medium">
    cacegdz@yahoo.fr
  </p>
</a>
            </div>

            {/* Droite : Google Maps intégrée */}
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

          {/* Réseaux sociaux en avant – exactement comme tu l’avais */}
          <div className="text-center">
            <h2 className="text-4xl font-bold text-blue-900 mb-10">
              Suivez-nous sur les réseaux sociaux
            </h2>
            <div className="grid md:grid-cols-3 gap-12 max-w-4xl mx-auto">
              {/* Instagram */}
              <Link 
                href="https://instagram.com/caceg_formation" 
                target="_blank"
                className="group"
              >
                <div className="w-28 h-28 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl hover:scale-110 transition mx-auto">
                  <Instagram size={52} className="text-white group-hover:drop-shadow-lg" />
                </div>
                <p className="mt-6 text-xl font-medium text-gray-700">@caceg_formation</p>
              </Link>

              {/* Facebook */}
              <Link 
                href="https://facebook.com/CACEG Formation" 
                target="_blank"
                className="group"
              >
                <div className="w-28 h-28 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl hover:scale-110 transition mx-auto">
                  <Facebook size={52} className="text-white" />
                </div>
                <p className="mt-6 text-xl font-medium text-gray-700">CACEG Formation</p>
              </Link>

              {/* TikTok avec ton logo personnalisé – comme tu l’avais */}
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
                <p className="mt-6 text-xl font-medium text-gray-700">@cacegformation</p>
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