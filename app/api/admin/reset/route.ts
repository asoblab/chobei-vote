import { NextRequest, NextResponse } from "next/server";
import { resetVotes, checkAdminKey } from "@/lib/kv";

export async function POST(req: NextRequest) {
  if (!checkAdminKey(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  await resetVotes();
  return NextResponse.json({ ok: true });
}
