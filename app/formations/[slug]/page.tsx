'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore"; // ← addDoc ajouté
import { db } from "@/lib/firebase";
import Image from "next/image";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";

interface Formation {
  id: string;
  title: string;
  instructor: string;
  description: string;
  price: string;
  image: string;
  slug: string;
  duration?: string;
  coursesCount?: string;
  objectives?: string;
  prerequisites?: string;
  targetAudience?: string;
}

export default function FormationDetail() {
  const params = useParams();
  const router = useRouter();
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
        console.error("Erreur chargement formation:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFormation();
  }, [slug]);

  const handleInscription = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "inscriptions"), {
        formationTitle: formation?.title || "Formation inconnue",
        formationId: formation?.id || "",
        nom: formData.nom.trim(),
        prenom: formData.prenom.trim(),
        email: formData.email.trim(),
        telephone: formData.telephone.trim(),
        wilaya: formData.wilaya.trim(),
        date: new Date().toISOString(),
      });

      alert(`Merci ${formData.prenom} ${formData.nom} !\nVotre demande d'inscription à "${formation?.title}" a été envoyée avec succès.\nNous vous contacterons très bientôt.`);
      setShowInscription(false);
      setFormData({ nom: '', prenom: '', email: '', telephone: '', wilaya: '' });
    } catch (error) {
      console.error("Erreur envoi inscription:", error);
      alert("Erreur lors de l'envoi. Veuillez réessayer.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-3xl font-bold text-blue-900">Chargement de la formation...</p>
      </div>
    );
  }

  if (!formation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-3xl font-bold text-red-600">Formation non trouvée</p>
      </div>
    );
  }

  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Hero */}
      <section className="relative h-96 md:h-[500px] overflow-hidden">
        <Image
          src={formation.image || "https://via.placeholder.com/1920x600?text=Formation+CACEG"}
          alt={formation.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8 md:p-12 text-white max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{formation.title}</h1>
          <p className="text-xl md:text-2xl mb-6">Par {formation.instructor || "Expert CACEG"}</p>
          <div className="flex flex-wrap gap-6 items-center">
            {formation.duration && <span className="bg-white/20 backdrop-blur px-6 py-3 rounded-full text-lg">Durée : {formation.duration}</span>}
            {formation.coursesCount && <span className="bg-white/20 backdrop-blur px-6 py-3 rounded-full text-lg">{formation.coursesCount} modules</span>}
            <span className={`px-8 py-4 rounded-full text-xl font-bold ${formation.price === "Gratuit" ? "bg-yellow-500 text-blue-900" : "bg-green-600 text-white"}`}>
              {formation.price}
            </span>
          </div>
        </div>
      </section>

      {/* Bouton Retour – haut gauche */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-3 text-blue-900 font-semibold hover:text-blue-700 transition"
        >
          <span className="text-2xl">←</span>
          Retour aux formations
        </button>
      </div>

      {/* Contenu principal */}
      <section className="py-8 bg-gray-50 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-3xl shadow-xl p-10 md:p-16 space-y-16">
            {/* Description */}
            <div>
              <h2 className="text-3xl font-bold text-blue-900 mb-6">Description</h2>
              <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                {formation.description}
              </p>
            </div>

            {/* Objectifs */}
            {formation.objectives && (
              <div>
                <h2 className="text-3xl font-bold text-blue-900 mb-8">Objectifs de la formation</h2>
                <ul className="space-y-5">
                  {formation.objectives
                    .split('\n')
                    .filter(line => line.trim())
                    .map((obj, i) => (
                      <li key={i} className="flex items-center gap-5">
                        <span className="text-yellow-500 text-2xl flex-shrink-0">✓</span>
                        <p className="text-lg text-gray-700 leading-relaxed">
                          {obj.trim().replace(/^-\s*/, '')}
                        </p>
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {/* Prérequis */}
            {formation.prerequisites && (
              <div>
                <h2 className="text-3xl font-bold text-blue-900 mb-6">Prérequis</h2>
                <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                  {formation.prerequisites}
                </p>
              </div>
            )}

            {/* Public cible */}
            {formation.targetAudience && (
              <div>
                <h2 className="text-3xl font-bold text-blue-900 mb-6">Public cible</h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {formation.targetAudience}
                </p>
              </div>
            )}

            {/* Bouton inscription centré */}
            <div className="text-center pt-8">
              <button
                onClick={() => setShowInscription(true)}
                className="bg-yellow-500 text-blue-900 font-bold text-2xl px-12 py-6 rounded-2xl hover:bg-yellow-400 transition shadow-2xl"
              >
                M'inscrire à cette formation
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Modal Inscription */}
      {showInscription && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowInscription(false)}>
          <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-2xl w-full mx-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">
              Demande d'inscription
            </h2>
            <p className="text-center text-lg text-gray-700 mb-8">
              Formation : <strong>{formation.title}</strong>
            </p>
            <form onSubmit={handleInscription} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <input type="text" placeholder="Nom *" required value={formData.nom} onChange={(e) => setFormData({...formData, nom: e.target.value})} className="px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-yellow-500 transition" />
                <input type="text" placeholder="Prénom *" required value={formData.prenom} onChange={(e) => setFormData({...formData, prenom: e.target.value})} className="px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-yellow-500 transition" />
              </div>
              <input type="email" placeholder="Email *" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-yellow-500 transition" />
              <input type="tel" placeholder="Téléphone *" required value={formData.telephone} onChange={(e) => setFormData({...formData, telephone: e.target.value})} className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-yellow-500 transition" />
              <input type="text" placeholder="Wilaya *" required value={formData.wilaya} onChange={(e) => setFormData({...formData, wilaya: e.target.value})} className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-yellow-500 transition" />
              <div className="flex gap-6 pt-8">
                <button type="submit" className="flex-1 bg-yellow-500 text-blue-900 font-bold py-5 rounded-xl hover:bg-yellow-400 transition text-xl">
                  Envoyer ma demande
                </button>
                <button type="button" onClick={() => setShowInscription(false)} className="flex-1 bg-gray-300 text-gray-800 font-bold py-5 rounded-xl hover:bg-gray-400 transition text-xl">
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}