import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getReceivedShares } from "@/lib/share-store";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const shares = getReceivedShares(session.user.email);
  return NextResponse.json(shares);
}
