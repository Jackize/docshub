import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { rollbackFile } from "@/lib/file-store";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { version } = await request.json() as { version: number };
  const result = rollbackFile(session.user.email, id, version);
  if (!result) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(result);
}
