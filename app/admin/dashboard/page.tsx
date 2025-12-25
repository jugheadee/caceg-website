'use client';

import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-900 mb-8">
          Dashboard Admin CACEG
        </h1>
        <p className="text-xl mb-8">Bienvenue ! Tu es connecté.</p>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-8 py-4 rounded-lg hover:bg-red-700 transition"
        >
          Déconnexion
        </button>
      </div>
    </div>
  );
}