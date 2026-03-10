import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { VOTES_KEY, checkAdminKey } from "@/lib/kv";

export async function POST(req: NextRequest) {
  if (!checkAdminKey(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  await kv.del(VOTES_KEY);
  return NextResponse.json({ ok: true });
}
