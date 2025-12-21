'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center">
        <Image
  src="/logo-caceg.png"
  alt="CACEG Logo"
  width={320}     // augmente ici
  height={160}    // augmente ici
  className="h-16 w-auto object-contain"  // h-16 = hauteur 64px au lieu de 48px
  priority
/>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex items-center text-sm font-semibold uppercase text-gray-700 tracking-wider">
          <li className="px-4 border-l border-gray-300 first:border-l-0">
            <Link href="/" className="hover:text-orange-600 transition">
              Accueil
            </Link>
          </li>

          {/* A propos Dropdown */}
          <li className="group relative px-4 border-l border-gray-300">
            <button className="flex items-center hover:text-orange-600 transition">
              A propos ▼
            </button>
            <div className="absolute top-full left-0 mt-2 bg-white shadow-lg border border-gray-200 rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all w-56 py-2">
              <Link href="/presentation" className="block px-6 py-2 hover:bg-gray-50">Présentation</Link>
              <Link href="/equipe" className="block px-6 py-2 hover:bg-gray-50">Équipe</Link>
            </div>
          </li>

          <li className="px-4 border-l border-gray-300">
            <Link href="/actualites" className="hover:text-orange-600 transition">
              Actualités
            </Link>
          </li>

          {/* Formations Dropdown */}
          <li className="group relative px-4 border-l border-gray-300">
            <button className="flex items-center hover:text-orange-600 transition">
              Nos formations ▼
            </button>
            <div className="absolute top-full left-0 mt-2 bg-white shadow-lg border border-gray-200 rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all w-56 py-2">
              <Link href="/formations/qhse" className="block px-6 py-2 hover:bg-gray-50">QHSE</Link>
              <Link href="/formations/grh" className="block px-6 py-2 hover:bg-gray-50">GRH</Link>
              {/* Ajoute d'autres si besoin */}
            </div>
          </li>

          <li className="px-4 border-l border-gray-300">
            <Link href="/etudes" className="text-orange-600 hover:text-orange-700 transition font-bold">
              Études et accompagnement
            </Link>
          </li>

          <li className="px-4 border-l border-gray-300">
            <Link href="/contact" className="hover:text-orange-600 transition">
              Contact
            </Link>
          </li>

          <li className="px-4 border-l border-gray-300">
            <Link href="/stagiaires" className="hover:text-orange-600 transition">
              Stagiaires
            </Link>
          </li>

          {/* Search Icon */}
          <li className="pl-4">
            <button className="text-gray-700 hover:text-orange-600 text-xl">🔍</button>
          </li>
        </ul>

        {/* Mobile Burger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden text-2xl text-gray-700"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <ul className="flex flex-col text-sm font-semibold uppercase text-gray-700 py-4">
            <li><Link href="/" className="block px-6 py-3 hover:bg-gray-50">Accueil</Link></li>
            <li><Link href="/presentation" className="block px-6 py-3 hover:bg-gray-50">Présentation</Link></li>
            <li><Link href="/equipe" className="block px-6 py-3 hover:bg-gray-50">Équipe</Link></li>
            <li><Link href="/actualites" className="block px-6 py-3 hover:bg-gray-50">Actualités</Link></li>
            <li><Link href="/formations/qhse" className="block px-6 py-3 hover:bg-gray-50">Formations QHSE</Link></li>
            <li><Link href="/formations/grh" className="block px-6 py-3 hover:bg-gray-50">Formations GRH</Link></li>
            <li><Link href="/etudes" className="block px-6 py-3 hover:bg-gray-50 text-orange-600 font-bold">Études et accompagnement</Link></li>
            <li><Link href="/contact" className="block px-6 py-3 hover:bg-gray-50">Contact</Link></li>
            <li><Link href="/stagiaires" className="block px-6 py-3 hover:bg-gray-50">Stagiaires</Link></li>
          </ul>
        </div>
      )}
    </nav>
  );
}