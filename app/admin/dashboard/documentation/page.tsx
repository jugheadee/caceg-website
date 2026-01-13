'use client';

import {
  LayoutDashboard,
  BookOpen,
  Users,
  Mail,
  FileText,
  HelpCircle,
  LogOut,
} from "lucide-react";

export default function Documentation() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-8 py-16">
        {/* Titre principal */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black text-blue-900 mb-6">
            Documentation Admin CACEG
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Bienvenue dans votre espace d'administration. Cette page vous guide à travers toutes les fonctionnalités du back office pour gérer votre centre de formation efficacement.
          </p>
        </div>

        {/* Sections */}
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
              Vue d'ensemble de votre activité : nombre d'étudiants inscrits, demandes en attente, messages non lus, et statistiques rapides. C'est votre tableau de bord principal pour suivre l'état du centre au quotidien.
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
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Ici, vous pouvez :
            </p>
            <ul className="space-y-3 text-gray-700 text-lg">
              <li className="flex items-start gap-3">
                <span className="text-yellow-500 mt-1">•</span>
                Ajouter, modifier ou supprimer une formation
              </li>
              <li className="flex items-start gap-3">
                <span className="text-yellow-500 mt-1">•</span>
                Mettre à jour titre, description, prix, image, durée, etc.
              </li>
              <li className="flex items-start gap-3">
                <span className="text-yellow-500 mt-1">•</span>
                Exporter la liste en CSV
              </li>
              <li className="flex items-start gap-3">
                <span className="text-yellow-500 mt-1">•</span>
                Rechercher et filtrer par prix
              </li>
            </ul>
          </section>

          {/* Gestion Étudiants */}
          <section className="bg-white rounded-3xl shadow-xl p-10">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                <Users size={32} className="text-blue-900" />
              </div>
              <h2 className="text-3xl font-bold text-blue-900">Gestion des Étudiants</h2>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Gérez tous les étudiants inscrits :
            </p>
            <ul className="space-y-3 text-gray-700 text-lg">
              <li className="flex items-start gap-3">
                <span className="text-yellow-500 mt-1">•</span>
                Voir nom, email, téléphone, wilaya, formation, date de naissance
              </li>
              <li className="flex items-start gap-3">
                <span className="text-yellow-500 mt-1">•</span>
                Ajouter ou modifier un étudiant manuellement
              </li>
              <li className="flex items-start gap-3">
                <span className="text-yellow-500 mt-1">•</span>
                Rechercher par nom/prénom
              </li>
              <li className="flex items-start gap-3">
                <span className="text-yellow-500 mt-1">•</span>
                Filtrer par formation ou wilaya
              </li>
              <li className="flex items-start gap-3">
                <span className="text-yellow-500 mt-1">•</span>
                Exporter en CSV
              </li>
            </ul>
          </section>

          {/* Demandes Formulaires */}
          <section className="bg-white rounded-3xl shadow-xl p-10">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                <FileText size={32} className="text-green-700" />
              </div>
              <h2 className="text-3xl font-bold text-blue-900">Demandes Formulaires</h2>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Toutes les demandes d'inscription reçues via le site internet apparaissent ici.
            </p>
            <ul className="space-y-3 text-gray-700 text-lg">
              <li className="flex items-start gap-3">
                <span className="text-yellow-500 mt-1">•</span>
                Voir les demandes en attente
              </li>
              <li className="flex items-start gap-3">
                <span className="text-yellow-500 mt-1">•</span>
                Accepter ou refuser chaque demande
              </li>
              <li className="flex items-start gap-3">
                <span className="text-yellow-500 mt-1">•</span>
                Badge rouge dans le menu quand il y a des nouvelles demandes
              </li>
            </ul>
          </section>

          {/* Gestion Messages */}
          <section className="bg-white rounded-3xl shadow-xl p-10">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center">
                <Mail size={32} className="text-purple-700" />
              </div>
              <h2 className="text-3xl font-bold text-blue-900">Gestion des Messages</h2>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Tous les messages envoyés via le formulaire "Contactez-nous" du site.
            </p>
            <ul className="space-y-3 text-gray-700 text-lg">
              <li className="flex items-start gap-3">
                <span className="text-yellow-500 mt-1">•</span>
                Voir expéditeur, sujet, message, date
              </li>
              <li className="flex items-start gap-3">
                <span className="text-yellow-500 mt-1">•</span>
                Cliquez sur un message pour voir les détails
              </li>
              <li className="flex items-start gap-3">
                <span className="text-yellow-500 mt-1">•</span>
                Répondre directement par Gmail ou appeler (si numéro fourni)
              </li>
              <li className="flex items-start gap-3">
                <span className="text-yellow-500 mt-1">•</span>
                Marqué comme lu automatiquement à l'ouverture
              </li>
              <li className="flex items-start gap-3">
                <span className="text-yellow-500 mt-1">•</span>
                Badge rouge dans le menu pour les non lus
              </li>
            </ul>
          </section>

          {/* Sécurité & Déconnexion */}
          <section className="bg-white rounded-3xl shadow-xl p-10">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center">
                <LogOut size={32} className="text-red-700" />
              </div>
              <h2 className="text-3xl font-bold text-blue-900">Sécurité & Déconnexion</h2>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
              Votre session expire automatiquement après <strong>1 heure</strong> d'inactivité pour des raisons de sécurité.<br />
              Cliquez sur le bouton jaune "Déconnexion" en bas du menu pour vous déconnecter manuellement.
            </p>
          </section>

        </div>

        {/* Message final */}
        <div className="text-center mt-20">
          <p className="text-2xl font-bold text-blue-900">
            Besoin d’aide ? Contactez le développeur à tout moment.
          </p>
          <p className="text-xl text-gray-600 mt-4">
            Le back office est conçu pour être simple, rapide et puissant. Vous avez tout sous contrôle !
          </p>
        </div>
      </div>
    </div>
  );
}