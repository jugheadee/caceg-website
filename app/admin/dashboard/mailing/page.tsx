'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Contact {
  id: string;
  nom?: string;
  email: string;
  telephone?: string;
  createdAt?: any;
}

export default function MailingPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showSendModal, setShowSendModal] = useState(false);
  const [mailSubject, setMailSubject] = useState('');
  const [mailBody, setMailBody] = useState('');

  const [showAddForm, setShowAddForm] = useState(false);
  const [newNom, setNewNom] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newTelephone, setNewTelephone] = useState('');

  useEffect(() => {
    const q = collection(db, 'mailing_contacts');
    const unsubscribe = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Contact[];
      setContacts(data);
    });
    return () => unsubscribe();
  }, []);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === contacts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(contacts.map((c) => c.id));
    }
  };

  const handleAddContact = async () => {
    if (!newEmail.trim()) {
      alert("L'email est obligatoire");
      return;
    }

    try {
      await addDoc(collection(db, 'mailing_contacts'), {
        nom: newNom.trim() || null,
        email: newEmail.trim(),
        telephone: newTelephone.trim() || null,
        createdAt: new Date(),
      });
      alert("Contact ajouté !");
      setNewNom('');
      setNewEmail('');
      setNewTelephone('');
      setShowAddForm(false);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'ajout");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce contact ?")) return;

    try {
      await deleteDoc(doc(db, 'mailing_contacts', id));
      alert("Contact supprimé");
    } catch (err) {
      console.error(err);
      alert("Erreur suppression");
    }
  };

  // Ouvrir Yahoo Mail réel avec ID unique
  const handleSendYahoo = () => {
    if (!mailSubject.trim() || !mailBody.trim()) {
      alert("Objet et message obligatoires");
      return;
    }

    const recipients = contacts
      .filter((c) => selectedIds.includes(c.id))
      .map((c) => c.email)
      .join(',');

    const uniqueId = Date.now(); // ID unique pour Yahoo Mail
    const url = `https://mail.yahoo.com/d/compose/${uniqueId}?.to=${encodeURIComponent(
      recipients
    )}&.subject=${encodeURIComponent(mailSubject)}&.body=${encodeURIComponent(
      mailBody
    )}`;

    window.open(url, '_blank');

    // Reset
    setShowSendModal(false);
    setMailSubject('');
    setMailBody('');
    setSelectedIds([]);
  };

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-3xl font-bold mb-8">Mailing - Envoi groupé</h1>

      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-5 py-2.5 rounded hover:bg-blue-700 transition"
        >
          + Ajouter un contact
        </button>

        <button
          onClick={() => setShowSendModal(true)}
          disabled={selectedIds.length === 0}
          className={`px-5 py-2.5 rounded text-white font-medium transition ${
            selectedIds.length > 0
              ? 'bg-indigo-600 hover:bg-indigo-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Envoyer un mail ({selectedIds.length})
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-8 border">
          <h2 className="text-xl font-bold mb-4">Ajouter un contact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm mb-1">Nom / Entreprise</label>
              <input
                type="text"
                value={newNom}
                onChange={(e) => setNewNom(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="Optionnel"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Email *</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="obligatoire"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Téléphone</label>
              <input
                type="tel"
                value={newTelephone}
                onChange={(e) => setNewTelephone(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="Optionnel"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleAddContact}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Ajouter
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto bg-white rounded-lg shadow border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left w-10">
                <input
                  type="checkbox"
                  checked={selectedIds.length === contacts.length && contacts.length > 0}
                  onChange={toggleSelectAll}
                  className="h-5 w-5 text-indigo-600 rounded"
                />
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Nom / Entreprise</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Email</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Téléphone</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {contacts.map((contact) => (
              <tr key={contact.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(contact.id)}
                    onChange={() => toggleSelect(contact.id)}
                    className="h-5 w-5 text-indigo-600 rounded"
                  />
                </td>
                <td className="px-6 py-4 text-gray-900">{contact.nom || '-'}</td>
                <td className="px-6 py-4 text-gray-900">{contact.email}</td>
                <td className="px-6 py-4 text-gray-900">{contact.telephone || '-'}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => {
                      if (confirm("Supprimer ce contact ?")) {
                        deleteDoc(doc(db, 'mailing_contacts', contact.id));
                      }
                    }}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showSendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Envoyer un mail groupé</h2>

            <p className="mb-6 text-gray-700">
              Destinataires : <strong>{selectedIds.length}</strong> adresse(s)
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Objet *</label>
              <input
                type="text"
                value={mailSubject}
                onChange={(e) => setMailSubject(e.target.value)}
                className="w-full border rounded px-4 py-3 focus:ring-2 focus:ring-blue-500"
                placeholder="Objet du mail"
              />
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium mb-2">Message *</label>
              <textarea
                value={mailBody}
                onChange={(e) => setMailBody(e.target.value)}
                rows={10}
                className="w-full border rounded px-4 py-3 focus:ring-2 focus:ring-blue-500"
                placeholder="Votre message ici..."
              />
            </div>

            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowSendModal(false)}
                className="px-6 py-3 bg-gray-200 rounded hover:bg-gray-300"
              >
                Annuler
              </button>
              <button
                onClick={handleSendYahoo}
                disabled={!mailSubject.trim() || !mailBody.trim()}
                className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
              >
                Ouvrir dans Yahoo Mail
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
