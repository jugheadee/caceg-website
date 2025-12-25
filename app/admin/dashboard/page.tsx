// app/admin/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
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

interface Formation {
  id: string;
  title: string;
  duration: string;
  price: string;
  studentsCount: number;
}

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  formation: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [expandedFormation, setExpandedFormation] = useState<string | null>(
    null
  );
  const [expandedStudents, setExpandedStudents] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "formations" | "etudiants" | "demandes"
  >("formations");

  // Mock data
  const formations: Formation[] = [
    {
      id: "1",
      title: "Formation Excel Avancé",
      duration: "3 jours",
      price: "45 000 DZD",
      studentsCount: 12,
    },
    {
      id: "2",
      title: "Management de Projet",
      duration: "5 jours",
      price: "80 000 DZD",
      studentsCount: 8,
    },
    {
      id: "3",
      title: "Comptabilité Générale",
      duration: "10 jours",
      price: "120 000 DZD",
      studentsCount: 15,
    },
  ];

  const allStudents: Student[] = [
    {
      id: "1",
      name: "Ahmed Benali",
      email: "ahmed@example.com",
      phone: "0555123456",
      formation: "Excel Avancé",
    },
    {
      id: "2",
      name: "Fatima Zahra",
      email: "fatima@example.com",
      phone: "0770987654",
      formation: "Management de Projet",
    },
    {
      id: "3",
      name: "Karim Djoudi",
      email: "karim@example.com",
      phone: "0566123456",
      formation: "Excel Avancé",
    },
  ];

  const formRequestsCount = 7;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.replace("/admin/session-expired");
        return;
      }

      const loginTime = localStorage.getItem("adminLoginTime");
      if (!loginTime || Date.now() - Number(loginTime) > ONE_HOUR) {
        localStorage.removeItem("adminLoginTime");
        await signOut(auth);
        router.replace("/admin/session-expired");
        return;
      }

      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    localStorage.removeItem("adminLoginTime");
    await signOut(auth);
    router.push("/admin/login");
  };

  const handlePrint = () => window.print();
  const handleExport = (section: string) =>
    alert(`Export ${section} (à implémenter plus tard)`);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl text-blue-900">
          Chargement du tableau de bord...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar - clean, no welcome text */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-gray-50/80 backdrop-blur-md flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-5">
          <button
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            className="text-gray-700 hover:text-blue-900 transition"
          >
            <Menu size={28} />
          </button>
          <div className="font-bold text-2xl">
            <span className="text-blue-900">CACEG</span>
            <span className="text-yellow-500">Admin</span>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3 text-gray-700 hover:text-blue-900 mr-5 cursor-pointer"
          >
            <UserCircle size={36} className="text-blue-900" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 z-50">
              <a
                href="#"
                className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition"
              >
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

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 bottom-0 bg-gray-50 transition-all duration-300 z-40 flex flex-col ${
          sidebarExpanded ? "w-64" : "w-20"
        }`}
      >
        <nav className="flex-1 py-6 px-4 space-y-6">
          {/* Principal */}
          <div>
            <p
              className={`text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 ${
                !sidebarExpanded ? "text-center" : ""
              }`}
            >
              {sidebarExpanded ? "Principal" : "..."}
            </p>
            <a
              href="#"
              className={`flex items-center gap-4 py-3 px-4 rounded-xl font-medium transition ${
                sidebarExpanded
                  ? "bg-blue-100 text-blue-900"
                  : "justify-center hover:bg-gray-100"
              }`}
            >
              <LayoutDashboard size={22} />
              {sidebarExpanded && <span>Dashboard</span>}
            </a>
          </div>

          {/* UI Elements */}
          <div>
            <p
              className={`text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 ${
                !sidebarExpanded ? "text-center" : ""
              }`}
            >
              {sidebarExpanded ? "UI Elements" : "..."}
            </p>
            <a
              href="#"
              className={`flex items-center gap-4 py-3 px-4 rounded-lg transition text-gray-700 ${
                sidebarExpanded
                  ? "hover:bg-gray-100"
                  : "justify-center hover:bg-gray-100"
              }`}
            >
              <Palette size={22} />
              {sidebarExpanded && <span>UI Elements</span>}
            </a>
          </div>

          {/* Forms and Datas */}
          <div>
            <p
              className={`text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 ${
                !sidebarExpanded ? "text-center" : ""
              }`}
            >
              {sidebarExpanded ? "Forms and Datas" : "..."}
            </p>
            <a
              href="#"
              className={`flex items-center gap-4 py-3 px-4 rounded-lg transition text-gray-700 ${
                !sidebarExpanded && "justify-center"
              } hover:bg-gray-100`}
            >
              <BookOpen size={22} />
              {sidebarExpanded && <span>Gestion Formations</span>}
            </a>
            <a
              href="#"
              className={`flex items-center gap-4 py-3 px-4 rounded-lg transition text-gray-700 ${
                !sidebarExpanded && "justify-center"
              } hover:bg-gray-100`}
            >
              <Users size={22} />
              {sidebarExpanded && <span>Gestion Étudiants</span>}
            </a>
            <a
              href="#"
              className={`flex items-center gap-4 py-3 px-4 rounded-lg transition text-gray-700 ${
                !sidebarExpanded && "justify-center"
              } hover:bg-gray-100`}
            >
              <Mail size={22} />
              {sidebarExpanded && <span>Demandes de Formulaires</span>}
            </a>
          </div>

          {/* Help */}
          <div>
            <p
              className={`text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 ${
                !sidebarExpanded ? "text-center" : ""
              }`}
            >
              {sidebarExpanded ? "Help" : "..."}
            </p>
            <a
              href="#"
              className={`flex items-center gap-4 py-3 px-4 rounded-lg transition text-gray-700 ${
                !sidebarExpanded && "justify-center"
              } hover:bg-gray-100`}
            >
              <HelpCircle size={22} />
              {sidebarExpanded && <span>Documentation</span>}
            </a>
          </div>
        </nav>

        <div className="px-4 pb-6">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center justify-center gap-3 py-4 bg-yellow-500 text-blue-900 font-bold rounded-xl hover:bg-yellow-400 transition shadow-lg ${
              !sidebarExpanded && "px-4"
            }`}
          >
            <LogOut size={22} />
            {sidebarExpanded && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`pt-20 transition-all duration-300 ${
          sidebarExpanded ? "ml-64" : "ml-20"
        }`}
      >
        <div className="px-8">
          {/* Dedicated welcome section - full control */}
          <div className="pb-15 text-center">
            <h2 className="text-6xl font-black text-blue-900 mb-6">
              Bienvenue de retour !
            </h2>
            <p className="text-2xl text-gray-600">
              Prêt à gérer vos formations aujourd'hui ?
            </p>
          </div>

          {/* Tableau de Bord */}
          <h1 className="text-4xl font-bold text-blue-900 mb-16">
            Tableau de Bord
          </h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <h3 className="text-gray-600 text-sm">Total Formations</h3>
              <p className="text-4xl font-bold text-blue-900 mt-2">
                {formations.length}
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <h3 className="text-gray-600 text-sm">Étudiants Inscrits</h3>
              <p className="text-4xl font-bold text-blue-900 mt-2">
                {allStudents.length}
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <h3 className="text-gray-600 text-sm">Demandes de Contact</h3>
              <p className="text-4xl font-bold text-blue-900 mt-2">
                {formRequestsCount}
              </p>
              <span className="text-sm text-green-600">+2 nouvelles</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-10">
            <div className="flex gap-12">
              <button
                onClick={() => setActiveTab("formations")}
                className={`py-4 px-2 font-medium text-lg border-b-3 transition-colors ${
                  activeTab === "formations"
                    ? "text-blue-900 border-blue-900"
                    : "text-gray-500 border-transparent hover:text-gray-700"
                }`}
              >
                Formations
              </button>
              <button
                onClick={() => setActiveTab("etudiants")}
                className={`py-4 px-2 font-medium text-lg border-b-3 transition-colors ${
                  activeTab === "etudiants"
                    ? "text-blue-900 border-blue-900"
                    : "text-gray-500 border-transparent hover:text-gray-700"
                }`}
              >
                Étudiants
              </button>
              <button
                onClick={() => setActiveTab("demandes")}
                className={`py-4 px-2 font-medium text-lg border-b-3 transition-colors ${
                  activeTab === "demandes"
                    ? "text-blue-900 border-blue-900"
                    : "text-gray-500 border-transparent hover:text-gray-700"
                }`}
              >
                Demandes
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === "formations" && (
              <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
                <div className="bg-blue-900 text-white p-6 flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Formations</h2>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleExport("formations")}
                      className="p-2 bg-yellow-500 rounded-lg hover:bg-yellow-400 transition"
                    >
                      <Download size={20} />
                    </button>
                    <button
                      onClick={handlePrint}
                      className="p-2 bg-yellow-500 rounded-lg hover:bg-yellow-400 transition"
                    >
                      <Printer size={20} />
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-gray-100">
                  {formations.map((formation) => (
                    <div key={formation.id}>
                      <button
                        onClick={() =>
                          setExpandedFormation(
                            expandedFormation === formation.id
                              ? null
                              : formation.id
                          )
                        }
                        className="w-full px-6 py-5 flex justify-between items-center hover:bg-gray-50 transition text-left"
                      >
                        <div>
                          <p className="font-semibold text-lg text-gray-900">
                            {formation.title}
                          </p>
                          <p className="text-sm text-gray-600">
                            {formation.duration} • {formation.price}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-blue-900 font-medium">
                            {formation.studentsCount} étudiants
                          </span>
                          {expandedFormation === formation.id ? (
                            <ChevronUp size={20} />
                          ) : (
                            <ChevronDown size={20} />
                          )}
                        </div>
                      </button>

                      {expandedFormation === formation.id && (
                        <div className="px-6 pb-5 bg-gray-50">
                          <p className="text-gray-700 font-medium mb-3">
                            Liste des étudiants inscrits :
                          </p>
                          <ul className="space-y-2">
                            {allStudents
                              .filter((s) =>
                                s.formation.includes(
                                  formation.title.split(" ")[1] || ""
                                )
                              )
                              .map((student) => (
                                <li
                                  key={student.id}
                                  className="bg-white px-4 py-3 rounded-lg shadow-sm"
                                >
                                  <p className="font-medium">{student.name}</p>
                                  <p className="text-sm text-gray-600">
                                    {student.email}
                                  </p>
                                </li>
                              ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "etudiants" && (
              <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
                <div className="bg-blue-900 text-white p-6 flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Étudiants</h2>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleExport("étudiants")}
                      className="p-2 bg-yellow-500 rounded-lg hover:bg-yellow-400 transition"
                    >
                      <Download size={20} />
                    </button>
                    <button
                      onClick={handlePrint}
                      className="p-2 bg-yellow-500 rounded-lg hover:bg-yellow-400 transition"
                    >
                      <Printer size={20} />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => setExpandedStudents(!expandedStudents)}
                  className="w-full px-6 py-5 flex justify-between items-center hover:bg-gray-50 transition text-left"
                >
                  <p className="font-semibold text-lg text-gray-900">
                    Voir tous les étudiants ({allStudents.length})
                  </p>
                  {expandedStudents ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </button>

                {expandedStudents && (
                  <div className="px-6 pb-5 bg-gray-50 max-h-96 overflow-y-auto">
                    <ul className="space-y-3">
                      {allStudents.map((student) => (
                        <li
                          key={student.id}
                          className="bg-white px-5 py-4 rounded-xl shadow-sm"
                        >
                          <p className="font-medium text-gray-900">
                            {student.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {student.email} • {student.phone}
                          </p>
                          <p className="text-sm text-blue-700 mt-1">
                            Formation: {student.formation}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === "demandes" && (
              <div className="bg-white rounded-2xl shadow-md p-12 border border-gray-100 text-center">
                <Mail size={80} className="mx-auto text-gray-300 mb-6" />
                <p className="text-2xl font-medium text-gray-700">
                  {formRequestsCount} demandes en attente
                </p>
                <p className="text-gray-500 mt-2">
                  Consultez le menu pour la liste complète
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
