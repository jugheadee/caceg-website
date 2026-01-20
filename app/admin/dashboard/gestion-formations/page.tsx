"use client";

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
  featured?: boolean; // Added for popular formations on home
}

const allColumns = [
  { key: "title", label: "Titre" },
  { key: "instructor", label: "Instructeur" },
  { key: "duration", label: "Durée" },
  { key: "coursesCount", label: "Modules" },
  { key: "price", label: "Prix" },
  { key: "featured", label: "Populaire (Accueil)" }, // Added column
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
        <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
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
  const [allFormations, setAllFormations] = useState<Formation[]>([]);
  const [formations, setFormations] = useState<Formation[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterInstructor, setFilterInstructor] = useState("");
  const [filterFree, setFilterFree] = useState(false);
  const [priceMin, setPriceMin] = useState<string>("");
  const [priceMax, setPriceMax] = useState<string>("");
  const [appliedPriceMin, setAppliedPriceMin] = useState<number | null>(null);
  const [appliedPriceMax, setAppliedPriceMax] = useState<number | null>(null);

  const [sortBy, setSortBy] = useState<
    "dateDesc" | "dateAsc" | "titleAsc" | "titleDesc"
  >("dateDesc");

  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    allColumns.map((c) => c.key)
  );

  const [showColumnDropdown, setShowColumnDropdown] = useState(false);
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    title: "",
    instructor: "",
    description: "",
    price: "",
    image: "",
    duration: "",
    coursesCount: "",
    objectives: "",
    prerequisites: "",
    targetAudience: "",
    featured: false, // Added
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "formations"), (snap) => {
      const data = snap.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Formation)
      );
      setAllFormations(data);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    let filtered = allFormations;

    if (searchQuery.trim()) {
      const terms = searchQuery.trim().toLowerCase().split(/\s+/);
      filtered = filtered.filter((f) => {
        const titleLower = f.title.toLowerCase();
        return terms.every((term) => titleLower.includes(term));
      });
    }

    if (filterInstructor) {
      filtered = filtered.filter((f) => f.instructor === filterInstructor);
    }

    if (filterFree) {
      filtered = filtered.filter((f) => {
        const p = f.price.toLowerCase().trim();
        return (
          p.includes("gratuit") ||
          p === "0" ||
          p === "0 da" ||
          parseFloat(p.replace(/[^0-9]/g, "")) === 0
        );
      });
    }

    if (appliedPriceMin !== null || appliedPriceMax !== null) {
      filtered = filtered.filter((f) => {
        const priceNum = parseFloat(f.price.replace(/[^0-9]/g, "")) || 0;
        if (appliedPriceMin !== null && priceNum < appliedPriceMin)
          return false;
        if (appliedPriceMax !== null && priceNum > appliedPriceMax)
          return false;
        return true;
      });
    }

    filtered = [...filtered].sort((a, b) => {
      if (sortBy === "dateDesc")
        return (
          new Date(
            b.dateCreation?.toDate?.() || b.dateCreation || 0
          ).getTime() -
          new Date(a.dateCreation?.toDate?.() || a.dateCreation || 0).getTime()
        );
      if (sortBy === "dateAsc")
        return (
          new Date(
            a.dateCreation?.toDate?.() || a.dateCreation || 0
          ).getTime() -
          new Date(b.dateCreation?.toDate?.() || b.dateCreation || 0).getTime()
        );
      if (sortBy === "titleAsc") return a.title.localeCompare(b.title);
      if (sortBy === "titleDesc") return b.title.localeCompare(a.title);
      return 0;
    });

    setFormations(filtered);
    setCurrentPage(1);
  }, [
    searchQuery,
    filterInstructor,
    filterFree,
    appliedPriceMin,
    appliedPriceMax,
    sortBy,
    allFormations,
  ]);

  const totalPages = Math.ceil(formations.length / itemsPerPage);
  const paginatedFormations = formations.slice(
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

  const handleTitleSort = () => {
    setSortBy(sortBy === "titleAsc" ? "titleDesc" : "titleAsc");
  };

  const selectAllPrices = () => {
    setFilterFree(false);
    setAppliedPriceMin(null);
    setAppliedPriceMax(null);
    setPriceMin("");
    setPriceMax("");
    setShowPriceDropdown(false);
  };

  const selectFree = () => {
    setFilterFree(true);
    setAppliedPriceMin(null);
    setAppliedPriceMax(null);
    setPriceMin("");
    setPriceMax("");
    setShowPriceDropdown(false);
  };

  const applyPriceRange = () => {
    const min = priceMin.trim() ? parseFloat(priceMin) : null;
    const max = priceMax.trim() ? parseFloat(priceMax) : null;
    setAppliedPriceMin(min);
    setAppliedPriceMax(max);
    setFilterFree(false);
    setShowPriceDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.title ||
      !formData.instructor ||
      !formData.description ||
      !formData.price
    ) {
      alert("Les champs obligatoires doivent être remplis");
      return;
    }

    const slug = generateSlug(formData.title);

    setUploading(true);

    let imageUrl = editingId ? formData.image : "";

    if (selectedFile) {
      try {
        const formDataUpload = new FormData();
        formDataUpload.append("file", selectedFile);
        formDataUpload.append("upload_preset", "caceg_preset");

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/dv1i4lsgq/image/upload`,
          {
            method: "POST",
            body: formDataUpload,
          }
        );

        const data = await response.json();
        imageUrl = data.secure_url;
      } catch (error) {
        console.error("Erreur lors du téléchargement de l'image:", error);
        alert("Erreur lors du téléchargement de l'image");
        setUploading(false);
        return;
      }
    }

    const dataToSave = {
      title: formData.title.trim(),
      slug,
      instructor: formData.instructor.trim(),
      description: formData.description.trim(),
      price: formData.price.trim(),
      image: imageUrl,
      duration: formData.duration?.trim() || "",
      coursesCount: formData.coursesCount?.trim() || "",
      objectives: formData.objectives?.trim() || "",
      prerequisites: formData.prerequisites?.trim() || "",
      targetAudience: formData.targetAudience?.trim() || "",
      featured: formData.featured, // Added
      dateCreation: new Date().toISOString(),
    };

    try {
      if (editingId) {
        await updateDoc(doc(db, "formations", editingId), dataToSave);
      } else {
        await addDoc(collection(db, "formations"), dataToSave);
      }
      closeModal();
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la sauvegarde");
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (formation: Formation) => {
    setFormData({
      title: formation.title,
      instructor: formation.instructor,
      description: formation.description,
      price: formation.price,
      image: formation.image || "",
      duration: formation.duration || "",
      coursesCount: formation.coursesCount || "",
      objectives: formation.objectives || "",
      prerequisites: formation.prerequisites || "",
      targetAudience: formation.targetAudience || "",
      featured: formation.featured || false, // Added
    });
    setPreviewImage(formation.image || null);
    setSelectedFile(null);
    setEditingId(formation.id);
    setShowModal(true);
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
      alert("Erreur lors de la suppression");
      setShowConfirmDelete(false);
    }
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const toggleSelectAll = () => {
    if (
      selectedIds.size === paginatedFormations.length &&
      paginatedFormations.length > 0
    ) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedFormations.map((f) => f.id)));
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setPreviewImage(null);
    setSelectedFile(null);
    setFormData({
      title: "",
      instructor: "",
      description: "",
      price: "",
      image: "",
      duration: "",
      coursesCount: "",
      objectives: "",
      prerequisites: "",
      targetAudience: "",
      featured: false,
    });
  };

  const getInstructorOptions = () => {
    const instructors = Array.from(
      new Set(allFormations.map((f) => f.instructor))
    );
    return [
      { value: "", label: "Tous les instructeurs" },
      ...instructors.map((i) => ({ value: i, label: i })),
    ];
  };

  const exportToCSV = () => {
    const headers = [
      "Titre",
      "Instructeur",
      "Durée",
      "Modules",
      "Prix",
      "Populaire",
      "Date création",
    ];
    const rows = formations.map((f) => [
      f.title,
      f.instructor,
      f.duration || "",
      f.coursesCount || "",
      f.price,
      f.featured ? "Oui" : "Non",
      f.dateCreation
        ? new Date(f.dateCreation).toLocaleDateString("fr-DZ")
        : "",
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((row) => row.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "formations.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
          <h1 className="text-4xl font-bold text-blue-900">
            Gestion des Formations
          </h1>
          <div className="flex flex-wrap gap-4 w-full lg:w-auto">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-yellow-500 text-blue-900 font-bold px-6 py-3 rounded-xl hover:bg-yellow-400 transition"
            >
              <Plus size={20} />
              Nouvelle formation
            </button>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 bg-green-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-green-500 transition"
            >
              <Download size={20} />
              Exporter CSV
            </button>
            <button
              onClick={() => setEditMode(!editMode)}
              className="flex items-center gap-2 bg-blue-900 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-800 transition"
            >
              <Edit size={20} />
              {editMode ? "Quitter mode édition" : "Mode édition"}
            </button>
            {editMode && selectedIds.size > 0 && (
              <button
                onClick={handleBatchDelete}
                className="flex items-center gap-2 bg-red-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-red-500 transition"
              >
                <X size={20} />
                Supprimer ({selectedIds.size})
              </button>
            )}
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-12 space-y-6 lg:space-y-0 lg:flex lg:items-end lg:gap-6">
          {/* Recherche */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recherche par titre
            </label>
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher..."
                className="w-full pl-12 pr-6 py-4 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200 outline-none transition"
              />
            </div>
          </div>

          {/* Instructeur */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instructeur
            </label>
            <CustomSelect
              options={getInstructorOptions()}
              value={filterInstructor}
              onChange={setFilterInstructor}
              placeholder="Tous les instructeurs"
            />
          </div>

          {/* Prix */}
          <div className="relative flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prix
            </label>
            <button
              type="button"
              onClick={() => setShowPriceDropdown(!showPriceDropdown)}
              className="w-full px-6 py-4 text-left border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200 outline-none bg-white transition flex items-center justify-between"
            >
              <span className="text-gray-500">
                {filterFree
                  ? "Gratuit uniquement"
                  : appliedPriceMin || appliedPriceMax
                  ? `${appliedPriceMin || "0"} - ${appliedPriceMax || "∞"} DA`
                  : "Tous les prix"}
              </span>
              <ChevronDown
                className={`text-gray-500 transition ${
                  showPriceDropdown ? "rotate-180" : ""
                }`}
                size={20}
              />
            </button>

            {showPriceDropdown && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-2xl border border-gray-200 z-50 p-6 space-y-6">
                <button
                  type="button"
                  onClick={selectAllPrices}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 rounded-lg flex items-center justify-between"
                >
                  Tous les prix
                  {!filterFree &&
                    appliedPriceMin === null &&
                    appliedPriceMax === null && (
                      <Check size={18} className="text-blue-900" />
                    )}
                </button>
                <button
                  type="button"
                  onClick={selectFree}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 rounded-lg flex items-center justify-between"
                >
                  Gratuit uniquement
                  {filterFree && <Check size={18} className="text-blue-900" />}
                </button>
                <div className="space-y-4">
                  <p className="font-medium text-gray-700">Plage de prix</p>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceMin}
                      onChange={(e) => setPriceMin(e.target.value)}
                      className="px-4 py-3 border border-gray-200 rounded-lg focus:border-yellow-500 outline-none"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceMax}
                      onChange={(e) => setPriceMax(e.target.value)}
                      className="px-4 py-3 border border-gray-200 rounded-lg focus:border-yellow-500 outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={applyPriceRange}
                    className="w-full bg-yellow-500 text-blue-900 font-bold py-3 rounded-lg hover:bg-yellow-400 transition"
                  >
                    Appliquer
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Colonnes */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Colonnes
            </label>
            <button
              type="button"
              onClick={() => setShowColumnDropdown(!showColumnDropdown)}
              className="flex items-center gap-3 px-6 py-4 border-2 border-gray-200 rounded-xl hover:border-yellow-500 transition"
            >
              <Filter size={20} className="text-gray-500" />
              <span className="text-gray-500 font-medium">
                {visibleColumns.length} visibles
              </span>
            </button>

            {showColumnDropdown && (
              <div className="absolute top-full mt-2 right-0 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 p-4 space-y-4">
                {allColumns.map((col) => (
                  <label
                    key={col.key}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={visibleColumns.includes(col.key)}
                      onChange={() => toggleColumn(col.key)}
                      disabled={
                        visibleColumns.includes(col.key) &&
                        visibleColumns.length === 1
                      }
                      className="w-5 h-5 text-blue-900 rounded focus:ring-blue-900 disabled:opacity-50"
                    />
                    <span className="text-gray-800">{col.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tableau */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {editMode && (
                  <th className="px-6 py-5 w-12">
                    <input
                      type="checkbox"
                      checked={
                        selectedIds.size === paginatedFormations.length &&
                        paginatedFormations.length > 0
                      }
                      onChange={toggleSelectAll}
                      className="w-5 h-5 text-blue-900 rounded focus:ring-blue-900"
                    />
                  </th>
                )}
                {visibleColumns.includes("title") && (
                  <th
                    onClick={handleTitleSort}
                    className="px-6 py-5 text-left text-gray-700 font-medium cursor-pointer select-none flex items-center gap-2 hover:text-blue-900 transition"
                  >
                    Titre
                    <ArrowUpDown size={16} />
                  </th>
                )}
                {visibleColumns.includes("instructor") && (
                  <th className="px-6 py-5 text-left text-gray-700 font-medium">
                    Instructeur
                  </th>
                )}
                {visibleColumns.includes("duration") && (
                  <th className="px-6 py-5 text-left text-gray-700 font-medium">
                    Durée
                  </th>
                )}
                {visibleColumns.includes("coursesCount") && (
                  <th className="px-6 py-5 text-left text-gray-700 font-medium">
                    Modules
                  </th>
                )}
                {visibleColumns.includes("price") && (
                  <th className="px-6 py-5 text-left text-gray-700 font-medium">
                    Prix
                  </th>
                )}
                {visibleColumns.includes("featured") && ( // Added
                  <th className="px-6 py-5 text-left text-gray-700 font-medium">
                    Populaire (Accueil)
                  </th>
                )}
                {visibleColumns.includes("dateCreation") && (
                  <th className="px-6 py-5 text-left text-gray-700 font-medium">
                    Date création
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
              {paginatedFormations.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="text-center py-16 text-gray-500 text-lg"
                  >
                    Aucune formation trouvée avec les filtres actuels.
                  </td>
                </tr>
              ) : (
                paginatedFormations.map((f) => (
                  <tr key={f.id} className="hover:bg-gray-50 transition">
                    {editMode && (
                      <td
                        className="px-6 py-5"
                        onClick={(ev) => ev.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={selectedIds.has(f.id)}
                          onChange={() => toggleSelect(f.id)}
                          className="w-5 h-5 text-blue-900 rounded focus:ring-blue-900"
                        />
                      </td>
                    )}
                    {visibleColumns.includes("title") && (
                      <td className="px-6 py-5 font-medium text-gray-900">
                        {f.title}
                      </td>
                    )}
                    {visibleColumns.includes("instructor") && (
                      <td className="px-6 py-5 text-gray-700">
                        {f.instructor}
                      </td>
                    )}
                    {visibleColumns.includes("duration") && (
                      <td className="px-6 py-5 text-gray-700">
                        {f.duration || "-"}
                      </td>
                    )}
                    {visibleColumns.includes("coursesCount") && (
                      <td className="px-6 py-5 text-gray-700">
                        {f.coursesCount || "-"}
                      </td>
                    )}
                    {visibleColumns.includes("price") && (
                      <td className="px-6 py-5">
                        <span className="inline-block px-4 py-2 bg-green-100 text-green-900 rounded-full text-sm font-medium">
                          {f.price}
                        </span>
                      </td>
                    )}
                    {visibleColumns.includes("featured") && ( // Added
                      <td className="px-6 py-5 text-gray-700">
                        {f.featured ? "Oui" : "Non"}
                      </td>
                    )}
                    {visibleColumns.includes("dateCreation") && (
                      <td className="px-6 py-5 text-gray-700">
                        {f.dateCreation
                          ? new Date(f.dateCreation).toLocaleDateString("fr-DZ")
                          : "Invalid Date"}
                      </td>
                    )}
                    {editMode && (
                      <td
                        className="px-6 py-5 text-right pr-10"
                        onClick={(ev) => ev.stopPropagation()}
                      >
                        <button
                          onClick={() => handleEdit(f)}
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition"
            >
              <ChevronLeft size={24} className="text-gray-600" />
            </button>
            {getPageNumbers().map((page, i) => (
              <button
                key={i}
                onClick={() => typeof page === "number" && setCurrentPage(page)}
                disabled={typeof page !== "number"}
                className={`px-5 py-3 rounded-lg font-medium transition ${
                  page === currentPage
                    ? "bg-blue-900 text-white"
                    : typeof page === "number"
                    ? "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    : "text-gray-400 cursor-default"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition"
            >
              <ChevronRight size={24} className="text-gray-600" />
            </button>
          </div>
        )}

        {/* Modal */}
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
                  {editingId ? "Modifier la formation" : "Nouvelle formation"}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={28} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <input
                  type="text"
                  placeholder="Titre *"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                  className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200 outline-none transition"
                />

                <input
                  type="text"
                  placeholder="Instructeur *"
                  value={formData.instructor}
                  onChange={(e) =>
                    setFormData({ ...formData, instructor: e.target.value })
                  }
                  required
                  className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200 outline-none transition"
                />

                <textarea
                  placeholder="Description *"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                  className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200 outline-none transition min-h-[120px]"
                />

                <input
                  type="text"
                  placeholder="Prix * (ex: 25 000 DA)"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                  className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200 outline-none transition"
                />

                <input
                  type="text"
                  placeholder="Durée (ex: 6 mois)"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200 outline-none transition"
                />

                <input
                  type="text"
                  placeholder="Nombre de modules"
                  value={formData.coursesCount}
                  onChange={(e) =>
                    setFormData({ ...formData, coursesCount: e.target.value })
                  }
                  className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200 outline-none transition"
                />

                <textarea
                  placeholder="Objectifs"
                  value={formData.objectives}
                  onChange={(e) =>
                    setFormData({ ...formData, objectives: e.target.value })
                  }
                  className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200 outline-none transition min-h-[100px]"
                />

                <textarea
                  placeholder="Prérequis"
                  value={formData.prerequisites}
                  onChange={(e) =>
                    setFormData({ ...formData, prerequisites: e.target.value })
                  }
                  className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200 outline-none transition min-h-[100px]"
                />

                <textarea
                  placeholder="Public cible"
                  value={formData.targetAudience}
                  onChange={(e) =>
                    setFormData({ ...formData, targetAudience: e.target.value })
                  }
                  className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200 outline-none transition min-h-[100px]"
                />

                {/* Featured Checkbox – Added */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) =>
                      setFormData({ ...formData, featured: e.target.checked })
                    }
                    className="w-5 h-5 text-blue-900 rounded focus:ring-blue-900"
                  />
                  <label
                    htmlFor="featured"
                    className="text-gray-700 font-medium"
                  >
                    Afficher comme formation populaire sur la page d'accueil
                    (max 4 recommandées)
                  </label>
                </div>

                {/* Upload Image */}
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setSelectedFile(file);
                        setPreviewImage(URL.createObjectURL(file));
                      }
                    }}
                    className="hidden"
                    id="imageUpload"
                  />
                  <label htmlFor="imageUpload" className="cursor-pointer block">
                    <div className="flex flex-col items-center gap-2">
                      <Image
                        src={
                          previewImage ||
                          formData.image ||
                          "/placeholder-image.png"
                        }
                        alt="Preview"
                        width={200}
                        height={200}
                        className="rounded-xl object-cover"
                      />
                      <p className="text-gray-600 font-medium">
                        Télécharger une image
                      </p>
                      <p className="text-sm text-gray-500">
                        PNG, JPG, GIF jusqu'à 5MB
                      </p>
                    </div>
                  </label>
                  {selectedFile && (
                    <p className="mt-2 text-sm text-gray-600">
                      Fichier sélectionné : {selectedFile.name}
                    </p>
                  )}
                  {editingId && formData.image && !selectedFile && (
                    <p className="mt-2 text-sm text-gray-600">
                      Image actuelle conservée
                    </p>
                  )}
                </div>

                {/* Boutons */}
                <div className="flex gap-4 pt-6">
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 bg-yellow-500 text-blue-900 font-bold py-4 rounded-xl hover:bg-yellow-400 transition disabled:opacity-70"
                  >
                    {uploading
                      ? "Enregistrement..."
                      : editingId
                      ? "Modifier"
                      : "Ajouter"}
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
