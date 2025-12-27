'use client';

import { useEffect, useState } from "react";
import { collection, onSnapshot, deleteDoc, doc, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Inscription {
  id: string;
  formationTitle: string;
  formationId: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  wilaya: string;
  date: string;
}

export default function DemandesFormulaires() {
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "inscriptions"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Inscription)).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setInscriptions(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAccept = async (inscription: Inscription) => {
    if (confirm(`Accepter ${inscription.prenom} ${inscription.nom} à la formation "${inscription.formationTitle}" ?`)) {
      try {
        // Ajout dans la collection "etudiants"
        await addDoc(collection(db, "etudiants"), {
          formationId: inscription.formationId,
          formationTitle: inscription.formationTitle,
          nom: inscription.nom,
          prenom: inscription.prenom,
          email: inscription.email,
          telephone: inscription.telephone,
          wilaya: inscription.wilaya,
          dateInscription: new Date().toISOString(),
          status: "inscrit",
        });

        // Suppression de la demande
        await deleteDoc(doc(db, "inscriptions", inscription.id));

        alert(`${inscription.prenom} ${inscription.nom} a été accepté et ajouté à la liste des étudiants !`);
      } catch (error) {
        console.error("Erreur lors de l'acceptation:", error);
        alert("Erreur lors de l'acceptation");
      }
    }
  };

  const handleReject = async (id: string, prenom: string, nom: string) => {
    if (confirm(`Refuser la demande de ${prenom} ${nom} ?`)) {
      try {
        await deleteDoc(doc(db, "inscriptions", id));
        alert("Demande refusée.");
      } catch (error) {
        console.error("Erreur lors du refus:", error);
        alert("Erreur lors du refus");
      }
    }
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
            <p className="text-2xl text-gray-500">Aucune demande pour l'instant</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-blue-900 text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Date</th>
                  <th className="px-6 py-4 text-left">Formation</th>
                  <th className="px-6 py-4 text-left">Nom Prénom</th>
                  <th className="px-6 py-4 text-left">Contact</th>
                  <th className="px-6 py-4 text-left">Wilaya</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inscriptions.map((ins) => (
                  <tr key={ins.id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm">
                      {new Date(ins.date).toLocaleDateString('fr-DZ')}
                    </td>
                    <td className="px-6 py-4 font-medium">{ins.formationTitle}</td>
                    <td className="px-6 py-4">{ins.prenom} {ins.nom}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p>{ins.email}</p>
                        <p className="text-gray-600">{ins.telephone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">{ins.wilaya}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-6">
                        <button
                          onClick={() => handleAccept(ins)}
                          className="text-green-600 hover:text-green-800 text-2xl"
                          title="Accepter"
                        >
                          ✅
                        </button>
                        <button
                          onClick={() => handleReject(ins.id, ins.prenom, ins.nom)}
                          className="text-red-600 hover:text-red-800 text-2xl"
                          title="Refuser"
                        >
                          ❌
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}