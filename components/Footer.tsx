// components/Footer.tsx
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-blue-950 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
        {/* Colonne 1 : CACEG */}
        <div>
          <h3 className="text-white font-bold text-lg mb-4">CACEG</h3>
          <p className="text-sm leading-relaxed">
            CACEG Consulting, spécialisé en Formation, consulting et étude ainsi
            en management et ressources humaines (RH). Notre cabinet de
            formation agréé en Algérie réalise des formations professionnelles.
          </p>
        </div>

        {/* Colonne 2 : Liens Utiles */}
        <div>
          <h3 className="text-white font-bold text-lg mb-4">Liens Utiles</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <Link
                href="/formations"
                className="hover:text-white transition flex items-center gap-2"
              >
                <span className="text-yellow-500">›</span> Formations
              </Link>
            </li>
            <li>
              <Link
                href="/actualites"
                className="hover:text-white transition flex items-center gap-2"
              >
                <span className="text-yellow-500">›</span> Actualités
              </Link>
            </li>
            <li>
              <Link
                href="/presentation"
                className="hover:text-white transition flex items-center gap-2"
              >
                <span className="text-yellow-500">›</span> À propos
              </Link>
            </li>
            <li>
              <Link
                href="/faq"
                className="hover:text-white transition flex items-center gap-2"
              >
                <span className="text-yellow-500">›</span> FAQ
              </Link>
            </li>
          </ul>
        </div>

        {/* Colonne 3 : Coordonnées */}
        <div>
          <h3 className="text-white font-bold text-lg mb-4">Coordonnées</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <span className="text-yellow-500">📍</span>
              <span>
                01, Place Ayachi Abderrahmane, BPS18 RP, Mostaganem, Algérie
              </span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-yellow-500">☎</span>
              <span>+213 (0)23 58 86 76</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-yellow-500">📱</span>
              <span>+213 (0)550 177 84</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-yellow-500">✉</span>
              <a
                href="mailto:contact@caceg-dz.com"
                className="hover:text-white transition"
              >
                contact@caceg-dz.com
              </a>
            </li>
          </ul>
        </div>

        {/* Colonne 4 : Logo FEDE */}
        <div className="flex flex-col items-end justify-start pr-8">
          <p className="text-sm text-gray-400 mb-4 w-full text-right">
            CACEG est agréé par :
          </p>
          <Image
            src="/logos/fede.png"
            alt="FEDE - Fédération Européenne Des Écoles"
            width={180}
            height={80}
            className="object-contain"
          />
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-blue-800 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} CACEG. Tous droits réservés. Designed by
        sefrone
      </div>
    </footer>
  );
}
