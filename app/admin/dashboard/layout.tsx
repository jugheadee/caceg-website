"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  signOut,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import {
  onSnapshot,
  collection,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import Image from "next/image";
import {
  Menu,
  UserCircle,
  LogOut,
  Settings,
  LayoutDashboard,
  BookOpen,
  Users,
  Mail,
  HelpCircle,
  FileText,
  Briefcase,
  X,
  Plus,
  Trash2,
} from "lucide-react";

// Phone input
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

export default function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);

  // Real-time badges
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [nonLusCount, setNonLusCount] = useState(0);

  // Password modal
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwdError, setPwdError] = useState("");
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordToast, setPasswordToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Contact modal
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [phones, setPhones] = useState<string[]>([]);
  const [contactEmail, setContactEmail] = useState("");
  const [contactError, setContactError] = useState("");
  const [loadingContact, setLoadingContact] = useState(false);
  const [isSavingContact, setIsSavingContact] = useState(false);
  const [contactToast, setContactToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Session check on navigation
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth-check", {
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok || !data.valid) {
          router.replace("/admin/session-expired");
        }
      } catch {
        router.replace("/admin/session-expired");
      }
    };
    checkSession();
  }, [pathname, router]);

  // Real-time pending requests count
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "inscriptions"), (snapshot) => {
      setPendingRequestsCount(snapshot.size);
    });
    return () => unsub();
  }, []);

  // Real-time unread messages count
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "messages"), (snapshot) => {
      let count = 0;
      snapshot.docs.forEach((doc) => {
        if (!doc.data().lu) count++;
      });
      setNonLusCount(count);
    });
    return () => unsub();
  }, []);

  const loadContactSettings = async () => {
    setLoadingContact(true);
    setContactError("");

    try {
      const docRef = doc(db, "settings", "contact");
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        const data = snap.data() || {};
        setPhones(data.phones || []);
        setContactEmail(data.email || "");
      } else {
        setContactError("Document non trouvé dans Firestore");
      }
    } catch (err: any) {
      console.error("Erreur chargement coordonnées:", err);
      setContactError("Erreur de chargement (réseau ou permissions)");
    } finally {
      setLoadingContact(false);
    }
  };

  const addPhone = () => {
    setPhones([...phones, ""]);
  };

  const removePhone = (index: number) => {
    setPhones(phones.filter((_, i) => i !== index));
  };

  const updatePhone = (index: number, value: string) => {
    const newPhones = [...phones];
    newPhones[index] = value;
    setPhones(newPhones);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError("");
    setIsSavingPassword(true);

    if (newPassword !== confirmPassword) {
      setPwdError("Les mots de passe ne correspondent pas.");
      setIsSavingPassword(false);
      return;
    }
    if (newPassword.length < 6) {
      setPwdError(
        "Le nouveau mot de passe doit contenir au moins 6 caractères."
      );
      setIsSavingPassword(false);
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        setPwdError("Aucun utilisateur connecté.");
        setIsSavingPassword(false);
        return;
      }

      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      setPasswordToast({
        message: "Mot de passe modifié avec succès !",
        type: "success",
      });
      setTimeout(() => setPasswordToast(null), 3500);

      setTimeout(() => {
        setPasswordModalOpen(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }, 2000);
    } catch (err: any) {
      if (err.code === "auth/wrong-password") {
        setPwdError("Mot de passe actuel incorrect.");
      } else if (err.code === "auth/requires-recent-login") {
        setPwdError("Veuillez vous reconnecter pour cette opération.");
      } else {
        setPwdError(
          err.message || "Erreur lors du changement de mot de passe."
        );
      }
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleContactSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactError("");
    setIsSavingContact(true);

    try {
      await setDoc(
        doc(db, "settings", "contact"),
        { phones, email: contactEmail },
        { merge: true }
      );

      setContactToast({
        message: "Coordonnées mises à jour avec succès !",
        type: "success",
      });
      setTimeout(() => setContactToast(null), 3500);
      setTimeout(() => setContactModalOpen(false), 2000);
    } catch (err) {
      console.error("Erreur sauvegarde coordonnées:", err);
      setContactError("Erreur lors de la sauvegarde des coordonnées.");
    } finally {
      setIsSavingContact(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      await signOut(auth);
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout failed:", error);
      router.push("/admin/login");
    }
  };

  const navigateTo = (path: string) => {
    router.push(path);
  };

  const iconSize = sidebarExpanded ? 22 : 28;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── HEADER ── */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-gray-50/80 backdrop-blur-md flex items-center justify-between px-6 z-50 shadow-sm">
        <div className="flex items-center gap-5">
          <button
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            className="text-gray-700 hover:text-blue-900 transition cursor-pointer"
          >
            <Menu size={28} />
          </button>
          <div className="flex items-center">
            <Image
              src="/logos/caceg-admine.png"
              alt="CACEG Admin Logo"
              width={200}
              height={60}
              className="object-contain"
              priority
            />
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3 text-gray-700 hover:text-blue-900 cursor-pointer"
          >
            <UserCircle size={36} className="text-blue-900" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 z-50">
              <button
                onClick={() => {
                  setProfileOpen(false);
                  setPasswordModalOpen(true);
                }}
                className="w-full flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition text-left cursor-pointer"
              >
                <Settings size={18} />
                Changer mot de passe
              </button>

              <button
                onClick={() => {
                  setProfileOpen(false);
                  setContactModalOpen(true);
                  loadContactSettings();
                }}
                className="w-full flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition text-left cursor-pointer"
              >
                <Mail size={18} />
                Modifier coordonnées
              </button>

              <hr className="my-2 border-gray-100" />

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-5 py-3 hover:bg-gray-50 text-red-600 transition text-left cursor-pointer"
              >
                <LogOut size={18} />
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ── SIDEBAR ── */}
      <aside
        className={`fixed left-0 top-16 bottom-0 bg-blue-900 text-white transition-all duration-300 z-40 flex flex-col ${
          sidebarExpanded ? "w-68" : "w-20"
        }`}
      >
        <nav className="flex-1 py-6 px-4 space-y-6 overflow-y-auto">
          {/* PRINCIPAL */}
          <div>
            <p
              className={`text-xs font-semibold uppercase tracking-wider mb-3 text-blue-200 ${
                !sidebarExpanded ? "text-center" : ""
              }`}
            >
              {sidebarExpanded ? "Principal" : "..."}
            </p>
            <button
              onClick={() => navigateTo("/admin/dashboard/acceuil")}
              className={`w-full flex items-center gap-4 py-3 px-4 rounded-xl font-medium transition cursor-pointer ${
                pathname === "/admin/dashboard/acceuil"
                  ? "bg-blue-800 text-white font-semibold"
                  : "text-gray-200 hover:bg-blue-700"
              } ${!sidebarExpanded && "justify-center"}`}
            >
              <LayoutDashboard size={iconSize} />
              {sidebarExpanded && <span>Dashboard</span>}
            </button>
          </div>

          {/* FORMS AND DATAS */}
          <div>
            <p
              className={`text-xs font-semibold uppercase tracking-wider mb-3 text-blue-200 ${
                !sidebarExpanded ? "text-center" : ""
              }`}
            >
              {sidebarExpanded ? "Forms and Datas" : "..."}
            </p>

            <button
              onClick={() => navigateTo("/admin/dashboard/gestion-formations")}
              className={`w-full flex items-center gap-4 py-3 px-4 rounded-lg transition cursor-pointer ${
                pathname.startsWith("/admin/dashboard/gestion-formations")
                  ? "bg-blue-800 text-white font-semibold"
                  : "text-gray-200 hover:bg-blue-700"
              } ${!sidebarExpanded && "justify-center"}`}
            >
              <BookOpen size={iconSize} />
              {sidebarExpanded && <span>Gestion Formations</span>}
            </button>

            <button
              onClick={() => navigateTo("/admin/dashboard/gestion-etudiants")}
              className={`w-full flex items-center gap-4 py-3 px-4 rounded-lg transition cursor-pointer ${
                pathname.startsWith("/admin/dashboard/gestion-etudiants")
                  ? "bg-blue-800 text-white font-semibold"
                  : "text-gray-200 hover:bg-blue-700"
              } ${!sidebarExpanded && "justify-center"}`}
            >
              <Users size={iconSize} />
              {sidebarExpanded && <span>Gestion Étudiants</span>}
            </button>

            <button
              onClick={() => navigateTo("/admin/dashboard/gestion-domaines")}
              className={`w-full flex items-center gap-4 py-3 px-4 rounded-lg transition cursor-pointer ${
                pathname.startsWith("/admin/dashboard/gestion-domaines")
                  ? "bg-blue-800 text-white font-semibold"
                  : "text-gray-200 hover:bg-blue-700"
              } ${!sidebarExpanded && "justify-center"}`}
            >
              <Briefcase size={iconSize} />
              {sidebarExpanded && <span>Gestion Domaines</span>}
            </button>

            <button
              onClick={() => navigateTo("/admin/dashboard/demande-formulaires")}
              className={`w-full flex items-center gap-4 py-3 px-4 rounded-lg transition cursor-pointer ${
                pathname.startsWith("/admin/dashboard/demandes-formulaires")
                  ? "bg-blue-800 text-white font-semibold"
                  : "text-gray-200 hover:bg-blue-700"
              } ${!sidebarExpanded && "justify-center"}`}
            >
              <FileText size={iconSize} />
              {sidebarExpanded && <span>Demandes Formulaires</span>}
            </button>

            <div className="relative">
              <button
                onClick={() => navigateTo("/admin/dashboard/gestion-messages")}
                className={`w-full flex items-center gap-4 py-3 px-4 rounded-lg transition cursor-pointer ${
                  pathname.startsWith("/admin/dashboard/gestion-messages")
                    ? "bg-blue-800 text-white font-semibold"
                    : "text-gray-200 hover:bg-blue-700"
                } ${!sidebarExpanded && "justify-center"}`}
              >
                <Mail size={iconSize} />
                {sidebarExpanded && <span>Gestion Messages</span>}
              </button>
              {nonLusCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg animate-pulse">
                  {nonLusCount > 99 ? "99+" : nonLusCount}
                </span>
              )}
            </div>
          </div>
        </nav>

        {/* Help & Logout */}
        <div className="px-4 pb-6 space-y-6">
          <div>
            <p
              className={`text-xs font-semibold uppercase tracking-wider mb-3 text-blue-200 ${
                !sidebarExpanded ? "text-center" : ""
              }`}
            >
              {sidebarExpanded ? "Help" : "..."}
            </p>
            <button
              onClick={() => navigateTo("/admin/dashboard/documentation")}
              className={`w-full flex items-center gap-4 py-3 px-4 rounded-lg transition cursor-pointer ${
                pathname === "/admin/dashboard/documentation"
                  ? "bg-blue-800 text-white font-semibold"
                  : "text-gray-200 hover:bg-blue-700"
              } ${!sidebarExpanded && "justify-center"}`}
            >
              <HelpCircle size={iconSize} />
              {sidebarExpanded && <span>Documentation</span>}
            </button>
          </div>

          <button
            onClick={handleLogout}
            className={`w-full flex items-center justify-center gap-3 py-4 bg-yellow-500 text-blue-900 font-bold rounded-xl hover:bg-yellow-400 transition shadow-lg cursor-pointer ${
              !sidebarExpanded && "px-4"
            }`}
          >
            <LogOut size={iconSize} />
            {sidebarExpanded && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main
        className={`pt-20 transition-all duration-300 ${
          sidebarExpanded ? "ml-68" : "ml-20"
        }`}
      >
        <div className="px-8">
          <div key={pathname} className="animate-in fade-in duration-500">
            {children}
          </div>
        </div>
      </main>

      {/* ── PASSWORD MODAL ── */}
      {passwordModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl relative">
            <button
              onClick={() => setPasswordModalOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold text-blue-900 mb-6">
              Changer le mot de passe
            </h2>

            <form onSubmit={handlePasswordChange} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mot de passe actuel
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                  required
                  disabled={isSavingPassword}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                  required
                  disabled={isSavingPassword}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirmer le nouveau mot de passe
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                  required
                  disabled={isSavingPassword}
                />
              </div>

              {pwdError && <p className="text-red-600 text-sm">{pwdError}</p>}

              <button
                type="submit"
                disabled={isSavingPassword}
                className={`w-full bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition ${
                  isSavingPassword ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSavingPassword ? "Enregistrement..." : "Enregistrer"}
              </button>

              {passwordToast && (
                <div
                  className={`mt-4 p-4 rounded-lg text-white font-medium flex items-center gap-3 justify-center ${
                    passwordToast.type === "success"
                      ? "bg-green-600"
                      : "bg-red-600"
                  }`}
                >
                  {passwordToast.type === "success" ? "✓" : "✕"}{" "}
                  {passwordToast.message}
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* ── CONTACT / COORDONNÉES MODAL ── */}
      {contactModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl relative">
            <button
              onClick={() => setContactModalOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold text-blue-900 mb-6">
              Modifier coordonnées
            </h2>

            {loadingContact ? (
              <p className="text-center py-10 text-gray-600">Chargement...</p>
            ) : (
              <form onSubmit={handleContactSave} className="space-y-5">
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Numéros de téléphone
                  </label>
                  {phones.map((phone, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <PhoneInput
                        international
                        defaultCountry="DZ"
                        value={phone}
                        onChange={(value) => updatePhone(index, value || "")}
                        className="flex-1 rounded-lg overflow-hidden shadow-sm"
                        numberInputProps={{
                          className:
                            "w-full px-4 py-2 border border-gray-300 rounded-r-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none disabled:opacity-50 text-sm",
                        }}
                        disabled={isSavingContact}
                      />
                      <button
                        type="button"
                        onClick={() => removePhone(index)}
                        className="text-red-600 hover:text-red-800"
                        disabled={isSavingContact}
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addPhone}
                    className="flex items-center gap-2 text-blue-900 font-medium hover:text-blue-700 disabled:opacity-50"
                    disabled={isSavingContact}
                  >
                    <Plus size={20} />
                    Ajouter un numéro
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email de contact
                  </label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
                    disabled={isSavingContact}
                  />
                </div>

                {contactError && (
                  <p className="text-red-600 text-sm">{contactError}</p>
                )}

                <button
                  type="submit"
                  disabled={isSavingContact || loadingContact}
                  className={`w-full bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition ${
                    isSavingContact || loadingContact
                      ? "opacity-70 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {isSavingContact ? "Enregistrement..." : "Enregistrer"}
                </button>

                {contactToast && (
                  <div
                    className={`mt-4 p-4 rounded-lg text-white font-medium flex items-center gap-3 justify-center ${
                      contactToast.type === "success"
                        ? "bg-green-600"
                        : "bg-red-600"
                    }`}
                  >
                    {contactToast.type === "success" ? "✓" : "✕"}{" "}
                    {contactToast.message}
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
