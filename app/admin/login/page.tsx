"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Get fresh ID token
      const idToken = await userCredential.user.getIdToken();

      // Call our API route to create secure session cookie
      const response = await fetch("/api/set-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        throw new Error("Failed to create session");
      }

      // Redirect to dashboard
      router.push("/admin/dashboard/acceuil");
    } catch (err: any) {
      console.error("Login error:", err);
      setError("Email ou mot de passe incorrect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-6">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-12">
        <div className="text-center mb-10">
          <Image
            src="/logos/caceg-admine.png"
            alt="CACEG Consulting Logo"
            width={280}
            height={100}
            className="mx-auto object-contain"
            priority
          />
          <h2 className="text-2xl font-bold text-blue-900 mt-6">
            Connexion Administrateur
          </h2>
        </div>

        {error && (
          <p className="text-red-600 text-center mb-6 bg-red-50 py-3 rounded-xl font-medium">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-blue-900 font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-blue-900 font-semibold mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-yellow-500 text-blue-900 font-bold py-5 rounded-xl ${
              loading ? "cursor-default opacity-70" : "cursor-pointer"
            }`}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}