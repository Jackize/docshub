import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { renameFolder, deleteFolder } from "@/lib/folder-store";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await request.json() as { name: string };
  const folder = renameFolder(session.user.email, id, body.name);
  if (!folder) return NextResponse.json({ error: "Folder not found" }, { status: 404 });
  return NextResponse.json(folder);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const movedFileIds = deleteFolder(session.user.email, id);
  return NextResponse.json({ movedFileIds });
}
