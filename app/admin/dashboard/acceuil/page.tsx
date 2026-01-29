"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Users,
  Mail,
  Clock,
  TrendingUp,
  UserPlus,
  ChevronDown,
  ChevronUp,
  Calendar as CalendarIcon,
} from "lucide-react";

interface Formation {
  id: string;
  title: string;
  duration: string;
  price: string;
}

interface Etudiant {
  id: string;
  prenom: string;
  nom: string;
  formationId: string;
  dateInscription: any;
}

interface Activity {
  id: string;
  type: "inscription";
  message: string;
  timestamp: Date;
}

export default function AdminDashboard() {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [etudiantsParFormation, setEtudiantsParFormation] = useState<
    Record<string, Etudiant[]>
  >({});
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [expandedFormation, setExpandedFormation] = useState<string | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<
    "formations" | "etudiants" | "demandes"
  >("formations");
  const [loading, setLoading] = useState(true);

  // Date du jour
  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    const unsubFormations = onSnapshot(collection(db, "formations"), (snap) => {
      const data = snap.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Formation)
      );
      setFormations(data);
    });

    // Étudiants récents pour timeline (seulement les 8 derniers)
    const q = query(
      collection(db, "etudiants"),
      orderBy("dateInscription", "desc"),
      limit(8)
    );
    const unsubEtudiants = onSnapshot(q, (snap) => {
      const map: Record<string, Etudiant[]> = {};
      const activities: Activity[] = [];

      snap.docs.forEach((doc) => {
        const data = doc.data();
        const etu: Etudiant = {
          id: doc.id,
          prenom: data.prenom,
          nom: data.nom,
          formationId: data.formationId,
          dateInscription: data.dateInscription,
        };

        if (!map[etu.formationId]) map[etu.formationId] = [];
        map[etu.formationId].push(etu);

        const formationTitle =
          formations.find((f) => f.id === etu.formationId)?.title ||
          "une formation";
        activities.push({
          id: doc.id,
          type: "inscription",
          message: `${etu.prenom} ${etu.nom} s'est inscrit à "${formationTitle}"`,
          timestamp: data.dateInscription.toDate
            ? data.dateInscription.toDate()
            : new Date(data.dateInscription),
        });
      });

      setEtudiantsParFormation((prev) => ({ ...prev, ...map }));
      setRecentActivities(activities);
      setLoading(false);
    });

    return () => {
      unsubFormations();
      unsubEtudiants();
    };
  }, [formations]);

  // Top 3 formations populaires
  const popularFormations = [...formations]
    .map((f) => ({
      ...f,
      count: (etudiantsParFormation[f.id] || []).length,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  const totalEtudiants = Object.values(etudiantsParFormation).flat().length;
  const totalFormations = formations.length;

  // TODO: À connecter plus tard avec ta collection "demandes" ou "contact"
  const demandesEnAttente = 0; // Remplace par un vrai count quand tu auras la collection

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      {/* Header Bienvenue */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-3xl p-10 mb-10 shadow-xl">
        <h1 className="text-4xl md:text-5xl font-black mb-3">
          Bienvenue sur votre espace administrateur CACEG
        </h1>
        <p className="text-xl opacity-90">{"Aujourd'hui, "}{today}</p>
        {totalEtudiants > 0 && (
          <p className="text-lg mt-3 opacity-80">
            {totalEtudiants} étudiant{totalEtudiants > 1 ? "s" : ""} inscrit
            {totalEtudiants > 1 ? "s" : ""} au total • Prêt à gérer la
            plateforme ? 🚀
          </p>
        )}
      </div>

      {/* KPI Cards - Grille équilibrée */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* Carte 1: Formations actives (mini bar chart comme dans ton image) */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 relative overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-sm text-blue-600 font-medium">
                Formations actives
              </p>
              <p className="text-4xl font-bold text-gray-900 mt-2">
                {totalFormations}
              </p>
            </div>
            <a href="#" className="text-sm text-blue-600 hover:underline">
              Voir détails →
            </a>
          </div>

          {/* Mini Bar Chart SVG */}
          <div className="absolute bottom-0 left-0 right-0 h-24 flex items-end justify-around px-4 pb-4">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 200 80"
              preserveAspectRatio="none"
            >
              <rect
                x="30"
                y="50"
                width="25"
                height="30"
                fill="#EBF4FF"
                rx="4"
              />
              <rect
                x="70"
                y="20"
                width="25"
                height="60"
                fill="#3B82F6"
                rx="4"
              />
              <rect
                x="110"
                y="40"
                width="25"
                height="40"
                fill="#EBF4FF"
                rx="4"
              />
              <rect
                x="150"
                y="55"
                width="25"
                height="25"
                fill="#EBF4FF"
                rx="4"
              />
            </svg>
          </div>

          {/* Badge croissance */}
          <div className="absolute top-20 right-6">
            <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
              <TrendingUp size={16} />
              +15%
            </div>
          </div>
        </div>

        {/* Carte 2: Étudiants inscrits (mini line chart comme dans ton image) */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 relative overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-sm text-blue-600 font-medium">
                Étudiants inscrits
              </p>
              <p className="text-4xl font-bold text-gray-900 mt-2">
                {totalEtudiants}
              </p>
            </div>
            <a href="#" className="text-sm text-blue-600 hover:underline">
              Voir détails →
            </a>
          </div>

          {/* Mini Line Chart SVG */}
          <div className="absolute bottom-0 left-0 right-0 h-24 px-4 pb-4">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 200 80"
              preserveAspectRatio="none"
            >
              <path
                d="M 10 60 Q 50 20, 90 40 T 170 30 L 190 50"
                stroke="#06B6D4"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 10 60 Q 50 20, 90 40 T 170 30 L 190 50 L 190 80 L 10 80 Z"
                fill="url(#gradient)"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Badge croissance + nombre récent */}
          <div className="absolute top-20 right-6 text-right">
            <div className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm font-bold">
              +25
            </div>
            <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold mt-2 flex items-center gap-1 justify-end">
              <TrendingUp size={16} />
              +10%
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center mb-3">
            <Mail size={28} className="text-blue-900" />
          </div>
          <p className="text-3xl font-bold text-blue-900">
            {demandesEnAttente}
          </p>
          <p className="text-gray-600">Demandes en attente</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <p className="text-lg font-semibold text-gray-800 mb-4">
            Top 3 formations
          </p>
          {popularFormations.length === 0 ? (
            <p className="text-gray-500 text-sm">Aucune inscription</p>
          ) : (
            <div className="space-y-3">
              {popularFormations.map((f, i) => (
                <div key={f.id} className="flex justify-between items-center">
                  <span className="text-sm text-gray-700 truncate">
                    {i + 1}. {f.title}
                  </span>
                  <span className="font-bold text-blue-900 text-sm">
                    {f.count} inscrits
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Timeline + Calendrier - Compact et équilibré */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Timeline - Seulement 8 activités max */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-blue-900 mb-5 flex items-center gap-2">
            <Clock size={24} /> Activités récentes
          </h3>
          {recentActivities.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Aucune inscription récente
            </p>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {recentActivities.map((act) => (
                <div key={act.id} className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                    <UserPlus size={16} className="text-blue-900" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-800 leading-tight">
                      {act.message}
                    </p>
                    <p className="text-xs text-gray-500">
                      {act.timestamp.toLocaleTimeString("fr-DZ", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      •{act.timestamp.toLocaleDateString("fr-DZ")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Calendrier - Plus beau placeholder */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-blue-900 mb-5 flex items-center gap-2">
            <CalendarIcon size={24} /> Planning des sessions
          </h3>
          <div className="bg-gradient-to-br from-blue-50 to-yellow-50 rounded-2xl p-8 text-center">
            <CalendarIcon
              size={64}
              className="mx-auto text-blue-900 mb-4 opacity-60"
            />
            <p className="text-xl font-semibold text-gray-800">
              Aucune session prévue pour le moment
            </p>
            <p className="text-gray-600 mt-3">
              Le calendrier interactif arrive bientôt !
            </p>
          </div>
        </div>
      </div>

      {/* Tabs - Plus compact */}
      <div>
        <div className="border-b border-gray-200 mb-6">
          <div className="flex gap-10">
            {(["formations", "etudiants", "demandes"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-1 font-medium text-lg border-b-4 transition-colors ${
                  activeTab === tab
                    ? "text-blue-900 border-blue-900"
                    : "text-gray-500 border-transparent hover:text-gray-700"
                }`}
              >
                {tab === "formations" && "Formations"}
                {tab === "etudiants" && "Étudiants"}
                {tab === "demandes" && "Demandes"}
              </button>
            ))}
          </div>
        </div>

        {/* Contenu des tabs - Identique mais plus propre */}
        {activeTab === "formations" && (
          <div className="grid gap-4">
            {formations.map((formation) => {
              const count = (etudiantsParFormation[formation.id] || []).length;
              const isPopular = popularFormations.some(
                (f) => f.id === formation.id
              );

              return (
                <div
                  key={formation.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setExpandedFormation(
                        expandedFormation === formation.id ? null : formation.id
                      )
                    }
                    className="w-full px-6 py-5 flex justify-between items-center hover:bg-gray-50 text-left"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <p className="font-semibold text-lg text-gray-900">
                          {formation.title}
                        </p>
                        {isPopular && (
                          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold">
                            Populaire 🔥
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {formation.duration && `${formation.duration} • `}
                        {formation.price}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-medium text-blue-900">
                        {count} étudiant{count > 1 ? "s" : ""}
                      </span>
                      {expandedFormation === formation.id ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </div>
                  </button>

                  {expandedFormation === formation.id && count > 0 && (
                    <div className="px-6 pb-5 bg-gray-50 border-t">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                        {etudiantsParFormation[formation.id]?.map((e) => (
                          <div
                            key={e.id}
                            className="bg-white p-3 rounded-lg shadow-sm text-sm"
                          >
                            <p className="font-medium">
                              {e.prenom} {e.nom}
                            </p>
                            <p className="text-gray-500">
                              Inscrit le{" "}
                              {new Date(
                                e.dateInscription.toDate?.() ||
                                  e.dateInscription
                              ).toLocaleDateString("fr-DZ")}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Autres tabs inchangés mais plus propres */}
        {activeTab === "etudiants" && (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center border">
            <Users size={70} className="mx-auto text-gray-300 mb-5" />
            <p className="text-xl font-medium text-gray-700">
              Gestion complète des étudiants disponible dans le menu latéral
            </p>
          </div>
        )}

        {activeTab === "demandes" && (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center border">
            <Mail size={70} className="mx-auto text-gray-300 mb-5" />
            <p className="text-xl font-medium text-gray-700">
              Module de gestion des demandes en développement
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
