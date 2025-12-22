"use client";

import Image from "next/image";

const sponsors = [
  { src: "/logos/sonelgaz.png", alt: "Sonelgaz" },
  { src: "/logos/sonatrach.png", alt: "Sonatrach" },
  { src: "/logos/cevital3.png", alt: "Cevital" },
  { src: "/logos/az-hotels.png", alt: "AZ Hotels" },
];

export default function SponsorsCarousel() {
  return (
    <div className="relative w-full overflow-hidden">
      {/* Marquee */}
      <div className="flex w-max animate-marquee">
        {[...sponsors, ...sponsors].map((logo, i) => (
          <div
            key={i}
            className="flex items-center justify-center w-[180px] h-[180px] mx-12"
          >
            <div className="relative w-full h-full">
              <Image
                src={logo.src}
                alt={logo.alt}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 200px, 260px"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
