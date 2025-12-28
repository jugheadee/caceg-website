'use client';

import { useState, useEffect } from "react";
import { Mail, Phone, User, MessageSquare, Send, Check } from "lucide-react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function CallToAction() {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    sujet: '',
    telephone: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" }>({
    show: false,
    message: "",
    type: "success",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "messages"), {
        nom: formData.nom.trim(),
        email: formData.email.trim().toLowerCase(),
        telephone: formData.telephone.trim(),
        sujet: formData.sujet.trim(),
        message: formData.message.trim(),
        lu: false,
        dateEnvoi: new Date(),
      });

      setFormData({
        nom: '',
        email: '',
        sujet: '',
        telephone: '',
        message: '',
      });

      setToast({ show: true, message: "Message envoyé avec succès !", type: "success" });
    } catch (err) {
      console.error("Erreur envoi message:", err);
      setToast({ show: true, message: "Erreur lors de l'envoi. Veuillez réessayer.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Auto-hide toast après 4 secondes avec fade-out
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ ...toast, show: false });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  return (
    <section className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Title and Text */}
          <div>
            <div className="relative mb-8">
              <div className="h-1 bg-yellow-500 w-24 mb-4"></div>
              <h2 className="text-4xl md:text-5xl font-bold">
                <span className="text-blue-900">CONTACTEZ</span>{" "}
                <span className="text-yellow-500">NOUS!</span>
              </h2>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
              Vous souhaitez recevoir plus d'informations ou un devis gratuit ?
              Appelez-nous ou laissez-nous un message en remplissant ce
              formulaire. Nous vous répondrons dans les meilleurs délais.
            </p>
          </div>

          {/* Right: Form Card */}
          <div className="bg-gray-50 rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative">
                  <User className="absolute left-4 top-4 text-gray-400 w-6 h-6" />
                  <input
                    type="text"
                    name="nom"
                    placeholder="Nom*"
                    required
                    value={formData.nom}
                    onChange={handleChange}
                    className="w-full pl-14 pr-6 py-4 rounded-lg border border-gray-300 focus:outline-none focus:border-yellow-500 transition"
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-4 top-4 text-gray-400 w-6 h-6" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email*"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-14 pr-6 py-4 rounded-lg border border-gray-300 focus:outline-none focus:border-yellow-500 transition"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-4 text-gray-400 w-6 h-6" />
                  <input
                    type="text"
                    name="sujet"
                    placeholder="Sujet*"
                    required
                    value={formData.sujet}
                    onChange={handleChange}
                    className="w-full pl-14 pr-6 py-4 rounded-lg border border-gray-300 focus:outline-none focus:border-yellow-500 transition"
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-4 top-4 text-gray-400 w-6 h-6" />
                  <input
                    type="tel"
                    name="telephone"
                    placeholder="Num de téléphone"
                    value={formData.telephone}
                    onChange={handleChange}
                    className="w-full pl-14 pr-6 py-4 rounded-lg border border-gray-300 focus:outline-none focus:border-yellow-500 transition"
                  />
                </div>
              </div>

              <div className="relative">
                <MessageSquare className="absolute left-4 top-4 text-gray-400 w-6 h-6" />
                <textarea
                  name="message"
                  placeholder="Message*"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full pl-14 pr-6 py-4 rounded-lg border border-gray-300 focus:outline-none focus:border-yellow-500 transition resize-none"
                />
              </div>

              <div className="text-center pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-3 bg-yellow-500 text-blue-900 font-bold px-12 py-5 rounded-full text-xl hover:bg-yellow-400 transition shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <Send className="w-6 h-6" />
                  {loading ? "Envoi en cours..." : "ENVOYER"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Toast au milieu en bas avec fade-in et fade-out */}
      <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none ${toast.show ? "opacity-100" : "opacity-0"} transition-opacity duration-500`}>
        <div className={`flex items-center gap-4 px-8 py-5 rounded-2xl shadow-2xl text-white font-bold text-lg ${
          toast.type === "success" ? "bg-green-600" : "bg-red-600"
        }`}>
          <Check size={10} />
          <span>{toast.message}</span>
        </div>
      </div>
    </section>
  );
}