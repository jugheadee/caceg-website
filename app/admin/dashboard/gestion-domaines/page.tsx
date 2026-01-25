'use client';

import { useEffect, useState, useRef } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db, storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  Edit,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  ArrowUpDown,
} from "lucide-react";
import Image from "next/image";

interface Domaine {
  id: string;
  title: string;
  order: number;
}

export default function GestionDomaines() {
  const [allDomaines, setAllDomaines] = useState<Domaine[]>([]);
  const [domaines, setDomaines] = useState<Domaine[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"orderAsc" | "orderDesc" | "titleAsc" | "titleDesc">("orderAsc");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    title: "",
    order: "",
  });

  // Erreur dans le modal (beau bandeau rouge)
  const [formError, setFormError] = useState<string | null>(null);

  // Image globale
  const [globalImageUrl, setGlobalImageUrl] = useState<string>("");
  const [globalSelectedFile, setGlobalSelectedFile] = useState<File | null>(null);
  const [globalPreviewUrl, setGlobalPreviewUrl] = useState<string | null>(null);
  const [globalUploading, setGlobalUploading] = useState(false);
  const globalFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "domaines"), (snap) => {
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Domaine));
      setAllDomaines(data);
    });

    const unsubGlobal = onSnapshot(
      doc(db, "global-settings", "consulting-banner"),
      (snap) => {
        if (snap.exists()) {
          setGlobalImageUrl(snap.data()?.url || "");
        } else {
          setGlobalImageUrl("");
        }
      }
    );

    return () => {
      unsub();
      unsubGlobal();
    };
  }, []);

  useEffect(() => {
    let filtered = allDomaines;

    if (searchQuery.trim()) {
      const terms = searchQuery.trim().toLowerCase().split(/\s+/);
      filtered = filtered.filter((d) =>
        terms.every((term) => d.title.toLowerCase().includes(term))
      );
    }

    filtered = [...filtered].sort((a, b) => {
      if (sortBy === "orderAsc") return (a.order || 0) - (b.order || 0);
      if (sortBy === "orderDesc") return (b.order || 0) - (a.order || 0);
      if (sortBy === "titleAsc") return a.title.localeCompare(b.title);
      if (sortBy === "titleDesc") return b.title.localeCompare(a.title);
      return 0;
    });

    setDomaines(filtered);
    setCurrentPage(1);
  }, [searchQuery, sortBy, allDomaines]);

  const totalPages = Math.ceil(domaines.length / itemsPerPage);
  const paginatedDomaines = domaines.slice(
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

  const handleTitleSort = () => {
    setSortBy(sortBy === "titleAsc" ? "titleDesc" : "titleAsc");
  };

  const handleOrderSort = () => {
    setSortBy(sortBy === "orderAsc" ? "orderDesc" : "orderAsc");
  };

  const getNextOrder = () => {
    if (allDomaines.length === 0) return 1;
    const maxOrder = Math.max(...allDomaines.map(d => d.order || 0));
    return maxOrder + 1;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null); // reset erreur

    if (!formData.title.trim()) {
      setFormError("Veuillez entrer le titre du domaine");
      return;
    }

    let orderValue: number;
    if (formData.order.trim() === "") {
      orderValue = getNextOrder();
    } else {
      orderValue = Number(formData.order);
      if (isNaN(orderValue) || orderValue < 1) {
        setFormError("L'ordre doit être un nombre positif (≥ 1)");
        return;
      }
    }

    // Vérifier doublon d'ordre
    const duplicate = allDomaines.find(
      (d) => d.order === orderValue && d.id !== editingId
    );
    if (duplicate) {
      setFormError(`L'ordre ${orderValue} est déjà utilisé par "${duplicate.title}". Choisissez un autre.`);
      return;
    }

    const dataToSave = {
      title: formData.title.trim(),
      order: orderValue,
    };

    try {
      if (editingId) {
        await updateDoc(doc(db, "domaines", editingId), dataToSave);
      } else {
        await addDoc(collection(db, "domaines"), dataToSave);
      }
      closeModal();
    } catch (error) {
      console.error("Erreur sauvegarde:", error);
      setFormError("Erreur lors de la sauvegarde. Réessayez.");
    }
  };

  const handleEdit = (domaine: Domaine) => {
    setFormData({
      title: domaine.title,
      order: domaine.order?.toString() || "",
    });
    setEditingId(domaine.id);
    setFormError(null);
    setShowModal(true);
  };

  const handleBatchDelete = async () => {
    if (selectedIds.size === 0) return;
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    try {
      const promises = Array.from(selectedIds).map((id) =>
        deleteDoc(doc(db, "domaines", id))
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
    if (selectedIds.size === paginatedDomaines.length && paginatedDomaines.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedDomaines.map((d) => d.id)));
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ title: "", order: "" });
    setFormError(null);
  };

  const handleGlobalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setGlobalSelectedFile(file);
      setGlobalPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleGlobalUpload = async () => {
    if (!globalSelectedFile) return alert("Sélectionnez une image");

    setGlobalUploading(true);
    try {
      const fileName = `banner-consulting-${Date.now()}.jpg`;
      const storageRef = ref(storage, `global/${fileName}`);
      await uploadBytes(storageRef, globalSelectedFile);
      const url = await getDownloadURL(storageRef);

      await setDoc(
        doc(db, "global-settings", "consulting-banner"),
        { url, updatedAt: new Date().toISOString() },
        { merge: true }
      );

      setGlobalSelectedFile(null);
      setGlobalPreviewUrl(null);
      alert("Image globale mise à jour !");
    } catch (err) {
      console.error(err);
      alert("Erreur upload image globale");
    } finally {
      setGlobalUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
          <h1 className="text-4xl font-bold text-blue-900">
            Gestion des Domaines de Compétence
          </h1>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-yellow-500 text-blue-900 font-bold px-6 py-3 rounded-xl hover:bg-yellow-400 transition"
            >
              <Plus size={20} /> Nouveau domaine
            </button>
            <button
              onClick={() => setEditMode(!editMode)}
              className="flex items-center gap-2 bg-blue-900 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-800 transition"
            >
              <Edit size={20} />
              {editMode ? "Quitter édition" : "Mode édition"}
            </button>
            {editMode && selectedIds.size > 0 && (
              <button
                onClick={handleBatchDelete}
                className="flex items-center gap-2 bg-red-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-red-500 transition"
              >
                <X size={20} /> Supprimer ({selectedIds.size})
              </button>
            )}
          </div>
        </div>

        {/* Recherche */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un domaine..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Tableau */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <table className="w-full min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {editMode && (
                  <th scope="col" className="px-6 py-4 w-12">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === paginatedDomaines.length && paginatedDomaines.length > 0}
                      onChange={toggleSelectAll}
                      className="h-5 w-5 text-blue-900 rounded border-gray-300 focus:ring-blue-900"
                    />
                  </th>
                )}
                <th
                  scope="col"
                  onClick={handleTitleSort}
                  className="px-6 py-4 text-left text-sm font-medium text-gray-700 cursor-pointer whitespace-nowrap"
                >
                  <div className="flex items-center gap-2">
                    Domaine
                    <ArrowUpDown size={14} />
                  </div>
                </th>
                <th
                  scope="col"
                  onClick={handleOrderSort}
                  className="px-6 py-4 text-left text-sm font-medium text-gray-700 cursor-pointer whitespace-nowrap"
                >
                  <div className="flex items-center gap-2">
                    Ordre
                    <ArrowUpDown size={14} />
                  </div>
                </th>
                {editMode && (
                  <th scope="col" className="px-6 py-4 text-right text-sm font-medium text-gray-700">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedDomaines.length === 0 ? (
                <tr>
                  <td colSpan={editMode ? 4 : 3} className="px-6 py-16 text-center text-gray-500 text-lg">
                    Aucun domaine trouvé
                  </td>
                </tr>
              ) : (
                paginatedDomaines.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50 transition">
                    {editMode && (
                      <td className="px-6 py-4 whitespace-nowrap" onClick={(ev) => ev.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedIds.has(d.id)}
                          onChange={() => toggleSelect(d.id)}
                          className="h-5 w-5 text-blue-900 rounded border-gray-300 focus:ring-blue-900"
                        />
                      </td>
                    )}
                    <td className="px-6 py-4 font-medium text-gray-900">{d.title}</td>
                    <td className="px-6 py-4 text-gray-700">{d.order || "—"}</td>
                    {editMode && (
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleEdit(d)}
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
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition"
            >
              <ChevronLeft size={24} />
            </button>
            {getPageNumbers().map((page, i) => (
              <button
                key={i}
                onClick={() => typeof page === "number" && setCurrentPage(page)}
                disabled={typeof page !== "number"}
                className={`px-5 py-3 rounded-lg font-medium transition ${
                  page === currentPage ? "bg-blue-900 text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}

        {/* Image globale */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mt-16">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">
            Image fixe à droite (page Consulting)
          </h2>
          <div className="grid md:grid-cols-2 gap-10">
            <div className="flex flex-col items-center">
              {globalImageUrl ? (
                <Image
                  src={globalImageUrl}
                  alt="Banner"
                  width={420}
                  height={420}
                  className="rounded-2xl shadow-lg object-cover"
                />
              ) : (
                <div className="w-full h-80 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-500">
                  Aucune image définie
                </div>
              )}
            </div>

          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-96">
  <input
    type="file"
    accept="image/*"
    ref={globalFileInputRef}
    onChange={handleGlobalFileChange}
    className="hidden"
  />
  <button
    onClick={() => globalFileInputRef.current?.click()}
    className="mb-6 bg-blue-700 text-white px-8 py-4 rounded-xl hover:bg-blue-800 flex items-center gap-2"
  >
    <Edit size={20} /> Choisir image
  </button>

  {globalPreviewUrl && (
    <Image
      src={globalPreviewUrl}
      alt="Aperçu"
      width={300}
      height={300}
      className="rounded-xl shadow max-h-72 object-contain mb-6"
    />
  )}

  {globalSelectedFile && (
    <button
      onClick={handleGlobalUpload}
      disabled={globalUploading}
      className="bg-green-600 text-white px-10 py-4 rounded-xl hover:bg-green-700 disabled:opacity-60 font-bold"
    >
      {globalUploading ? "Upload..." : "Enregistrer"}
    </button>
  )}
</div>
          </div>
        </div>

        {/* Modal avec bandeau rouge pour erreur */}
        {showModal && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <div
              className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-blue-900">
                  {editingId ? "Modifier domaine" : "Nouveau domaine"}
                </h2>
                <button onClick={closeModal}>
                  <X size={28} className="text-gray-400 hover:text-gray-600" />
                </button>
              </div>

              {/* Bandeau rouge pour erreur */}
              {formError && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-lg flex items-center gap-3">
                  <X size={24} className="text-red-700 flex-shrink-0" />
                  <p className="font-medium">{formError}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <textarea
                  placeholder="Entrez le domaine ici..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  rows={4}
                  className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200 outline-none resize-none"
                />

                <div>
                  <h3 className="text-xl font-bold text-blue-900 mb-2">Ordre / Emplacement</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Laissez vide pour ajouter automatiquement à la fin.<br />
                    L'ordre doit être un nombre positif et unique.
                  </p>
                  <input
                    type="number"
                    min="1"
                    placeholder="ex: 5"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                    className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200 outline-none"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-yellow-500 text-blue-900 font-bold py-4 rounded-xl hover:bg-yellow-400 transition"
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

        {/* Confirm delete */}
        {showConfirmDelete && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold text-center mb-4">Confirmer suppression</h3>
              <p className="text-gray-600 text-center mb-8">
                Supprimer {selectedIds.size} domaine(s) ?
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