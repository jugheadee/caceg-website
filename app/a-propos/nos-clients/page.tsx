"use client";

import Navbar from "@/components/NavBar";
import Image from "next/image";
import Footer from "@/components/Footer";

const clients = [
  {
    src: "/logos/knauf-seeklogo.png",
    alt: "Knauf",
    url: "https://www.knauf.com/",
  },
  {
    src: "/logos/algerie-telecom-seeklogo.png",
    alt: "Algérie Telecom",
    url: "https://www.algerietelecom.dz/",
  },
  { src: "/logos/safina.png", alt: "Safina" },
  {
    src: "/logos/cevital3.png",
    alt: "Cevital",
    url: "https://www.cevital.com/",
  },
  { src: "/logos/ferti-plant.png", alt: "EP Ferti Plant" },
  { src: "/logos/gisb-electric.png", alt: "GISB" },
  { src: "/logos/cetic.png", alt: "CETIC" },
  { src: "/logos/mk.png", alt: "MK" },
  { src: "/logos/Mostaland.jpg", alt: "Mostaland" },
  { src: "/logos/epm.png", alt: "epm" },
  { src: "/logos/mosta-glaces.png", alt: "Mosta Glaces" },
  {
    src: "/logos/az-hotels.png",
    alt: "AZ Hotels",
    url: "https://www.azhotels.dz/",
  },
  { src: "/logos/setram-seeklogo.png", alt: "Setram" },
  { src: "/logos/pacha.png", alt: "Pacha" },
  { src: "/logos/oravio.png", alt: "GAO Oravio" },
];

export default function NosClients() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="h-16 lg:h-20"></div>

      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center text-center text-white overflow-hidden">
        <Image
          src="/clients1.jpg" 
          alt="Références CACEG"
          fill
          className="object-cover brightness-[0.65] object-[center_19%]"
          priority
        />
        <div className="relative z-10 px-6 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-2xl">
            Nos Références
          </h1>
          <p className="text-xl md:text-2xl drop-shadow-lg max-w-3xl mx-auto">
           Entreprises qui nous ont fait confiance
          </p>
        </div>
      </section>

      {/* Section grille */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white rounded-3xl shadow-2xl p-10 md:p-16 text-center">
            {/* Flex avec largeurs calculées pour forcer 2/3/4 par ligne et centrer la dernière */}
            <div className="flex flex-wrap justify-center gap-12 md:gap-16">
              {clients.map((logo, i) => (
                <div
                  key={i}
                  className="relative h-[180px] md:h-[200px] w-[calc(100%/2-24px)] sm:w-[calc(100%/3-32px)] md:w-[calc(100%/4-48px)] flex items-center justify-center group"
                >
                  {logo.url ? (
                    <a
                      href={logo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative w-full h-full block cursor-pointer"
                    >
                      <Image
                        src={logo.src}
                        alt={logo.alt}
                        fill
                        className="object-contain select-none transition-all duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 180px, (max-width: 1024px) 220px, 260px"
                        priority={i < 8}
                      />
                    </a>
                  ) : (
                    <div className="relative w-full h-full">
                      <Image
                        src={logo.src}
                        alt={logo.alt}
                        fill
                        className="object-contain select-none transition-all duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 180px, (max-width: 1024px) 220px, 260px"
                        priority={i < 8}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <p className="mt-16 text-gray-600 italic text-lg">
              Et de nombreuses autres entreprises et institutions nous font
              confiance…
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
