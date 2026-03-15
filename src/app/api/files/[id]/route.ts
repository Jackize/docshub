import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { deleteFile, updateFile } from "@/lib/file-store";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const deleted = deleteFile(session.user.email!, id);
  if (!deleted) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
  return new NextResponse(null, { status: 204 });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json() as { content: string };
  const updated = updateFile(session.user.email!, id, { content: body.content });
  if (!updated) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}
