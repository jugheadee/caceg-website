'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Formation {
  id: string;
  title: string;
  instructor: string;
  description: string;
  price: string;
  image: string;
}

export default function AdminDashboard() {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    instructor: '',
    description: '',
    price: 'Gratuit',
    image: '',
  });

  const router = useRouter();

  // Fetch formations en temps réel
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'formations'), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Formation));
      setFormations(data);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateDoc(doc(db, 'formations', editingId), formData);
    } else {
      await addDoc(collection(db, 'formations'), formData);
    }
    setShowModal(false);
    setEditingId(null);
    setFormData({ title: '', instructor: '', description: '', price: 'Gratuit', image: '' });
  };

  const handleEdit = (formation: Formation) => {
    setFormData({
      title: formation.title,
      instructor: formation.instructor,
      description: formation.description,
      price: formation.price,
      image: formation.image,
    });
    setEditingId(formation.id);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Supprimer cette formation ?')) {
      await deleteDoc(doc(db, 'formations', id));
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-blue-900 text-white p-6 fixed h-full">
        <div className="mb-12">
          <Image src="/CACEG-Consulting-1.jpg" alt="CACEG" width={200} height={80} className="mx-auto object-contain" />
        </div>
        <nav className="space-y-4">
          <a href="/admin/dashboard" className="block py-3 px-4 bg-blue-800 rounded-lg">Dashboard</a>
          <a href="/admin/dashboard" className="block py-3 px-4 hover:bg-blue-800 rounded-lg">Formations</a>
          <a href="#" className="block py-3 px-4 hover:bg-blue-800 rounded-lg">Actualités</a>
          <a href="#" className="block py-3 px-4 hover:bg-blue-800 rounded-lg">Newsletter</a>
          <a href="#" className="block py-3 px-4 hover:bg-blue-800 rounded-lg">Sponsors</a>
        </nav>
        <button onClick={handleLogout} className="mt-auto block w-full py-3 px-4 bg-red-600 hover:bg-red-700 rounded-lg mt-12">
          Déconnexion
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 ml-64 p-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-4xl font-bold text-blue-900">Gérer les Formations</h1>
            <button
              onClick={() => setShowModal(true)}
              className="bg-yellow-500 text-blue-900 font-bold px-8 py-4 rounded-xl hover:bg-yellow-400 transition shadow-lg"
            >
              + Ajouter une formation
            </button>
          </div>

          {/* Tableau formations */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-blue-900 text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Image</th>
                  <th className="px-6 py-4 text-left">Titre</th>
                  <th className="px-6 py-4 text-left">Instructeur</th>
                  <th className="px-6 py-4 text-left">Prix</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {formations.map((f) => (
                  <tr key={f.id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="w-16 h-16 relative rounded-lg overflow-hidden">
                        <Image src={f.image} alt={f.title} fill className="object-cover" />
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">{f.title}</td>
                    <td className="px-6 py-4">{f.instructor}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${f.price === 'Gratuit' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                        {f.price}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button onClick={() => handleEdit(f)} className="text-blue-600 hover:text-blue-800 mr-4">✏️</button>
                      <button onClick={() => handleDelete(f.id)} className="text-red-600 hover:text-red-800">🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Ajouter/Modifier */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-3xl font-bold text-blue-900 mb-8">
              {editingId ? 'Modifier la formation' : 'Nouvelle formation'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="text"
                placeholder="Titre"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-yellow-500 transition"
              />
              <input
                type="text"
                placeholder="Instructeur"
                value={formData.instructor}
                onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                required
                className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-yellow-500 transition"
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={4}
                className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-yellow-500 transition"
              />
              <input
                type="text"
                placeholder="Prix (ex: Gratuit ou 250.00 DZD)"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-yellow-500 transition"
              />
              <input
                type="text"
                placeholder="URL de l'image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                required
                className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-yellow-500 transition"
              />
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-yellow-500 text-blue-900 font-bold py-4 rounded-xl hover:bg-yellow-400 transition"
                >
                  {editingId ? 'Modifier' : 'Ajouter'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingId(null);
                    setFormData({ title: '', instructor: '', description: '', price: 'Gratuit', image: '' });
                  }}
                  className="flex-1 bg-gray-300 text-gray-800 font-bold py-4 rounded-xl hover:bg-gray-400 transition"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}