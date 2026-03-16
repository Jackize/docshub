import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { resolveToken, removeReceivedShare } from "@/lib/share-store";
import { getUserFiles } from "@/lib/file-store";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { token } = await params;
  const resolved = resolveToken(token);
  if (!resolved) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const files = getUserFiles(resolved.ownerEmail);
  const file = files.find((f) => f.id === resolved.fileId);
  if (!file) {
    return NextResponse.json({ error: "File deleted" }, { status: 410 });
  }

  return NextResponse.json({ file, ownerEmail: resolved.ownerEmail });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { token } = await params;
  removeReceivedShare(session.user.email, token);
  return new NextResponse(null, { status: 204 });
}
