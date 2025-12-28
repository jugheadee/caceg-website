'use client';

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Trash2,
  Mail,
  MailOpen,
  Download,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  ArrowUpDown,
  Phone,
  Mail as MailIcon,
  X,
} from "lucide-react";

interface Message {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  sujet: string;
  message: string;
  lu: boolean;
  dateEnvoi: any; // Timestamp Firestore
}

export default function GestionMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLu, setFilterLu] = useState<"tous" | "lus" | "non-lus">("tous");
  const [sortByDate, setSortByDate] = useState(true); // true = plus récent en haut

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "messages"), (snap) => {
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        lu: doc.data().lu || false,
        dateEnvoi: doc.data().dateEnvoi,
      } as Message));
      setMessages(data);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    let filtered = messages;

    if (searchQuery.trim()) {
      const terms = searchQuery.toLowerCase().split(" ");
      filtered = filtered.filter((m) =>
        terms.every(
          (term) =>
            m.nom.toLowerCase().includes(term) ||
            m.email.toLowerCase().includes(term) ||
            m.sujet.toLowerCase().includes(term) ||
            m.message.toLowerCase().includes(term)
        )
      );
    }

    if (filterLu === "lus") filtered = filtered.filter((m) => m.lu);
    if (filterLu === "non-lus") filtered = filtered.filter((m) => !m.lu);

    filtered = [...filtered].sort((a, b) =>
      sortByDate
        ? b.dateEnvoi.toDate().getTime() - a.dateEnvoi.toDate().getTime()
        : a.dateEnvoi.toDate().getTime() - b.dateEnvoi.toDate().getTime()
    );

    setFilteredMessages(filtered);
    setCurrentPage(1);
  }, [searchQuery, filterLu, sortByDate, messages]);

  const totalPages = Math.ceil(filteredMessages.length / itemsPerPage);
  const paginated = filteredMessages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getPageNumbers = () => {
    if (totalPages <= 1) return [];
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1, 2);
      if (currentPage > 4) pages.push("...");
      for (let i = Math.max(3, currentPage - 1); i <= Math.min(totalPages - 2, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 3) pages.push("...");
      pages.push(totalPages - 1, totalPages);
    }
    return pages;
  };

  const openMessage = async (message: Message) => {
    setSelectedMessage(message);
    if (!message.lu) {
      await updateDoc(doc(db, "messages", message.id), { lu: true });
    }
  };

  const closeDetails = () => {
    setSelectedMessage(null);
  };

  const deleteMessage = async (id: string) => {
    if (confirm("Supprimer ce message ?")) {
      await deleteDoc(doc(db, "messages", id));
    }
  };

  const nonLusCount = messages.filter((m) => !m.lu).length;

  const exportToCSV = () => {
    const headers = ["Date", "Nom", "Email", "Téléphone", "Sujet", "Message", "Lu"];
    const rows = filteredMessages.map((m) => [
      m.dateEnvoi.toDate().toLocaleString("fr-DZ"),
      m.nom,
      m.email,
      m.telephone || "-",
      m.sujet,
      m.message,
      m.lu ? "Oui" : "Non",
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "messages_caceg.csv";
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-8 py-10">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-bold text-blue-900">Gestion des Messages</h1>
            {nonLusCount > 0 && (
              <span className="bg-red-600 text-white px-4 py-2 rounded-full font-bold">
                {nonLusCount} non lu{nonLusCount > 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative">
              <Search className="absolute left-4 top-4 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher par nom, email, sujet..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200 outline-none transition"
              />
            </div>

            <select
              value={filterLu}
              onChange={(e) => setFilterLu(e.target.value as any)}
              className="px-6 py-4 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200 outline-none transition"
            >
              <option value="tous">Tous les messages</option>
              <option value="non-lus">Non lus uniquement</option>
              <option value="lus">Lus uniquement</option>
            </select>

            <button
              onClick={() => setSortByDate(!sortByDate)}
              className="bg-blue-900 text-white font-bold px-8 py-4 rounded-xl hover:bg-blue-800 transition shadow-md flex items-center justify-center gap-2"
            >
              <ArrowUpDown size={20} />
              Trier par date ({sortByDate ? "récent" : "ancien"})
            </button>
          </div>
        </div>

        {/* Tableau */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <span className="text-gray-600 font-medium">
              Messages ({filteredMessages.length})
            </span>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-900 transition font-medium"
            >
              <Download size={20} />
              Exporter CSV
            </button>
          </div>

          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-5 text-left text-gray-700 font-medium w-32">Date</th>
                <th className="px-6 py-5 text-left text-gray-700 font-medium">Expéditeur</th>
                <th className="px-6 py-5 text-left text-gray-700 font-medium">Sujet</th>
                <th className="px-6 py-5 text-left text-gray-700 font-medium">Message</th>
                <th className="px-6 py-5 text-center text-gray-700 font-medium">Statut</th>
                <th className="px-6 py-5 text-right text-gray-700 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-gray-500 text-lg">
                    Aucun message trouvé.
                  </td>
                </tr>
              ) : (
                paginated.map((m) => (
                  <tr
                    key={m.id}
                    className={`hover:bg-gray-50 transition cursor-pointer ${!m.lu ? "bg-yellow-50 font-medium" : ""}`}
                    onClick={() => openMessage(m)}
                  >
                    <td className="px-6 py-5 text-sm text-gray-600">
                      {m.dateEnvoi.toDate().toLocaleDateString("fr-DZ")} <br />
                      {m.dateEnvoi.toDate().toLocaleTimeString("fr-DZ", { hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="px-6 py-5">
                      <p className="font-medium text-gray-900">{m.nom}</p>
                      <p className="text-sm text-gray-600">{m.email}</p>
                      {m.telephone && <p className="text-sm text-gray-600">{m.telephone}</p>}
                    </td>
                    <td className="px-6 py-5 font-medium text-gray-900">{m.sujet}</td>
                    <td className="px-6 py-5 text-gray-700 max-w-md truncate">{m.message}</td>
                    <td className="px-6 py-5 text-center">
                      {m.lu ? (
                        <MailOpen size={20} className="text-green-600 mx-auto" />
                      ) : (
                        <Mail size={20} className="text-red-600 mx-auto" />
                      )}
                    </td>
                    <td className="px-6 py-5 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => deleteMessage(m.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Supprimer"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 p-6 border-t border-gray-100">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-3 rounded-xl hover:bg-gray-100 disabled:opacity-50 transition"
              >
                <ChevronLeft size={20} />
              </button>

              {getPageNumbers().map((page, i) =>
                page === "..." ? (
                  <span key={i} className="px-4 text-gray-500">
                    ...
                  </span>
                ) : (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(page as number)}
                    className={`w-12 h-12 rounded-xl font-medium transition ${
                      currentPage === page
                        ? "bg-blue-900 text-white shadow-md"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-3 rounded-xl hover:bg-gray-100 disabled:opacity-50 transition"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Modal Détails Message */}
        {selectedMessage && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeDetails}>
            <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-blue-900 mb-4">{selectedMessage.sujet}</h2>
                  <div className="space-y-2 text-gray-600">
                    <p className="font-medium">
                      De : {selectedMessage.nom} 
                    </p>
                    <p className="font-medium">mail : {selectedMessage.email}</p>
                
                    {selectedMessage.telephone && (
                      <p className="font-medium">
                        Tél : {selectedMessage.telephone}
                      </p>
                    )}
                    <p className="font-medium">
    Sujet : {selectedMessage.sujet}
  </p>
                    <p className="text-sm">
                      À : {selectedMessage.dateEnvoi.toDate().toLocaleTimeString("fr-DZ", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <button onClick={closeDetails} className="text-gray-400 hover:text-gray-600 transition">
                  <X size={28} />
                </button>
              </div>

              <div className="bg-gray-50 rounded-2xl p-8 mb-10">
                <p className="text-lg text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.message}
                </p>
              </div>

              <div className="flex flex-wrap gap-4 justify-center">
                {/* Lien direct vers Gmail */}
                <a
                  href={`https://mail.google.com/mail/u/0/?fs=1&tf=cm&to=${selectedMessage.email}&su=Re: ${encodeURIComponent(selectedMessage.sujet)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-blue-900 !text-white font-bold px-8 py-4 rounded-xl hover:bg-blue-800 transition shadow-lg"
                >
                  <MailIcon size={22} />
                  Répondre par email
                </a>

                {/* Bouton Appeler */}
                {selectedMessage.telephone && (
                  <a
                    href={`tel:${selectedMessage.telephone.replace(/\s/g, '')}`}
                    className="flex items-center gap-3 bg-green-600 !text-white font-bold px-8 py-4 rounded-xl hover:bg-green-700 transition shadow-lg"
                  >
                    <Phone size={22} />
                    Appeler
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}