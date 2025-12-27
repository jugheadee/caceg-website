"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import {
  Menu,
  UserCircle,
  LogOut,
  Settings,
  LayoutDashboard,
  BookOpen,
  Users,
  Mail,
  HelpCircle,
} from "lucide-react";

const ONE_HOUR = 60 * 60 * 1000;

export default function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.replace("/admin/login");
        return;
      }

      const loginTime = localStorage.getItem("adminLoginTime");
      if (!loginTime || Date.now() - Number(loginTime) > ONE_HOUR) {
        localStorage.removeItem("adminLoginTime");
        await signOut(auth);
        router.replace("/admin/login");
        return;
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    localStorage.removeItem("adminLoginTime");
    await signOut(auth);
    router.push("/admin/login");
  };

  const navigateTo = (path: string) => {
    router.push(path);
  };

  // Taille des icônes : plus grande quand sidebar fermée
  const iconSize = sidebarExpanded ? 22 : 28;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-gray-50/80 backdrop-blur-md flex items-center justify-between px-6 z-50 shadow-sm">
        <div className="flex items-center gap-5">
          <button
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            className="text-gray-700 hover:text-blue-900 transition cursor-pointer"
          >
            <Menu size={28} />
          </button>
          <div className="flex items-center">
            <Image
              src="/logos/caceg-admine.png"
              alt="CACEG Admin Logo"
              width={200}
              height={60}
              className="object-contain"
              priority
            />
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3 text-gray-700 hover:text-blue-900 cursor-pointer"
          >
            <UserCircle size={36} className="text-blue-900" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 z-50">
              <a
                href="#"
                className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition cursor-pointer"
              >
                <Settings size={18} />
                Changer mot de passe
              </a>
              <hr className="my-2 border-gray-100" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-5 py-3 hover:bg-gray-50 text-red-600 transition text-left cursor-pointer"
              >
                <LogOut size={18} />
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 bottom-0 bg-blue-900 text-white transition-all duration-300 z-40 flex flex-col ${
          sidebarExpanded ? "w-68" : "w-20"
        }`}
      >
        <nav className="flex-1 py-6 px-4 space-y-6 overflow-y-auto">
          {/* Principal */}
          <div>
            <p
              className={`text-xs font-semibold uppercase tracking-wider mb-3 text-blue-200 ${
                !sidebarExpanded ? "text-center" : ""
              }`}
            >
              {sidebarExpanded ? "Principal" : "..."}
            </p>
            <button
              onClick={() => navigateTo("/admin/dashboard/acceuil")}
              className={`w-full flex items-center gap-4 py-3 px-4 rounded-xl font-medium transition cursor-pointer ${
                pathname === "/admin/dashboard/acceuil"
                  ? "bg-blue-800 text-white font-semibold"
                  : "text-gray-200 hover:bg-blue-700"
              } ${!sidebarExpanded && "justify-center"}`}
            >
              <LayoutDashboard size={iconSize} />
              {sidebarExpanded && <span>Dashboard</span>}
            </button>
          </div>

          {/* Forms and Datas */}
          <div>
            <p
              className={`text-xs font-semibold uppercase tracking-wider mb-3 text-blue-200 ${
                !sidebarExpanded ? "text-center" : ""
              }`}
            >
              {sidebarExpanded ? "Forms and Datas" : "..."}
            </p>

            <button
              onClick={() => navigateTo("/admin/dashboard/gestion-formations")}
              className={`w-full flex items-center gap-4 py-3 px-4 rounded-lg transition cursor-pointer ${
                pathname === "/admin/dashboard/gestion-formations"
                  ? "bg-blue-800 text-white font-semibold"
                  : "text-gray-200 hover:bg-blue-700"
              } ${!sidebarExpanded && "justify-center"}`}
            >
              <BookOpen size={iconSize} />
              {sidebarExpanded && <span>Gestion Formations</span>}
            </button>

            <button
              onClick={() => navigateTo("/admin/dashboard/gestion-etu")}
              className={`w-full flex items-center gap-4 py-3 px-4 rounded-lg transition cursor-pointer ${
                pathname === "/admin/dashboard/gestion-etu"
                  ? "bg-blue-800 text-white font-semibold"
                  : "text-gray-200 hover:bg-blue-700"
              } ${!sidebarExpanded && "justify-center"}`}
            >
              <Users size={iconSize} />
              {sidebarExpanded && <span>Gestion Étudiants</span>}
            </button>

            <button
              onClick={() => navigateTo("/admin/dashboard/demandes")}
              className={`w-full flex items-center gap-4 py-3 px-4 rounded-lg transition cursor-pointer ${
                pathname === "/admin/dashboard/demandes"
                  ? "bg-blue-800 text-white font-semibold"
                  : "text-gray-200 hover:bg-blue-700"
              } ${!sidebarExpanded && "justify-center"}`}
            >
              <Mail size={iconSize} />
              {sidebarExpanded && <span>Demandes Formulaires</span>}
            </button>
          </div>
        </nav>

        {/* Help + Déconnexion – en bas */}
        <div className="px-4 pb-6 space-y-6">
          {/* Help */}
          <div>
            <p
              className={`text-xs font-semibold uppercase tracking-wider mb-3 text-blue-200 ${
                !sidebarExpanded ? "text-center" : ""
              }`}
            >
              {sidebarExpanded ? "Help" : "..."}
            </p>
            <button
              onClick={() => navigateTo("/admin/dashboard/documentation")}
              className={`w-full flex items-center gap-4 py-3 px-4 rounded-lg transition cursor-pointer ${
                pathname === "/admin/dashboard/documentation"
                  ? "bg-blue-800 text-white font-semibold"
                  : "text-gray-200 hover:bg-blue-700"
              } ${!sidebarExpanded && "justify-center"}`}
            >
              <HelpCircle size={iconSize} />
              {sidebarExpanded && <span>Documentation</span>}
            </button>
          </div>

          {/* Déconnexion */}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center justify-center gap-3 py-4 bg-yellow-500 text-blue-900 font-bold rounded-xl hover:bg-yellow-400 transition shadow-lg cursor-pointer ${
              !sidebarExpanded && "px-4"
            }`}
          >
            <LogOut size={iconSize} />
            {sidebarExpanded && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main
        className={`pt-20 transition-all duration-300 ${
          sidebarExpanded ? "ml-68" : "ml-20"
        }`}
      >
        <div className="px-8">
          <div key={pathname} className="animate-in fade-in duration-500">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
