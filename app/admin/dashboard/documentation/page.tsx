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
  CheckCircle2,
  ArrowRight,
  Info,
  User
} from "lucide-react";

export default function Documentation() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 md:px-8 py-14 md:py-16">

        {/* Titre + intro */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-blue-900 mb-5">
            Documentation – Espace Administrateur
          </h1>

          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Cette page est un <strong>mode d’emploi simple</strong> pour gérer votre site.
            Vous pouvez ajouter des formations, publier des événements, lire les messages,
            et accepter les demandes d’inscription.
          </p>
        </div>

        {/* Bloc "Commencer ici" */}
        <section className="bg-white rounded-3xl shadow-xl p-8 md:p-10 border border-gray-100 mb-10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Info className="text-blue-900" size={22} />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-2">
                Commencer (simple et rapide)
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                Quand vous êtes connecté, utilisez le menu à gauche pour changer de page.
                Si vous ne savez pas où aller, suivez ces étapes :
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border bg-gray-50 p-5">
                  <div className="flex items-center gap-2 text-blue-900 font-bold mb-2">
                    <CheckCircle2 size={18} />
                    Étape 1
                  </div>
                  <p className="text-gray-700">
                    Regardez le <strong>Dashboard</strong> pour voir l’état général (demandes & messages).
                  </p>
                </div>

                <div className="rounded-2xl border bg-gray-50 p-5">
                  <div className="flex items-center gap-2 text-blue-900 font-bold mb-2">
                    <CheckCircle2 size={18} />
                    Étape 2
                  </div>
                  <p className="text-gray-700">
                    Traitez les <strong>Demandes</strong> (accepter ou refuser) et les <strong>Messages</strong>.
                  </p>
                </div>

                <div className="rounded-2xl border bg-gray-50 p-5">
                  <div className="flex items-center gap-2 text-blue-900 font-bold mb-2">
                    <CheckCircle2 size={18} />
                    Étape 3
                  </div>
                  <p className="text-gray-700">
                    Mettez à jour le contenu : <strong>Formations</strong>, <strong>Domaines</strong>, <strong>Événements</strong>.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-yellow-50 border border-yellow-200 p-5">
                <p className="text-gray-800 text-lg">
                  ✅ <strong>Bon à savoir :</strong> quand vous enregistrez une modification (formation, événement…),
                  elle apparaît automatiquement sur le site public.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Bloc "Je veux faire..." */}
        <section className="bg-white rounded-3xl shadow-xl p-8 md:p-10 border border-gray-100 mb-14">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6">
            Je veux… (où aller ?)
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              { left: "Ajouter une nouvelle formation", right: "Gestion des Formations" },
              { left: "Ajouter un événement / une actualité", right: "Gestion des Événements" },
              { left: "Modifier la liste des domaines ", right: "Gestion des Domaines" },
              { left: "Voir les demandes d’inscription", right: "Gestion des Formulaires" },
              { left: "Lire / répondre aux messages reçus", right: "Gestion des Messages" },
              { left: "Voir tous les étudiants inscrits", right: "Gestion des Étudiants" },
            ].map((item, idx) => (
              <div key={idx} className="rounded-2xl border bg-gray-50 p-5 flex items-center justify-between gap-4">
                <p className="text-gray-800 text-lg">{item.left}</p>
                <div className="flex items-center gap-2 text-blue-900 font-bold">
                  <span className="hidden sm:inline">{item.right}</span>
                  <ArrowRight size={18} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl bg-blue-50 border border-blue-200 p-5">
            <p className="text-gray-800 text-lg">
              💡 <strong>Astuce :</strong> si vous ne trouvez pas une information, commencez par le <strong>Dashboard </strong>
              puis allez dans <strong>Formulaires</strong> (demandes) ou <strong>Messages</strong>.
            </p>
          </div>
        </section>

        {/* Sections détaillées */}
        <div className="space-y-14">

          {/* Dashboard */}
          <Section
            icon={<LayoutDashboard size={32} className="text-blue-900" />}
            badgeClass="bg-blue-100"
            title="Dashboard"
            description="C’est la page d’accueil après la connexion. Elle donne une vue d’ensemble rapide."
            bullets={[
              "Voir combien de demandes sont en attente",
              "Voir si vous avez des messages non lus",
              "Avoir un résumé de l’activité du centre",
            ]}
            tip="Si vous vous connectez et vous ne savez pas quoi faire : commencez ici."
          />

          {/* Formations */}
          <Section
            icon={<BookOpen size={32} className="text-yellow-600" />}
            badgeClass="bg-yellow-100"
            title="Gestion des Formations"
            description="Ici, vous gérez toutes les formations visibles sur le site."
            bullets={[
              "Ajouter une formation",
              "Modifier une formation (titre, prix, durée, description, image…) ",
              "Supprimer une formation si elle n’existe plus",
            ]}
            tip="Après modification, la formation se met à jour automatiquement sur le site public."
          />

          {/* Étudiants */}
          <Section
            icon={<Users size={32} className="text-blue-900" />}
            badgeClass="bg-blue-100"
            title="Gestion des Étudiants"
            description="Cette page contient la liste des étudiants déjà acceptés."
            bullets={[
              "Voir les informations (nom, email, téléphone, wilaya, formation…) ",
              "Rechercher un étudiant",
              "Exporter la liste si besoin",
            ]}
            tip="Les étudiants arrivent ici après que vous ayez accepté une demande dans “Formulaires”."
          />

       {/* Domaines */}
<Section
  icon={<Briefcase size={32} className="text-indigo-700" />}
  badgeClass="bg-indigo-100"
  title="Gestion des Domaines (Consulting & Accompagnement)"
  description="Cette section permet de gérer les domaines de consulting affichés sur la page “Consulting & Accompagnement” du site."
  bullets={[
    "Ajouter un domaine (ex : Audit, Finance, GRH, Management…)",
    "Modifier le titre d’un domaine",
    "Changer l’image associée (photo affichée à droite sur le site)",
    "Supprimer un domaine si besoin",
  ]}
  tip="Après une modification, vérifiez la page “Consulting & Accompagnement” côté site public pour confirmer que le texte et l’image sont corrects."
/>


          {/* Événements */}
          <Section
            icon={<Calendar size={32} className="text-indigo-700" />}
            badgeClass="bg-indigo-100"
            title="Gestion des Événements"
            description="Vous pouvez publier des actualités, conférences et événements."
            bullets={[
              "Ajouter un événement (titre, date, lieu, texte)",
              "Ajouter des images (couverture + galerie)",
              "Publier ou garder en brouillon",
            ]}
            tip="Une fois publié, l’événement apparaît sur la page Actualités du site public."
          />

          {/* Formulaires */}
          <Section
            icon={<FileText size={32} className="text-green-700" />}
            badgeClass="bg-green-100"
            title="Gestion des Formulaires"
            description="Toutes les demandes envoyées depuis le site arrivent ici."
            bullets={[
              "Ouvrir une demande et lire les informations",
              "Accepter une demande (elle devient un étudiant)",
              "Refuser une demande si nécessaire",
            ]}
            tip="Conseil : traitez ces demandes régulièrement pour répondre vite aux personnes intéressées."
          />

          {/* Messages */}
          <Section
            icon={<Mail size={32} className="text-purple-700" />}
            badgeClass="bg-purple-100"
            title="Gestion des Messages"
            description="Cette page affiche les messages envoyés via “Contactez-nous”."
            bullets={[
              "Lire le message",
              "Répondre par email",
              "Appeler si un numéro est fourni",
            ]}
            tip="Si vous voyez un message important, répondez rapidement : cela augmente la confiance des clients."
          />
       {/* Profil Administrateur */}
<Section
  icon={<User size={32} className="text-blue-900" />}
  badgeClass="bg-blue-100"
  title="Profil Administrateur (en haut à droite)"
  description="En haut à droite de l’écran, vous pouvez modifier vos informations personnelles."
  bullets={[
    "Changer votre mot de passe",
    "Modifier votre adresse email",
    "Modifier votre numéro de téléphone ou le supprimer",
    "Ajouter un autre numéro de contact si nécessaire",
  ]}
  tip="Après une modification, pensez à vérifier que les informations sont correctes car ils seront automatiquement modifier sur le site."
/>


          {/* Sécurité */}
          <Section
            icon={<LogOut size={32} className="text-red-700" />}
            badgeClass="bg-red-100"
            title="Sécurité & Déconnexion"
            description="Pour la sécurité, la session peut se fermer automatiquement après un temps sans activité."
            bullets={[
              "Vous pouvez vous déconnecter manuellement à tout moment",
              "En cas de déconnexion, reconnectez-vous simplement",
            ]}
            tip="Si vous partagez l’ordinateur, déconnectez-vous après usage."
          />
        </div>

        {/* Fin */}
        <div className="text-center mt-20">
          <p className="text-2xl font-bold text-blue-900">
            Besoin d’aide ? N’hésitez pas à demander.
          </p>
          <p className="text-xl text-gray-600 mt-4">
            Ce système a été conçu pour être simple, clair et facile à utiliser.
          </p>
        </div>

      </div>
    </div>
  );
}

/** Composant section réutilisable */
function Section({
  icon,
  badgeClass,
  title,
  description,
  bullets,
  tip,
}: {
  icon: React.ReactNode;
  badgeClass: string;
  title: string;
  description: string;
  bullets: string[];
  tip?: string;
}) {
  return (
    <section className="bg-white rounded-3xl shadow-xl p-8 md:p-10 border border-gray-100">
      <div className="flex items-center gap-6 mb-6">
        <div className={`w-16 h-16 ${badgeClass} rounded-2xl flex items-center justify-center`}>
          {icon}
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-blue-900">{title}</h2>
      </div>

      <p className="text-lg text-gray-700 leading-relaxed mb-6">
        {description}
      </p>

      <div className="rounded-2xl bg-gray-50 border p-6">
        <p className="font-bold text-blue-900 mb-3">Vous pouvez faire :</p>
        <ul className="space-y-3 text-gray-800 text-lg">
          {bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="text-yellow-500 mt-1">•</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>

      {tip && (
        <div className="mt-6 rounded-2xl bg-blue-50 border border-blue-200 p-5">
          <p className="text-gray-800 text-lg">
            💡 <strong>Astuce :</strong> {tip}
          </p>
        </div>
      )}
    </section>
  );
}
