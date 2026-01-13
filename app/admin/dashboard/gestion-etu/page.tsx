"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Edit,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Plus,
  Search,
  Filter,
  X,
  ArrowUpDown,
} from "lucide-react";

const wilayas = [
  "Adrar",
  "Chlef",
  "Laghouat",
  "Oum El Bouaghi",
  "Batna",
  "Béjaïa",
  "Biskra",
  "Béchar",
  "Blida",
  "Bouira",
  "Tamanrasset",
  "Tébessa",
  "Tlemcen",
  "Tiaret",
  "Tizi Ouzou",
  "Alger",
  "Djelfa",
  "Jijel",
  "Sétif",
  "Saïda",
  "Skikda",
  "Sidi Bel Abbès",
  "Annaba",
  "Guelma",
  "Constantine",
  "Médéa",
  "Mostaganem",
  "M'Sila",
  "Mascara",
  "Ouargla",
  "Oran",
  "El Bayadh",
  "Illizi",
  "Bordj Bou Arreridj",
  "Boumerdès",
  "El Tarf",
  "Tindouf",
  "Tissemsilt",
  "El Oued",
  "Khenchela",
  "Souk Ahras",
  "Tipaza",
  "Mila",
  "Aïn Defla",
  "Naâma",
  "Aïn Témouchent",
  "Ghardaïa",
  "Relizane",
  "Timimoun",
  "Bordj Badji Mokhtar",
  "Ouled Djellal",
  "Béni Abbès",
  "In Salah",
  "In Guezzam",
  "Touggourt",
  "Djanet",
  "El M'Ghair",
  "El Meniaa",
];

interface Formation {
  id: string;
  title: string;
}

interface Etudiant {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  formationId: string;
  wilaya: string;
  commune: string;
  dateNaissance: string;
  dateInscription: any;
}

const allColumns = [
  { key: "nomComplet", label: "Nom complet" },
  { key: "dateNaissance", label: "Date naissance" },
  { key: "wilaya", label: "Wilaya" },
  { key: "telephone", label: "Téléphone" },
  { key: "email", label: "Email" },
  { key: "formation", label: "Formation" },
];

export default function GestionEtudiants() {
  const [allEtudiants, setAllEtudiants] = useState<Etudiant[]>([]);
  const [etudiants, setEtudiants] = useState<Etudiant[]>([]);
  const [formations, setFormations] = useState<Formation[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterFormations, setFilterFormations] = useState<string[]>([]);
  const [filterWilayas, setFilterWilayas] = useState<string[]>([]);

  const [sortBy, setSortBy] = useState<
    "dateDesc" | "dateAsc" | "nameAsc" | "nameDesc"
  >("dateDesc");

  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    allColumns.map((c) => c.key)
  );

  const [showColumnDropdown, setShowColumnDropdown] = useState(false);
  const [showFormationDropdown, setShowFormationDropdown] = useState(false);
  const [showWilayaDropdown, setShowWilayaDropdown] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    formationId: "",
    wilaya: "",
    commune: "",
    dateNaissance: "",
  });

  useEffect(() => {
    const unsubEtudiants = onSnapshot(collection(db, "etudiants"), (snap) => {
      const data = snap.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Etudiant)
      );
      setAllEtudiants(data);
    });

    const unsubFormations = onSnapshot(collection(db, "formations"), (snap) => {
      const data = snap.docs.map(
        (doc) => ({ id: doc.id, title: doc.data().title } as Formation)
      );
      setFormations(data);
    });

    return () => {
      unsubEtudiants();
      unsubFormations();
    };
  }, []);

  useEffect(() => {
    let filtered = allEtudiants;

    if (searchQuery.trim()) {
      const terms = searchQuery.trim().toLowerCase().split(/\s+/);
      filtered = filtered.filter((e) => {
        const fullNameLower = `${e.prenom} ${e.nom}`.toLowerCase();
        return terms.every((term) => fullNameLower.includes(term));
      });
    }

    if (filterFormations.length > 0) {
      filtered = filtered.filter((e) =>
        filterFormations.includes(e.formationId)
      );
    }

    if (filterWilayas.length > 0) {
      filtered = filtered.filter((e) => filterWilayas.includes(e.wilaya));
    }

    filtered = [...filtered].sort((a, b) => {
      if (sortBy === "dateDesc")
        return (
          new Date(
            b.dateInscription?.toDate?.() || b.dateInscription || 0
          ).getTime() -
          new Date(
            a.dateInscription?.toDate?.() || a.dateInscription || 0
          ).getTime()
        );
      if (sortBy === "dateAsc")
        return (
          new Date(
            a.dateInscription?.toDate?.() || a.dateInscription || 0
          ).getTime() -
          new Date(
            b.dateInscription?.toDate?.() || b.dateInscription || 0
          ).getTime()
        );
      if (sortBy === "nameAsc")
        return `${a.prenom} ${a.nom}`.localeCompare(`${b.prenom} ${b.nom}`);
      if (sortBy === "nameDesc")
        return `${b.prenom} ${b.nom}`.localeCompare(`${a.prenom} ${a.nom}`);
      return 0;
    });

    setEtudiants(filtered);
    setCurrentPage(1);
  }, [searchQuery, filterFormations, filterWilayas, sortBy, allEtudiants]);

  const totalPages = Math.ceil(etudiants.length / itemsPerPage);
  const paginatedEtudiants = etudiants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getPageNumbers = () => {
    if (totalPages <= 1) return [];
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1, 2);
      if (currentPage > 4) pages.push("...");
      for (
        let i = Math.max(3, currentPage - 1);
        i <= Math.min(totalPages - 2, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }
      if (currentPage < totalPages - 3) pages.push("...");
      pages.push(totalPages - 1, totalPages);
    }
    return pages;
  };

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) => {
      const isCurrentlyVisible = prev.includes(key);
      const visibleCount = prev.length;

      if (isCurrentlyVisible && visibleCount === 1) {
        return prev;
      }

      if (isCurrentlyVisible) {
        return prev.filter((k) => k !== key);
      } else {
        return [...prev, key];
      }
    });
  };

  const toggleFormation = (id: string) => {
    setFilterFormations((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const toggleWilaya = (wilaya: string) => {
    setFilterWilayas((prev) =>
      prev.includes(wilaya)
        ? prev.filter((w) => w !== wilaya)
        : [...prev, wilaya]
    );
  };

  const handleNameSort = () => {
    setSortBy(sortBy === "nameAsc" ? "nameDesc" : "nameAsc");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.nom ||
      !formData.prenom ||
      !formData.email ||
      !formData.formationId ||
      !formData.wilaya ||
      !formData.dateNaissance
    ) {
      alert("Les champs obligatoires doivent être remplis");
      return;
    }

    const dataToSave = {
      nom: formData.nom.trim(),
      prenom: formData.prenom.trim(),
      email: formData.email.trim().toLowerCase(),
      telephone: formData.telephone.trim(),
      formationId: formData.formationId,
      wilaya: formData.wilaya,
      commune: formData.commune.trim(),
      dateNaissance: formData.dateNaissance,
      dateInscription: new Date().toISOString(),
    };

    try {
      if (editingId) {
        await updateDoc(doc(db, "etudiants", editingId), dataToSave);
      } else {
        await addDoc(collection(db, "etudiants"), dataToSave);
      }
      closeModal();
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la sauvegarde");
    }
  };

  const handleEdit = (etudiant: Etudiant) => {
    setFormData({
      nom: etudiant.nom,
      prenom: etudiant.prenom,
      email: etudiant.email,
      telephone: etudiant.telephone,
      formationId: etudiant.formationId,
      wilaya: etudiant.wilaya,
      commune: etudiant.commune,
      dateNaissance: etudiant.dateNaissance,
    });
    setEditingId(etudiant.id);
    setShowModal(true);
  };

  const handleBatchDelete = async () => {
    if (selectedIds.size === 0) return;
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    try {
      const promises = Array.from(selectedIds).map((id) =>
        deleteDoc(doc(db, "etudiants", id))
      );
      await Promise.all(promises);
      setSelectedIds(new Set());
      setEditMode(false);
      setShowConfirmDelete(false);
    } catch (error) {
      alert("Erreur lors de la suppression");
      setShowConfirmDelete(false);
    }
  };

  const cancelDelete = () => {
    setShowConfirmDelete(false);
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const toggleSelectAll = () => {
    if (
      selectedIds.size === paginatedEtudiants.length &&
      paginatedEtudiants.length > 0
    ) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedEtudiants.map((e) => e.id)));
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      nom: "",
      prenom: "",
      email: "",
      telephone: "",
      formationId: "",
      wilaya: "",
      commune: "",
      dateNaissance: "",
    });
  };

  const getFormationTitle = (formationId: string) => {
    const f = formations.find((f) => f.id === formationId);
    return f ? f.title : "Aucune formation";
  };

  const exportToCSV = () => {
    const headers = [
      "Nom complet",
      "Date naissance",
      "Wilaya",
      "Téléphone",
      "Email",
      "Formation",
    ];
    const rows = etudiants.map((e) => [
      `${e.prenom} ${e.nom}`,
      e.dateNaissance || "-",
      e.wilaya,
      e.telephone || "-",
      e.email,
      getFormationTitle(e.formationId),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([`\uFEFF${csvContent}`], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "etudiants_caceg.csv");
    link.click();
  };

  const resetAllFilters = () => {
    setSearchQuery("");
    setFilterFormations([]);
    setFilterWilayas([]);
    setSortBy("dateDesc");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-8 py-10">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold text-blue-900">
            Gestion des Étudiants
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => setShowModal(true)}
              className="bg-yellow-500 text-blue-900 font-bold px-8 py-4 rounded-xl hover:bg-yellow-400 transition shadow-lg flex items-center gap-3"
            >
              <Plus size={24} />
              Ajouter un étudiant
            </button>

            {editMode && selectedIds.size > 0 && (
              <button
                onClick={handleBatchDelete}
                className="bg-red-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-red-700 transition shadow-lg"
              >
                Supprimer ({selectedIds.size})
              </button>
            )}

            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="bg-blue-900 text-white font-bold px-8 py-4 rounded-xl hover:bg-blue-800 transition shadow-lg"
              >
                Éditer
              </button>
            ) : (
              <button
                onClick={() => {
                  setEditMode(false);
                  setSelectedIds(new Set());
                }}
                className="bg-gray-300 text-gray-800 font-bold px-8 py-4 rounded-xl hover:bg-gray-400 transition"
              >
                Annuler
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="relative">
              <Search
                className="absolute left-4 top-4 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Rechercher par nom ou prénom..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200 outline-none transition"
              />
            </div>

            {/* Toutes les formations */}
            <div className="relative inline-block text-left">
              <button
                type="button"
                onClick={() => setShowFormationDropdown(!showFormationDropdown)}
                className="flex items-center gap-2 px-5 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition whitespace-nowrap min-w-[220px] w-full justify-between"
              >
                <span className="truncate">
                  {filterFormations.length === 0
                    ? "Toutes les formations"
                    : `${filterFormations.length} formations`}
                </span>
                <ChevronDown
                  size={18}
                  className={`text-gray-500 transition-transform ${
                    showFormationDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showFormationDropdown && (
                <div
                  className="
                    absolute right-0 top-full mt-2 w-full min-w-[220px] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-30
                  "
                >
                  <div className="max-h-64 overflow-y-auto divide-y divide-gray-100">
                    {formations.map((f) => (
                      <label
                        key={f.id}
                        className="flex items-center px-5 py-3.5 hover:bg-blue-50/50 cursor-pointer transition-colors select-none group"
                      >
                        <div className="relative flex h-5 w-5 items-center justify-center">
                          <input
                            type="checkbox"
                            checked={filterFormations.includes(f.id)}
                            onChange={() => toggleFormation(f.id)}
                            className="peer h-5 w-5 appearance-none rounded-md border-2 border-gray-300 bg-white checked:border-blue-600 checked:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors group-hover:border-blue-400"
                          />
                          {/* White checkmark when checked */}
                          <svg
                            className="pointer-events-none absolute h-4 w-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth="3"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <span className="ml-3 text-gray-700 font-medium group-hover:text-blue-700 transition-colors">
                          {f.title}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Toutes les wilayas */}
            <div className="relative inline-block text-left">
              <button
                type="button"
                onClick={() => setShowWilayaDropdown(!showWilayaDropdown)}
                className="flex items-center gap-2 px-5 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition whitespace-nowrap min-w-[220px] w-full justify-between"
              >
                <span className="truncate">
                  {filterWilayas.length === 0
                    ? "Toutes les wilayas"
                    : `${filterWilayas.length} wilayas`}
                </span>
                <ChevronDown
                  size={18}
                  className={`text-gray-500 transition-transform ${
                    showWilayaDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showWilayaDropdown && (
                <div
                  className="
                    absolute right-0 top-full mt-2 w-full min-w-[220px] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-30
                  "
                >
                  <div className="max-h-64 overflow-y-auto divide-y divide-gray-100">
                    {wilayas.map((w) => (
                      <label
                        key={w}
                        className="flex items-center px-5 py-3.5 hover:bg-blue-50/50 cursor-pointer transition-colors select-none group"
                      >
                        <div className="relative flex h-5 w-5 items-center justify-center">
                          <input
                            type="checkbox"
                            checked={filterWilayas.includes(w)}
                            onChange={() => toggleWilaya(w)}
                            className="peer h-5 w-5 appearance-none rounded-md border-2 border-gray-300 bg-white checked:border-blue-600 checked:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors group-hover:border-blue-400"
                          />
                          {/* White checkmark when checked */}
                          <svg
                            className="pointer-events-none absolute h-4 w-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth="3"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <span className="ml-3 text-gray-700 font-medium group-hover:text-blue-700 transition-colors">
                          {w}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={resetAllFilters}
              className="bg-blue-900 text-white font-bold px-8 py-4 rounded-xl hover:bg-blue-800 transition shadow-md flex items-center justify-center gap-2"
            >
              <Filter size={20} />
              Réinitialiser
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <div className="flex items-center gap-6">
              <span className="text-gray-600 font-medium">
                Étudiants Summary ({etudiants.length})
              </span>

              <div className="relative inline-block text-left">
                <button
                  type="button"
                  onClick={() => setShowColumnDropdown(!showColumnDropdown)}
                  className="flex items-center gap-2 px-5 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition whitespace-nowrap min-w-[220px]"
                >
                  <Filter size={18} />
                  Afficher les colonnes
                  <ChevronDown
                    size={18}
                    className={`text-gray-500 transition-transform ${
                      showColumnDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showColumnDropdown && (
                  <div
                    className="
                      absolute
                      right-0
                      top-full
                      mt-2
                      w-full
                      min-w-[220px]
                      bg-white
                      rounded-xl
                      shadow-2xl
                      border border-gray-200
                      overflow-hidden
                      z-30
                    "
                  >
                    <div className="max-h-64 overflow-y-auto divide-y divide-gray-100">
                      {allColumns.map((col) => (
                        <label
                          key={col.key}
                          className="flex items-center px-5 py-3.5 hover:bg-blue-50/50 cursor-pointer transition-colors select-none group"
                        >
                          <div className="relative flex h-5 w-5 items-center justify-center">
                            <input
                              type="checkbox"
                              checked={visibleColumns.includes(col.key)}
                              onChange={() => toggleColumn(col.key)}
                              className="peer h-5 w-5 appearance-none rounded-md border-2 border-gray-300 bg-white checked:border-blue-600 checked:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors group-hover:border-blue-400"
                            />
                            <svg
                              className="pointer-events-none absolute h-4 w-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              strokeWidth="3"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                          <span className="ml-3 text-gray-700 font-medium group-hover:text-blue-700 transition-colors">
                            {col.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-6">
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-900 transition font-medium"
              >
                <Download size={20} />
                Exporter CSV
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-3 rounded-xl hover:bg-gray-100 disabled:opacity-50 transition"
                >
                  <ChevronLeft size={20} />
                </button>

                {getPageNumbers().map((page, i) =>
                  page === "..." ? (
                    <span key={i} className="px-4 text-gray-500">
                      ...
                    </span>
                  ) : (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(page as number)}
                      className={`w-12 h-12 rounded-xl font-medium transition ${
                        currentPage === page
                          ? "bg-blue-900 text-white shadow-md"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-3 rounded-xl hover:bg-gray-100 disabled:opacity-50 transition"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>

          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {editMode && (
                  <th className="px-6 py-5 text-left w-12">
                    <input
                      type="checkbox"
                      checked={
                        selectedIds.size === paginatedEtudiants.length &&
                        paginatedEtudiants.length > 0
                      }
                      onChange={toggleSelectAll}
                      className="w-5 h-5 text-blue-900 rounded focus:ring-blue-900"
                    />
                  </th>
                )}
                {visibleColumns.includes("nomComplet") && (
                  <th className="px-6 py-5 text-left text-gray-700 font-medium">
                    <button
                      onClick={handleNameSort}
                      className="flex items-center gap-2 hover:text-blue-900 transition"
                    >
                      Nom complet
                      <ArrowUpDown size={16} />
                    </button>
                  </th>
                )}
                {visibleColumns.includes("dateNaissance") && (
                  <th className="px-6 py-5 text-left text-gray-700 font-medium">
                    Date naissance
                  </th>
                )}
                {visibleColumns.includes("wilaya") && (
                  <th className="px-6 py-5 text-left text-gray-700 font-medium">
                    Wilaya
                  </th>
                )}
                {visibleColumns.includes("telephone") && (
                  <th className="px-6 py-5 text-left text-gray-700 font-medium">
                    Téléphone
                  </th>
                )}
                {visibleColumns.includes("email") && (
                  <th className="px-6 py-5 text-left text-gray-700 font-medium">
                    Email
                  </th>
                )}
                {visibleColumns.includes("formation") && (
                  <th className="px-6 py-5 text-left text-gray-700 font-medium">
                    Formation
                  </th>
                )}
                {editMode && (
                  <th className="px-6 py-5 text-right pr-10 text-gray-700 font-medium">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedEtudiants.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="text-center py-16 text-gray-500 text-lg"
                  >
                    Aucun étudiant trouvé avec les filtres actuels.
                  </td>
                </tr>
              ) : (
                paginatedEtudiants.map((e) => (
                  <tr key={e.id} className="hover:bg-gray-50 transition">
                    {editMode && (
                      <td
                        className="px-6 py-5"
                        onClick={(ev) => ev.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={selectedIds.has(e.id)}
                          onChange={() => toggleSelect(e.id)}
                          className="w-5 h-5 text-blue-900 rounded focus:ring-blue-900"
                        />
                      </td>
                    )}
                    {visibleColumns.includes("nomComplet") && (
                      <td className="px-6 py-5 font-medium text-gray-900">
                        {e.prenom} {e.nom}
                      </td>
                    )}
                    {visibleColumns.includes("dateNaissance") && (
                      <td className="px-6 py-5 text-gray-700">
                        {e.dateNaissance
                          ? new Date(e.dateNaissance).toLocaleDateString(
                              "fr-DZ"
                            )
                          : "-"}
                      </td>
                    )}
                    {visibleColumns.includes("wilaya") && (
                      <td className="px-6 py-5 text-gray-700">{e.wilaya}</td>
                    )}
                    {visibleColumns.includes("telephone") && (
                      <td className="px-6 py-5 text-gray-700">
                        {e.telephone || "-"}
                      </td>
                    )}
                    {visibleColumns.includes("email") && (
                      <td className="px-6 py-5 text-gray-700">{e.email}</td>
                    )}
                    {visibleColumns.includes("formation") && (
                      <td className="px-6 py-5">
                        <span className="inline-block px-4 py-2 bg-blue-100 text-blue-900 rounded-full text-sm font-medium">
                          {getFormationTitle(e.formationId)}
                        </span>
                      </td>
                    )}
                    {editMode && (
                      <td
                        className="px-6 py-5 text-right pr-10"
                        onClick={(ev) => ev.stopPropagation()}
                      >
                        <button
                          onClick={() => handleEdit(e)}
                          className="text-blue-600 hover:text-blue-800 transition"
                          title="Modifier"
                        >
                          <Edit size={20} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <div
              className="bg-white rounded-3xl shadow-2xl p-8 max-w-3xl w-full max-h-[95vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-blue-900">
                  {editingId ? "Modifier l'étudiant" : "Nouvel étudiant"}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={28} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    placeholder="Prénom *"
                    value={formData.prenom}
                    onChange={(e) =>
                      setFormData({ ...formData, prenom: e.target.value })
                    }
                    required
                    className="px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200 outline-none transition"
                  />
                  <input
                    type="text"
                    placeholder="Nom *"
                    value={formData.nom}
                    onChange={(e) =>
                      setFormData({ ...formData, nom: e.target.value })
                    }
                    required
                    className="px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200 outline-none transition"
                  />
                </div>

                <input
                  type="date"
                  value={formData.dateNaissance}
                  onChange={(e) =>
                    setFormData({ ...formData, dateNaissance: e.target.value })
                  }
                  required
                  className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200 outline-none transition"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative inline-block text-left w-full">
                    <button
                      type="button"
                      className="w-full px-6 py-4 pr-12 text-left border-2 border-gray-300 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200 outline-none bg-white transition flex items-center justify-between"
                    >
                      <span
                        className={
                          formData.wilaya ? "text-gray-900" : "text-gray-500"
                        }
                      >
                        {formData.wilaya || "Choisir une wilaya *"}
                      </span>
                      <ChevronDown className="text-gray-500" size={20} />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Commune"
                    value={formData.commune}
                    onChange={(e) =>
                      setFormData({ ...formData, commune: e.target.value })
                    }
                    className="px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200 outline-none transition"
                  />
                </div>

                <input
                  type="tel"
                  placeholder="Téléphone"
                  value={formData.telephone}
                  onChange={(e) =>
                    setFormData({ ...formData, telephone: e.target.value })
                  }
                  className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200 outline-none transition"
                />

                <input
                  type="email"
                  placeholder="Email *"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200 outline-none transition"
                />

                <div className="relative inline-block text-left w-full">
                  <button
                    type="button"
                    className="w-full px-6 py-4 pr-12 text-left border-2 border-gray-300 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200 outline-none bg-white transition flex items-center justify-between"
                  >
                    <span
                      className={
                        formData.formationId ? "text-gray-900" : "text-gray-500"
                      }
                    >
                      {formData.formationId || "Choisir une formation *"}
                    </span>
                    <ChevronDown className="text-gray-500" size={20} />
                  </button>
                </div>

                <div className="flex gap-6 pt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-yellow-500 text-blue-900 font-bold py-4 rounded-xl hover:bg-yellow-400 transition shadow-lg"
                  >
                    {editingId ? "Modifier" : "Ajouter"}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 bg-gray-300 text-gray-800 font-bold py-4 rounded-xl hover:bg-gray-400 transition"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showConfirmDelete && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                Confirmer la suppression
              </h3>
              <p className="text-gray-600 text-center mb-8">
                Supprimer {selectedIds.size} étudiant(s) sélectionné(s) ?<br />
                Cette action est irréversible.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={cancelDelete}
                  className="flex-1 bg-gray-200 text-gray-800 font-bold py-4 rounded-xl hover:bg-gray-300 transition"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-600 text-white font-bold py-4 rounded-xl hover:bg-red-700 transition"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
