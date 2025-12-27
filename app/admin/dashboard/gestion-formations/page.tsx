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
import Image from "next/image";

interface Formation {
  id: string;
  title: string;
  instructor: string;
  description: string;
  price: string;
  image: string;
}

export default function GestionFormations() {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [formationToDelete, setFormationToDelete] = useState<string | null>(
    null
  );
  const [formData, setFormData] = useState({
    title: "",
    instructor: "",
    description: "",
    price: "Dzd",
    image: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "formations"),
      (snapshot) => {
        const data = snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as Formation)
        );
        setFormations(data);
      },
      (error) => {
        console.error("Error fetching formations:", error);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      alert("Titre et description sont obligatoires");
      return;
    }

    setUploading(true);

    let imageUrl = formData.image;

    try {
      if (selectedFile) {
        const formDataUpload = new FormData();
        formDataUpload.append("file", selectedFile);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formDataUpload,
        });

        if (!res.ok) {
          alert("Erreur lors de l'upload de l'image");
          setUploading(false);
          return;
        }

        const data = await res.json();
        imageUrl = data.url;
      } else if (!editingId && !formData.image) {
        imageUrl = "https://via.placeholder.com/600x400?text=Formation+CACEG";
      }

      const dataToSave = {
        title: formData.title.trim(),
        instructor: formData.instructor.trim(),
        description: formData.description.trim(),
        price: formData.price,
        image: imageUrl,
      };

      if (editingId) {
        await updateDoc(doc(db, "formations", editingId), dataToSave);
      } else {
        await addDoc(collection(db, "formations"), dataToSave);
      }

      setShowModal(false);
      setEditingId(null);
      setFormData({
        title: "",
        instructor: "",
        description: "",
        price: "Gratuit",
        image: "",
      });
      setSelectedFile(null);
    } catch (error) {
      console.error("Error saving formation:", error);
      alert("Erreur lors de la sauvegarde");
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
    });
    setEditingId(formation.id);
    setSelectedFile(null);
    setShowModal(true);
  };

  const openDeleteModal = (id: string) => {
    setFormationToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (formationToDelete) {
      try {
        await deleteDoc(doc(db, "formations", formationToDelete));
      } catch (error) {
        alert("Erreur lors de la suppression");
      }
      setDeleteModalOpen(false);
      setFormationToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setFormationToDelete(null);
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
    });
    setSelectedFile(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-8 py-10">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900">
            Gestion des Formations
          </h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-yellow-500 text-blue-900 font-bold px-8 py-4 rounded-xl hover:bg-yellow-400 transition shadow-lg"
          >
            + Ajouter une formation
          </button>
        </div>

        {/* Tableau */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="px-6 py-4 text-left">Image</th>
                <th className="px-6 py-4 text-left">Titre</th>
                <th className="px-6 py-4 text-left">Instructeur</th>
                <th className="px-6 py-4 text-left">Prix</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {formations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-500">
                    Aucune formation pour l'instant. Ajoutez-en une !
                  </td>
                </tr>
              ) : (
                formations.map((f) => (
                  <tr
                    key={f.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4">
                      <div className="w-20 h-20 relative rounded-lg overflow-hidden shadow-md">
                        <Image
                          src={
                            f.image ||
                            "https://via.placeholder.com/600x400?text=Formation+CACEG"
                          }
                          alt={f.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">{f.title}</td>
                    <td className="px-6 py-4">
                      {f.instructor || "Non défini"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-bold ${
                          f.price === "Gratuit"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {f.price}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleEdit(f)}
                        className="text-blue-600 hover:text-blue-800 mr-6 text-lg"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => openDeleteModal(f.id)}
                        className="text-red-600 hover:text-red-800 text-lg"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Ajout/Modification – smooth */}
      {showModal && (
        <div
          className="fixed inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl p-4 md:p-8 max-w-2xl w-full mx-4 max-h-[97vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-3xl font-bold text-blue-900 mb-8">
              {editingId ? "Modifier la formation" : "Nouvelle formation"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <input
                type="text"
                placeholder="Titre de la formation"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-yellow-500 transition"
              />
              <input
                type="text"
                placeholder="Instructeur (facultatif)"
                value={formData.instructor}
                onChange={(e) =>
                  setFormData({ ...formData, instructor: e.target.value })
                }
                className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-yellow-500 transition"
              />
              <textarea
                placeholder="Description détaillée"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
                rows={1}
                className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-yellow-500 transition resize-none min-h-[100px] max-h-[200px]"
              />
              <input
                type="text"
                placeholder="Prix (ex: Gratuit ou 45 000 DZD)"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
                className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-yellow-500 transition"
              />
              <div>
                <label className="block text-blue-900 font-semibold mb-2">
                  Image de la formation {editingId ? "(optionnel)" : ""}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:bg-yellow-500 file:text-blue-900 file:font-bold hover:file:bg-yellow-400 transition"
                />
                {selectedFile && (
                  <p className="mt-2 text-sm text-gray-600">
                    Nouveau fichier : {selectedFile.name}
                  </p>
                )}
                {editingId && formData.image && !selectedFile && (
                  <p className="mt-2 text-sm text-gray-600">
                    Image actuelle conservée
                  </p>
                )}
              </div>
              <div className="flex gap-4 pt-4">
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

      {/* Modal Suppression – smooth & pro */}
      {deleteModalOpen && (
        <div
          className="fixed inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300"
          onClick={cancelDelete}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-in fade-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-red-600 text-3xl">🗑️</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Confirmer la suppression
              </h3>
              <p className="text-gray-600">
                Êtes-vous sûr de vouloir supprimer cette formation ?<br />
                Cette action est irréversible.
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={cancelDelete}
                className="flex-1 bg-gray-200 text-gray-800 font-bold py-3 rounded-xl hover:bg-gray-300 transition"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
