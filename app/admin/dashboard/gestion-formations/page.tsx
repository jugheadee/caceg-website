'use client';

import { useEffect, useState, useRef } from "react";
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
  Check,
  ArrowUpDown,
} from "lucide-react";
import Image from "next/image";

interface Formation {
  id: string;
  title: string;
  slug: string;
  instructor: string;
  description: string;
  price: string;
  image: string;
  duration?: string;
  coursesCount?: string;
  objectives?: string;
  prerequisites?: string;
  targetAudience?: string;
  dateCreation: any;
}

const allColumns = [
  { key: "title", label: "Titre" },
  { key: "instructor", label: "Instructeur" },
  { key: "duration", label: "Durée" },
  { key: "coursesCount", label: "Modules" },
  { key: "price", label: "Prix" },
  { key: "dateCreation", label: "Date création" },
];

// Génération automatique du slug
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

function CustomSelect({
  options,
  value,
  onChange,
  placeholder,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel =
    options.find((o) => o.value === value)?.label || placeholder;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-6 py-4 pr-12 text-left border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200 outline-none bg-white transition flex items-center justify-between"
      >
        <span className={value ? "text-gray-900" : "text-gray-500"}>
          {selectedLabel}
        </span>
        <ChevronDown
          className={`text-gray-500 transition ${open ? "rotate-180" : ""}`}
          size={20}
        />
      </button>

      {open && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-2xl border border-gray-100 z-30 overflow-hidden">
          <div className="max-h-64 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className="w-full px-6 py-3 text-left hover:bg-gray-50 transition flex items-center justify-between"
              >
                <span className="text-gray-800">{option.label}</span>
                {value === option.value && (
                  <Check size={18} className="text-blue-900" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function GestionFormations() {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [filteredFormations, setFilteredFormations] = useState<Formation[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterPrice, setFilterPrice] = useState("");
  const [sortBy, setSortBy] = useState<"dateDesc" | "dateAsc" | "titleAsc" | "titleDesc">("dateDesc");

  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    allColumns.map((c) => c.key)
  );
  const [showColumnDropdown, setShowColumnDropdown] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    instructor: "",
    description: "",
    price: "Gratuit",
    image: "",
    duration: "",
    coursesCount: "",
    objectives: "",
    prerequisites: "",
    targetAudience: "",
  });

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "formations"), (snap) => {
      const data = snap.docs.map((doc) => {
        const docData = doc.data();
        return {
          id: doc.id,
          ...docData,
          slug: docData.slug || generateSlug(docData.title || "untitled"),
          dateCreation: docData.dateCreation || new Date(),
        } as Formation;
      });
      setFormations(data);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    let filtered = formations;

    if (searchQuery.trim()) {
      const terms = searchQuery.toLowerCase().split(" ");
      filtered = filtered.filter((f) =>
        terms.every((term) => f.title.toLowerCase().includes(term))
      );
    }

    if (filterPrice) {
      filtered = filtered.filter((f) => f.price === filterPrice);
    }

    filtered = [...filtered].sort((a, b) => {
      if (sortBy === "dateDesc")
        return new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime();
      if (sortBy === "dateAsc")
        return new Date(a.dateCreation).getTime() - new Date(b.dateCreation).getTime();
      if (sortBy === "titleAsc")
        return a.title.localeCompare(b.title);
      if (sortBy === "titleDesc")
        return b.title.localeCompare(a.title);
      return 0;
    });

    setFilteredFormations(filtered);
    setCurrentPage(1);
  }, [searchQuery, filterPrice, sortBy, formations]);

  const totalPages = Math.ceil(filteredFormations.length / itemsPerPage);
  const paginated = filteredFormations.slice(
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
      for (let i = Math.max(3, currentPage - 1); i <= Math.min(totalPages - 2, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 3) pages.push("...");
      pages.push(totalPages - 1, totalPages);
    }
    return pages;
  };

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) => {
      const isVisible = prev.includes(key);
      if (isVisible && prev.length === 1) return prev;
      return isVisible ? prev.filter((k) => k !== key) : [...prev, key];
    });
  };

  const handleTitleSort = () => {
    setSortBy(sortBy === "titleAsc" ? "titleDesc" : "titleAsc");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      alert("Titre et description obligatoires");
      return;
    }

    setUploading(true);
    let imageUrl = formData.image || ""; // ← Garde l'ancienne URL si pas de nouvelle image

    try {
      if (selectedFile) {
        const formDataUpload = new FormData();
        formDataUpload.append("file", selectedFile);
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formDataUpload,
        });
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Erreur upload: ${errorText}`);
        }
        const data = await res.json();
        imageUrl = data.url;
      }

      const slug = generateSlug(formData.title);

      const dataToSave = {
        title: formData.title.trim(),
        slug: slug,
        instructor: formData.instructor.trim(),
        description: formData.description.trim(),
        price: formData.price,
        image: imageUrl, // Toujours une string valide
        duration: formData.duration.trim(),
        coursesCount: formData.coursesCount.trim(),
        objectives: formData.objectives.trim(),
        prerequisites: formData.prerequisites.trim(),
        targetAudience: formData.targetAudience.trim(),
        dateCreation: editingId ? formations.find(f => f.id === editingId)?.dateCreation : new Date(),
      };

      if (editingId) {
        await updateDoc(doc(db, "formations", editingId), dataToSave);
      } else {
        await addDoc(collection(db, "formations"), dataToSave);
      }

      closeModal();
    } catch (error) {
      console.error("Erreur sauvegarde:", error);
      alert("Erreur lors de la sauvegarde – vérifie la console");
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (formation: Formation) => {
    setFormData({
      title: formation.title,
      instructor: formation.instructor || "",
      description: formation.description,
      price: formation.price,
      image: formation.image,
      duration: formation.duration || "",
      coursesCount: formation.coursesCount || "",
      objectives: formation.objectives || "",
      prerequisites: formation.prerequisites || "",
      targetAudience: formation.targetAudience || "",
    });
    setEditingId(formation.id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      title: "",
      instructor: "",
      description: "",
      price: "Gratuit",
      image: "",
      duration: "",
      coursesCount: "",
      objectives: "",
      prerequisites: "",
      targetAudience: "",
    });
    setSelectedFile(null);
  };

  const handleBatchDelete = async () => {
    if (selectedIds.size === 0) return;
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    try {
      const promises = Array.from(selectedIds).map((id) =>
        deleteDoc(doc(db, "formations", id))
      );
      await Promise.all(promises);
      setSelectedIds(new Set());
      setEditMode(false);
      setShowConfirmDelete(false);
    } catch (error) {
      alert("Erreur suppression");
    }
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    newSet.has(id) ? newSet.delete(id) : newSet.add(id);
    setSelectedIds(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === paginated.length && paginated.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginated.map((f) => f.id)));
    }
  };

  const exportToCSV = () => {
    const headers = ["Titre", "Instructeur", "Durée", "Modules", "Prix", "Date création"];
    const rows = filteredFormations.map((f) => [
      f.title,
      f.instructor || "-",
      f.duration || "-",
      f.coursesCount || "-",
      f.price,
      new Date(f.dateCreation).toLocaleDateString("fr-DZ"),
    ]);

    const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "formations_caceg.csv";
    link.click();
  };

  const resetFilters = () => {
    setSearchQuery("");
    setFilterPrice("");
    setSortBy("dateDesc");
  };

  const priceOptions = [
    { value: "", label: "Tous les prix" },
    { value: "Gratuit", label: "Gratuit" },
    { value: "Payant", label: "Payant" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-8 py-10">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold text-blue-900">Gestion des Formations</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setShowModal(true)}
              className="bg-yellow-500 text-blue-900 font-bold px-8 py-4 rounded-xl hover:bg-yellow-400 transition shadow-lg flex items-center gap-3"
            >
              <Plus size={24} />
              Ajouter une formation
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

        {/* Filtres */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="relative">
              <Search className="absolute left-4 top-4 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher par titre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200 outline-none transition"
              />
            </div>

            <CustomSelect
              options={priceOptions}
              value={filterPrice}
              onChange={setFilterPrice}
              placeholder="Tous les prix"
            />

            <div className="md:col-span-2">
              <button
                onClick={resetFilters}
                className="w-full bg-blue-900 text-white font-bold px-8 py-4 rounded-xl hover:bg-blue-800 transition shadow-md flex items-center justify-center gap-2"
              >
                <Filter size={20} />
                Réinitialiser
              </button>
            </div>
          </div>
        </div>

        {/* Tableau */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <div className="flex items-center gap-6">
              <span className="text-gray-600 font-medium">
                Formations ({filteredFormations.length})
              </span>
              <div className="relative z-50">
                <button
                  onClick={() => setShowColumnDropdown(!showColumnDropdown)}
                  className="flex items-center gap-2 px-5 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition"
                >
                  <Filter size={18} />
                  Afficher les colonnes
                  <ChevronDown size={18} className={`transition ${showColumnDropdown ? "rotate-180" : ""}`} />
                </button>
                {showColumnDropdown && (
                  <div className="absolute left-0 top-full mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200 py-4 z-50">
                    {allColumns.map((col) => (
                      <label key={col.key} className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={visibleColumns.includes(col.key)}
                          onChange={() => toggleColumn(col.key)}
                          className="w-5 h-5 text-blue-900 rounded focus:ring-blue-900"
                        />
                        <span className="text-gray-700 font-medium">{col.label}</span>
                      </label>
                    ))}
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
                <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="p-3 rounded-xl hover:bg-gray-100 disabled:opacity-50">
                  <ChevronLeft size={20} />
                </button>
                {getPageNumbers().map((page, i) => (
                  page === "..." ? <span key={i} className="px-4 text-gray-500">...</span> : 
                  <button key={i} onClick={() => setCurrentPage(page as number)} className={`w-12 h-12 rounded-xl font-medium transition ${currentPage === page ? "bg-blue-900 text-white" : "hover:bg-gray-100 text-gray-700"}`}>
                    {page}
                  </button>
                ))}
                <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="p-3 rounded-xl hover:bg-gray-100 disabled:opacity-50">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>

          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {editMode && <th className="px-6 py-5 text-left w-12"><input type="checkbox" checked={selectedIds.size === paginated.length && paginated.length > 0} onChange={toggleSelectAll} className="w-5 h-5 text-blue-900 rounded" /></th>}
                {visibleColumns.includes("title") && (
                  <th className="px-6 py-5 text-left text-gray-700 font-medium">
                    <button onClick={handleTitleSort} className="flex items-center gap-2 hover:text-blue-900">
                      Titre
                      <ArrowUpDown size={16} />
                    </button>
                  </th>
                )}
                {visibleColumns.includes("instructor") && <th className="px-6 py-5 text-left text-gray-700 font-medium">Instructeur</th>}
                {visibleColumns.includes("duration") && <th className="px-6 py-5 text-left text-gray-700 font-medium">Durée</th>}
                {visibleColumns.includes("coursesCount") && <th className="px-6 py-5 text-left text-gray-700 font-medium">Modules</th>}
                {visibleColumns.includes("price") && <th className="px-6 py-5 text-left text-gray-700 font-medium">Prix</th>}
                {visibleColumns.includes("dateCreation") && <th className="px-6 py-5 text-left text-gray-700 font-medium">Date création</th>}
                {editMode && <th className="px-6 py-5 text-right pr-10 text-gray-700 font-medium">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-16 text-gray-500 text-lg">
                    Aucune formation trouvée.
                  </td>
                </tr>
              ) : (
                paginated.map((f) => (
                  <tr key={f.id} className="hover:bg-gray-50 transition">
                    {editMode && (
                      <td className="px-6 py-5">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(f.id)}
                          onChange={() => toggleSelect(f.id)}
                          className="w-5 h-5 text-blue-900 rounded"
                        />
                      </td>
                    )}
                    {visibleColumns.includes("title") && <td className="px-6 py-5 font-medium text-gray-900">{f.title}</td>}
                    {visibleColumns.includes("instructor") && <td className="px-6 py-5 text-gray-700">{f.instructor || "-"}</td>}
                    {visibleColumns.includes("duration") && <td className="px-6 py-5 text-gray-700">{f.duration || "-"}</td>}
                    {visibleColumns.includes("coursesCount") && <td className="px-6 py-5 text-gray-700">{f.coursesCount || "-"}</td>}
                    {visibleColumns.includes("price") && (
                      <td className="px-6 py-5">
                        <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${f.price === "Gratuit" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}>
                          {f.price}
                        </span>
                      </td>
                    )}
                    {visibleColumns.includes("dateCreation") && (
                      <td className="px-6 py-5 text-gray-700">
                        {new Date(f.dateCreation).toLocaleDateString("fr-DZ")}
                      </td>
                    )}
                    {editMode && (
                      <td className="px-6 py-5 text-right pr-10">
                        <button onClick={() => handleEdit(f)} className="text-blue-600 hover:text-blue-800">
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

        {/* Modal Ajout/Édition – avec labels bleus */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeModal}>
            <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-3xl w-full mx-4 overflow-y-auto max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-3xl font-bold text-blue-900 mb-8">
                {editingId ? "Modifier la formation" : "Nouvelle formation"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Titre */}
                <div>
                  <label className="block text-blue-900 font-bold mb-2 text-lg">
                    Titre de la formation *
                  </label>
                  <input
                    type="text"
                    placeholder="Titre de la formation *"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-yellow-500 transition"
                  />
                </div>

                {/* Instructeur */}
                <div>
                  <label className="block text-blue-900 font-bold mb-2 text-lg">
                    Instructeur (facultatif)
                  </label>
                  <input
                    type="text"
                    placeholder="Instructeur (facultatif)"
                    value={formData.instructor}
                    onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                    className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-yellow-500 transition"
                  />
                </div>

                {/* Durée & Modules */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-blue-900 font-bold mb-2 text-lg">
                      Durée (ex: 6 mois)
                    </label>
                    <input
                      type="text"
                      placeholder="Durée (ex: 6 mois)"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-yellow-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-blue-900 font-bold mb-2 text-lg">
                      Nombre de modules
                    </label>
                    <input
                      type="text"
                      placeholder="Nombre de modules"
                      value={formData.coursesCount}
                      onChange={(e) => setFormData({ ...formData, coursesCount: e.target.value })}
                      className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-yellow-500 transition"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-blue-900 font-bold mb-2 text-lg">
                    Description détaillée *
                  </label>
                  <textarea
                    placeholder="Description détaillée *"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={6}
                    className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-yellow-500 transition resize-none"
                  />
                </div>

                {/* Objectifs */}
                <div>
                  <label className="block text-blue-900 font-bold mb-2 text-lg">
                    Objectifs (un par ligne avec - devant)
                  </label>
                  <textarea
                    placeholder="Objectifs (un par ligne avec - devant)"
                    value={formData.objectives}
                    onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                    rows={8}
                    className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-yellow-500 transition resize-none font-mono text-sm"
                  />
                </div>

                {/* Prérequis */}
                <div>
                  <label className="block text-blue-900 font-bold mb-2 text-lg">
                    Prérequis
                  </label>
                  <textarea
                    placeholder="Prérequis"
                    value={formData.prerequisites}
                    onChange={(e) => setFormData({ ...formData, prerequisites: e.target.value })}
                    rows={4}
                    className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-yellow-500 transition resize-none"
                  />
                </div>

                {/* Public cible */}
                <div>
                  <label className="block text-blue-900 font-bold mb-2 text-lg">
                    Public cible
                  </label>
                  <input
                    type="text"
                    placeholder="Public cible"
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                    className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-yellow-500 transition"
                  />
                </div>

                {/* Prix */}
                <div>
                  <label className="block text-blue-900 font-bold mb-2 text-lg">
                    Prix *
                  </label>
                  <input
                    type="text"
                    placeholder="Prix (ex: 45 000 DA ou Gratuit)"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-yellow-500 transition"
                  />
                </div>

                {/* Image */}
                <div>
                  <label className="block text-blue-900 font-bold mb-2 text-lg">
                    Image de la formation
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:bg-yellow-500 file:text-blue-900 file:font-bold hover:file:bg-yellow-400 transition"
                  />
                  {selectedFile && <p className="mt-2 text-sm text-gray-600">Fichier sélectionné : {selectedFile.name}</p>}
                  {editingId && formData.image && !selectedFile && <p className="mt-2 text-sm text-gray-600">Image actuelle conservée</p>}
                </div>

                {/* Boutons */}
                <div className="flex gap-4 pt-6">
                  <button type="submit" disabled={uploading} className="flex-1 bg-yellow-500 text-blue-900 font-bold py-4 rounded-xl hover:bg-yellow-400 transition disabled:opacity-70">
                    {uploading ? "Enregistrement..." : (editingId ? "Modifier" : "Ajouter")}
                  </button>
                  <button type="button" onClick={closeModal} className="flex-1 bg-gray-300 text-gray-800 font-bold py-4 rounded-xl hover:bg-gray-400 transition">
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Confirm Delete */}
        {showConfirmDelete && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                Confirmer la suppression
              </h3>
              <p className="text-gray-600 text-center mb-8">
                Supprimer {selectedIds.size} formation(s) ?<br />
                Cette action est irréversible.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowConfirmDelete(false)}
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