'use client';

import { useEffect, useState, useRef } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { db, storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Edit, Plus, X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface Evenement {
  id: string;
  titre: string;
  slug: string;
  date: string;
  lieu: string;
  categorie: string;
  description: string;
  imageUrl?: string;
  photos?: string[]; // ← Ajouté pour le slider
  statut: "Brouillon" | "Publié";
  createdAt?: any;
}

export default function GestionEvenements() {
  const [evenements, setEvenements] = useState<Evenement[]>([]);
  const [filteredEvenements, setFilteredEvenements] = useState<Evenement[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    titre: "",
    slug: "",
    date: "",
    lieu: "",
    categorie: "Formation",
    description: "",
    imageUrl: "",
    photos: [] as string[],
    statut: "Brouillon" as "Brouillon" | "Publié",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photosInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const q = query(collection(db, "evenements"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Evenement));
      setEvenements(data);
    });
    return () => unsub();
  }, []);

  // Génération automatique du slug quand le titre change
  useEffect(() => {
    if (formData.titre.trim()) {
      const baseSlug = formData.titre
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      const slugExists = evenements.some(
        (evt) => evt.slug === baseSlug && evt.id !== editingId
      );

      const finalSlug = slugExists ? `${baseSlug}-${Date.now()}` : baseSlug;

      setFormData((prev) => ({
        ...prev,
        slug: finalSlug,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        slug: "",
      }));
    }
  }, [formData.titre, evenements, editingId]);

  useEffect(() => {
    let filtered = evenements;

    if (searchQuery.trim()) {
      const terms = searchQuery.trim().toLowerCase().split(/\s+/);
      filtered = filtered.filter((e) =>
        terms.every((term) =>
          e.titre.toLowerCase().includes(term) ||
          e.description.toLowerCase().includes(term) ||
          e.lieu.toLowerCase().includes(term)
        )
      );
    }

    setFilteredEvenements(filtered);
    setCurrentPage(1);
  }, [searchQuery, evenements]);

  const totalPages = Math.ceil(filteredEvenements.length / itemsPerPage);
  const paginatedEvenements = filteredEvenements.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titre.trim()) {
      alert("Le titre est obligatoire");
      return;
    }
    if (!formData.slug.trim()) {
      alert("Le slug est obligatoire");
      return;
    }

    setUploading(true);
    let imageUrl = formData.imageUrl;

    if (selectedFile) {
      try {
        const fileName = `evenements/${Date.now()}_${selectedFile.name}`;
        const storageRef = ref(storage, fileName);
        await uploadBytes(storageRef, selectedFile);
        imageUrl = await getDownloadURL(storageRef);
      } catch (err) {
        console.error(err);
        alert("Erreur upload image principale");
        setUploading(false);
        return;
      }
    }

    const dataToSave = {
      ...formData,
      imageUrl,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    try {
      if (editingId) {
        await updateDoc(doc(db, "evenements", editingId), dataToSave);
      } else {
        await addDoc(collection(db, "evenements"), dataToSave);
      }
      closeModal();
    } catch (error) {
      console.error("Erreur sauvegarde:", error);
      alert("Erreur lors de la sauvegarde");
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (evt: Evenement) => {
    setFormData({
      titre: evt.titre,
      slug: evt.slug,
      date: evt.date,
      lieu: evt.lieu,
      categorie: evt.categorie,
      description: evt.description,
      imageUrl: evt.imageUrl || "",
      photos: evt.photos || [],
      statut: evt.statut,
    });
    setEditingId(evt.id);
    setShowModal(true);
  };

  const handleBatchDelete = () => {
    if (selectedIds.size === 0) return;
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    try {
      const promises = Array.from(selectedIds).map((id) =>
        deleteDoc(doc(db, "evenements", id))
      );
      await Promise.all(promises);
      setSelectedIds(new Set());
      setEditMode(false);
      setShowConfirmDelete(false);
    } catch (error) {
      alert("Erreur lors de la suppression");
    }
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedEvenements.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedEvenements.map((e) => e.id)));
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      titre: "",
      slug: "",
      date: "",
      lieu: "",
      categorie: "Formation",
      description: "",
      imageUrl: "",
      photos: [],
      statut: "Brouillon",
    });
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
          <h1 className="text-4xl font-bold text-blue-900">
            Gestion des Événements & Actualités
          </h1>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-yellow-500 text-blue-900 font-bold px-6 py-3 rounded-xl hover:bg-yellow-400 transition"
            >
              <Plus size={20} /> Nouvel événement
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
              placeholder="Rechercher un événement..."
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
                      checked={selectedIds.size === paginatedEvenements.length && paginatedEvenements.length > 0}
                      onChange={toggleSelectAll}
                      className="h-5 w-5 text-blue-900 rounded border-gray-300 focus:ring-blue-900"
                    />
                  </th>
                )}
                <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Titre
                </th>
                
                <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Date
                </th>
                <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Catégorie
                </th>
                <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Statut
                </th>
                {editMode && <th scope="col" className="px-6 py-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedEvenements.length === 0 ? (
                <tr>
                  <td colSpan={editMode ? 7 : 6} className="px-6 py-16 text-center text-gray-500 text-lg">
                    Aucun événement trouvé
                  </td>
                </tr>
              ) : (
                paginatedEvenements.map((evt) => (
                  <tr key={evt.id} className="hover:bg-gray-50 transition">
                    {editMode && (
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedIds.has(evt.id)}
                          onChange={() => toggleSelect(evt.id)}
                          className="h-5 w-5 text-blue-900 rounded border-gray-300 focus:ring-blue-900"
                        />
                      </td>
                    )}
                    <td className="px-6 py-4 font-medium text-gray-900">{evt.titre}</td>
                    
                    <td className="px-6 py-4 text-gray-700">{evt.date}</td>
                    <td className="px-6 py-4 text-gray-700">{evt.categorie}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          evt.statut === "Publié" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {evt.statut}
                      </span>
                    </td>
                    {editMode && (
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleEdit(evt)}
                          className="text-blue-600 hover:text-blue-800"
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
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-5 py-3 rounded-lg font-medium transition ${
                  page === currentPage ? "bg-blue-900 text-white" : "bg-gray-100 hover:bg-gray-200"
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

        {/* Modal ajout/modif */}
        {showModal && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <div
              className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-blue-900">
                  {editingId ? "Modifier l'événement" : "Nouvel événement"}
                </h2>
                <button onClick={closeModal}>
                  <X size={28} className="text-gray-400 hover:text-gray-600" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre *
                  </label>
                  <input
                    type="text"
                    value={formData.titre}
                    onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none"
                  />
                </div>

                

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <input
                      type="text"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      placeholder="ex: 15-17 octobre 2025"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lieu
                    </label>
                    <input
                      type="text"
                      value={formData.lieu}
                      onChange={(e) => setFormData({ ...formData, lieu: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie
                  </label>
                  <select
                    value={formData.categorie}
                    onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none"
                  >
                    <option value="Formation">Formation</option>
                    <option value="Événement entreprise">Événement entreprise</option>
                    <option value="Conférence">Conférence</option>
                    <option value="Actualité">Actualité</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image de l'événement (couverture)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-blue-700 text-white px-6 py-3 rounded-xl hover:bg-blue-800 mb-4"
                  >
                    Choisir une image
                  </button>

                  <div className="relative w-64 h-40 rounded-xl overflow-hidden shadow-md bg-gray-100">
                    {(previewUrl || formData.imageUrl) ? (
                      <Image
                        src={previewUrl || formData.imageUrl || "/placeholder.jpg"}
                        alt="Aperçu de l'événement"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 256px"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.jpg";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                        Aucune image
                      </div>
                    )}
                  </div>
                </div>

                {/* Bloc multi-photos */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photos supplémentaires (pour le slider)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    ref={photosInputRef}
                    onChange={async (e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length === 0) return;

                      setUploading(true);
                      const newPhotos: string[] = [];

                      for (const file of files) {
                        try {
                          const fileName = `evenements/photos/${Date.now()}_${file.name}`;
                          const storageRef = ref(storage, fileName);
                          await uploadBytes(storageRef, file);
                          const url = await getDownloadURL(storageRef);
                          newPhotos.push(url);
                        } catch (err) {
                          console.error("Erreur upload photo:", err);
                        }
                      }

                      setFormData((prev) => ({
                        ...prev,
                        photos: [...prev.photos, ...newPhotos],
                      }));
                      setUploading(false);
                    }}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => photosInputRef.current?.click()}
                    className="bg-blue-700 text-white px-6 py-3 rounded-xl hover:bg-blue-800 mb-4"
                  >
                    Ajouter plusieurs photos
                  </button>

                  {/* Preview des photos ajoutées */}
                  {formData.photos.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      {formData.photos.map((url, index) => (
                        <div key={index} className="relative rounded-lg overflow-hidden shadow">
                          <Image
                            src={url}
                            alt={`Photo ${index + 1}`}
                            width={150}
                            height={100}
                            className="object-cover w-full h-24"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                photos: prev.photos.filter((_, i) => i !== index),
                              }));
                            }}
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Statut
                  </label>
                  <select
                    value={formData.statut}
                    onChange={(e) => setFormData({ ...formData, statut: e.target.value as "Brouillon" | "Publié" })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none"
                  >
                    <option value="Brouillon">Brouillon</option>
                    <option value="Publié">Publié</option>
                  </select>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 bg-yellow-500 text-blue-900 font-bold py-4 rounded-xl hover:bg-yellow-400 transition disabled:opacity-50"
                  >
                    {uploading ? "Enregistrement..." : editingId ? "Modifier" : "Ajouter"}
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
                Supprimer {selectedIds.size} événement(s) ?
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