// app/certification-iso/components/BenefitsSection.tsx
import Image from "next/image";

export default function BenefitsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-blue-900 text-center mb-16">
          À quoi ça sert ?
        </h2>

        {/* Desktop: 3-column grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-12 items-center max-w-6xl mx-auto">
          {/* Left Column */}
          <ul className="space-y-8 text-lg text-gray-700">
            <li className="flex items-start">
              <span className="text-yellow-500 text-3xl mr-4">•</span>
              <span className="font-semibold">
                A METTRE EN PLACE DES PRATIQUES EXEMPLAIRES RECONNUES ET
                PARTAGÉES À L'ÉCHELLE MONDIALE
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-500 text-3xl mr-4">•</span>
              <span className="font-semibold">
                A AMÉLIORER SES PROCESSUS ET AMENER SON ORGANISATION À UNE
                MEILLEURE UTILISATION DE SES RESSOURCES
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-500 text-3xl mr-4">•</span>
              <span className="font-semibold">
                A GAGNER DE NOUVEAUX MARCHÉS ET ACCÉDER AUX APPELS D'OFFRES
                PUBLICS OU DES GRANDS DONNEURS D'ORDRE PRIVÉS
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-500 text-3xl mr-4">•</span>
              <span className="font-semibold">
                A AUGMENTER SA PRODUCTIVITÉ ET SES REVENUS
              </span>
            </li>
          </ul>

          {/* Central ISO Badge - Clean, no shadow, hover lift */}
          <div className="flex justify-center">
            <Image
              src="/iso-logo.jpg"
              alt="Certification ISO - Excellence et qualité"
              width={600}
              height={600}
              className="object-contain hover:-translate-y-6 transition-transform duration-500"
              priority
            />
          </div>

          {/* Right Column */}
          <ul className="space-y-8 text-lg text-gray-700">
            <li className="flex items-start">
              <span className="text-yellow-500 text-3xl mr-4">•</span>
              <span className="font-semibold">
                A ÊTRE EN CONFORMITÉ AVEC LES TEXTES & RÈGLEMENTS SI SON
                ORGANISATION Y EST SOUMISE
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-500 text-3xl mr-4">•</span>
              <span className="font-semibold">
                LA CERTIFICATION EST UN GAGE DE SÉRIEUX ET DE CRÉDIBILITÉ DES
                BONNES PRATIQUES MISES EN PLACE
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-500 text-3xl mr-4">•</span>
              <span className="font-semibold">
                A AMÉLIORER LA NOTORIÉTÉ ET LE PRESTIGE DE SON ORGANISATION
                AUPRÈS DU PUBLIC ET DE TOUTES LES PARTIES PRENANTES
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-500 text-3xl mr-4">•</span>
              <span className="font-semibold">
                A MOTIVER L'ÉQUIPE AUTOUR D'UN PROJET FÉDÉRATEUR ET FAIRE
                CHANGER LES MENTALITÉS
              </span>
            </li>
          </ul>
        </div>

        {/* Mobile */}
        <div className="md:hidden space-y-16">
          <ul className="space-y-8 text-lg text-gray-700">
            <li className="flex items-start">
              <span className="text-yellow-500 text-3xl mr-4">•</span>
              <span className="font-semibold">
                A METTRE EN PLACE DES PRATIQUES EXEMPLAIRES RECONNUES ET
                PARTAGÉES À L'ÉCHELLE MONDIALE
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-500 text-3xl mr-4">•</span>
              <span className="font-semibold">
                A AMÉLIORER SES PROCESSUS ET AMENER SON ORGANISATION À UNE
                MEILLEURE UTILISATION DE SES RESSOURCES
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-500 text-3xl mr-4">•</span>
              <span className="font-semibold">
                A GAGNER DE NOUVEAUX MARCHÉS ET ACCÉDER AUX APPELS D'OFFRES
                PUBLICS OU DES GRANDS DONNEURS D'ORDRE PRIVÉS
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-500 text-3xl mr-4">•</span>
              <span className="font-semibold">
                A AUGMENTER SA PRODUCTIVITÉ ET SES REVENUS
              </span>
            </li>
          </ul>

          <div className="flex justify-center">
            <Image
              src="/iso-logo.jpg"
              alt="Certification ISO - Excellence et qualité"
              width={400}
              height={400}
              className="object-contain hover:-translate-y-6 transition-transform duration-500"
              priority
            />
          </div>

          <ul className="space-y-8 text-lg text-gray-700">
            <li className="flex items-start">
              <span className="text-yellow-500 text-3xl mr-4">•</span>
              <span className="font-semibold">
                A ÊTRE EN CONFORMITÉ AVEC LES TEXTES & RÈGLEMENTS SI SON
                ORGANISATION Y EST SOUMISE
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-500 text-3xl mr-4">•</span>
              <span className="font-semibold">
                LA CERTIFICATION EST UN GAGE DE SÉRIEUX ET DE CRÉDIBILITÉ DES
                BONNES PRATIQUES MISES EN PLACE
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-500 text-3xl mr-4">•</span>
              <span className="font-semibold">
                A AMÉLIORER LA NOTORIÉTÉ ET LE PRESTIGE DE SON ORGANISATION
                AUPRÈS DU PUBLIC ET DE TOUTES LES PARTIES PRENANTES
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-500 text-3xl mr-4">•</span>
              <span className="font-semibold">
                A MOTIVER L'ÉQUIPE AUTOUR D'UN PROJET FÉDÉRATEUR ET FAIRE
                CHANGER LES MENTALITÉS
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
