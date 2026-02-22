import { NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: "ID token is required" }, { status: 400 });
    }

    const adminAuth = getAdminAuth(); // ✅ init ici (dans try/catch)
    const expiresIn = 60 * 60 * 1000;

    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    const response = NextResponse.json({ success: true });

    response.cookies.set("session", sessionCookie, {
      httpOnly: true,
      secure: true,       // si ton site est bien en https
      sameSite: "lax",    // mieux que strict
      path: "/",
      maxAge: 60 * 60,
    });

    return response;
  } catch (error: any) {
    console.error("Error creating session cookie:", error);
    return NextResponse.json(
      { error: "Failed to create session", details: String(error?.message || error) },
      { status: 500 }
    );
  }
}