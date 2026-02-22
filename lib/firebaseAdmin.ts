// lib/firebaseAdmin.ts
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

export function getAdminAuth() {
  if (!getApps().length) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;

    // Checks explicites (ça t’aidera à voir DIRECT c’est laquelle qui manque)
    if (!projectId) throw new Error("Missing env: FIREBASE_PROJECT_ID");
    if (!clientEmail) throw new Error("Missing env: FIREBASE_CLIENT_EMAIL");
    if (!privateKeyRaw) throw new Error("Missing env: FIREBASE_PRIVATE_KEY");

    const privateKey = privateKeyRaw.replace(/\\n/g, "\n");

    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  }

  return getAuth();
}