"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Formation {
  id: string;
  title: string;
  slug: string;
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const [formations, setFormations] = useState<Formation[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "formations"), (snap) => {
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title as string,
        slug: doc.data().slug as string,
      }));
      setFormations(data.sort((a, b) => a.title.localeCompare(b.title)));
    });

    return () => unsub();
  }, []);

  const activeLinkClass =
    "relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-1 after:bg-yellow-500 after:rounded-full after:transition-all after:duration-300 after:ease-in-out after:scale-x-100";
  const inactiveLinkClass = "after:scale-x-0";

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href);

  return (
    <nav className="fixed top-0 w-full bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto pl-0 pr-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center h-20 overflow-hidden">
          <Image
            src="/CACEG-Consulting-1.jpg"
            alt="CACEG Logo"
            width={424}
            height={238}
            className="w-[180px] object-contain"
            priority
          />
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex items-center text-sm font-semibold uppercase text-gray-700 tracking-wider">
          {/* Accueil */}
          <li className="px-4 border-l border-gray-300 first:border-l-0">
            <Link
              href="/home"
              className={`hover:text-amber-600 transition ${
                pathname === "/" ? activeLinkClass : inactiveLinkClass
              }`}
            >
              Accueil
            </Link>
          </li>

          {/* A PROPOS dropdown */}
          <li className="group relative px-4 border-l border-gray-300">
            <Link
              href="/a-propos"
              className={`flex items-center gap-1 hover:text-amber-600 transition ${
                pathname.startsWith("/a-propos")
                  ? activeLinkClass
                  : inactiveLinkClass
              }`}
            >
              A propos ▼
            </Link>
            <div className="absolute top-full left-0 mt-2 bg-white shadow-lg border border-gray-200 rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all w-64 py-2 z-50">
              <Link
                href="/a-propos/presentation"
                className="block px-6 py-3 text-gray-800 font-medium hover:bg-gray-100 hover:text-amber-600 transition"
              >
                Présentation
              </Link>
              <Link
                href="/a-propos/mot-du-directeur"
                className="block px-6 py-3 text-gray-800 font-medium hover:bg-gray-100 hover:text-amber-600 transition"
              >
                Un mot du directeur
              </Link>
              <Link
                href="/a-propos/nos-clients"
                className="block px-6 py-3 text-gray-800 font-medium hover:bg-gray-100 hover:text-amber-600 transition"
              >
                Nos clients
              </Link>
            </div>
          </li>

          {/* Formations dropdown – dynamic, max 4 */}
          <li className="group relative px-4 border-l border-gray-300">
            <Link
              href="/formations"
              className={`flex items-center gap-1 hover:text-amber-600 transition ${
                pathname.startsWith("/formations")
                  ? activeLinkClass
                  : inactiveLinkClass
              }`}
            >
              Nos formations ▼
            </Link>
            <div className="absolute top-full left-0 mt-2 bg-white shadow-lg border border-gray-200 rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all w-64 py-2 z-50">
              {formations.slice(0, 4).map((formation) => (
                <Link
                  key={formation.id}
                  href={`/formations/${formation.slug}`}
                  className="block px-6 py-3 text-gray-800 font-medium hover:bg-gray-100 hover:text-amber-600 transition"
                >
                  {formation.title.toUpperCase()}
                </Link>
              ))}

              <Link
                href="/formations"
                className="block px-6 py-3 text-amber-600 font-bold hover:bg-gray-100 hover:text-amber-500 transition border-t border-gray-200 mt-2 pt-4"
              >
                VOIR TOUTES LES FORMATIONS...
              </Link>
            </div>
          </li>

          {/* Consulting */}
          <li className="px-4 border-l border-gray-300">
            <Link
              href="/consulting"
              className={`text-orange-600 hover:text-amber-600 font-bold transition ${
                isActive("/consulting") ? activeLinkClass : inactiveLinkClass
              }`}
            >
              Consulting et accompagnement
            </Link>
          </li>

          {/* Contact */}
          <li className="px-4 border-l border-gray-300">
            <Link
              href="/contact"
              className={`hover:text-amber-600 transition ${
                isActive("/contact") ? activeLinkClass : inactiveLinkClass
              }`}
            >
              Contact
            </Link>
          </li>
        </ul>

        {/* Mobile Burger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden text-2xl text-gray-700"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu – structure mirrors desktop */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-top border-gray-200">
          <ul className="flex flex-col text-sm font-semibold uppercase text-gray-700 py-4">
            {/* Accueil */}
            <li>
              <Link
                href="/"
                className={`block px-6 py-3 hover:bg-gray-100 hover:text-amber-600 transition ${
                  pathname === "/" ? "text-amber-600" : ""
                }`}
              >
                Accueil
              </Link>
            </li>

            {/* A Propos section */}
            <li className="border-t border-gray-100 mt-2 pt-2">
              <Link
                href="/a-propos"
                className={`block px-6 py-3 hover:bg-gray-100 hover:text-amber-600 transition ${
                  pathname.startsWith("/a-propos") ? "text-amber-600" : ""
                }`}
              >
                A propos
              </Link>
              <div className="pl-10 text-gray-600 font-normal">
                <Link
                  href="/a-propos/presentation"
                  className="block px-6 py-2 hover:bg-gray-50 hover:text-amber-600 transition text-sm"
                >
                  Présentation
                </Link>
                <Link
                  href="/a-propos/mot-du-directeur"
                  className="block px-6 py-2 hover:bg-gray-50 hover:text-amber-600 transition text-sm"
                >
                  Un mot du directeur
                </Link>
                <Link
                  href="/a-propos/nos-partenaires"
                  className="block px-6 py-2 hover:bg-gray-50 hover:text-amber-600 transition text-sm"
                >
                  Nos partenaires
                </Link>
              </div>
            </li>

            {/* Formations section */}
            <li className="border-t border-gray-100 mt-2 pt-2">
              <Link
                href="/formations"
                className={`block px-6 py-3 hover:bg-gray-100 hover:text-amber-600 transition ${
                  pathname.startsWith("/formations") ? "text-amber-600" : ""
                }`}
              >
                Nos formations
              </Link>
              <div className="pl-10 text-gray-600 font-normal max-h-64 overflow-y-auto">
                {formations.slice(0, 8).map((formation) => (
                  <Link
                    key={formation.id}
                    href={`/formations/${formation.slug}`}
                    className="block px-6 py-2 hover:bg-gray-50 hover:text-amber-600 transition text-sm"
                  >
                    {formation.title}
                  </Link>
                ))}
                <Link
                  href="/formations"
                  className="block px-6 py-3 mt-2 text-amber-600 hover:text-amber-500 transition text-sm font-bold border-t border-gray-200"
                >
                  Voir toutes les formations...
                </Link>
              </div>
            </li>

            {/* Consulting */}
            <li className="border-t border-gray-100 mt-2 pt-2">
              <Link
                href="/consulting"
                className={`block px-6 py-3 hover:bg-gray-100 text-orange-600 font-bold hover:text-amber-600 transition ${
                  isActive("/consulting") ? "text-amber-600" : ""
                }`}
              >
                Consulting et accompagnement
              </Link>
            </li>

            {/* Contact */}
            <li className="border-t border-gray-100 mt-2 pt-2">
              <Link
                href="/contact"
                className={`block px-6 py-3 hover:bg-gray-100 hover:text-amber-600 transition ${
                  isActive("/contact") ? "text-amber-600" : ""
                }`}
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
