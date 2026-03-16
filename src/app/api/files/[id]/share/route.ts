import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { generateShare, revokeShare } from "@/lib/share-store";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const token = generateShare(session.user.email, id);
  const url = `${process.env.NEXTAUTH_URL ?? ""}/shared/${token}`;
  return NextResponse.json({ token, url });
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
  revokeShare(session.user.email, id);
  return new NextResponse(null, { status: 204 });
}
