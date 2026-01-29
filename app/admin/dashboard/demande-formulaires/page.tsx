'use client';

import { useEffect, useState } from "react";
import { collection, onSnapshot, deleteDoc, doc, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { X } from "lucide-react";

interface Inscription {
  id: string;
  formationTitle: string;
  formationId: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  wilaya: string;
  dateNaissance?: string;
  niveauEtude?: string; // ✅ AJOUT
  date: string;
}

export default function DemandesFormulaires() {
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInscription, setSelectedInscription] = useState<Inscription | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ show: boolean; action: "accept" | "reject"; inscription?: Inscription }>({
    show: false,
    action: "accept",
  });

  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" }>({
    show: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "inscriptions"), (snapshot) => {
      const data = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as Inscription))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setInscriptions(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
  };

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ ...toast, show: false });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const openConfirmModal = (action: "accept" | "reject", inscription: Inscription) => {
    setConfirmModal({ show: true, action, inscription });
  };

  const handleConfirmAction = async () => {
    if (!confirmModal.inscription) return;

    const ins = confirmModal.inscription;

    if (confirmModal.action === "accept") {
      try {
        await addDoc(collection(db, "etudiants"), {
          formationId: ins.formationId,
          formationTitle: ins.formationTitle,
          nom: ins.nom,
          prenom: ins.prenom,
          email: ins.email,
          telephone: ins.telephone,
          wilaya: ins.wilaya,
          dateNaissance: ins.dateNaissance || null,
          niveauEtude: ins.niveauEtude || null, // ✅ AJOUT
          dateInscription: new Date().toISOString(),
          status: "inscrit",
        });

        await deleteDoc(doc(db, "inscriptions", ins.id));

        showToast(`${ins.prenom} ${ins.nom} a été accepté(e) et ajouté(e) aux étudiants !`, "success");
      } catch (error) {
        console.error("Erreur:", error);
        showToast("Erreur lors de l'acceptation", "error");
      }
    } else {
      try {
        await deleteDoc(doc(db, "inscriptions", ins.id));
        showToast("Demande refusée avec succès.", "error");
      } catch (error) {
        console.error("Erreur:", error);
        showToast("Erreur lors du refus", "error");
      }
    }

    setConfirmModal({ show: false, action: "accept" });
    setSelectedInscription(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <p className="text-2xl text-blue-900">Chargement des demandes...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-8 py-10">
        <h1 className="text-4xl font-bold text-blue-900 mb-12">Demandes de Formulaires</h1>

        {inscriptions.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-16 text-center">
            <p className="text-2xl text-gray-500">{"Aucune demande pour l'instant"}</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-blue-900 text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Date demande</th>
                  <th className="px-6 py-4 text-left">Formation</th>
                  <th className="px-6 py-4 text-left">Nom Prénom</th>
                  <th className="px-6 py-4 text-left">Contact</th>
                  <th className="px-6 py-4 text-left">Wilaya</th>
                  <th className="px-6 py-4 text-left">Date naissance</th>
                  <th className="px-6 py-4 text-left">Niveau d’étude</th> {/* ✅ AJOUT */}
                </tr>
              </thead>
              <tbody>
                {inscriptions.map((ins) => (
                  <tr
                    key={ins.id}
                    className="border-b hover:bg-yellow-50 transition cursor-pointer"
                    onClick={() => setSelectedInscription(ins)}
                  >
                    <td className="px-6 py-4 text-sm">
                      {new Date(ins.date).toLocaleDateString('fr-DZ')}
                    </td>
                    <td className="px-6 py-4 font-medium">{ins.formationTitle}</td>
                    <td className="px-6 py-4">
                      {ins.prenom} {ins.nom}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm">{ins.email}</p>
                        <p className="text-gray-600 text-sm">{ins.telephone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">{ins.wilaya}</td>
                    <td className="px-6 py-4 text-sm">
                      {ins.dateNaissance ? new Date(ins.dateNaissance).toLocaleDateString('fr-DZ') : "-"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {ins.niveauEtude || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Détails */}
      {selectedInscription && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedInscription(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl p-10 max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-3xl font-bold text-blue-900 mb-4">
                  Demande d'inscription
                </h2>
                <p className="text-xl font-medium text-gray-800">
                  {selectedInscription.prenom} {selectedInscription.nom}
                </p>
              </div>
              <button onClick={() => setSelectedInscription(null)} className="text-gray-400 hover:text-gray-600">
                <X size={28} />
              </button>
            </div>

            <div className="space-y-6 text-lg">
              <div>
                <span className="font-medium text-gray-600">Formation :</span>
                <p className="text-gray-900 font-semibold">{selectedInscription.formationTitle}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Email :</span>
                <p className="text-blue-700">{selectedInscription.email}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Téléphone :</span>
                <p>{selectedInscription.telephone || "-"}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Wilaya :</span>
                <p>{selectedInscription.wilaya}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Date de naissance :</span>
                <p>{selectedInscription.dateNaissance ? new Date(selectedInscription.dateNaissance).toLocaleDateString('fr-DZ') : "Non renseignée"}</p>
              </div>

              {/* ✅ AJOUT : Niveau d'étude */}
              <div>
                <span className="font-medium text-gray-600">Niveau d’étude :</span>
                <p>{selectedInscription.niveauEtude || "Non renseigné"}</p>
              </div>

              <div>
                <span className="font-medium text-gray-600">Date de la demande :</span>
                <p>{new Date(selectedInscription.date).toLocaleString('fr-DZ')}</p>
              </div>
            </div>

            <div className="flex gap-6 mt-12">
              <button
                onClick={() => openConfirmModal("accept", selectedInscription)}
                className="flex-1 bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-700 transition shadow-lg"
              >
                Accepter & Ajouter aux étudiants
              </button>
              <button
                onClick={() => openConfirmModal("reject", selectedInscription)}
                className="flex-1 bg-red-600 text-white font-bold py-4 rounded-xl hover:bg-red-700 transition shadow-lg"
              >
                Refuser la demande
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal confirmation */}
      {confirmModal.show && confirmModal.inscription && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-lg w-full text-center">
            <h3 className="text-2xl font-bold text-blue-900 mb-6">
              {confirmModal.action === "accept" ? "Accepter cette demande ?" : "Refuser cette demande ?"}
            </h3>
            <p className="text-lg text-gray-700 mb-10">
              {confirmModal.inscription.prenom} {confirmModal.inscription.nom}<br />
              Formation : <strong>{confirmModal.inscription.formationTitle}</strong>
            </p>
            <div className="flex gap-6">
              <button
                onClick={handleConfirmAction}
                className={`flex-1 font-bold py-4 rounded-xl transition shadow-lg ${
                  confirmModal.action === "accept"
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                Confirmer
              </button>
              <button
                onClick={() => setConfirmModal({ show: false, action: "accept" })}
                className="flex-1 bg-gray-300 text-gray-800 font-bold py-4 rounded-xl hover:bg-gray-400 transition shadow-lg"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      <div className="fixed inset-x-0 bottom-8 z-50 flex justify-center pointer-events-none">
        <div className={`transition-all duration-500 ease-in-out ${
          toast.show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}>
          <div className={`flex items-center gap-4 px-8 py-5 rounded-2xl shadow-2xl text-white font-medium text-lg ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}>
            <span className="text-3xl">✓</span>
            <span>{toast.message}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
