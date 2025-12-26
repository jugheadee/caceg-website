'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";

interface Formation {
  id: string;
  title: string;
  instructor: string;
  description: string;
  price: string;
  image: string;
  slug: string;
}

export default function FormationDetail() {
  const params = useParams();
  const slug = params.slug as string;

  const [formation, setFormation] = useState<Formation | null>(null);
  const [loading, setLoading] = useState(true);
  const [showInscription, setShowInscription] = useState(false);

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    wilaya: '',
  });

  useEffect(() => {
    const fetchFormation = async () => {
      if (!slug) return;

      try {
        const q = query(collection(db, "formations"), where("slug", "==", slug));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          setFormation({ id: doc.id, ...doc.data() } as Formation);
        }
      } catch (error) {
        console.error("Erreur chargement:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFormation();
  }, [slug]);

  const handleInscription = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Merci ${formData.prenom} ${formData.nom} ! Votre demande d'inscription a été envoyée.`);
    setShowInscription(false);
    setFormData({ nom: '', prenom: '', email: '', telephone: '', wilaya: '' });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-2xl">Chargement...</p></div>;
  if (!formation) return <div className="min-h-screen flex items-center justify-center"><p className="text-2xl text-red-600">Formation non trouvée</p></div>;

  return (
    <>
      {/* Hero */}
      <div className="relative h-96 overflow-hidden">
        <Image
          src={formation.image || "https://via.placeholder.com/1920x600?text=CACEG"}
          alt={formation.title}
          fill
          className="object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8 md:p-16 text-white">
          <h1 className="text-4xl md:text-6xl font-black mb-4">{formation.title}</h1>
          <p className="text-xl">Par {formation.instructor || "CACEG"}</p>
          <span className={`inline-block mt-4 px-6 py-3 rounded-full font-bold ${formation.price === "Gratuit" ? "bg-yellow-500 text-blue-900" : "bg-green-600 text-white"}`}>
            {formation.price}
          </span>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="bg-white rounded-3xl shadow-2xl p-10">
          <h2 className="text-3xl font-bold text-blue-900 mb-6">Description</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{formation.description}</p>

          <div className="text-center mt-12">
            <button
              onClick={() => setShowInscription(true)}
              className="bg-yellow-500 text-blue-900 font-bold text-2xl px-12 py-6 rounded-2xl hover:bg-yellow-400 transition shadow-2xl"
            >
              M'inscrire à cette formation
            </button>
          </div>
        </div>
      </div>

      {/* Modal Inscription */}
      {showInscription && (
        <div className="fixed inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowInscription(false)}>
          <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">Demande d'inscription</h2>
            <p className="text-center mb-8"><strong>{formation.title}</strong></p>
            <form onSubmit={handleInscription} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <input type="text" placeholder="Nom *" required value={formData.nom} onChange={(e) => setFormData({...formData, nom: e.target.value})} className="px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-yellow-500" />
                <input type="text" placeholder="Prénom *" required value={formData.prenom} onChange={(e) => setFormData({...formData, prenom: e.target.value})} className="px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-yellow-500" />
              </div>
              <input type="email" placeholder="Email *" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-yellow-500" />
              <input type="tel" placeholder="Téléphone *" required value={formData.telephone} onChange={(e) => setFormData({...formData, telephone: e.target.value})} className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-yellow-500" />
              <input type="text" placeholder="Wilaya *" required value={formData.wilaya} onChange={(e) => setFormData({...formData, wilaya: e.target.value})} className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-yellow-500" />
              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 bg-yellow-500 text-blue-900 font-bold py-4 rounded-xl hover:bg-yellow-400">Envoyer</button>
                <button type="button" onClick={() => setShowInscription(false)} className="flex-1 bg-gray-300 text-gray-800 font-bold py-4 rounded-xl hover:bg-gray-400">Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}