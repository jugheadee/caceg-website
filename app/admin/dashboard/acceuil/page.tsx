'use client';

import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ChevronLeft,
  ChevronRight,ChevronDown, ChevronUp,Users,Mail}from "lucide-react";

interface Formation {
  id: string;
  title: string;
  duration: string;
  price: string;
  studentsCount: number;
}

export default function AdminDashboard() {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [expandedFormation, setExpandedFormation] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"formations" | "etudiants" | "demandes">("formations");

  // Mock data pour étudiants (à remplacer par Firestore plus tard)
  const allStudents = [
    { name: "Ahmed Benali", formation: "Excel Avancé" },
    { name: "Fatima Zahra", formation: "Management de Projet" },
    { name: "Karim Djoudi", formation: "Excel Avancé" },
  ];

  const formRequestsCount = 7;

  // Fetch formations depuis Firestore (si tu les as déjà)
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "formations"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Formation));
      setFormations(data);
    });
    return () => unsubscribe();
  }, []);

  // Si pas encore de données Firestore, fallback mock
  const displayFormations = formations.length > 0 ? formations : [
    { id: "1", title: "Formation Excel Avancé", duration: "3 jours", price: "45 000 DZD", studentsCount: 12 },
    { id: "2", title: "Management de Projet", duration: "5 jours", price: "80 000 DZD", studentsCount: 8 },
    { id: "3", title: "Comptabilité Générale", duration: "10 jours", price: "120 000 DZD", studentsCount: 15 },
  ];

  return (
    <div className="max-w-7xl mx-auto py-10">
      {/* Welcome section */}
      <div className="text-center mb-16">
        <h2 className="text-6xl font-black text-blue-900 mb-6">
          Bienvenue sur votre espace administrateur
        </h2>
        <p className="text-2xl text-gray-600">
          Prêt à gérer votre plateforme aujourd'hui ?
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
            {displayFormations.length}
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
            <div className="bg-blue-900 text-white p-6">
              <h2 className="text-2xl font-bold">Formations</h2>
            </div>

            <div className="divide-y divide-gray-100">
              {displayFormations.map((formation) => (
                <div key={formation.id}>
                  <button
                    onClick={() =>
                      setExpandedFormation(
                        expandedFormation === formation.id ? null : formation.id
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
                          .filter((s) => s.formation.includes(formation.title.split(" ")[1] || ""))
                          .map((student, i) => (
                            <li key={i} className="bg-white px-4 py-3 rounded-lg shadow-sm">
                              <p className="font-medium">{student.name}</p>
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
          <div className="bg-white rounded-2xl shadow-md p-12 border border-gray-100 text-center">
            <Users size={80} className="mx-auto text-gray-300 mb-6" />
            <p className="text-2xl font-medium text-gray-700">
              Gestion des étudiants en développement
            </p>
          </div>
        )}

        {activeTab === "demandes" && (
          <div className="bg-white rounded-2xl shadow-md p-12 border border-gray-100 text-center">
            <Mail size={80} className="mx-auto text-gray-300 mb-6" />
            <p className="text-2xl font-medium text-gray-700">
              {formRequestsCount} demandes en attente
            </p>
            <p className="text-gray-500 mt-2">
              Fonctionnalité en développement
            </p>
          </div>
        )}
      </div>
    </div>
  );
}