"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const sponsors = [
  {
    src: "/logos/sonelgaz.png",
    alt: "Sonelgaz",
    url: "https://www.sonelgaz.dz/",
  },
  {
    src: "/logos/sonatrach.png",
    alt: "Sonatrach",
    url: "https://www.sonatrach.com/",
  },
  {
    src: "/logos/cevital3.png",
    alt: "Cevital",
    url: "https://www.cevital.com/",
  },
  {
    src: "/logos/az-hotels.png",
    alt: "AZ Hotels",
    url: "https://www.azhotels.dz/",
  },
 
  {
    src: "/logos/algerie-telecom-seeklogo.png",
    alt: "Algérie Telecom",
    url: "https://www.algerietelecom.dz/",
  },
  {
    src: "/logos/knauf-seeklogo.png",
    alt: "Knauf",
    url: "https://www.knauf.com/",
  },
  {
    src: "/logos/mostaland.jpg",
    alt: "Mostaland",
    url: "https://www.mostaland.dz/", 
  },
  {
    src: "/logos/setram-seeklogo.png",
    alt: "Setram (Cetram)",
    url: "https://www.setram.dz/", 
  },
];

export default function SponsorsCarousel() {
  const duplicatedSponsors = [...sponsors, ...sponsors, ...sponsors]; // 3 copies for smooth infinite loop

  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      dragFree: false,
      slidesToScroll: 1,
      align: "start",
      containScroll: "trimSnaps",
      skipSnaps: false,
    },
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  );

  return (
    <div className="relative w-full overflow-hidden py-8 group">
      <div className="embla" ref={emblaRef}>
        <div className="embla__container flex">
          {duplicatedSponsors.map((logo, i) => (
            <div
              key={i}
              className="flex items-center justify-center w-[200px] h-[200px] mx-16 embla__slide"
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
                  className="object-contain select-none"
                  sizes="(max-width: 768px) 150px, 200px"
                />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}