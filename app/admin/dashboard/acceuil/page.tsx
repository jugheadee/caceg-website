'use client';

import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Menu,
  UserCircle,
  LogOut,
  LayoutDashboard,
  BookOpen,
  Users,
  Mail,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface Formation {
  id: string;
  title: string;
  duration?: string;
  price: string;
}

interface Etudiant {
  id: string;
  prenom: string;
  nom: string;
  dateInscription: string;
}

export default function AdminDashboard() {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [etudiantsParFormation, setEtudiantsParFormation] = useState<Record<string, Etudiant[]>>({});
  const [expandedFormation, setExpandedFormation] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"formations" | "etudiants" | "demandes">("formations");
  const [loading, setLoading] = useState(true);

  // Fetch formations
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "formations"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title,
        duration: doc.data().duration || "",
        price: doc.data().price,
      } as Formation));
      setFormations(data);
    });
    return () => unsubscribe();
  }, []);

  // Fetch étudiants acceptés et les grouper par formation
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "etudiants"), (snapshot) => {
      const map: Record<string, Etudiant[]> = {};

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        const formationId = data.formationId;

        if (!map[formationId]) {
          map[formationId] = [];
        }

        map[formationId].push({
          id: doc.id,
          prenom: data.prenom,
          nom: data.nom,
          dateInscription: data.dateInscription,
        });
      });

      setEtudiantsParFormation(map);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const formRequestsCount = 7; // À connecter plus tard si tu as une collection demandes

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
            {formations.length}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <h3 className="text-gray-600 text-sm">Étudiants Inscrits</h3>
          <p className="text-4xl font-bold text-blue-900 mt-2">
            {Object.values(etudiantsParFormation).flat().length}
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
              {formations.map((formation) => {
                const etudiants = etudiantsParFormation[formation.id] || [];
                const count = etudiants.length;

                return (
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
                          {formation.duration ? `${formation.duration} • ` : ""}{formation.price}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-blue-900 font-medium">
                          {count} étudiant{count > 1 ? 's' : ''} inscrit{count > 1 ? 's' : ''}
                        </span>
                        {expandedFormation === formation.id ? (
                          <ChevronUp size={20} className="text-gray-600" />
                        ) : (
                          <ChevronDown size={20} className="text-gray-600" />
                        )}
                      </div>
                    </button>

                    {expandedFormation === formation.id && (
                      <div className="px-6 pb-5 bg-gray-50">
                        <p className="text-gray-700 font-medium mb-3">
                          Liste des étudiants inscrits :
                        </p>
                        {count === 0 ? (
                          <p className="text-gray-500 italic">Aucun étudiant inscrit pour l'instant</p>
                        ) : (
                          <ul className="space-y-3">
                            {etudiants.map((etudiant) => (
                              <li key={etudiant.id} className="bg-white px-5 py-4 rounded-xl shadow-sm border border-gray-100">
                                <p className="font-medium text-gray-900">
                                  {etudiant.prenom} {etudiant.nom}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                  Inscrit le {new Date(etudiant.dateInscription).toLocaleDateString('fr-DZ')}
                                </p>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
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