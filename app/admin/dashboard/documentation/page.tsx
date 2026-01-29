'use client';

import {
  LayoutDashboard,
  BookOpen,
  Users,
  Briefcase,
  Calendar,
  FileText,
  Mail,
  LogOut,
} from "lucide-react";

export default function Documentation() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-8 py-16">

        {/* Titre */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black text-blue-900 mb-6">
            Documentation – Espace Administrateur
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Cette page explique simplement chaque partie du back office.
            Elle vous aide à utiliser le site pas à pas.
          </p>
        </div>

        <div className="space-y-16">

          {/* Dashboard */}
          <section className="bg-white rounded-3xl shadow-xl p-10">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                <LayoutDashboard size={32} className="text-blue-900" />
              </div>
              <h2 className="text-3xl font-bold text-blue-900">Dashboard</h2>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
              Cette page est la première que vous voyez après la connexion.
              Elle vous montre l’état général de votre centre : inscriptions,
              messages reçus et demandes en attente.
            </p>
          </section>

          {/* Gestion Formations */}
          <section className="bg-white rounded-3xl shadow-xl p-10">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center">
                <BookOpen size={32} className="text-yellow-600" />
              </div>
              <h2 className="text-3xl font-bold text-blue-900">Gestion des Formations</h2>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
              Ici, vous gérez toutes les formations proposées par votre centre.
              Vous pouvez en ajouter de nouvelles, modifier les informations
              (titre, prix, durée, description) ou supprimer une formation.
            </p>
          </section>

          {/* Gestion Étudiants */}
          <section className="bg-white rounded-3xl shadow-xl p-10">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                <Users size={32} className="text-blue-900" />
              </div>
              <h2 className="text-3xl font-bold text-blue-900">Gestion des Étudiants</h2>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
              Cette section contient la liste de tous les étudiants inscrits.
              Vous pouvez voir leurs informations, rechercher un étudiant
              et exporter la liste si nécessaire.
            </p>
          </section>

          {/* Gestion Domaines */}
          <section className="bg-white rounded-3xl shadow-xl p-10">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center">
                <Briefcase size={32} className="text-indigo-700" />
              </div>
              <h2 className="text-3xl font-bold text-blue-900">Gestion des Domaines</h2>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
              Les domaines servent à classer les formations
              (exemple : informatique, langues, management).
              Vous pouvez ajouter ou modifier un domaine.
              Ils s’affichent automatiquement sur le site.
            </p>
          </section>

          {/* Gestion Événements */}
          <section className="bg-white rounded-3xl shadow-xl p-10">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center">
                <Calendar size={32} className="text-indigo-700" />
              </div>
              <h2 className="text-3xl font-bold text-blue-900">Gestion des Événements</h2>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
              Cette partie permet d’ajouter des événements et des actualités.
              Vous choisissez le titre, la date, le lieu, le texte et les images.
              Une fois publié, l’événement apparaît sur le site public.
            </p>
          </section>

          {/* Gestion Formulaires */}
          <section className="bg-white rounded-3xl shadow-xl p-10">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                <FileText size={32} className="text-green-700" />
              </div>
              <h2 className="text-3xl font-bold text-blue-900">Gestion des Formulaires</h2>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
              Toutes les demandes envoyées depuis le site arrivent ici.
              Vous pouvez lire chaque demande et décider de l’accepter ou non.
            </p>
          </section>

          {/* Gestion Messages */}
          <section className="bg-white rounded-3xl shadow-xl p-10">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center">
                <Mail size={32} className="text-purple-700" />
              </div>
              <h2 className="text-3xl font-bold text-blue-900">Gestion des Messages</h2>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
              Cette page affiche les messages envoyés via le formulaire de contact.
              Vous pouvez lire les messages et répondre par email ou par téléphone.
            </p>
          </section>

          {/* Sécurité */}
          <section className="bg-white rounded-3xl shadow-xl p-10">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center">
                <LogOut size={32} className="text-red-700" />
              </div>
              <h2 className="text-3xl font-bold text-blue-900">Sécurité & Déconnexion</h2>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
              Pour votre sécurité, la connexion se ferme automatiquement
              après une période sans activité.
              Vous pouvez aussi vous déconnecter manuellement à tout moment.
            </p>
          </section>

        </div>

        {/* Fin */}
        <div className="text-center mt-20">
          <p className="text-2xl font-bold text-blue-900">
            Besoin d’aide ? N’hésitez pas à demander.
          </p>
          <p className="text-xl text-gray-600 mt-4">
            Ce système a été conçu pour être simple et facile à utiliser.
          </p>
        </div>

      </div>
    </div>
  );
}
