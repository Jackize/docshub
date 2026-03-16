import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUserFolders, createFolder } from "@/lib/folder-store";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(getUserFolders(session.user.email));
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json() as { name: string; parentId: string | null };
  const folder = createFolder(session.user.email, body.name, body.parentId ?? null);
  return NextResponse.json(folder, { status: 201 });
}
