import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center bg-gradient-to-r from-blue-900 to-blue-800 text-white">
      <Image
        src="/consulting.jpg" // You can change to a more specific ISO image later
        alt="Certification ISO CACEG"
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 text-center px-6">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Certification ISO
        </h1>
        <p className="text-xl md:text-2xl max-w-4xl mx-auto">
          Engagez votre organisation dans une démarche de certification ISO avec
          CACEG Consulting
        </p>
      </div>
    </section>
  );
}
