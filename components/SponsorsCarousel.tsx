"use client";

import Image from "next/image";

const sponsors = [
  {
    src: "/logos/sonelgaz.png",
    alt: "Sonelgaz",
    url: "https://www.sonelgaz.dz", // Site officiel Sonelgaz
  },
  {
    src: "/logos/sonatrach.png",
    alt: "Sonatrach",
    url: "https://www.sonatrach.com", // Site officiel Sonatrach
  },
  {
    src: "/logos/cevital3.png",
    alt: "Cevital",
    url: "https://www.cevital.com", // Site officiel Cevital
  },
  {
    src: "/logos/az-hotels.png",
    alt: "AZ Hotels",
    url: "https://www.azhotels.dz", // Site officiel AZ Hôtels 
  },
  
];

export default function SponsorsCarousel() {
  return (
    <div className="relative w-full overflow-hidden py-8 group">
      <div className="flex w-max animate-marquee group-hover:animation-pause">
        {[...sponsors, ...sponsors].map((logo, i) => (
          <div
            key={i}
            className="flex items-center justify-center w-[200px] h-[200px] mx-16"
          >
            <a
              href={logo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-full h-full block cursor-pointer hover:opacity-80 transition-opacity"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 150px, 200px"
              />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}