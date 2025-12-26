"use client";

import { useRouter } from "next/navigation";

export default function SessionExpired() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
      <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-blue-900 mb-4">
          Session expirée
        </h1>

        <p className="text-gray-600 mb-8">
          Votre session a expiré. Veuillez vous reconnecter.
        </p>

        <button
          onClick={() => router.push("/admin/login")}
          className="bg-yellow-500 text-blue-900 font-bold px-8 py-4 rounded-xl"
        >
          Se reconnecter
        </button>
      </div>
    </div>
  );
}
