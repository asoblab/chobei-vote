import { NextRequest, NextResponse } from "next/server";
import { redis, VOTES_KEY, checkAdminKey } from "@/lib/kv";

export async function POST(req: NextRequest) {
  if (!checkAdminKey(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  await redis.del(VOTES_KEY);
  return NextResponse.json({ ok: true });
}
