import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUserFiles, saveFile } from "@/lib/file-store";
import { DocFile } from "@/lib/types";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const files = getUserFiles(session.user.email);
  return NextResponse.json(files);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext !== "md" && ext !== "html") {
    return NextResponse.json({ error: "Only .md and .html files are accepted" }, { status: 400 });
  }

  const content = await file.text();
  const name = file.name.replace(/\.(md|html)$/, "");
  const type = ext as "md" | "html";

  const newFile: Omit<DocFile, "id"> = {
    name,
    type,
    content,
    version: 1,
    updatedAt: new Date(),
    author: session.user.name ?? "Unknown",
    folderId: null,
    history: [],
    breadcrumb: [],
  };

  const saved = saveFile(session.user.email, newFile);
  return NextResponse.json(saved, { status: 201 });
}
