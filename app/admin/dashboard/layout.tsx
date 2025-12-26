'use client';

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Menu,
  UserCircle,
  LogOut,
  Settings,
  Download,
  Printer,
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  Palette,
  BookOpen,
  Users,
  Mail,
  HelpCircle,
} from "lucide-react";

const ONE_HOUR = 60 * 60 * 1000;

export default function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
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
  const [currentPath, setCurrentPath] = useState<string>("");

useEffect(() => {
  setCurrentPath(window.location.pathname);
}, []);

  const handleLogout = async () => {
    localStorage.removeItem("adminLoginTime");
    await signOut(auth);
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-gray-50/80 backdrop-blur-md flex items-center justify-between px-6 z-50 shadow-sm">
        <div className="flex items-center gap-5">
          <button
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            className="text-gray-700 hover:text-blue-900 transition"
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
              <a href="#" className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition">
                <Settings size={18} />
                Changer mot de passe
              </a>
              <hr className="my-2 border-gray-100" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-5 py-3 hover:bg-gray-50 text-red-600 transition text-left"
              >
                <LogOut size={18} />
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Sidebar bleu foncé – couleurs corrigées */}
      <aside className={`fixed left-0 top-16 bottom-0 bg-blue-900 text-white transition-all duration-300 z-40 flex flex-col ${sidebarExpanded ? "w-64" : "w-20"}`}>
       <nav className="flex-1 py-6 px-4 space-y-6">
  {/* Principal */}
  <div>
    <p className={`text-xs font-semibold uppercase tracking-wider mb-3 text-blue-200 ${!sidebarExpanded ? "text-center" : ""}`}>
      {sidebarExpanded ? "Principal" : "..."}
    </p>
    <a 
      href="/admin/dashboard/acceuil" 
      className={`flex items-center gap-4 py-3 px-4 rounded-xl font-medium transition ${
        currentPath === "/admin/dashboard/acceuil" 
          ? "bg-blue-800 text-blue-900" 
          : "text-gray-200 hover:bg-blue-700"
      } ${!sidebarExpanded && "justify-center"}`}
    >
      <LayoutDashboard size={22} />
      {sidebarExpanded && <span>Dashboard</span>}
    </a>
  </div>

  {/* Forms and Datas */}
  <div>
    <p className={`text-xs font-semibold uppercase tracking-wider mb-3 text-blue-200 ${!sidebarExpanded ? "text-center" : ""}`}>
      {sidebarExpanded ? "Forms and Datas" : "..."}
    </p>
    <a 
      href="/admin/dashboard/gestion-formations" 
      className={`flex items-center gap-4 py-3 px-4 rounded-lg transition ${
        currentPath === "/admin/dashboard/gestion-formations" 
          ? "bg-blue-800 text-blue-900" 
          : "text-gray-200 hover:bg-blue-700"
      } ${!sidebarExpanded && "justify-center"}`}
    >
      <BookOpen size={22} />
      {sidebarExpanded && <span>Gestion Formations</span>}
    </a>

    {/* Les autres liens (Étudiants, Demandes, etc.) – même principe si tu veux */}
    <a href="#" className={`flex items-center gap-4 py-3 px-4 rounded-lg transition text-gray-200 hover:bg-blue-800 ${!sidebarExpanded && "justify-center"}`}>
      <Users size={22} />
      {sidebarExpanded && <span>Gestion Étudiants</span>}
    </a>
    <a href="#" className={`flex items-center gap-4 py-3 px-4 rounded-lg transition text-gray-200 hover:bg-blue-800 ${!sidebarExpanded && "justify-center"}`}>
      <Mail size={22} />
      {sidebarExpanded && <span>Demandes de Formulaires</span>}
    </a>
  </div>

  {/* Help */}
  <div>
    <p className={`text-xs font-semibold uppercase tracking-wider mb-3 text-blue-200 ${!sidebarExpanded ? "text-center" : ""}`}>
      {sidebarExpanded ? "Help" : "..."}
    </p>
    <a href="#" className={`flex items-center gap-4 py-3 px-4 rounded-lg transition text-gray-200 hover:bg-blue-800 ${!sidebarExpanded && "justify-center"}`}>
      <HelpCircle size={22} />
      {sidebarExpanded && <span>Documentation</span>}
    </a>
  </div>
</nav>

        <div className="px-4 pb-6">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center justify-center gap-3 py-4 bg-yellow-500 text-blue-900 font-bold rounded-xl hover:bg-yellow-400 transition shadow-lg ${!sidebarExpanded && "px-4"}`}
          >
            <LogOut size={22} />
            {sidebarExpanded && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className={`pt-20 transition-all duration-300 ${sidebarExpanded ? "ml-64" : "ml-20"}`}>
        <div className="px-8">
          {children}
        </div>
      </main>
    </div>
  );
}