import { NextRequest, NextResponse } from "next/server";
import { redis, PERIOD_KEY, checkAdminKey } from "@/lib/kv";

export async function POST(req: NextRequest) {
  if (!checkAdminKey(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  let start: string, end: string;
  try {
    ({ start, end } = await req.json());
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }
  if (!start || !end || new Date(start) >= new Date(end)) {
    return NextResponse.json({ error: "invalid period" }, { status: 400 });
  }
  await redis.set(PERIOD_KEY, { start, end });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  if (!checkAdminKey(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  await redis.del(PERIOD_KEY);
  return NextResponse.json({ ok: true });
}
