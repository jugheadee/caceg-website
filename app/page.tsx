// page.tsx (Server Component - no 'use client')
import Navbar from "@/components/NavBar";
import Image from "next/image";
import Link from "next/link";
import SponsorsCarousel from "@/components/SponsorsCarousel"; // Import the new component

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* HERO SLIDER */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center bg-gradient-to-r from-blue-900 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <Image
          src="/hero-caceg.jpg"
          alt="CACEG Hero"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            PARTENAIRE PRIVILÉGIÉ <br /> DES PME
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Des solutions sur mesure de formation, conseil et expertise <br />
            de votre projet jusqu'à la concrétisation
          </p>
          <Link
            href="/contact"
            className="inline-block bg-yellow-500 text-blue-900 font-bold px-8 py-4 rounded-lg text-lg hover:bg-yellow-400 transition shadow-lg"
          >
            EN SAVOIR PLUS
          </Link>
        </div>
      </section>

      {/* Sponsors Section - Now using the client component */}
      <section className="py-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-blue-900 mb-12">
            Nos Partenaires et Sponsors
          </h2>
          <SponsorsCarousel /> {/* This is client-side, handles the carousel */}
        </div>
      </section>

      {/* Section "Une formation réussie..." */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6">
              Une formation réussie, un accès facile à l'emploi
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              CACEG a développé une large gamme de formations pour partager et
              transmettre le savoir et les bonnes pratiques du management aux
              salariés de chaque entreprise.
            </p>
            <p className="text-lg text-gray-700 mb-8">
              Toutes nos formations sont adaptables à vos besoins et contexte
              (durée, programme, niveau de difficulté, nombre de
              participants...). Nous pouvons également concevoir des formations
              totalement sur mesure en tenant votre cahier des charges.
            </p>
            <Link
              href="/formations"
              className="inline-block bg-yellow-500 text-blue-900 font-bold px-8 py-4 rounded-lg hover:bg-yellow-400 transition"
            >
              EN SAVOIR PLUS
            </Link>
          </div>
          <div className="flex justify-center">
            <Image
              src="/formation-image.jpg" // remplace par une belle image formation
              alt="Formation CACEG"
              width={600}
              height={400}
              className="rounded-xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* CACEG Formations + Consulting (2 sections côte à côte) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16">
          {/* Formations */}
          <div className="text-center md:text-left">
            <Image
              src="/formations-caceg.jpg" // image formation en groupe
              alt="CACEG Formations"
              width={600}
              height={400}
              className="rounded-xl shadow-xl mb-8 mx-auto md:mx-0"
            />
            <h2 className="text-3xl font-bold text-blue-900 mb-6">
              CACEG Formations
            </h2>
            <p className="text-gray-700 mb-8 text-lg">
              Nous proposons des formations inter-entreprises et des formations
              intra-entreprises. Caceg Formations identifie avec votre
              entreprise vos besoins en formation. Nous établissons ensemble un
              plan de formation en fonction de votre budget et de votre
              calendrier. Notre expérience et notre réseau de formateurs et
              d'organismes de formation nous permettent de vous proposer des
              formations, tant en termes de contenu que de coûts et
              d'organisation.
            </p>
            <Link
              href="/formations"
              className="inline-block bg-yellow-500 text-blue-900 font-bold px-8 py-4 rounded-lg hover:bg-yellow-400 transition"
            >
              Lire Plus
            </Link>
          </div>

          {/* Consulting */}
          <div className="text-center md:text-left">
            <Image
              src="/consulting-caceg.jpg" // image consulting
              alt="CACEG Consulting"
              width={600}
              height={400}
              className="rounded-xl shadow-xl mb-8 mx-auto md:mx-0"
            />
            <h2 className="text-3xl font-bold text-blue-900 mb-6">
              CACEG Consulting
            </h2>
            <p className="text-gray-700 mb-8 text-lg">
              Nous avons pour mission d'accompagner les entreprises dans leurs
              projets d'évolution et de développement afin de les propulser vers
              la réussite de leurs objectifs de performance. La
              pluridisciplinarité de notre équipe d'experts permet de vous
              accompagner dans votre projet de certification ISO, élaboration de
              plan stratégique, audit, certification, etc.
            </p>
            <Link
              href="/etudes"
              className="inline-block bg-yellow-500 text-blue-900 font-bold px-8 py-4 rounded-lg hover:bg-yellow-400 transition"
            >
              Lire Plus
            </Link>
          </div>
        </div>
      </section>

      {/* Témoignages clients */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-blue-900 mb-12">
            Ce que disent nos clients
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <p className="text-gray-700 italic mb-6">
                "J'ai vraiment apprécié les cours de CACEG et j'espère pouvoir
                suivre d'autres formations avec eux. Les explications sont
                claires ainsi que les exemples sont bien présentés et faciles à
                suivre."
              </p>
              <p className="font-semibold text-blue-900">Mohamed</p>
              <p className="text-sm text-gray-600">Développeur Web</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <p className="text-gray-700 italic mb-6">
                "Les cours ici ont dépassé mes attentes à bien des égards.
                L'approche pédagogique est claire et structurée. Dans un
                environnement très calme, j'ai appris les principes clés du
                design que je peux mettre en œuvre immédiatement."
              </p>
              <p className="font-semibold text-blue-900">Rafik Ziani</p>
              <p className="text-sm text-gray-600">Infographie</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-yellow-500">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6">
            Abonnez-vous à notre newsletter
          </h2>
          <form className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Votre email"
              className="px-6 py-4 rounded-lg flex-1"
            />
            <button className="bg-blue-900 text-white font-bold px-8 py-4 rounded-lg hover:bg-blue-800 transition">
              S'abonner
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-950 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">CACEG</h3>
            <p className="text-sm">
              CACEG Consulting, spécialisé en Formation, consulting et étude
              ainsi en management et ressources humaines (RH). Notre cabinet de
              formation agréé en Algérie réalise des formations
              professionnelles.
            </p>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Liens Utiles</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/formations">Formations</Link>
              </li>
              <li>
                <Link href="/actualites">Actualités</Link>
              </li>
              <li>
                <Link href="/about">À propos</Link>
              </li>
              <li>
                <Link href="/faq">FAQ</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Coordonnées</h3>
            <p className="text-sm">
              01, Place Ayachi Abderrahmane, BPS18 RP, Mostaganem, Algérie{" "}
              <br />
              Tél : +213 (0)23 58 86 76 <br />
              Mobile : +213 (0)550 177 84 <br />
              Email : contact@caceg-dz.com
            </p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm mb-4">CACEG est agréé par :</p>
            {/* Mets le logo FDE si tu l'as */}
            <Image src="/fde-logo.png" alt="FDE" width={150} height={80} />
          </div>
        </div>
        <div className="text-center text-sm mt-12 border-t border-blue-800 pt-6">
          © {new Date().getFullYear()} CACEG. Tous droits réservés. Designed in
          Algeria
        </div>
      </footer>
    </main>
  );
}
