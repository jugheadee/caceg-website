import { NextResponse } from "next/server";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const fileName = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `formations/${fileName}`);

    const snapshot = await uploadBytes(storageRef, buffer, {
      contentType: file.type,
    });

    const downloadURL = await getDownloadURL(snapshot.ref);

    return NextResponse.json({ url: downloadURL });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
