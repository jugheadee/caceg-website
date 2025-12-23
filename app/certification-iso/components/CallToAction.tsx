// app/certification-iso/components/CallToAction.tsx
"use client";

import { Mail, Phone, User, MessageSquare, Send } from "lucide-react";

export default function CallToAction() {
  return (
    <section className="py-20 bg-white">
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
              Vous souhaitez recevoir plus d'informations ou un devis gratuit?
              Appelez-nous ou laissez-nous un message en remplissant ce
              formulaire. Nous vous répondrons dans les meilleurs délais.
            </p>
          </div>

          {/* Right: Form Card - Creative & Elevated */}
          <div className="bg-gray-50 rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative">
                  <User className="absolute left-4 top-4 text-gray-400 w-6 h-6" />
                  <input
                    type="text"
                    placeholder="Nom*"
                    required
                    className="w-full pl-14 pr-6 py-4 rounded-lg border border-gray-300 focus:outline-none focus:border-yellow-500 transition"
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-4 top-4 text-gray-400 w-6 h-6" />
                  <input
                    type="email"
                    placeholder="Email*"
                    required
                    className="w-full pl-14 pr-6 py-4 rounded-lg border border-gray-300 focus:outline-none focus:border-yellow-500 transition"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-4 text-gray-400 w-6 h-6" />
                  <input
                    type="text"
                    placeholder="Sujet*"
                    required
                    className="w-full pl-14 pr-6 py-4 rounded-lg border border-gray-300 focus:outline-none focus:border-yellow-500 transition"
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-4 top-4 text-gray-400 w-6 h-6" />
                  <input
                    type="tel"
                    placeholder="Num de téléphone"
                    className="w-full pl-14 pr-6 py-4 rounded-lg border border-gray-300 focus:outline-none focus:border-yellow-500 transition"
                  />
                </div>
              </div>

              <div className="relative">
                <MessageSquare className="absolute left-4 top-4 text-gray-400 w-6 h-6" />
                <textarea
                  placeholder="Message*"
                  required
                  rows={6}
                  className="w-full pl-14 pr-6 py-4 rounded-lg border border-gray-300 focus:outline-none focus:border-yellow-500 transition resize-none"
                />
              </div>

              <div className="text-center pt-6">
                <button
                  type="submit"
                  className="inline-flex items-center gap-3 bg-yellow-500 text-blue-900 font-bold px-12 py-5 rounded-full text-xl hover:bg-yellow-400 transition shadow-lg hover:shadow-xl"
                >
                  <Send className="w-6 h-6" />
                  ENVOYER
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
