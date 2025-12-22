'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo-caceg.png"
            alt="CACEG Logo"
            width={400}
            height={360}
            className="h-30 w-35 object-contain"
            priority
          />
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex items-center text-sm font-semibold uppercase text-gray-700 tracking-wider">
          <li className="px-4 border-l border-gray-300 first:border-l-0">
            <Link href="/home" className="hover:text-amber-600 transition">
              Accueil
            </Link>
          </li>

          {/* A propos Dropdown */}
          <li className="group relative px-4 border-l border-gray-300">
            <button className="flex items-center gap-1 hover:text-amber-600 transition">
              A propos ▼
            </button>
            <div className="absolute top-full left-0 mt-2 bg-white shadow-lg border border-gray-200 rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all w-56 py-2 z-50">
              <Link href="/presentation" className="block px-6 py-3 hover:bg-gray-100 hover:text-amber-600 transition">
                Présentation
              </Link>
              <Link href="/equipe" className="block px-6 py-3 hover:bg-gray-100 hover:text-amber-600 transition">
                Équipe
              </Link>
            </div>
          </li>

          <li className="px-4 border-l border-gray-300">
            <Link href="/actualites" className="hover:text-amber-600 transition">
              Actualités
            </Link>
          </li>

          {/* Formations Dropdown */}
          <li className="group relative px-4 border-l border-gray-300">
            <button className="flex items-center gap-1 hover:text-amber-600 transition">
              Nos formations ▼
            </button>
            <div className="absolute top-full left-0 mt-2 bg-white shadow-lg border border-gray-200 rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all w-64 py-2 z-50">
              <Link 
                href="/formations/management" 
                className="block px-6 py-3 text-gray-800 font-medium hover:bg-gray-100 hover:text-amber-600 transition"
              >
                MANAGEMENT DE L'ENTREPRISE
              </Link>
              <Link 
                href="/formations/gestion-recources-humaines" 
                className="block px-6 py-3 text-gray-800 font-medium hover:bg-gray-100 hover:text-amber-600 transition"
              >
                GESTION DES RESSOURCES HUMAINES
              </Link>
              <Link 
                href="/formations/comptabilite-finance-fiscalite" 
                className="block px-6 py-3 text-gray-800 font-medium hover:bg-gray-100 hover:text-amber-600 transition"
              >
                COMPTABILITÉ, FINANCE ET FISCALITÉ
              </Link>
              <Link 
                href="/formations/gestion-commerciale-marketing" 
                className="block px-6 py-3 text-gray-800 font-medium hover:bg-gray-100 hover:text-amber-600 transition"
              >
                GESTION COMMERCIALE ET MARKETING
              </Link>
              <Link 
                href="/formations/informatique" 
                className="block px-6 py-3 text-gray-800 font-medium hover:bg-gray-100 !hover:text-amber-600 transition"
              >
                INFORMATIQUE
              </Link>
              <Link 
                href="/formations" 
                className="block px-6 py-3 text-amber-600 font-bold hover:bg-gray-100 hover:text-amber-500 transition"
              >
                VOIR TOUTES LES FORMATIONS...
              </Link>
            </div>
          </li>

          <li className="px-4 border-l border-gray-300">
            <Link href="/consulting" className="text-orange-600 !hover:text-amber-600 font-bold transition">
              Consulting et accompagnement
            </Link>
          </li>

          <li className="px-4 border-l border-gray-300">
            <Link href="/contact" className="hover:text-amber-600 transition">
              Contact
            </Link>
          </li>

          <li className="px-4 border-l border-gray-300">
            <Link href="/stagiaires" className="hover:text-amber-600 transition">
              Stagiaires
            </Link>
          </li>

          {/* Search Icon */}
          <li className="pl-4">
            <button className="text-gray-700 hover:text-amber-600 text-xl transition">🔍</button>
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
            <li><Link href="/" className="block px-6 py-3 hover:bg-gray-100 hover:text-amber-600 transition">Accueil</Link></li>
            <li><Link href="/presentation" className="block px-6 py-3 hover:bg-gray-100 hover:text-amber-600 transition">Présentation</Link></li>
            <li><Link href="/equipe" className="block px-6 py-3 hover:bg-gray-100 hover:text-amber-600 transition">Équipe</Link></li>
            <li><Link href="/actualites" className="block px-6 py-3 hover:bg-gray-100 hover:text-amber-600 transition">Actualités</Link></li>
            <li><Link href="/formations/management" className="block px-6 py-3 hover:bg-gray-100 hover:text-amber-600 transition">Management de l'entreprise</Link></li>
            <li><Link href="/formations/gestion-recources-humaines" className="block px-6 py-3 hover:bg-gray-100 hover:text-amber-600 transition">Gestion des ressources humaines</Link></li>
            <li><Link href="/formations/comptabilite-finance-fiscalite" className="block px-6 py-3 hover:bg-gray-100 hover:text-amber-600 transition">Comptabilité, finance et fiscalité</Link></li>
            <li><Link href="/formations/gestion-commerciale-marketing" className="block px-6 py-3 hover:bg-gray-100 hover:text-amber-600 transition">Gestion commerciale et marketing</Link></li>
            <li><Link href="/formations/informatique" className="block px-6 py-3 hover:bg-gray-100 hover:text-amber-600 transition">Informatique</Link></li>
            <li><Link href="/etudes" className="block px-6 py-3 hover:bg-gray-100 text-orange-600 font-bold hover:text-amber-600 transition">Études et accompagnement</Link></li>
            <li><Link href="/contact" className="block px-6 py-3 hover:bg-gray-100 hover:text-amber-600 transition">Contact</Link></li>
            <li><Link href="/stagiaires" className="block px-6 py-3 hover:bg-gray-100 hover:text-amber-600 transition">Stagiaires</Link></li>
          </ul>
        </div>
      )}
    </nav>
  );
}